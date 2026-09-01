


(function(){
  "use strict";
  var dot=document.querySelector('[data-cur]'), ring=document.querySelector('[data-cur-ring]');
  if(!dot || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.body.classList.add('rc');

  var DARK='.hero,.ft,.proof,.split .txt,.st-open,.st-spec,.ph.dark,.film-back,.dock';
  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,shown=false;

  addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY;
    dot.style.transform='translate('+mx+'px,'+my+'px)';
    if(!shown){ shown=true; dot.classList.remove('off'); ring.classList.remove('off'); }
  });
  (function follow(){
    rx+=(mx-rx)*.17; ry+=(my-ry)*.17;
    ring.style.transform='translate('+rx+'px,'+ry+'px)';
    requestAnimationFrame(follow);
  })();

  addEventListener('mousedown',function(){ document.body.classList.add('rc-press'); });
  addEventListener('mouseup',function(){ document.body.classList.remove('rc-press'); });
  /* only hide when the pointer truly leaves the window */
  document.addEventListener('mouseleave',function(e){
    if(e.target !== document.documentElement) return;
    dot.classList.add('off'); ring.classList.add('off');
  });
  document.addEventListener('mouseenter',function(){
    dot.classList.remove('off'); ring.classList.remove('off');
  });
  document.addEventListener('mouseover',function(e){
    document.body.classList.toggle('rc-hot', !!e.target.closest('a,button'));
    document.body.classList.toggle('cur-dark', !!e.target.closest(DARK));
  });

})();


