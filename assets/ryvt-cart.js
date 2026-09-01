/* ryvt-cart.js - the real Shopify bag.
 *
 * ryvt-store.js ships a demo cart: a `lines` array in memory, paintCart() to
 * draw it, FREE_OVER = 125 hardcoded. That file is not edited. This one takes
 * over from it when - and only when - cart-drawer.liquid has decided the theme
 * is running on a real store and printed
 *
 *     window.__RYVT_REAL_CART__ = true
 *
 * If that flag is missing this script returns immediately and does nothing at
 * all: no listeners, no fetches, no globals. The demo keeps working untouched.
 *
 * How the takeover works without editing ryvt-store.js
 * ----------------------------------------------------
 * ryvt-store.js binds its handlers directly to [data-cart], [data-bag-open],
 * [data-checkout] and [data-add]. Every listener here is registered on
 * `document` in the CAPTURE phase, so it runs on the way DOWN - before the
 * event ever reaches those elements - and calls stopPropagation(). The demo
 * handlers are therefore never invoked, paintCart() never runs, and nothing
 * in ryvt-store.js has to change. Remove the flag and they all come back.
 *
 * Rendering
 * ---------
 * The drawer markup lives in cart-drawer.liquid, not here. After every cart
 * mutation this script asks Shopify's Section Rendering API to re-render that
 * section and swaps the panel in, so there is exactly one source of truth for
 * the markup, the money formatting, the free-shipping threshold and every
 * label - all of them section settings.
 */
