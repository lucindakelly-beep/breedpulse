// foal-namer-snippet.mjs
// Exports a function that returns the HTML for the foal namer section,
// customised to one stallion. Imported by scripts/seo-upgrade.mjs.

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

export function foalNamerSection({ stallionName, stallionSlug, seasonPassUrl }) {
  const sireEsc = escapeHtml(stallionName);
  const slugEsc = escapeHtml(stallionSlug);
  const stripeEsc = escapeHtml(seasonPassUrl);

  return `
<section class="detail foal-namer" id="foal-namer" data-sire="${sireEsc}" data-stallion-slug="${slugEsc}" data-stripe="${stripeEsc}">
  <h2>
    Imagine your foal
    <span class="fn-pill">New &mdash; free tool</span>
  </h2>
  <p class="fn-sub">A traditional Connemara foal name, generated from your mare&rsquo;s name and ${sireEsc}. Share the result, picture the future.</p>

  <div class="fn-card">
    <form class="fn-form" onsubmit="return false;">
      <div class="fn-field">
        <label for="fn-mare">Your mare&rsquo;s name</label>
        <input type="text" id="fn-mare" placeholder="e.g. My Bonnie Lass" autocomplete="off" maxlength="60">
      </div>
      <div class="fn-field">
        <label for="fn-prefix">Your stud prefix <span class="fn-optional">(optional)</span></label>
        <input type="text" id="fn-prefix" placeholder="e.g. Drumcong" autocomplete="off" maxlength="30">
      </div>
      <div class="fn-field fn-field-full">
        <label>Are you imagining a colt or a filly?</label>
        <div class="fn-chips" role="radiogroup">
          <button type="button" class="fn-chip active" data-gender="filly" role="radio" aria-checked="true">Filly</button>
          <button type="button" class="fn-chip" data-gender="colt" role="radio" aria-checked="false">Colt</button>
          <button type="button" class="fn-chip" data-gender="either" role="radio" aria-checked="false">Either</button>
        </div>
      </div>
    </form>

    <div class="fn-actions">
      <button type="button" class="fn-generate-btn" id="fn-generate"><span>Generate three names</span></button>
      <span class="fn-disclaimer">For inspiration only &middot; not registration advice</span>
    </div>
  </div>

  <div class="fn-results" id="fn-results" hidden>
    <div class="fn-results-header">
      <h3>Three names for your foal</h3>
      <button type="button" class="fn-retry-btn" id="fn-retry" title="Generate three new names">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>
        Try again
      </button>
    </div>
    <div class="fn-name-grid" id="fn-name-grid"></div>

    <div class="fn-upsell" id="fn-upsell" hidden>
      <h3 class="fn-upsell-h">Like the look of one of these? Three steps to actually book ${sireEsc}</h3>
      <ol class="fn-steps">
        <li class="fn-step">
          <span class="fn-step-num">1</span>
          <div class="fn-step-body">
            <strong class="fn-step-title">See the stud fee and what&rsquo;s included</strong>
            <span class="fn-step-meta">Members see the exact fee, covering method, and what the booking includes.</span>
          </div>
        </li>
        <li class="fn-step">
          <span class="fn-step-num">2</span>
          <div class="fn-step-body">
            <strong class="fn-step-title">Check pedigree compatibility</strong>
            <span class="fn-step-meta">Compare your mare&rsquo;s lines with the 5-generation pedigree above to spot duplicate ancestors and HWSD risks.</span>
          </div>
        </li>
        <li class="fn-step">
          <span class="fn-step-num">3</span>
          <div class="fn-step-body">
            <strong class="fn-step-title">Contact the breeder directly</strong>
            <span class="fn-step-meta">Members get the breeder&rsquo;s verified email and mobile &mdash; most reply within 24 hours.</span>
          </div>
        </li>
      </ol>
      <div class="fn-upsell-cta-row">
        <a href="${stripeEsc}" class="fn-upsell-cta">Get Season Pass &middot; &euro;9.99</a>
        <span class="fn-upsell-meta">90 days &middot; all stallions &middot; cancel anytime</span>
      </div>
    </div>
  </div>
</section>

<div id="fn-card-stage" aria-hidden="true" style="position:fixed;left:-9999px;top:-9999px;width:600px;height:600px;"></div>

<style>
.foal-namer h2 { font-family: var(--font-display); font-size: 1.8rem; font-style: italic; font-weight: 500; color: var(--green-deep); margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--ash); letter-spacing: -0.01em; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
.foal-namer .fn-pill { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem; border-radius: 20px; font-family: var(--font-body); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; background: var(--copper); color: var(--white); font-style: normal; }
.foal-namer .fn-sub { color: var(--earth); font-size: 0.95rem; margin-bottom: 1.5rem; font-weight: 400; line-height: 1.55; max-width: 60ch; }
.foal-namer .fn-card { background: var(--white); border: 1px solid var(--ash); border-radius: var(--radius); padding: 1.75rem 1.75rem 1.5rem; box-shadow: var(--shadow); }
@media (max-width: 560px) { .foal-namer .fn-card { padding: 1.25rem; } }
.foal-namer .fn-form { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem 1rem; margin-bottom: 1.5rem; }
@media (max-width: 560px) { .foal-namer .fn-form { grid-template-columns: 1fr; } }
.foal-namer .fn-field-full { grid-column: 1 / -1; }
.foal-namer .fn-field label { display: block; font-size: 0.66rem; font-weight: 500; color: var(--earth); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.45rem; }
.foal-namer .fn-optional { font-weight: 400; color: var(--fog); text-transform: none; letter-spacing: 0; font-size: 0.7rem; }
.foal-namer .fn-field input { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid var(--ash); border-radius: 6px; background: var(--linen); font-family: var(--font-body); font-weight: 400; font-size: 0.95rem; color: var(--peat); transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; }
.foal-namer .fn-field input:focus { outline: none; border-color: var(--gold); background: var(--white); box-shadow: 0 0 0 3px rgba(184,145,92,0.18); }
.foal-namer .fn-field input::placeholder { color: var(--fog); font-weight: 300; font-style: italic; }
.foal-namer .fn-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.foal-namer .fn-chip { padding: 0.6rem 1.15rem; border: 1px solid var(--ash); background: var(--white); border-radius: 22px; font-family: var(--font-body); font-size: 0.85rem; font-weight: 400; color: var(--earth); cursor: pointer; transition: all 0.15s; }
.foal-namer .fn-chip:hover { border-color: var(--gold); color: var(--green-deep); }
.foal-namer .fn-chip.active { background: var(--green-deep); border-color: var(--green-deep); color: var(--white); font-weight: 500; }
.foal-namer .fn-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; padding-top: 0.25rem; }
.foal-namer .fn-generate-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--green-dark); color: var(--white); padding: 0.85rem 1.75rem; border-radius: 30px; font-family: var(--font-body); font-size: 0.92rem; font-weight: 500; letter-spacing: 0.02em; cursor: pointer; border: none; transition: all 0.2s ease; }
.foal-namer .fn-generate-btn:hover { background: var(--green-deep); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(20,47,34,0.18); }
.foal-namer .fn-generate-btn:active { transform: translateY(0); }
.foal-namer .fn-disclaimer { font-size: 0.72rem; color: var(--fog); font-style: italic; }
.foal-namer .fn-results { margin-top: 1.75rem; animation: fnFadeIn 0.4s ease; }
@keyframes fnFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.foal-namer .fn-results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.foal-namer .fn-results-header h3 { font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: 1.4rem; color: var(--green-deep); }
.foal-namer .fn-retry-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; color: var(--earth); padding: 0.45rem 0.95rem; border-radius: 20px; font-family: var(--font-body); font-size: 0.8rem; font-weight: 500; cursor: pointer; border: 1px solid var(--ash); transition: all 0.15s; }
.foal-namer .fn-retry-btn:hover { border-color: var(--gold); color: var(--green-deep); background: var(--linen); }
.foal-namer .fn-name-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; }
@media (max-width: 720px) { .foal-namer .fn-name-grid { grid-template-columns: 1fr; } }
.foal-namer .fn-name-card { background: var(--linen); border: 1px solid var(--ash); border-radius: var(--radius); padding: 1.5rem 1.25rem 1.1rem; text-align: center; transition: all 0.2s ease; position: relative; display: flex; flex-direction: column; gap: 0.85rem; }
.foal-namer .fn-name-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(184,145,92,0.12); }
.foal-namer .fn-name-value { font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: 1.45rem; color: var(--green-deep); line-height: 1.15; letter-spacing: -0.005em; }
.foal-namer .fn-name-meta { font-family: var(--font-body); font-size: 0.7rem; color: var(--fog); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 500; }
.foal-namer .fn-name-save { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--gold); color: var(--green-deep); padding: 0.55rem 0.9rem; border-radius: 20px; font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; margin-top: auto; }
.foal-namer .fn-name-save:hover { background: #C9A06B; }
.foal-namer .fn-name-save svg { width: 13px; height: 13px; }
.foal-namer .fn-name-save:disabled { opacity: 0.6; cursor: wait; }
.foal-namer .fn-upsell { margin-top: 1.75rem; background: var(--green-ghost); border: 1px solid var(--green-pale); border-radius: var(--radius); padding: 1.5rem 1.75rem; }
@media (max-width: 560px) { .foal-namer .fn-upsell { padding: 1.25rem; } }
.foal-namer .fn-upsell-h { font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: 1.3rem; color: var(--green-deep); margin-bottom: 1rem; line-height: 1.25; }
.foal-namer .fn-steps { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.35rem; padding: 0; }
.foal-namer .fn-step { display: flex; gap: 0.85rem; align-items: flex-start; }
.foal-namer .fn-step-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--green-deep); color: var(--white); display: flex; align-items: center; justify-content: center; font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; }
.foal-namer .fn-step-body { display: flex; flex-direction: column; gap: 0.15rem; padding-top: 0.15rem; }
.foal-namer .fn-step-title { font-family: var(--font-body); font-size: 0.92rem; font-weight: 600; color: var(--green-deep); }
.foal-namer .fn-step-meta { font-family: var(--font-body); font-size: 0.85rem; color: var(--earth); font-weight: 400; line-height: 1.45; }
.foal-namer .fn-upsell-cta-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; padding-top: 0.5rem; border-top: 1px dashed var(--green-pale); }
.foal-namer .fn-upsell-cta { display: inline-block; background: var(--gold); color: var(--green-deep); padding: 0.95rem 1.85rem; border-radius: 30px; font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; letter-spacing: 0.02em; text-decoration: none; transition: all 0.2s ease; }
.foal-namer .fn-upsell-cta:hover { background: #C9A06B; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(184,145,92,0.35); }
.foal-namer .fn-upsell-meta { font-size: 0.82rem; color: var(--earth); }
.fn-toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--green-deep); color: var(--white); padding: 0.85rem 1.4rem; border-radius: 30px; font-family: var(--font-body); font-size: 0.88rem; font-weight: 500; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.18); opacity: 0; transition: opacity 0.25s, transform 0.25s; pointer-events: none; }
.fn-toast.show { opacity: 1; transform: translateX(-50%) translateY(-4px); }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script>
<script>
(function(){
const SECTION=document.getElementById('foal-namer');if(!SECTION)return;
const SIRE=SECTION.dataset.sire||'this stallion';
const STALLION_SLUG=SECTION.dataset.stallionSlug||'';
const STRIPE_URL=SECTION.dataset.stripe||'https://buy.stripe.com/cNi6oI1m8d4Ha654aZ2B200';
const IRISH=[{w:'M\u00f3r',m:'great'},{w:'Beag',m:'small'},{w:'Dubh',m:'dark'},{w:'B\u00e1n',m:'fair'},{w:'Rua',m:'red'},{w:'Fionn',m:'bright'},{w:'\u00d3g',m:'young'},{w:'Glas',m:'green'},{w:'Saoirse',m:'freedom'},{w:'Aoibhinn',m:'radiant'},{w:'Caoimhe',m:'gentle'},{w:'Niamh',m:'brightness'},{w:'R\u00e9alta',m:'star'},{w:'Gaoth',m:'wind'},{w:'Tine',m:'fire'},{w:'Sneachta',m:'snow'},{w:'Ceol',m:'music'},{w:'Cail\u00edn',m:'maiden'},{w:'Sionnach',m:'fox'},{w:'Bu\u00ed',m:'golden'}];
const QF=['Dawn','Mist','Star','Pearl','Grace','Belle','Dream','Hope','Lass','Maid','Lady','Rose','Misty','Bonnie','Sionna','Sky'];
const QM=['Knight','Hero','Pride','Storm','Spirit','Prince','Cavalier','Bold','Shadow','Captain','Squire','Rebel','Earl','Strider','Echo'];
const QE=['Light','Hope','Glory','Wonder','Wave','Tide','Moon','Echo','River','Dream','Spirit','Sky'];
const PLACES=['Aran','Lough','Sliabh','Maam','Cliff','Roundstone','Errislannan','Letterfrack','Renvyle','Bunowen','Inagh','Killary','Doolough','Maumean','Cleggan','Diamond','Connemara','Glassilaun'];
const CONN=['of','from','by'];
function cap(s){if(!s)return'';return s.toString().trim().split(/\\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');}
function dword(n){if(!n)return'';const sw=new Set(['the','of','and','de','la','del','le','an','na']);const ws=n.split(/\\s+/).filter(w=>w.length>2&&!sw.has(w.toLowerCase()));if(!ws.length)return'';return ws.sort((a,b)=>b.length-a.length)[0];}
function r(a){return a[Math.floor(Math.random()*a.length)];}
function pq(g){if(g==='colt')return QM;if(g==='filly')return QF;return QE.concat(QF).concat(QM);}
function gen(inp){const sw=dword(inp.sire)||'Connemara';const dw=dword(inp.dam)||'';const qs=pq(inp.gender);const px=inp.prefix?cap(inp.prefix):'';const seen=new Set();const out=[];let att=0;
const pats=[
()=>{const i=r(IRISH);const q=r(qs);const b=px?px+' '+sw+' '+i.w:sw+' '+i.w+' '+q;return{name:b,meta:'Of the sire, with '+i.w.toLowerCase()+' ('+i.m+')'};},
()=>{const q=r(qs);const b=px?px+' '+sw+"'s "+q:sw+"'s "+q;return{name:b,meta:"In the sire's line"};},
()=>{const p=r(PLACES);const i=r(IRISH);const b=px?px+' '+p+' '+i.w:p+' '+i.w;return{name:b,meta:'A Connemara place name, with '+i.w.toLowerCase()+' ('+i.m+')'};},
()=>{const q=r(qs);const i=r(IRISH);const b=px?px+' '+i.w+' '+q:i.w+' '+q;return{name:b,meta:i.w+' means '+i.m+' in Irish'};},
()=>{if(!dw)return null;const q=r(qs);const b=px?px+' '+dw+"'s "+q:dw+"'s "+q;return{name:b,meta:"In the dam's line"};},
()=>{const c=r(CONN);const p=r(PLACES);const b=px?px+' '+sw+' '+c+' '+p:sw+' '+c+' '+p;return{name:b,meta:'Sire, '+c+' '+p};}
];
while(out.length<3&&att<40){att++;const p=r(pats);const res=p();if(!res)continue;const k=res.name.toLowerCase().trim();if(seen.has(k))continue;if(k.length>40)continue;seen.add(k);out.push(res);}return out;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const chips=SECTION.querySelectorAll('.fn-chip');
chips.forEach(c=>c.addEventListener('click',()=>{chips.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-checked','false');});c.classList.add('active');c.setAttribute('aria-checked','true');}));
function getInp(){const m=document.getElementById('fn-mare').value.trim();const p=document.getElementById('fn-prefix').value.trim();const a=SECTION.querySelector('.fn-chip.active');return{sire:SIRE,dam:m,prefix:p,gender:a?a.dataset.gender:'either'};}
function buildCard(fn,inp){const ff=inp.gender==='filly';const cc=inp.gender==='colt';const tag=ff?"a filly that doesn't exist yet.":cc?"a colt that doesn't exist yet.":"a foal that doesn't exist yet.";const ns=fn.length>26?44:fn.length>20?52:58;
return '<div style="width:600px;height:600px;background:#FAF7F2;font-family:Cormorant Garamond,Georgia,serif;color:#2C2825;display:flex;flex-direction:column;">'+
'<div style="background:#142F22;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;">'+
'<div style="font-family:Cormorant Garamond,Georgia,serif;font-style:italic;font-size:26px;color:#FFFFFF;letter-spacing:0.01em;">Breed<span style="color:#B8915C;">Pulse</span></div>'+
'<div style="font-family:DM Sans,sans-serif;font-size:11px;color:#B8915C;letter-spacing:0.18em;text-transform:uppercase;font-weight:500;">Foal name idea</div>'+
'</div>'+
'<div style="flex:1;padding:50px 36px 32px;text-align:center;display:flex;flex-direction:column;justify-content:center;">'+
'<div style="font-family:DM Sans,sans-serif;font-size:13px;color:#5C5248;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:22px;font-weight:500;">Meet</div>'+
'<div style="font-family:Cormorant Garamond,Georgia,serif;font-style:italic;font-weight:500;font-size:'+ns+'px;color:#142F22;line-height:1.02;letter-spacing:-0.01em;margin-bottom:18px;">'+esc(fn)+'</div>'+
'<div style="font-family:Cormorant Garamond,Georgia,serif;font-style:italic;font-size:18px;color:#85562C;font-weight:400;margin-bottom:34px;">'+esc(tag)+'</div>'+
'<div style="background:#FFFFFF;border:1px solid #E6E1DB;border-radius:8px;padding:20px 26px;margin:0 auto;max-width:460px;width:100%;box-sizing:border-box;">'+
'<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">'+
'<div style="text-align:left;flex:1;"><div style="font-family:DM Sans,sans-serif;font-size:9px;color:#5C5248;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:5px;font-weight:500;">Sire</div><div style="font-family:Cormorant Garamond,Georgia,serif;font-style:italic;font-size:18px;color:#142F22;font-weight:500;">'+esc(inp.sire)+'</div></div>'+
'<div style="font-family:Cormorant Garamond,Georgia,serif;font-style:italic;font-size:22px;color:#B8915C;font-weight:400;">\u00d7</div>'+
'<div style="text-align:right;flex:1;"><div style="font-family:DM Sans,sans-serif;font-size:9px;color:#5C5248;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:5px;font-weight:500;">Dam</div><div style="font-family:Cormorant Garamond,Georgia,serif;font-style:italic;font-size:18px;color:#142F22;font-weight:500;">'+esc(inp.dam||'Your mare')+'</div></div>'+
'</div></div></div>'+
'<div style="background:#1E4D38;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;">'+
'<div style="font-family:DM Sans,sans-serif;font-size:12px;color:rgba(255,255,255,0.78);letter-spacing:0.02em;font-weight:300;">Verified Connemara stallion directory</div>'+
'<div style="font-family:DM Sans,sans-serif;font-size:13px;color:#B8915C;letter-spacing:0.03em;font-weight:500;">breedpulse.com</div>'+
'</div></div>';}
function save(fn,inp,btn){const st=document.getElementById('fn-card-stage');st.innerHTML=buildCard(fn,inp);const el=st.firstChild;btn.disabled=true;const o=btn.innerHTML;btn.innerHTML='Rendering...';
domtoimage.toBlob(el,{width:600,height:600,bgcolor:'#FAF7F2'}).then(b=>{const s=fn.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');const f='foal-name-'+s+'.png';const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=f;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),500);toast('Image saved \u2014 share it anywhere');if(window.gtag)gtag('event','foal_name_download',{stallion:inp.sire,stallion_slug:STALLION_SLUG,foal_name:fn});}).catch(()=>toast("Couldn't render image. Try again?")).finally(()=>{btn.disabled=false;btn.innerHTML=o;st.innerHTML='';});}
function toast(m){let t=document.querySelector('.fn-toast');if(!t){t=document.createElement('div');t.className='fn-toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
function render(ns,inp){const g=document.getElementById('fn-name-grid');g.innerHTML='';ns.forEach(n=>{const c=document.createElement('div');c.className='fn-name-card';c.innerHTML='<div class="fn-name-value">'+esc(n.name)+'</div><div class="fn-name-meta">'+esc(n.meta)+'</div><button type="button" class="fn-name-save" data-name="'+esc(n.name)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Save as image</button>';g.appendChild(c);});g.querySelectorAll('.fn-name-save').forEach(b=>b.addEventListener('click',()=>save(b.dataset.name,inp,b)));document.getElementById('fn-results').hidden=false;document.getElementById('fn-upsell').hidden=false;setTimeout(()=>document.getElementById('fn-results').scrollIntoView({behavior:'smooth',block:'nearest'}),80);}
function go(){const inp=getInp();if(!inp.dam){const f=document.getElementById('fn-mare');f.focus();f.style.borderColor='#B85A32';setTimeout(()=>f.style.borderColor='',1400);return;}render(gen(inp),inp);if(window.gtag)gtag('event','foal_name_generate',{stallion:inp.sire,stallion_slug:STALLION_SLUG,gender:inp.gender});}
document.getElementById('fn-generate').addEventListener('click',go);
document.getElementById('fn-retry').addEventListener('click',go);
document.getElementById('fn-mare').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
document.getElementById('fn-prefix').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
})();
</script>
`;
}