(function(){
  "use strict";

  /* ---------------- catalogue ---------------- */
  var P = [
    {h:'renaissance', n:'The Detroit Renaissance Heavyweight Tee', cat:'Tees', price:58, badge:'Best seller',
     blurb:'The one the brand was built on. 8.2 oz garment-dyed cotton, boxy body, set shoulder, and a collar that holds its shape past year one.',
     colors:[{n:'Bone',hex:'#EFEBE3'},{n:'Black',hex:'#0B0B0C'},{n:'Chalk',hex:'#E8E6E1'}],
     sizes:['XS','S','M','L','XL','XXL'], out:['XS'],
     details:['8.2 oz heavyweight cotton, garment-dyed','Boxy body, set-in shoulder','Ribbed collar, double-needle hem','Cut and finished in Metro Detroit']},
    {h:'foundry', n:'The Foundry Wash Heavyweight Tee', cat:'Tees', price:58, badge:'Restocked',
     blurb:'Dyed, then washed twice before it is cut, so it lands broken-in and stays that size.',
     colors:[{n:'Washed Black',hex:'#26262A'},{n:'Concrete',hex:'#D9D6D0'}],
     sizes:['XS','S','M','L','XL','XXL'], out:[],
     details:['8.2 oz cotton, double-washed','Softened hand, pre-shrunk','Tonal woven label at hem']},
    {h:'cargo', n:'The Standard-Issue Cargo Pants', cat:'Bottoms', price:118, badge:'',
     blurb:'Straight leg, six pockets, and a waistband that does not roll when you sit down.',
     colors:[{n:'Black',hex:'#0B0B0C'},{n:'Field Olive',hex:'#4A4A3A'}],
     sizes:['28','30','32','34','36','38'], out:['38'],
     details:['12 oz cotton twill','Six pockets, bar-tacked','Straight leg, no taper']},
    {h:'corktown', n:'The Corktown Boxy Tank', cat:'Tanks', price:42, badge:'New',
     blurb:'Wide armhole, dropped shoulder, cut long enough to stay tucked.',
     colors:[{n:'Bone',hex:'#EFEBE3'},{n:'Black',hex:'#0B0B0C'}],
     sizes:['XS','S','M','L','XL'], out:[],
     details:['7 oz cotton jersey','Wide armhole, boxy body','Raw-edge neck binding']},
    {h:'eastern', n:'The Eastern Market Muscle Tank', cat:'Tanks', price:44, badge:'',
     blurb:'Closer through the chest, cropped a touch shorter. Built for the lift, not the loungewear photo.',
     colors:[{n:'Concrete',hex:'#D9D6D0'},{n:'Washed Black',hex:'#26262A'}],
     sizes:['S','M','L','XL'], out:['S'],
     details:['7 oz cotton jersey','Trim chest, shorter body','Reinforced armhole seam']},
    {h:'gratiot', n:'The Gratiot Heavyweight Crew', cat:'Fleece', price:88, badge:'',
     blurb:'14 oz loopback fleece with a two-panel body, so it drapes instead of bunching.',
     colors:[{n:'Black',hex:'#0B0B0C'},{n:'Heather Steel',hex:'#7A7A7E'}],
     sizes:['S','M','L','XL','XXL'], out:[],
     details:['14 oz loopback fleece','Two-panel body','Ribbed cuff and hem']},
    {h:'woodward', n:'The Woodward Utility Short', cat:'Bottoms', price:68, badge:'',
     blurb:'Nine-inch inseam, zip pocket on the thigh, cut from the same twill as the cargo.',
     colors:[{n:'Black',hex:'#0B0B0C'},{n:'Field Olive',hex:'#4A4A3A'}],
     sizes:['28','30','32','34','36'], out:[],
     details:['12 oz cotton twill','9" inseam','Zip thigh pocket']},
    {h:'belleisle', n:'The Belle Isle Performance Tee', cat:'Tees', price:52, badge:'New',
     blurb:'The training cut. Lighter knit, longer body, dries fast without going shiny.',
     colors:[{n:'Concrete',hex:'#D9D6D0'},{n:'Black',hex:'#0B0B0C'}],
     sizes:['XS','S','M','L','XL'], out:[],
     details:['Cotton-blend performance knit','Longer body, trim sleeve','Flatlock shoulder seam']}
  ];
  var byH = {}; P.forEach(function(p){ byH[p.h] = p; });

  /* the cloth and the measurements, per style - the two questions every
     product page is actually asked */
  var FABRIC = {
    Tees:   ['8.2 oz cotton, garment-dyed', 'Washed twice before cutting', 'Ribbed collar, double-needle hem'],
    Tanks:  ['7 oz cotton jersey', 'Raw-edge neck binding', 'Reinforced armhole seam'],
    Bottoms:['12 oz cotton twill', 'Bar-tacked at every stress point', 'YKK hardware throughout'],
    Fleece: ['14 oz loopback fleece', 'Two-panel body, no centre seam', 'Ribbed cuff and hem']
  };
  var SIZES_TOP = [['Size','Chest','Length','Shoulder'],
                   ['XS','19','26.5','17'],['S','20.5','28','18'],['M','22','29','19'],
                   ['L','23.5','30','20'],['XL','25','31','21'],['XXL','26.5','32','22']];
  var SIZES_BTM = [['Size','Waist','Inseam','Leg opening'],
                   ['28','14','30','7.5'],['30','15','30','7.75'],['32','16','30','8'],
                   ['34','17','30','8.25'],['36','18','30','8.5'],['38','19','30','8.75']];

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  var esc = function(s){ return String(s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

  var plate = function(i,label,cls){
    var k = ['','alt','dark','alt'][i % 4];
    return '<span class="ph '+k+' '+(cls||'')+'">'+(label ? '<em>'+esc(label)+'</em>' : '')+'</span>';
  };

  /* ---------------- product cards ---------------- */
  function cardHTML(p,i){
    var sw = p.colors.map(function(c){
      return '<i style="background:'+c.hex+'" title="'+esc(c.n)+'"></i>'; }).join('');
    var badge = p.badge ? '<span class="card-badge">'+esc(p.badge)+'</span>' : '';
    /* name and price share one line, the way a printed line sheet reads;
       swatches stay out of the way until the card is hovered */
    return '<a class="card" href="#" data-product="'+p.h+'">'+
      '<div class="card-media">'+
        plate(i, p.colors[0].n, 'still')+
        plate(i+1, '', 'hover-img')+
        badge+
        '<button class="card-fav" type="button" aria-label="Save '+esc(p.n)+'" '+
          'onclick="event.preventDefault();event.stopPropagation();this.classList.toggle(\'on\')">'+
          '<svg viewBox="0 0 24 24"><path d="M12 3.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6 6.8 19.5 8 13.7 3.6 9.7l5.9-.7z"/></svg>'+
        '</button>'+
      '</div>'+
      '<div class="card-info">'+
        '<span class="card-name">'+esc(p.n)+'</span>'+
        '<span class="card-price">$'+p.price+'</span>'+
      '</div>'+
      '<div class="card-sub">'+
        '<span class="sw">'+sw+'</span>'+
        '<span class="card-colour">'+esc(p.colors[0].n)+'</span>'+
      '</div>'+
    '</a>';
  }
  function fill(el, list){
    if(!el) return;
    el.innerHTML = list.map(function(p,i){ return cardHTML(p,i); }).join('');
    $$('.card', el).forEach(function(c,i){
      c.setAttribute('data-i', (i+1 < 10 ? '0' : '') + (i+1));
    });
  }
  fill($('[data-rail]'),  P.slice(0,4));
  fill($('[data-rail2]'), P.slice(4,8));

  /* ---------------- shop filters ----------------
     The controls live in a drawer so the grid is the only thing on the page
     at rest. The button stays visible and says what is on, so nothing is
     hidden - it is folded, not buried. */
  var curFilter = 'all', curSort = 'feat';

  var SORTS = {
    feat: null,
    low:  function(a, b){ return a.price - b.price; },
    high: function(a, b){ return b.price - a.price; },
    name: function(a, b){ return a.n.localeCompare(b.n); }
  };
  var SORT_LAB = { feat:'Featured', low:'Price, low to high',
                   high:'Price, high to low', name:'A - Z' };

  function renderShop(){
    var list = curFilter === 'all' ? P.slice() : P.filter(function(p){ return p.cat === curFilter; });
    if(SORTS[curSort]) list.sort(SORTS[curSort]);
    fill($('[data-shop]'), list);
    $('[data-count]').textContent = list.length + (list.length === 1 ? ' style' : ' styles');
    $$('[data-filters] button').forEach(function(b){ b.classList.toggle('on', b.dataset.f === curFilter); });
    $$('[data-sorts] button').forEach(function(b){ b.classList.toggle('on', b.dataset.s === curSort); });

    /* the button carries the current state so the drawer never has to be
       opened just to find out what is applied */
    var chip = $('[data-filt-chip]');
    if(chip){
      var bits = [];
      if(curFilter !== 'all') bits.push(curFilter);
      if(curSort !== 'feat')  bits.push(SORT_LAB[curSort]);
      chip.textContent = bits.join(' / ');
      chip.hidden = !bits.length;
    }
  }

  $$('[data-filters] button').forEach(function(b){
    b.addEventListener('click', function(){ curFilter = b.dataset.f; renderShop(); });
  });
  $$('[data-sorts] button').forEach(function(b){
    b.addEventListener('click', function(){ curSort = b.dataset.s; renderShop(); });
  });
  var openFilters = function(){};
  (function filterDrawer(){
    var btn = $('[data-filt-toggle]'), panel = $('[data-filt-panel]');
    if(!btn || !panel) return;
    function set(open){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open){
        panel.hidden = false;
        panel.style.height = '0px';
        var h = panel.scrollHeight;
        requestAnimationFrame(function(){
          panel.style.transition = 'height .45s var(--e)';
          panel.style.height = h + 'px';
        });
        setTimeout(function(){ panel.style.height = 'auto'; }, 470);
      } else {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(function(){ panel.style.height = '0px'; });
        setTimeout(function(){ panel.hidden = true; panel.style.height = ''; }, 470);
      }
    }
    btn.addEventListener('click', function(){
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    var clear = $('[data-filt-clear]');
    if(clear) clear.addEventListener('click', function(){
      curFilter = 'all'; curSort = 'feat'; renderShop();
    });
    /* a deep link that arrives with a filter opens the drawer, so the
       narrowed grid is never a mystery */
    openFilters = function(){ if(btn.getAttribute('aria-expanded') !== 'true') set(true); };
  })();
  renderShop();

  /* ---------------- views ---------------- */
  function show(view){
    $$('[data-view]').forEach(function(v){ v.classList.toggle('on', v.dataset.view === view); });
    document.body.classList.toggle('pdp-open', view === 'product');
    if(view !== 'product') hideDock();
    window.scrollTo({top:0, behavior:'auto'});
    closeAll();
  }

  /* ---------------- PDP ---------------- */
  var cur = null, curSize = null, curColor = 0;

  function renderStage(p){
    var shots = [p.colors[0].n + ' - front', 'Back', 'Detail'];
    var stage = $('[data-pdp-stage]');
    var html = shots.map(function(s,i){
      return '<span class="shot'+(i===0?' on':'')+'" data-shot="'+i+'">'+plate(i,s)+'</span>';
    }).join('');
    html += '<div class="mos">'+
      shots.map(function(s,i){
        return '<button class="chip'+(i===0?' on':'')+'" data-chip="'+i+'" aria-label="View '+esc(s)+'">'+plate(i,'')+'</button>';
      }).join('')+
      '<button class="chip film" data-film-chip aria-label="Play the film"><span class="ph dark"></span></button>'+
    '</div>';
    stage.innerHTML = html;
    $$('[data-chip]', stage).forEach(function(c){
      c.addEventListener('click', function(){
        var i = c.dataset.chip;
        $$('.shot', stage).forEach(function(s){ s.classList.toggle('on', s.dataset.shot === i); });
        $$('.chip', stage).forEach(function(x){ x.classList.toggle('on', x === c); });
      });
    });
    $('[data-film-chip]', stage).addEventListener('click', function(){
      var f = $('[data-film]');
      f.scrollIntoView({block:'center', behavior:'smooth'});
      f.animate([{opacity:.55},{opacity:1}], {duration:600, easing:'ease-out'});
    });
  }

  function openProduct(h){
    cur = byH[h]; if(!cur) return;
    curSize = null; curColor = 0;

    $('[data-pdp-crumb]').textContent = cur.n;
    $('[data-pdp-cat]').textContent   = cur.cat;
    $('[data-pdp-name]').textContent  = cur.n;
    $('[data-pdp-price]').textContent = '$' + cur.price;
    $('[data-pdp-blurb]').textContent = cur.blurb;
    $('[data-pdp-details]').innerHTML = cur.details.map(function(d){ return '<li>'+esc(d)+'</li>'; }).join('');
    $('[data-pdp-fabric]').innerHTML = (FABRIC[cur.cat] || FABRIC.Tees)
      .map(function(d){ return '<li>'+esc(d)+'</li>'; }).join('');
    var table = cur.cat === 'Bottoms' ? SIZES_BTM : SIZES_TOP;
    $('[data-pdp-size]').innerHTML = table.map(function(row, i){
      var cell = i === 0 ? 'th' : 'td';
      return '<tr>' + row.map(function(c){ return '<'+cell+'>'+esc(c)+'</'+cell+'>'; }).join('') + '</tr>';
    }).join('');
    $('[data-dock-name]').textContent  = cur.n;
    $('[data-dock-price]').textContent = '$' + cur.price;

    $('[data-color-name]').textContent = cur.colors[0].n;
    $('[data-colors]').innerHTML = cur.colors.map(function(c,i){
      return '<button data-c="'+i+'" class="'+(i===0?'on':'')+'" style="background:'+c.hex+'" aria-label="'+esc(c.n)+'"></button>';
    }).join('');
    $$('[data-colors] button').forEach(function(b){
      b.addEventListener('click', function(){
        curColor = +b.dataset.c;
        $$('[data-colors] button').forEach(function(x){ x.classList.toggle('on', x === b); });
        $('[data-color-name]').textContent = cur.colors[curColor].n;
        renderStage(cur);
      });
    });

    $('[data-sizes]').innerHTML = cur.sizes.map(function(s){
      var out = cur.out.indexOf(s) > -1;
      return '<button data-s="'+esc(s)+'"'+(out?' disabled':'')+'>'+esc(s)+'</button>';
    }).join('');
    $$('[data-sizes] button').forEach(function(b){
      b.addEventListener('click', function(){
        if(b.disabled) return;
        curSize = b.dataset.s;
        $$('[data-sizes] button').forEach(function(x){ x.classList.toggle('on', x === b); });
        syncAdd();
      });
    });

    fill($('[data-pairs]'), P.filter(function(p){ return p.h !== cur.h; }).slice(0,4));
    renderStage(cur);
    syncAdd();
    show('product');
    requestAnimationFrame(watchAdd);
  }

  /* the dock proxies the real button - it never replaces it */
  var addBtn  = $('[data-add]');
  var dock    = $('[data-dock]');
  var dockBtn = $('[data-dock-add]');

  function syncAdd(){
    var ready = !!curSize;
    addBtn.disabled  = !ready;
    dockBtn.disabled = !ready;
    addBtn.textContent  = ready ? 'Add to bag - $' + cur.price : 'Select a size';
    dockBtn.textContent = ready ? 'Add to bag' : 'Select size';
  }

  /* ---------------- the bag ---------------- */
  var FREE_OVER = 125;
  var lines = [];
  var cartEl = $('[data-cart]');

  function money(v){ return '$' + v.toLocaleString(); }
  function bagCount(){ return lines.reduce(function(n,l){ return n + l.qty; }, 0); }
  function bagTotal(){ return lines.reduce(function(n,l){ return n + l.qty * l.price; }, 0); }

  function paintCart(){
    var count = bagCount(), total = bagTotal();
    var n = $('[data-bagn]');
    n.hidden = count === 0;
    n.textContent = count;
    $('[data-cart-count]').textContent = count;
    $('[data-cart-total]').textContent = money(total);
    $('[data-checkout]').disabled = count === 0;
    cartEl.classList.toggle('empty', count === 0);

    var left = Math.max(0, FREE_OVER - total);
    $('[data-cart-bar]').style.width = Math.min(100, total / FREE_OVER * 100) + '%';
    $('[data-cart-ship-msg]').innerHTML = left > 0
      ? 'Add <b>' + money(left) + '</b> more for free shipping'
      : 'Free shipping unlocked';
    $('[data-cart-shipline]').textContent = left > 0 ? 'Calculated at checkout' : 'Free';

    $('[data-cart-items]').innerHTML = lines.map(function(l, i){
      return '<div class="cart-line">' +
        '<span class="thumb"></span>' +
        '<div><b>' + esc(l.name) + '</b><span>' + esc(l.colour) + ' / ' + esc(l.size) + '</span>' +
          '<div class="cart-qty">' +
            '<button type="button" data-qty="-1" data-i="' + i + '" aria-label="One fewer">&minus;</button>' +
            '<span>' + l.qty + '</span>' +
            '<button type="button" data-qty="1" data-i="' + i + '" aria-label="One more">+</button>' +
          '</div>' +
        '</div>' +
        '<div><span class="price">' + money(l.qty * l.price) + '</span>' +
          '<a class="cart-x" href="#" data-remove="' + i + '">Remove</a></div>' +
      '</div>';
    }).join('');
  }

  function openCart(){ cartEl.hidden = false; requestAnimationFrame(function(){ cartEl.classList.add('on'); }); }
  function closeCart(){ cartEl.classList.remove('on'); setTimeout(function(){ cartEl.hidden = true; }, 420); }

  cartEl.addEventListener('click', function(e){
    if(e.target.closest('[data-cart-close]')){ e.preventDefault(); closeCart(); return; }
    var q = e.target.closest('[data-qty]');
    if(q){
      var i = +q.dataset.i;
      lines[i].qty += +q.dataset.qty;
      if(lines[i].qty < 1) lines.splice(i, 1);
      paintCart();
      return;
    }
    var rm = e.target.closest('[data-remove]');
    if(rm){ e.preventDefault(); lines.splice(+rm.dataset.remove, 1); paintCart(); }
  });
  $$('[data-bag-open]').forEach(function(b){
    b.addEventListener('click', function(e){ e.preventDefault(); openCart(); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && cartEl && !cartEl.hidden) closeCart();
  });
  $('[data-checkout]').addEventListener('click', function(){
    var t = $('[data-toast]');
    $('.toast b').textContent = 'Checkout';
    $('[data-toast-item]').textContent = 'Handed to Shopify at launch';
    t.classList.add('on');
    setTimeout(function(){ t.classList.remove('on'); $('.toast b').textContent = 'Added to bag'; }, 2600);
  });

  function addToBag(){
    if(addBtn.disabled) return;
    var colour = cur.colours ? cur.colours[curColor].n : cur.colors[curColor].n;
    var found = null;
    lines.forEach(function(l){
      if(l.h === cur.h && l.size === curSize && l.colour === colour) found = l;
    });
    if(found) found.qty++;
    else lines.push({ h:cur.h, name:cur.n, price:cur.price, size:curSize, colour:colour, qty:1 });
    paintCart();
    $('[data-toast-item]').textContent = cur.colors[curColor].n + ' / ' + curSize;
    var t = $('[data-toast]'); t.classList.add('on');
    clearTimeout(addToBag._t);
    addToBag._t = setTimeout(function(){ t.classList.remove('on'); }, 2400);
  }
  addBtn.addEventListener('click', addToBag);
  dockBtn.addEventListener('click', function(){ addBtn.click(); });

  function showDock(){
    dock.classList.add('on');
    document.documentElement.style.setProperty('--pdp-cta-height', dock.offsetHeight + 'px');
  }
  function hideDock(){
    dock.classList.remove('on');
    document.documentElement.style.setProperty('--pdp-cta-height', '0px');
  }
  var io = null;
  function watchAdd(){
    if(io) io.disconnect();
    io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!document.body.classList.contains('pdp-open')) return hideDock();
        if(e.isIntersecting) hideDock(); else showDock();
      });
    }, {threshold:0});
    io.observe(addBtn);
  }

  /* ---------------- header panels ---------------- */
  var scrim = $('[data-scrim]');
  function closeAll(){
    $$('[data-panel]').forEach(function(p){ p.classList.remove('on'); });
    $$('[data-menu]').forEach(function(m){ m.classList.remove('on'); });
    $('[data-srch]').classList.remove('on');
    $$('[data-drop]').forEach(function(b){ b.setAttribute('aria-expanded','false'); });
    scrim.classList.remove('on');
    setTimeout(function(){ if(!scrim.classList.contains('on')) scrim.hidden = true; }, 300);
  }
  function openScrim(){ scrim.hidden = false; requestAnimationFrame(function(){ scrim.classList.add('on'); }); }
  $('[data-scrim]').addEventListener('click', closeAll);
  function openDrop(btn){
    var panel = $('[data-panel="'+btn.dataset.drop+'"]');
    if(!panel) return;
    closeAll();
    panel.classList.add('on');
    btn.setAttribute('aria-expanded','true');
    openScrim();
    if(btn.closest('[data-menu]')) btn.closest('[data-menu]').classList.add('on');
  }

  $$('[data-drop]').forEach(function(btn){
    /* Shop is a destination, not just a menu: clicking it goes to the full
       collection, and the mega menu is what opens on hover instead. */
    if(btn.hasAttribute('data-shop-nav')){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        closeAll();
        curFilter = 'all'; curSort = 'feat';
        renderShop();
        show('shop');
        window.scrollTo(0, 0);
      });
      return;
    }
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var panel = $('[data-panel="'+btn.dataset.drop+'"]');
      if(panel.classList.contains('on')) closeAll(); else openDrop(btn);
    });
  });

  /* hover opens the mega menu on a pointer; touch devices have no hover, so
     there the burger is the way in and Shop stays a plain link */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    $$('[data-menu] [data-drop]').forEach(function(btn){
      var wrap = btn.closest('[data-menu]');
      wrap.addEventListener('mouseenter', function(){ openDrop(btn); });
    });
    var hd = $('.hd');
    if(hd) hd.addEventListener('mouseleave', function(){
      if($('[data-srch]') && $('[data-srch]').classList.contains('on')) return;
      closeAll();
    });
  }
  $('[data-search-open]').addEventListener('click', function(){
    var s = $('[data-srch]'), open = s.classList.contains('on');
    closeAll();
    if(!open){ s.classList.add('on'); openScrim(); setTimeout(function(){ $('[data-q]').focus(); }, 60); }
  });
  $('[data-search-close]').addEventListener('click', closeAll);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeAll(); });
  document.addEventListener('click', function(e){
    if(e.target.closest('.hd') || e.target.closest('.srch-scrim')) return;
    closeAll();
  });

  /* search: the pane always holds something - most wanted, then results */
  var MOST = P.slice(0,4);
  function hitHTML(p,i){
    return '<a href="#" data-product="'+p.h+'">'+
      '<span class="hit-m">'+plate(i,'')+'<span class="hit-tag">'+esc(p.colors[0].n)+'</span></span>'+
      '<p>'+esc(p.n)+'</p><span>$'+p.price+'</span></a>';
  }
  function paintHits(list){
    $('[data-hits]').innerHTML = list.map(function(p,i){ return hitHTML(p,i); }).join('');
  }
  function runSearch(q){
    var box = $('[data-hits]'), head = $('[data-hits-h]'), count = $('[data-hits-count]');
    var clear = $('[data-search-clear]');
    q = (q || '').trim();
    clear.hidden = !q;
    if(!q){
      head.textContent = 'Most wanted';
      count.textContent = MOST.length + ' styles';
      paintHits(MOST);
      return;
    }
    var k = q.toLowerCase();
    var hits = P.filter(function(p){
      return (p.n + ' ' + p.cat + ' ' + p.colors.map(function(c){return c.n;}).join(' ')).toLowerCase().indexOf(k) > -1;
    });
    head.textContent = 'Results';
    count.textContent = hits.length + (hits.length === 1 ? ' style' : ' styles');
    if(!hits.length){
      box.innerHTML = '<p class="none">Nothing matches <b>' + esc(q) + '</b> yet. ' +
        'Closest things we make: heavyweight tees, tanks, cargo.</p>' +
        MOST.slice(0,3).map(function(p,i){ return hitHTML(p,i); }).join('');
      return;
    }
    paintHits(hits.slice(0,8));
  }
  $('[data-q]').addEventListener('input', function(e){ runSearch(e.target.value); });
  $('[data-search-clear]').addEventListener('click', function(){
    var f = $('[data-q]'); f.value = ''; runSearch(''); f.focus();
  });
  $$('.srch-terms button').forEach(function(b){
    b.addEventListener('click', function(){
      var q = b.dataset.term;
      $('[data-q]').value = q; runSearch(q); $('[data-q]').focus();
    });
  });
  runSearch('');

  /* ---------------- global navigation ---------------- */
  document.addEventListener('click', function(e){
    var prod = e.target.closest('[data-product]');
    if(prod){ e.preventDefault(); openProduct(prod.dataset.product); return; }
    var go = e.target.closest('[data-go]');
    if(go){
      e.preventDefault();
      if(go.dataset.filter){ curFilter = go.dataset.filter; renderShop(); openFilters(); }
      show(go.dataset.go);
    }
  });



  /* ---------------- every figure on the site counts up ----------------
     Rather than naming the numbers one by one, this walks the document for
     text that contains a figure and wraps each one. A number runs from zero
     when it scrolls into view, is set back to zero when it leaves so the next
     pass replays it, and re-runs on hover so it can be read again in place.

     Two shapes, because they need different treatment:
       - a standalone figure (a stat, a price, a section number) is animated in
         its own element and keeps the formatting it was authored with;
       - a figure inside a sentence is wrapped and zero-padded to its final
         width, so "48 hours" counts through "00 hours" and the line never
         reflows around it.

     Live text is left alone: the clock, the bag count and the cart total are
     written by other code and would fight this. */
  var NUM_SKIP = 'script,style,noscript,svg,select,textarea,input,button,option,' +
                 'code,pre,[data-time],[data-cart-count],[data-cart-total],' +
                 '[data-toast-item],[data-ck],.toast,.bag,.dock,.cur,.cur-r';
  /* the ticker repeats forever - replaying there would be a nervous tic,
     so its figures run once and then hold */
  var NUM_ONCE = '.marq';
  var nums = [];

  function easeOutExpo(t){ return 1 - Math.pow(1 - t, 3); }

  function fmt(el, v){
    var dec = el._dec, out;
    if(dec){
      out = Math.abs(v).toFixed(dec);
    } else {
      out = String(Math.round(Math.abs(v)));
      if(el._grp) out = Number(out).toLocaleString();
    }
    if(el._wid){
      var head = out.split('.')[0], tail = out.slice(head.length);
      while(head.length < el._wid) head = '0' + head;
      out = head + tail;
    }
    return el._pre + (v < 0 ? '-' : '') + out + el._suf;
  }

  function write(el, txt){ el.textContent = txt; el._own = txt; }

  function runNumber(el){
    cancelAnimationFrame(el._raf);
    var dur = 1900 + Math.min(900, Math.abs(el._to) * 6), t0 = null;
    el._raf = requestAnimationFrame(function step(now){
      if(t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      write(el, fmt(el, el._to * easeOutExpo(p)));
      if(p < 1) el._raf = requestAnimationFrame(step); else el._done = true;
    });
  }
  function zeroNumber(el){
    cancelAnimationFrame(el._raf);
    write(el, fmt(el, 0));
  }

  var NUM_RE = /^([^0-9-]*?)(-?[0-9][0-9,]*(?:\.[0-9]+)?)([\s\S]*)$/;

  /* read an element whose whole text is one figure */
  function prepare(node, pad){
    var m = NUM_RE.exec(node.textContent.trim());
    if(!m) return null;
    var fig = m[2], to = parseFloat(fig.replace(/,/g, ''));
    if(isNaN(to)) return null;
    node._pre = m[1];
    node._suf = m[3];
    node._to  = to;
    node._dec = (fig.split('.')[1] || '').length;
    node._grp = fig.indexOf(',') > -1;
    /* keep authored zero padding ("01" stays two wide), and pad in prose so
       the surrounding words never shift */
    var head = fig.replace(/[,]/g, '').split('.')[0].replace('-', '');
    node._wid = (pad || head.charAt(0) === '0') ? head.length : 0;
    node.classList.add('num');
    node._on = false;
    node._once = !!node.closest(NUM_ONCE);
    zeroNumber(node);
    return node;
  }

  /* an element counts on its own when it holds nothing but one figure */
  function standalone(el){
    if(el.children.length) return false;
    var t = el.textContent.trim();
    if(t.length > 26) return false;
    return (t.match(/[0-9][0-9,.]*/g) || []).length === 1;
  }

  var seenText = new WeakSet();

  function walk(root){
    var found = [];
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){
        if(!/[0-9]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        /* skip what is already claimed - our own inline wrappers, and any
           element this pass has taken. A bare .num in the markup is authored,
           not claimed, so it still gets read. */
        if(!p || p._num || p.classList.contains('num-in')) return NodeFilter.FILTER_REJECT;
        if(p.closest(NUM_SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while((n = w.nextNode())) found.push(n);
    return found;
  }

  /* split a sentence into text and figures, wrapping each figure so it can be
     animated without disturbing the words around it */
  function wrapInline(node){
    var txt = node.nodeValue, re = /[0-9][0-9,]*(?:\.[0-9]+)?/g, out = [], i = 0, m, made = [];
    while((m = re.exec(txt))){
      if(m.index > i) out.push(document.createTextNode(txt.slice(i, m.index)));
      var sp = document.createElement('span');
      sp.className = 'num num-in';
      sp.textContent = m[0];
      out.push(sp); made.push(sp);
      i = m.index + m[0].length;
    }
    if(!made.length) return [];
    if(i < txt.length) out.push(document.createTextNode(txt.slice(i)));
    var frag = document.createDocumentFragment();
    out.forEach(function(x){ frag.appendChild(x); });
    node.parentNode.replaceChild(frag, node);
    return made;
  }

  function add(el, pad){
    var n = prepare(el, pad);
    if(!n) return;
    el._num = true;
    nums.push(n);
    armHover(n);
  }

  /* hovering a figure replays it from zero, so a number can be re-read
     without scrolling away and back */
  function armHover(el){
    if(el._hover) return;
    el._hover = true;
    el.addEventListener('mouseenter', function(){
      if(!el._on) return;
      zeroNumber(el);
      requestAnimationFrame(function(){ runNumber(el); });
    });
  }

  function collect(root){
    root = root || document.body;
    /* anything already claimed whose text was rewritten by other code is read
       again, so JS-painted figures (the filter tally, the story counter) still
       animate off their new value */
    $$('.num', root).forEach(function(el){
      if(el._num && el._own !== undefined && el.textContent !== el._own){
        el._num = false; el.classList.remove('num');
      }
    });

    walk(root).forEach(function(node){
      if(seenText.has(node)) return;
      seenText.add(node);
      var p = node.parentElement;
      if(!p) return;
      if(standalone(p)){
        if(!p._num) add(p, false);
      } else {
        wrapInline(node).forEach(function(sp){ add(sp, true); });
      }
    });
  }

  function sweep(){
    var h = window.innerHeight;
    for(var i = 0; i < nums.length; i++){
      var el = nums[i];
      if(!el.isConnected){ nums.splice(i--, 1); continue; }
      if(el._once && el._done) continue;
      var r = el.getBoundingClientRect();
      if(r.width + r.height === 0){ if(el._on){ el._on = false; zeroNumber(el); } continue; }
      /* a figure has to be properly inside the viewport, not merely clipping
         its bottom edge. Anything sitting low on the first screen would
         otherwise finish counting before it was ever looked at, and would
         then be done by the time it was scrolled to. */
      var seen = r.bottom > 40 && r.top < h - 40;
      /* On the very first paint anything sitting low on the opening screen is
         left armed rather than run: it would otherwise finish counting before
         it had been looked at, and be over by the time it was scrolled to.
         Once the page has been scrolled, plain intersection is enough. */
      if(seen && firstPass && r.top > h * 0.7) seen = false;
      if(seen === el._on) continue;
      el._on = seen;
      if(seen) runNumber(el); else if(!el._once) zeroNumber(el);
    }
  }

  /* true until the page is scrolled, or if there is nothing to scroll */
  var firstPass = document.documentElement.scrollHeight > window.innerHeight + 4;
  addEventListener('scroll', function(){ firstPass = false; }, { passive:true, once:true });

  var sweepQueued = false;
  function queueSweep(){
    if(sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(function(){ sweepQueued = false; sweep(); });
  }
  addEventListener('scroll', queueSweep, { passive:true });
  addEventListener('resize', queueSweep);

  collect(document.body);
  queueSweep();

  /* cards, results and product pages are painted by JS - re-collect after each */
  var _fill = fill;
  fill = function(el, list){ _fill(el, list); collect(); queueSweep(); };
  var _paint = paintHits;
  paintHits = function(list){ _paint(list); collect(); queueSweep(); };
  var _open = openProduct;
  openProduct = function(h){ _open(h); collect(); queueSweep(); };
  var _show = show;
  /* moving to another view is interaction: from here on a figure runs as
     soon as it is on screen, without waiting to be scrolled past */
  show = function(v){ firstPass = false; _show(v); collect(); queueSweep(); };

  /* story: one observer drives the sticky picture and dims the steps around it */
  (function initStory(){
    var steps = $$('.st-step'), shots = $$('[data-way-shot]'), n = $('[data-way-n]');
    if(!steps.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var w = e.target.dataset.way;
        steps.forEach(function(st){ st.classList.toggle('on', st === e.target); });
        shots.forEach(function(sh){ sh.classList.toggle('on', sh.dataset.wayShot === w); });
        n.textContent = '0' + w;
      });
    }, {rootMargin:'-45% 0px -45% 0px', threshold:0});
    steps.forEach(function(st){ io.observe(st); });
    steps[0].classList.add('on');
  })();

  fill($('[data-story-rail]'), P.filter(function(p){ return p.h !== 'renaissance'; }).slice(0,4));

  var subForm = $('[data-sub]');
  if(subForm) subForm.addEventListener('submit', function(e){
    e.preventDefault();
    var t = $('[data-toast]');
    $('[data-toast-item]').textContent = 'Check your inbox for the code';
    $('.toast b').textContent = 'You are on the list';
    t.classList.add('on');
    setTimeout(function(){ t.classList.remove('on'); $('.toast b').textContent = 'Added to bag'; }, 2600);
    e.target.reset();
  });

  /* the clocks - footer and film strip - on Detroit time */
  (function clock(){
    var outs = $$('[data-time], [data-time-strip]');
    if(!outs.length) return;
    var out = { set textContent(v){ outs.forEach(function(o){ o.textContent = v; }); } };
    var fmt = new Intl.DateTimeFormat('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit',
      hour12:false, timeZone:'America/Detroit' });
    (function tick(){
      out.textContent = fmt.format(new Date()).replace(/:/g, ' : ');
      setTimeout(tick, 1000 - (Date.now() % 1000));
    })();
  })();

/* the landing links into the store by name: store.html?view=shop&filter=Tees */
  (function route(){
    var q = new URLSearchParams(location.search);
    var v = q.get('view'), f = q.get('filter');
    if(f){ curFilter = f; renderShop(); openFilters(); }
    if(v && $('[data-view="' + v + '"]')) show(v);
  })();

  /* ---------------- the construction specs ----------------
     Hovering a row brings its spec in from the right; it holds for ten seconds
     so it can be read, then fades out on its own. Hovering again restarts the
     clock rather than stacking timers. */
  $$('[data-detail]').forEach(function(row){
    var t = null;
    function reveal(){
      clearTimeout(t);
      row.classList.add('show');
      t = setTimeout(function(){ row.classList.remove('show'); }, 10000);
    }
    row.addEventListener('mouseenter', reveal);
    row.addEventListener('focusin', reveal);
  });

  /* ---------------- cookie preferences ----------------
     A real dialog: it opens from the footer, remembers what was chosen, and
     hands the answer to one place. On Shopify, point `apply` at
     Shopify.customerPrivacy.setTrackingConsent and the rest carries over. */
  (function cookies(){
    var box = $('[data-ck]');
    if(!box) return;

    function say(head, line){
      var t = $('[data-toast]');
      if(!t) return;
      $('.toast b').textContent = head;
      $('[data-toast-item]').textContent = line;
      t.classList.add('on');
      clearTimeout(t._ck);
      t._ck = setTimeout(function(){
        t.classList.remove('on');
        $('.toast b').textContent = 'Added to bag';
      }, 2600);
    }
    var rows  = $$('[data-ck-toggle]', box),
        note  = $('[data-ck-note]', box),
        last  = null,
        KEY   = 'ryvt.consent';

    /* storage can throw outright in a locked-down browser, so it is only ever
       an optimisation - the dialog works from memory either way */
    var mem = null;
    function load(){
      try { var raw = localStorage.getItem(KEY); if(raw) return JSON.parse(raw); }
      catch(e){}
      return mem;
    }
    function save(v){
      mem = v;
      try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){}
    }

    function paint(){
      var c = load() || { analytics:true, marketing:true };
      rows.forEach(function(r){
        var on = !!c[r.dataset.ckToggle];
        r.classList.toggle('on', on);
        r.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      note.textContent = c.at
        ? 'Saved ' + new Date(c.at).toLocaleDateString(undefined,
            { day:'numeric', month:'long', year:'numeric' })
        : '';
    }

    function open(){
      last = document.activeElement;
      paint();
      box.hidden = false;
      requestAnimationFrame(function(){ box.classList.add('on'); });
      document.body.style.overflow = 'hidden';
      var f = $('[data-ck-toggle]', box); if(f) f.focus();
    }
    function close(){
      box.classList.remove('on');
      document.body.style.overflow = '';
      setTimeout(function(){ box.hidden = true; }, 380);
      if(last && last.focus) last.focus();
    }

    /* the single hand-off point */
    function apply(c){
      save(c);
      if(window.Shopify && Shopify.customerPrivacy && Shopify.customerPrivacy.setTrackingConsent){
        Shopify.customerPrivacy.setTrackingConsent(
          { analytics:c.analytics, marketing:c.marketing, preferences:c.analytics }, function(){});
      }
    }
    function read(){
      var c = { at: Date.now() };
      rows.forEach(function(r){ c[r.dataset.ckToggle] = r.classList.contains('on'); });
      return c;
    }

    $$('[data-cookie-open]').forEach(function(b){
      b.addEventListener('click', function(e){ e.preventDefault(); open(); });
    });
    $$('[data-ck-close]', box).forEach(function(b){ b.addEventListener('click', close); });
    rows.forEach(function(r){
      r.addEventListener('click', function(){
        var on = !r.classList.contains('on');
        r.classList.toggle('on', on);
        r.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
    $('[data-ck-reject]', box).addEventListener('click', function(){
      rows.forEach(function(r){ r.classList.remove('on'); r.setAttribute('aria-pressed','false'); });
      apply(read());
      say('Preferences saved', 'Optional cookies are off');
      close();
    });
    $('[data-ck-save]', box).addEventListener('click', function(){
      apply(read());
      say('Preferences saved', 'You can change these any time');
      close();
    });
    addEventListener('keydown', function(e){
      if(e.key === 'Escape' && box.classList.contains('on')) close();
    });
  })();

  /* ---------------- the shipping promise ----------------
     It sits at a whisper so there is something to find, comes up to full on
     hover or keyboard focus, and then stays lit — once you have read it there
     is no reason to hide it again. */
  (function shipLine(){
    var el = document.querySelector('[data-ship]');
    if(!el) return;
    function lit(){ el.classList.add('lit'); }
    el.addEventListener('mouseenter', lit);
    el.addEventListener('focus', lit);
    el.addEventListener('touchstart', lit, { passive:true });
  })();

  /* ---------------- the drops square ----------------
     A slow cross-fade through the plates in the footer pill. Real photography
     drops straight in: replace the <img> sources, order sets the sequence. */
  (function drops(){
    var box = document.querySelector('[data-slides]');
    if(!box) return;
    var shots = Array.prototype.slice.call(box.querySelectorAll('img'));
    if(shots.length < 2) return;
    if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var i = 0, timer = null;
    function step(){
      shots[i].classList.remove('on');
      i = (i + 1) % shots.length;
      shots[i].classList.add('on');
    }
    function run(){ stop(); timer = setInterval(step, 3400); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    document.addEventListener('visibilitychange', function(){
      document.hidden ? stop() : run();
    });
    run();
  })();

  /* ---------------- text arrives rather than appearing ----------------
     Anything still unseen starts a little low and transparent and settles as it
     comes into view, staggered by position so a section reads in order instead
     of flashing on all at once. */
  (function rise(){
    if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var SEL = '.sec-h, .stat, .marq, .cat, .card, .tile, .keep-in > *, .split .txt,' +
              ' .doc-hd .wrap > *, .doc-body section, .doc-nav,' +
              ' .st-open-in > *, .st-spec div, .st-step, .st-quote blockquote, .st-by,' +
              ' .st-detail-txt > *, .st-detail-media,' +
              ' .br-title, .br-lead, .br-based p, .br-source > *, .br-figs div, .br-news-in > *,' +
              ' .pdp > *, .acc details, .pdp-trust, .hud-ft-in > *, .hud-ft-btm > *';

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function(){ el.classList.add('in'); }, +(el.dataset.riseDelay || 0));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -2% 0px', threshold: 0.01 });

    /* a safety net: anything that ends up on screen without the observer
       firing (the footer strip at the very bottom of the document) still
       arrives rather than staying invisible */
    addEventListener('scroll', function(){
      requestAnimationFrame(function(){
        $$('[data-rise]:not(.in)').forEach(function(el){
          var r = el.getBoundingClientRect();
          if(r.top < innerHeight && r.bottom > 0) el.classList.add('in');
        });
      });
    }, { passive:true });

    function arm(root){
      var counts = {};
      $$(SEL, root || document).forEach(function(el){
        if(el.dataset.rise) return;
        el.dataset.rise = '1';
        var p = el.parentElement;
        var key = p ? (p.dataset.riseKey || (p.dataset.riseKey = 'g' + (++arm._k))) : 'x';
        counts[key] = (counts[key] || 0) + 1;
        el.dataset.riseDelay = Math.min(5, counts[key] - 1) * 70;
        io.observe(el);
      });
    }
    arm._k = 0;
    arm(document);

    /* views, rails and product pages are painted later - arm those too */
    var _show = show;
    show = function(v){ _show(v); requestAnimationFrame(function(){ arm(document); }); };
    var _fillR = fill;
    fill = function(el, list){ _fillR(el, list); arm(el); };
    var _openR = openProduct;
    openProduct = function(h){ _openR(h); arm($('[data-view="product"]')); };
  })();

  /* the footer preview button */
  (function nowPlaying(){
    var np = $('[data-np]'), toggle = $('[data-np-toggle]'), icon = $('[data-np-icon]');
    if(!toggle) return;
    toggle.addEventListener('click', function(){
      var on = np.classList.toggle('playing');
      icon.innerHTML = on ? '<path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/>' : '<path d="M8 5l11 7-11 7z"/>';
      toggle.setAttribute('aria-label', on ? 'Pause preview' : 'Play preview');
    });
  })();

})();



