

(function(){
  "use strict";
  var $=function(s){ return document.querySelector(s); };

  /* the film: fade it in only once it can actually paint a frame */
  var stage=$('[data-stage]'), film=$('[data-film]');
  function ready(){ stage.classList.add('ready'); }
  if(film){
    if(film.readyState>=2) ready(); else film.addEventListener('loadeddata',ready);
    film.addEventListener('error',ready);
    /* autoplay can be refused, and a codec can be missing - the poster behind
       the film carries the screen either way, so reveal on a timer regardless */
    var pr=film.play(); if(pr&&pr.catch) pr.catch(function(){});
    setTimeout(ready,1200);
  }

  /* the clock: the city's local time, ticking */
  var TZ='America/Detroit';
  var fmt=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',
    hour12:false,timeZone:TZ});
  var out=$('[data-time]');
  (function tick(){
    out.textContent=fmt.format(new Date()).replace(/:/g,' : ');
    setTimeout(tick,1000-(Date.now()%1000));
  })();

  /* the cursor: a dot that tracks exactly, a ring that lags behind it */
  var dot=$('[data-cur]'), ring=$('[data-cur-ring]');
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    var LIGHT_SEL='.promo-cta, .lp-sub button';
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
    addEventListener('mousedown',function(){ document.body.classList.add('press'); });
    addEventListener('mouseup',function(){ document.body.classList.remove('press'); });
    /* only hide when the pointer truly leaves the window, and bring it straight
       back on re-entry - a stray mouseout must never leave the screen bare */
    document.addEventListener('mouseleave',function(e){
      if(e.target !== document.documentElement) return;
      dot.classList.add('off'); ring.classList.add('off');
    });
    document.addEventListener('mouseenter',function(){
      dot.classList.remove('off'); ring.classList.remove('off');
    });
    addEventListener('blur',function(){ document.body.classList.remove('press'); });
    /* anything clickable widens the ring */
    document.addEventListener('mouseover',function(e){
      document.body.classList.toggle('hot', !!e.target.closest('a,button'));
      /* the ground under the pointer decides the cursor's colour */
      document.body.classList.toggle('cur-light', !!e.target.closest(LIGHT_SEL));
    });
  }

  /* the promo header cycles its lines, and stays dismissed for the visit */
  var promo=$('[data-promo]');
  if(promo){
    if(sessionStorage.getItem('promo-off')==='1'){ promo.remove(); }
    else{
      var msgs=Array.prototype.slice.call(promo.querySelectorAll('.promo-msg')), i=0;
      if(msgs.length>1){
        setInterval(function(){
          msgs[i].classList.remove('on');
          i=(i+1)%msgs.length;
          msgs[i].classList.add('on');
        },4200);
      }
      $('[data-promo-close]').addEventListener('click',function(){
        promo.classList.add('gone');
        try{ sessionStorage.setItem('promo-off','1'); }catch(e){}
        setTimeout(function(){ promo.remove(); },420);
      });
    }
  }

  /* the preview button drives the spinning sleeve */
  var np=$('[data-np]'), toggle=$('[data-np-toggle]'), icon=$('[data-np-icon]');
  toggle.addEventListener('click',function(){
    var on=np.classList.toggle('playing');
    icon.innerHTML = on ? '<path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/>' : '<path d="M8 5l11 7-11 7z"/>';
    toggle.setAttribute('aria-label', on ? 'Pause preview' : 'Play preview');
  });
})();


  /* ---------------- numbers count up, every time they are seen ---------------- */
  (function counters(){
    var SEL = '.tile i, .ship b, .buy-t i, .sheet-head p';
    var nums = [];
    function ease(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function fmt(el, v){
      return el._pre + (el._dec ? v.toFixed(el._dec) : Math.round(v).toLocaleString()) + el._suf;
    }
    function run(el){
      cancelAnimationFrame(el._raf);
      var dur = 850 + Math.min(500, Math.abs(el._to) * 3), t0 = null;
      el._raf = requestAnimationFrame(function step(now){
        if(t0 === null) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(el, el._to * ease(p));
        if(p < 1) el._raf = requestAnimationFrame(step);
      });
    }
    function zero(el){ cancelAnimationFrame(el._raf); el.textContent = fmt(el, 0); }

    document.querySelectorAll(SEL).forEach(function(el){
      var m = /^([^0-9-]*)(-?[0-9][0-9,]*(?:\.[0-9]+)?)([\s\S]*)$/.exec(el.textContent.trim());
      if(!m) return;
      el._pre = m[1]; el._suf = m[3];
      el._to = parseFloat(m[2].replace(/,/g, ''));
      el._dec = (m[2].split('.')[1] || '').length;
      if(isNaN(el._to)) return;
      el._on = false; zero(el); nums.push(el);
    });

    function sweep(){
      var h = innerHeight;
      nums.forEach(function(el){
        var r = el.getBoundingClientRect();
        var seen = r.bottom > 40 && r.top < h - 40;
        if(seen === el._on) return;
        el._on = seen;
        if(seen) run(el); else zero(el);
      });
    }
    var q = false;
    function queue(){ if(q) return; q = true; requestAnimationFrame(function(){ q = false; sweep(); }); }
    addEventListener('scroll', queue, { passive:true });
    addEventListener('resize', queue);
    queue();
  })();


  /* Scrolling reveals the footer and nothing else. The film lifts a little as
     it arrives, and the centre column and corner pills step out of the way
     rather than being cut in half by the footer's top edge. */
  (function reveal(){
    var stage = document.querySelector('.stage');
    var core  = document.querySelector('.core');
    var huds  = Array.prototype.slice.call(document.querySelectorAll('.hud'));
    var promo = document.querySelector('[data-promo]');
    var queued = false;
    function paint(){
      var max = Math.max(1, document.body.scrollHeight - innerHeight);
      var p = Math.min(1, window.scrollY / max);
      document.body.classList.toggle('scrolled', window.scrollY > 40);
      if(stage) stage.style.transform = 'translateY(' + (-p * 10) + 'vh)';
      var out = Math.min(1, p / 0.5);
      if(core){
        core.style.setProperty('opacity', 1 - out, 'important');
        core.style.transform = 'translateY(' + (out * -30) + 'px)';
      }
      huds.forEach(function(h){
        h.style.setProperty('opacity', 1 - out, 'important');
        h.style.pointerEvents = out > .9 ? 'none' : '';
      });
      if(promo) promo.style.setProperty('opacity', 1 - Math.min(1, p / 0.35), 'important');
    }
    addEventListener('scroll', function(){
      if(queued) return;
      queued = true;
      requestAnimationFrame(function(){ queued = false; paint(); });
    }, { passive:true });
    paint();
  })();


;

(function drops(){
  var box = document.querySelector('[data-slides]');
  if(!box) return;
  var shots = Array.prototype.slice.call(box.querySelectorAll('img'));
  if(shots.length < 2 || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var i = 0, timer = null;
  function step(){ shots[i].classList.remove('on'); i = (i+1) % shots.length; shots[i].classList.add('on'); }
  function run(){ stop(); timer = setInterval(step, 3400); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : run(); });
  run();
})();
