/* ============================================================
   AEGIR_OS — application logic
   boot · view routing · i18n · typewriter · skills reveal · tweaks
   ============================================================ */
(function(){
  "use strict";
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  /* ---------- language ---------- */
  let lang = localStorage.getItem('aegir_lang') || 'es';

  function t(key){ return (window.I18N[lang] && window.I18N[lang][key]) ?? key; }

  function applyLang(next){
    lang = next;
    localStorage.setItem('aegir_lang', lang);
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      if(window.I18N[lang][k] != null) el.textContent = window.I18N[lang][k];
    });
    $$('[data-i18n-ph]').forEach(el=>{
      const k = el.getAttribute('data-i18n-ph');
      if(window.I18N[lang][k] != null) el.setAttribute('placeholder', window.I18N[lang][k]);
    });
    // language toggle UI
    $$('.lang button').forEach(b=>b.classList.toggle('on', b.dataset.lang===lang));
    // about intro text (managed manually, not by data-i18n)
    renderAbout();
    // let other modules (detail overlay) react to language changes
    window.dispatchEvent(new CustomEvent('aegir:lang', {detail:lang}));
  }

  /* ---------- about intro (static, no typewriter) ---------- */
  function renderAbout(){
    const el = $('#about-type-text');
    if(el) el.textContent = t('about_type');
  }

  /* ---------- skills reveal ---------- */
  function revealSkills(){
    const v = $('#view-skills'); if(!v) return;
    const items = $$('.oklist li', v);
    v.classList.remove('skills-active'); void v.offsetWidth;
    items.forEach((li,i)=> li.style.animationDelay = (i*38)+'ms');
    v.classList.add('skills-active');
  }

  /* ---------- view routing ---------- */
  const VIEWS = ['home','about','skills','contact'];
  function switchView(name, opts={}){
    if(!VIEWS.includes(name)) name='home';
    $$('.view').forEach(v=>v.classList.toggle('active', v.id==='view-'+name));
    $$('[data-view]').forEach(a=>a.classList.toggle('active', a.dataset.view===name));
    // crumb
    const crumb = $('#crumb-path'); if(crumb) crumb.textContent = '~/'+name;
    if(history.replaceState) history.replaceState(null,'', '#'+name);
    else location.hash = name;
    if(!opts.noScroll) window.scrollTo({top:0, behavior:'auto'});
    if(name==='skills') revealSkills();
    closeDrawer();
  }

  /* ---------- drawer ---------- */
  function openDrawer(){ $('#drawer').classList.add('open'); $('#drawer-bd').classList.add('open'); $('#burger').classList.add('open'); }
  function closeDrawer(){ $('#drawer').classList.remove('open'); $('#drawer-bd').classList.remove('open'); $('#burger').classList.remove('open'); }

  /* ---------- boot ---------- */
  function runBoot(){
    const boot = $('#boot'); if(!boot) return;
    boot.classList.remove('done');
    const lines = $$('.boot-line', boot);
    const bar = $('.boot-bar', boot);
    lines.forEach(l=>l.classList.remove('show'));
    if(bar) bar.classList.remove('run');
    if(reduceMotion){
      lines.forEach(l=>l.classList.add('show'));
      setTimeout(()=>boot.classList.add('done'), 500);
      return;
    }
    let tm = 200;
    lines.forEach((l,i)=>{
      setTimeout(()=>l.classList.add('show'), tm);
      tm += (i===lines.length-1 ? 700 : 460);
    });
    if(bar) setTimeout(()=>bar.classList.add('run'), 280);
    setTimeout(()=>boot.classList.add('done'), tm + 820);
  }

  /* ============================================================
     Tweaks — vanilla panel + host protocol
     ============================================================ */
  const TW = Object.assign({
    accent:"#00FF66", button:"#D9B44A", cards:"filled", texture:"grid", bodySize:21, glow:55
  }, window.TWEAKS || {});

  function applyTweaks(){
    const r = document.documentElement.style;
    r.setProperty('--accent', TW.accent);
    r.setProperty('--btn', TW.button);
    r.setProperty('--btn-hover', `color-mix(in oklab, ${TW.button} 78%, #ffffff)`);
    r.setProperty('--body-size', TW.bodySize + 'px');
    r.setProperty('--glow', (TW.glow/100).toFixed(2));
    document.body.dataset.cards = TW.cards;
    document.body.dataset.tex = TW.texture;
  }

  function setTweak(key, val){
    TW[key] = val;
    applyTweaks();
    syncTweakUI();
    try{ window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[key]:val}}, '*'); }catch(e){}
  }

  let tweakUISync = ()=>{};
  function syncTweakUI(){ tweakUISync(); }

  function buildTweaks(){
    const panel = $('#tweaks'); if(!panel) return;
    const body = $('.tw-body', panel);

    const seg = (key, options)=>{
      const wrap = document.createElement('div'); wrap.className='tw-seg';
      options.forEach(o=>{
        const b=document.createElement('button'); b.textContent=o.label; b.dataset.val=o.val;
        b.onclick=()=>setTweak(key,o.val);
        wrap.appendChild(b);
      });
      return wrap;
    };
    const swatches = (key, colors)=>{
      const wrap=document.createElement('div'); wrap.className='tw-sw';
      colors.forEach(c=>{
        const b=document.createElement('button'); b.dataset.val=c;
        b.style.background=c; b.title=c;
        b.onclick=()=>setTweak(key,c);
        wrap.appendChild(b);
      });
      return wrap;
    };
    const field = (label, control)=>{
      const f=document.createElement('div'); f.className='tw-field';
      const l=document.createElement('div'); l.className='lab'; l.textContent=label;
      f.appendChild(l); f.appendChild(control); return f;
    };
    const range = (key,min,max,step,suffix)=>{
      const wrap=document.createElement('div'); wrap.className='tw-range';
      const inp=document.createElement('input'); inp.type='range';
      inp.min=min; inp.max=max; inp.step=step; inp.value=TW[key];
      const val=document.createElement('span'); val.className='val'; val.textContent=TW[key]+suffix;
      inp.oninput=()=>{ val.textContent=inp.value+suffix; setTweak(key, Number(inp.value)); };
      inp.dataset.key=key;
      wrap.appendChild(inp); wrap.appendChild(val); return wrap;
    };

    body.appendChild(field('Accent', swatches('accent', ['#00FF66','#FFB000','#27E0E0','#FF5C8A'])));
    body.appendChild(field('Button color', swatches('button', ['#D9B44A','#E8A33D','#9BD64A','#D6D6D6'])));
    body.appendChild(field('Card style', seg('cards', [{label:'Filled',val:'filled'},{label:'Outline',val:'outline'}])));
    body.appendChild(field('Background', seg('texture', [{label:'Grid',val:'grid'},{label:'Lines',val:'scanlines'},{label:'None',val:'none'}])));
    body.appendChild(field('Body size', range('bodySize',18,26,1,'px')));
    body.appendChild(field('Glow', range('glow',0,100,5,'%')));

    tweakUISync = ()=>{
      $$('.tw-seg', panel).forEach(sg=>{
        const k = sg.parentElement.querySelector('.lab').textContent==='Card style' ? 'cards' : 'texture';
        $$('button', sg).forEach(b=> b.classList.toggle('on', String(TW[k])===b.dataset.val));
      });
      $$('.tw-sw', panel).forEach(sw=>{
        const k = sw.parentElement.querySelector('.lab').textContent==='Accent' ? 'accent' : 'button';
        $$('button', sw).forEach(b=> b.classList.toggle('on', (TW[k]||'').toLowerCase()===b.dataset.val.toLowerCase()));
      });
    };
    syncTweakUI();

    // close + drag
    $('.tw-x', panel).onclick = ()=>{ panel.classList.remove('open'); try{window.parent.postMessage({type:'__edit_mode_dismissed'},'*');}catch(e){} };
    dragPanel(panel, $('.tw-hd', panel));
  }

  function dragPanel(panel, handle){
    let sx,sy,sr,sb;
    handle.addEventListener('mousedown', e=>{
      if(e.target.closest('.tw-x')) return;
      const r=panel.getBoundingClientRect();
      sx=e.clientX; sy=e.clientY; sr=innerWidth-r.right; sb=innerHeight-r.bottom;
      const move=ev=>{ panel.style.right=Math.max(8,sr-(ev.clientX-sx))+'px'; panel.style.bottom=Math.max(8,sb-(ev.clientY-sy))+'px'; };
      const up=()=>{ removeEventListener('mousemove',move); removeEventListener('mouseup',up); };
      addEventListener('mousemove',move); addEventListener('mouseup',up);
    });
  }

  /* ============================================================
     init
     ============================================================ */
  function init(){
    applyTweaks();
    buildTweaks();
    applyLang(lang);

    // nav
    $$('[data-view]').forEach(a=>{
      a.addEventListener('click', e=>{ e.preventDefault(); switchView(a.dataset.view); });
    });
    // jump-to-work
    $$('[data-action="work"]').forEach(a=>a.addEventListener('click', e=>{
      e.preventDefault(); switchView('home');
      const w=$('#work'); if(w) setTimeout(()=>w.scrollIntoView({behavior:reduceMotion?'auto':'smooth', block:'start'}), 60);
    }));

    // language toggle
    $$('.lang button, #drawer-lang button').forEach(b=>b.addEventListener('click', ()=>applyLang(b.dataset.lang)));

    // drawer
    $('#burger').addEventListener('click', ()=> $('#drawer').classList.contains('open')?closeDrawer():openDrawer());
    $('#drawer-bd').addEventListener('click', closeDrawer);

    // reboot
    $$('.js-reboot').forEach(b=>b.addEventListener('click', runBoot));

    // hash routing
    window.addEventListener('hashchange', ()=>{
      const h = location.hash.replace('#','');
      if(VIEWS.includes(h)) switchView(h);
    });

    // initial view
    const startHash = location.hash.replace('#','');
    switchView(VIEWS.includes(startHash)?startHash:'home', {noScroll:true});

    // boot — plays on every visit
    runBoot();

    // tweaks host protocol
    window.addEventListener('message', e=>{
      const ty = e?.data?.type;
      if(ty==='__activate_edit_mode') $('#tweaks').classList.add('open');
      else if(ty==='__deactivate_edit_mode') $('#tweaks').classList.remove('open');
    });
    try{ window.parent.postMessage({type:'__edit_mode_available'}, '*'); }catch(e){}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
