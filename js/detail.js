/* ============================================================
   AEGIR_OS — detail overlay
   Project detail views + per-area media (images / video / builds & links).
   ============================================================ */
(function(){
  "use strict";
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  let lang = localStorage.getItem('aegir_lang') || 'es';
  const t   = (k)=> (window.I18N[lang] && window.I18N[lang][k] != null) ? window.I18N[lang][k] : k;
  const arr = (k)=> (window.I18N[lang] && Array.isArray(window.I18N[lang][k])) ? window.I18N[lang][k] : [];
  const esc = (s)=> String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* base URL para medios alojados en el repositorio GitHub */
  const MEDIA_BASE = 'https://raw.githubusercontent.com/AEGIR242/Website/master/';
  const mu = (p) => MEDIA_BASE + encodeURI(p);

  /* ---------- projects ---------- */
  const PROJECTS = {
    relapse:{ title:'Relapse', type:'relapse_type', long:'relapse_long', pts:'relapse_pts', role:'relapse_role',
      tags:['Unity','VR','MR','Cyberpunk','Game Design','Interactive Systems','Technical Art'], images:1, videos:3 },
    rythian:{ title:'Rythian', type:'rythian_type', long:'rythian_long', pts:'rythian_pts', role:'rythian_role',
      tags:['Worldbuilding','Narrative Design','Visual Development','Fantasy','Character Concepts','Environment Concepts'], images:3, videos:2 },
    smk:{ title:'SMK Showreel', type:'smk_type', long:'smk_long', pts:'smk_pts', role:'smk_role',
      tags:['2D Animation','Video Editing','Motion Design','Mascot Animation','Marketing Visuals','Audiovisual Production'], images:1, videos:2 },
  };
  const PORDER = ['relapse','rythian','smk'];

  /* ---------- creative areas ---------- */
  const AREAS = {
    'game-dev':   { title:'area_1',  desc:'area_d_1', builds:[
                      { title:'gd_relapse', note:'gd_relapse_note', id:'gd-relapse', btn:'download_apk', icon:'↓', disabled:true },
                      { title:'gd_cashout', note:'gd_cashout_note', id:'gd-cashout', btn:'play_web',     icon:'↗', defaultUrl:'https://aegir242.github.io/CashOutPage/' } ] },
    '2d-anim':    { title:'area_3',  desc:'area_d_3',  videos:2 },
    '3d-model':   { title:'area_4',  desc:'area_d_4',  images:3 },
    '3d-anim':    { title:'area_5',  desc:'area_d_5',  videos:2 },
    'shaders':    { title:'area_6',  desc:'area_d_6',  process:'shaders_process', images:4 },
    'pixel-art':  { title:'area_7',  desc:'area_d_7',  images:3 },
    'audio':      { title:'area_8',  desc:'area_d_8',  videos:1 },
    'clips':      { title:'area_9',  desc:'area_d_9',  videos:2 },
    'audiovisual':{ title:'area_10', desc:'area_d_10', images:3, videos:1 },
  };
  const AORDER = ['game-dev','2d-anim','3d-model','3d-anim','shaders','pixel-art','audio','clips','audiovisual'];

  /* ---------- default media per section ---------- */
  const MEDIA_DEFAULTS = {
    /* ---- projects ---- */
    relapse: {
      images: [
        mu('DiseñoDeMovimiento/Captura de pantalla 2026-05-29 123529.png'),
      ],
      videos: [
        mu('DiseñoDeMovimiento/Movie_001.webm'),
        mu('DiseñoDeMovimiento/Movie_002.webm'),
        mu('DiseñoDeMovimiento/Movie_004.webm'),
      ],
    },
    rythian: {
      images: [
        mu('Rythian/Captura de pantalla 2023-11-26 181608.png'),
        mu('Rythian/Captura de pantalla 2023-11-26 181649.png'),
        mu('Rythian/Captura de pantalla 2023-11-27 101256.png'),
      ],
      videos: [
        mu('Animacion2D/Rythian/AnimaciónFinal.mp4'),
        mu('Animacion3D/Rythian/AnimacionFinal.mp4'),
      ],
    },
    smk: {
      images: [
        mu('SMK/CharacterSheet/BartenderHojaV1.png'),
      ],
      videos: [
        mu('SMK/ProyectoFinal (1).mp4'),
        mu('SMK/Animaciones/IntroSMKV9.mp4'),
      ],
    },
    /* ---- areas ---- */
    '2d-anim': {
      videos: [
        mu('Animacion2D/Bolsa (2).mp4'),
        mu('SMK/Animaciones/Animacion1.mp4'),
      ],
    },
    '3d-model': {
      images: [
        mu('Modelado3D/destornillador.png'),
        mu('Modelado3D/lapicero.png'),
        mu('Modelado3D/Muñeco (2).jpg'),
      ],
    },
    '3d-anim': {
      videos: [
        mu('Animacion3D/Lipsync.mp4'),
        mu('Animacion3D/Rythian/AnimacionFinal.mp4'),
      ],
    },
    shaders: {
      images: [
        mu('Shaders/ShaderHolograma/Captura de pantalla 2026-05-15 151357.png'),
        mu('Shaders/ShaderHolograma/Captura de pantalla 2026-05-15 163639.png'),
        mu('Shaders/ShaderPixelArt/Captura de pantalla 2026-05-15 164207.png'),
        mu('Shaders/ShaderPixelArt/image (1).png'),
      ],
    },
    'pixel-art': {
      images: [
        mu('PixelArt/QuimeraFinalizada.png'),
        mu('PixelArt/QuimeraChiquita.png'),
        mu('PixelArt/pixil-frame-0 (1).png'),
      ],
    },
    audio: {
      videos: [
        mu('EdicionDeAudio/Comercial.mp4'),
      ],
    },
    clips: {
      videos: [
        mu('Videoclips/Videoclip-La ultima.mp4'),
        mu('Videoclips/Videoclip Lenguajes.mp4'),
      ],
    },
    audiovisual: {
      images: [
        mu('TrabajosIndependientes/Draikon.png'),
        mu('TrabajosIndependientes/HollowAbyss/TheHollowAbyss.png'),
        mu('TrabajosIndependientes/HollowAbyss/Logo.png'),
      ],
    },
  };

  let ov, bd, panel, cur = null;

  /* ---------- video slot ---------- */
  function videoEmbed(url){
    let m;
    if((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/)))
      return `<iframe src="https://www.youtube.com/embed/${m[1]}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
    if((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return `<iframe src="https://player.vimeo.com/video/${m[1]}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>`;
    if(/\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url))
      return `<video src="${esc(url)}" controls playsinline></video>`;
    return `<iframe src="${esc(url)}" allowfullscreen></iframe>`;
  }
  function renderVideo(box, id, defaultUrl){
    const url = localStorage.getItem('aegir_vid_'+id) || defaultUrl || null;
    box.innerHTML = '';
    if(url){
      const frame = document.createElement('div'); frame.className='vid-frame';
      frame.innerHTML = videoEmbed(url);
      box.appendChild(frame);
    }
  }

  /* ---------- media (images + videos) ---------- */
  function buildMedia(prefix, images, videos, defaults){
    const gal = $('#ov-gal'); if(!gal) return;
    for(let i=1;i<=images;i++){
      const defImg = defaults && defaults.images && defaults.images[i-1];
      if(!defImg) continue;
      const s = document.createElement('image-slot');
      s.id = 'aegir-'+prefix+'-img'+i;
      s.setAttribute('shape','rounded');
      s.setAttribute('radius','8');
      s.setAttribute('src', defImg);
      gal.appendChild(s);
    }
    for(let j=1;j<=videos;j++){
      const defVid = defaults && defaults.videos && defaults.videos[j-1];
      const stored  = localStorage.getItem('aegir_vid_'+prefix+'-vid'+j);
      if(!defVid && !stored) continue;
      const vs = document.createElement('div'); vs.className='vid-slot';
      gal.appendChild(vs);
      renderVideo(vs, prefix+'-vid'+j, defVid || null);
    }
  }

  /* ---------- builds & links ---------- */
  function renderLink(card, b){
    card.innerHTML = `<div class="bc-info"><div class="bc-t">${esc(t(b.title))}</div><div class="bc-n">${esc(t(b.note))}</div></div>`;
    const grp = document.createElement('div'); grp.className='bc-actions';
    if(b.disabled){
      const btn = document.createElement('button'); btn.type='button'; btn.className='btn btn-primary';
      btn.textContent = t(b.btn)+' '+b.icon;
      btn.disabled = true; btn.style.cssText='opacity:.4;cursor:not-allowed';
      grp.appendChild(btn);
    } else {
      const url = b.defaultUrl || localStorage.getItem('aegir_link_'+b.id);
      if(url){
        const a = document.createElement('a'); a.className='btn btn-primary';
        a.href=url; a.target='_blank'; a.rel='noopener';
        a.textContent = t(b.btn)+' '+b.icon;
        grp.appendChild(a);
      }
    }
    card.appendChild(grp);
  }
  function buildBuilds(builds){
    const wrap = $('#ov-builds'); if(!wrap) return;
    builds.forEach(b=>{ const card=document.createElement('div'); card.className='build-card'; wrap.appendChild(card); renderLink(card,b); });
  }

  /* ---------- bar ---------- */
  function bar(path){
    return `<div class="ov-bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="path">aegir@portfolio:<b>${path}</b> $</span>
      <span class="sp"></span>
      <span class="ov-nav"><button type="button" data-ov="prev" aria-label="Previous">←</button><button type="button" data-ov="next" aria-label="Next">→</button></span>
      <button class="ov-close" type="button" data-ov="close">✕ ${t('close')}</button>
    </div>`;
  }
  function galHint(images, videos){
    if(images && videos) return t('media_hint');
    if(videos) return t('hint_vid');
    return t('hint_img');
  }

  /* ---------- builders ---------- */
  function buildProject(key){
    const p = PROJECTS[key]; if(!p) return;
    const pts = arr(p.pts).map(x=>`<li><span class="ok">[+]</span><span>${esc(x)}</span></li>`).join('');
    const tags = p.tags.map(x=>`<span class="tag">${esc(x)}</span>`).join('');
    panel.innerHTML = bar('~/work/'+key) + `<div class="ov-body">
      <div class="ov-head"><h2>${esc(p.title)}</h2><span class="type">${esc(t(p.type))}</span></div>
      <p class="ov-role">${esc(t(p.role))}</p>
      <p class="ov-long">${esc(t(p.long))}</p>
      <p class="ov-sub">${t('highlights')}</p>
      <ul class="ov-pts">${pts}</ul>
      <div class="ov-tags">${tags}</div>
      <div class="ov-section">
        <p class="ov-sub">${t('gallery')}</p>
        <div class="gal" id="ov-gal"></div>
      </div>
    </div>`;
    buildMedia(key, p.images||0, p.videos||0, MEDIA_DEFAULTS[key]);
  }

  function buildArea(key){
    const c = AREAS[key]; if(!c) return;
    let html = bar('~/areas/'+key) + '<div class="ov-body">';
    html += `<div class="ov-head"><h2>${esc(t(c.title))}</h2></div>`;
    html += `<p class="ov-long">${esc(t(c.desc))}</p>`;
    if(c.process){
      html += `<div class="ov-section"><p class="ov-sub">${t('lbl_process')}</p><p class="ov-long" style="margin-bottom:0">${esc(t(c.process))}</p></div>`;
    }
    if(c.builds){
      html += `<div class="ov-section"><p class="ov-sub">${t('lbl_builds')}</p><div id="ov-builds"></div></div>`;
    }
    if(c.images || c.videos){
      html += `<div class="ov-section"><p class="ov-sub">${t('gallery')}</p><div class="gal" id="ov-gal"></div></div>`;
    }
    html += '</div>';
    panel.innerHTML = html;
    if(c.builds) buildBuilds(c.builds);
    if(c.images || c.videos) buildMedia(key, c.images||0, c.videos||0, MEDIA_DEFAULTS[key]);
  }

  /* ---------- open / close / nav ---------- */
  function show(){ ov.classList.add('open'); bd.classList.add('open'); document.body.style.overflow='hidden'; ov.scrollTop=0; }
  function hide(){ ov.classList.remove('open'); bd.classList.remove('open'); document.body.style.overflow=''; cur=null; }
  function openProject(key){ cur={type:'project',key}; buildProject(key); show(); }
  function openArea(key){ cur={type:'area',key}; buildArea(key); show(); }
  function nav(dir){
    if(!cur) return;
    if(cur.type==='project'){ let i=(PORDER.indexOf(cur.key)+dir+PORDER.length)%PORDER.length; openProject(PORDER[i]); }
    else { let i=(AORDER.indexOf(cur.key)+dir+AORDER.length)%AORDER.length; openArea(AORDER[i]); }
  }

  /* ---------- init ---------- */
  function init(){
    ov = $('#overlay'); bd = $('#ov-bd'); panel = $('#ov-panel');
    if(!ov) return;

    $$('#work .card.proj').forEach((el,i)=>{
      el.dataset.detail='project'; el.dataset.key=PORDER[i] || ('p'+i);
      el.setAttribute('role','button'); el.tabIndex=0;
    });
    $$('.card.area').forEach(el=>{
      el.dataset.detail='area';
      el.setAttribute('role','button'); el.tabIndex=0;
    });

    document.addEventListener('click', e=>{
      const card = e.target.closest('[data-detail]');
      if(!card) return;
      if(card.dataset.detail==='project') openProject(card.dataset.key);
      else openArea(card.dataset.area);
    });
    document.addEventListener('keydown', e=>{
      if((e.key==='Enter'||e.key===' ') && document.activeElement && document.activeElement.matches && document.activeElement.matches('.card[data-detail]')){
        e.preventDefault(); document.activeElement.click();
      }
    });

    panel.addEventListener('click', e=>{
      const b = e.target.closest('[data-ov]'); if(!b) return;
      const a = b.dataset.ov;
      if(a==='close') hide(); else nav(a==='prev'?-1:1);
    });
    bd.addEventListener('click', hide);
    ov.addEventListener('click', e=>{ if(e.target===ov) hide(); });

    document.addEventListener('keydown', e=>{
      if(!ov.classList.contains('open')) return;
      if(e.key==='Escape'){ hide(); return; }
      const inField = document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
      if(inField) return;
      if(e.key==='ArrowLeft') nav(-1);
      else if(e.key==='ArrowRight') nav(1);
    });

    window.addEventListener('aegir:lang', e=>{
      lang = e.detail || lang;
      if(cur){ cur.type==='project' ? buildProject(cur.key) : buildArea(cur.key); }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