(function () {
  'use strict';

  if (!window.__RYVT_REAL_CART__) return;

  var CLOSE_MS = 420;           /* matches the .cart transition in ryvt-store.css */
  var TOAST_MS = 2400;          /* matches addToBag() in ryvt-store.js            */
  var busy = false;
  var toastTimer = null;

  function root() { return document.querySelector('[data-cart]'); }
  function attr(el, name, fallback) {
    var v = el && el.getAttribute(name);
    return v ? v : fallback;
  }
  function cfg(name, fallback) { return attr(root(), name, fallback); }

  function sectionId() { return cfg('data-cart-section', ''); }
  function addUrl() { return cfg('data-cart-add-url', '/cart/add') + '.js'; }
  function changeUrl() { return cfg('data-cart-change-url', '/cart/change') + '.js'; }
  function cartUrl() { return cfg('data-cart-url', '/cart') + '.js'; }
  function checkoutUrl() { return cfg('data-cart-checkout-url', '/checkout'); }
  function sectionsUrl() { return window.location.pathname + window.location.search; }

  /* ---------------- open / close ---------------- */

  function openCart() {
    var el = root();
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add('on'); });
  }

  function closeCart() {
    var el = root();
    if (!el) return;
    el.classList.remove('on');
    setTimeout(function () { var e = root(); if (e) e.hidden = true; }, CLOSE_MS);
  }

  function isOpen() {
    var el = root();
    return !!el && !el.hidden;
  }

  /* ---------------- painting ---------------- */

  /* The header bag pip lives in site-header.liquid and is server-rendered as
     hidden/0, so it is seeded from the drawer's own count on load. */
  function setBagCount(n) {
    var pip = document.querySelector('[data-bagn]');
    if (!pip) return;
    pip.hidden = n === 0;
    pip.textContent = n;
  }

  function countFromDrawer() {
    var el = root();
    var c = el && el.querySelector('[data-cart-count]');
    var n = c ? parseInt(c.textContent, 10) : 0;
    return isNaN(n) ? 0 : n;
  }

  /* Swap in a freshly rendered cart-drawer section. Only the panel contents
     are replaced, so the aside itself keeps its open/closed state. */
  function applySection(html) {
    var el = root();
    if (!el || !html) return;
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var fresh = doc.querySelector('[data-cart]');
    if (!fresh) return;
    el.innerHTML = fresh.innerHTML;
    if (fresh.classList.contains('empty')) el.classList.add('empty');
    else el.classList.remove('empty');
    setBagCount(countFromDrawer());
  }

  function fetchSection() {
    var id = sectionId();
    if (!id) return Promise.resolve();
    var url = sectionsUrl() + (sectionsUrl().indexOf('?') > -1 ? '&' : '?') + 'sections=' + encodeURIComponent(id);
    return fetch(url, { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (j) { applySection(j && j[id]); });
  }

  /* Every mutation asks for the section back in the same round trip; if the
     shop's API did not return it, fall back to a second request. */
  function afterMutation(data) {
    var id = sectionId();
    if (data && data.sections && data.sections[id]) {
      applySection(data.sections[id]);
      return Promise.resolve(data);
    }
    return fetchSection().then(function () { return data; });
  }

  function post(url, body) {
    var id = sectionId();
    if (id) {
      body.sections = id;
      body.sections_url = sectionsUrl();
    }
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw (j && (j.description || j.message)) || 'Cart error';
        return j;
      });
    });
  }

  /* /cart.js first so the header pip is right immediately, then the section
     markup so the drawer body matches it. */
  function refresh() {
    return fetch(cartUrl(), { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        if (c && typeof c.item_count === 'number') setBagCount(c.item_count);
        return fetchSection();
      })
      .catch(function () {});
  }

  /* ---------------- toast (the one site-chrome already renders) ---------------- */

  function toast(text) {
    var t = document.querySelector('[data-toast]');
    var item = document.querySelector('[data-toast-item]');
    if (!t) return;
    if (item && text) item.textContent = text;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, TOAST_MS);
  }

  /* ---------------- mutations ---------------- */

  function setQuantity(key, qty) {
    if (busy) return Promise.resolve();
    busy = true;
    return post(changeUrl(), { id: key, quantity: Math.max(0, qty) })
      .then(afterMutation)
      .catch(function () { return fetchSection(); })
      .then(function () { busy = false; });
  }

  function addToBag(body, label) {
    if (busy) return Promise.resolve();
    busy = true;
    return post(addUrl(), body)
      .then(afterMutation)
      .then(function () {
        openCart();
        toast(label || '');
      })
      .catch(function (err) {
        toast(typeof err === 'string' ? err : 'Could not add that');
      })
      .then(function () { busy = false; });
  }

  /* ---------------- resolving what to add ---------------- */

  function addForm(el) {
    if (!el || !el.closest) return null;
    return el.closest('form[action*="/cart/add"]');
  }

  /* product-main.liquid is still the demo PDP, so it carries no variant id.
     Every place a real one could come from is tried, newest wiring first. */
  function variantId(btn) {
    var v = btn && btn.getAttribute && btn.getAttribute('data-variant-id');
    if (v) return v;
    var f = addForm(btn);
    var input = f && f.querySelector('[name="id"]');
    if (input && input.value) return input.value;
    var picked = document.querySelector('[data-sizes] .on[data-variant-id], [data-sizes] [data-variant-id].on');
    if (picked) return picked.getAttribute('data-variant-id');
    var any = document.querySelector('form[action*="/cart/add"] [name="id"]');
    if (any && any.value) return any.value;
    var m = /[?&]variant=(\d+)/.exec(window.location.search);
    return m ? m[1] : null;
  }

  function quantityFor(btn) {
    var f = addForm(btn);
    var q = f && f.querySelector('[name="quantity"]');
    var n = q ? parseInt(q.value, 10) : 1;
    return n > 0 ? n : 1;
  }

  /* what the "Added to bag" toast says - the PDP name plus whatever options
     are currently picked, matching the demo's toast copy */
  function addLabel() {
    var bits = [];
    var name = document.querySelector('[data-pdp-name], [data-product-title]');
    if (name && name.textContent.trim()) bits.push(name.textContent.trim());
    var picked = document.querySelectorAll('[data-opt-row] button.on, [data-sizes] button.on');
    for (var i = 0; i < picked.length; i++) {
      var v = picked[i].getAttribute('data-value') || picked[i].textContent.trim();
      if (v) bits.push(v);
    }
    return bits.join(' / ');
  }

  var warned = false;
  function warnNoVariant() {
    if (warned) return;
    warned = true;
    if (window.console && console.warn) {
      console.warn('[ryvt-cart] real cart is on but no variant id is available - ' +
        'the add button needs data-variant-id or a form[action*="/cart/add"] with [name="id"].');
    }
  }

  /* ---------------- interception (capture phase, so the demo never sees it) ---------------- */

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var bag = t.closest('[data-bag-open]');
    if (bag) {
      e.preventDefault();
      e.stopPropagation();
      openCart();
      refresh();
      return;
    }

    var drawer = t.closest('[data-cart]');

    var close = t.closest('[data-cart-close]');
    if (close) {
      e.stopPropagation();
      /* "Shop the drop" carries data-cart-close AND a real href now - close the
         drawer but let the browser follow the link. */
      var href = close.getAttribute && close.getAttribute('href');
      if (!(close.tagName === 'A' && href && href.charAt(0) !== '#')) e.preventDefault();
      closeCart();
      return;
    }

    if (t.closest('[data-checkout]')) {
      e.preventDefault();
      e.stopPropagation();
      if (countFromDrawer() > 0) window.location.href = checkoutUrl();
      return;
    }

    if (drawer) {
      var step = t.closest('[data-qty]');
      if (step) {
        e.preventDefault();
        e.stopPropagation();
        var line = step.closest('.cart-line');
        /* the quantity comes off the attribute Liquid wrote, never off the
           rendered text - ryvt-store.js animates loose figures */
        var now = parseInt(step.getAttribute('data-line-qty') ||
                           (line && line.getAttribute('data-line-qty')), 10);
        if (isNaN(now)) {
          var box = step.closest('.cart-qty');
          var out = box && box.querySelector('span');
          now = out ? parseInt(out.textContent, 10) : NaN;
        }
        var key = step.getAttribute('data-key') || (line && line.getAttribute('data-key'));
        if (key && !isNaN(now)) setQuantity(key, now + parseInt(step.getAttribute('data-qty'), 10));
        return;
      }

      var rm = t.closest('[data-remove]');
      if (rm) {
        e.preventDefault();
        e.stopPropagation();
        var rline = rm.closest('.cart-line');
        var rkey = rm.getAttribute('data-key') || (rline && rline.getAttribute('data-key'));
        if (rkey) setQuantity(rkey, 0);
        return;
      }
    }

    var add = t.closest('[data-add], [data-dock-add]');
    if (add) {
      e.preventDefault();
      e.stopPropagation();          /* the demo addToBag() must not run against a real bag */
      if (add.disabled) return;
      var id = variantId(add);
      if (!id) { warnNoVariant(); return; }
      addToBag({ items: [{ id: id, quantity: quantityFor(add) }] }, addLabel());
    }
  }, true);

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.matches || !f.matches('form[action*="/cart/add"]')) return;
    e.preventDefault();
    e.stopPropagation();
    var data = new FormData(f);
    var body = { items: [{ id: data.get('id'), quantity: parseInt(data.get('quantity'), 10) || 1 }] };
    var props = {};
    data.forEach(function (v, k) {
      var m = /^properties\[(.+)\]$/.exec(k);
      if (m) props[m[1]] = v;
    });
    if (Object.keys(props).length) body.items[0].properties = props;
    if (data.get('selling_plan')) body.items[0].selling_plan = data.get('selling_plan');
    addToBag(body, '');
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !isOpen()) return;
    e.stopPropagation();
    closeCart();
  }, true);

  /* ---------------- boot ---------------- */

  /* ryvt-store.js walks the whole document counting figures up from zero, and
     it runs before this file does. It has no idea the drawer is server-rendered
     now, so it claims every figure inside it - quantities, line prices, even the
     "32" in "Slate / 32" - and rewrites them to 0. cart-drawer.liquid snapshots
     the panel inline, while it is still pristine; putting that snapshot back
     drops the claimed nodes (sweep() discards them once they are disconnected)
     and leaves the real numbers standing. Re-rendered panels come from the
     server after that pass, so they are never touched either. */
  (function restore() {
    var el = root();
    if (el && typeof window.__RYVT_CART_HTML__ === 'string') el.innerHTML = window.__RYVT_CART_HTML__;
  }());

  setBagCount(countFromDrawer());

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.querySelector('[data-cart]')) setBagCount(countFromDrawer());
  });

  window.RYVT_CART = {
    open: openCart,
    close: closeCart,
    refresh: refresh,
    add: function (id, qty) { return addToBag({ items: [{ id: id, quantity: qty || 1 }] }, ''); },
    setQuantity: setQuantity
  };
})();
