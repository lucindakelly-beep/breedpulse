// foal-namer-snippet.mjs — v2
// Smarter patterns + style chips + colour dropdown + IP-safe prefix handling.

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
        <div class="fn-chips" role="radiogroup" data-group="gender">
          <button type="button" class="fn-chip active" data-gender="filly" role="radio" aria-checked="true">Filly</button>
          <button type="button" class="fn-chip" data-gender="colt" role="radio" aria-checked="false">Colt</button>
          <button type="button" class="fn-chip" data-gender="either" role="radio" aria-checked="false">Either</button>
        </div>
      </div>
      <div class="fn-field fn-field-full">
        <label>Naming style</label>
        <div class="fn-chips" role="radiogroup" data-group="style">
          <button type="button" class="fn-chip active" data-style="any" role="radio" aria-checked="true">Any (mix)</button>
          <button type="button" class="fn-chip" data-style="traditional" role="radio" aria-checked="false">Traditional</button>
          <button type="button" class="fn-chip" data-style="modern" role="radio" aria-checked="false">Modern</button>
          <button type="button" class="fn-chip" data-style="pastoral" role="radio" aria-checked="false">Pastoral</button>
          <button type="button" class="fn-chip" data-style="mythological" role="radio" aria-checked="false">Mythological</button>
          <button type="button" class="fn-chip" data-style="place" role="radio" aria-checked="false">Place-based</button>
        </div>
      </div>
      <div class="fn-field fn-field-full">
        <button type="button" class="fn-more-toggle" id="fn-more-toggle" aria-expanded="false">
          <span>More options</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="fn-more" id="fn-more" hidden>
          <div class="fn-field">
            <label for="fn-colour">Expected foal colour <span class="fn-optional">(optional)</span></label>
            <select id="fn-colour">
              <option value="">No preference</option>
              <option value="grey">Grey</option>
              <option value="bay">Bay</option>
              <option value="dun">Dun</option>
              <option value="black">Black</option>
              <option value="palomino">Palomino / Buckskin</option>
              <option value="chestnut">Chestnut</option>
            </select>
          </div>
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
    <div class="fn-prefix-note" id="fn-prefix-note" hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Add your stud prefix above to make these registrable. A foal can&rsquo;t be registered under a prefix you don&rsquo;t own.</span>
    </div>

    <div class="fn-upsell" id="fn-upsell" hidden>
      <h3 class="fn-upsell-h">Like the look of one of these? Three steps to actually book ${sireEsc}</h3>
      <ol class="fn-steps">
        <li class="fn-step"><span class="fn-step-num">1</span><div class="fn-step-body"><strong class="fn-step-title">See the stud fee and what&rsquo;s included</strong><span class="fn-step-meta">Members see the exact fee, covering method, and what the booking includes.</span></div></li>
        <li class="fn-step"><span class="fn-step-num">2</span><div class="fn-step-body"><strong class="fn-step-title">Check pedigree compatibility</strong><span class="fn-step-meta">Compare your mare&rsquo;s lines with the 5-generation pedigree above to spot duplicate ancestors and HWSD risks.</span></div></li>
        <li class="fn-step"><span class="fn-step-num">3</span><div class="fn-step-body"><strong class="fn-step-title">Contact the breeder directly</strong><span class="fn-step-meta">Members get the breeder&rsquo;s verified email and mobile &mdash; most reply within 24 hours.</span></div></li>
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
.foal-namer .fn-field input, .foal-namer .fn-field select { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid var(--ash); border-radius: 6px; background: var(--linen); font-family: var(--font-body); font-weight: 400; font-size: 0.95rem; color: var(--peat); transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; }
.foal-namer .fn-field input:focus, .foal-namer .fn-field select:focus { outline: none; border-color: var(--gold); background: var(--white); box-shadow: 0 0 0 3px rgba(184,145,92,0.18); }
.foal-namer .fn-field input::placeholder { color: var(--fog); font-weight: 300; font-style: italic; }
.foal-namer .fn-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.foal-namer .fn-chip { padding: 0.55rem 1.1rem; border: 1px solid var(--ash); background: var(--white); border-radius: 22px; font-family: var(--font-body); font-size: 0.82rem; font-weight: 400; color: var(--earth); cursor: pointer; transition: all 0.15s; }
.foal-namer .fn-chip:hover { border-color: var(--gold); color: var(--green-deep); }
.foal-namer .fn-chip.active { background: var(--green-deep); border-color: var(--green-deep); color: var(--white); font-weight: 500; }
.foal-namer .fn-more-toggle { display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; border: none; color: var(--earth); padding: 0.35rem 0; font-family: var(--font-body); font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: color 0.15s; }
.foal-namer .fn-more-toggle:hover { color: var(--green-deep); }
.foal-namer .fn-more-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
.foal-namer .fn-more-toggle svg { transition: transform 0.2s ease; }
.foal-namer .fn-more { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--ash); animation: fnFadeIn 0.2s ease; }
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
.foal-namer .fn-name-meta { font-family: var(--font-body); font-size: 0.7rem; color: var(--fog); letter-spacing: 0.04em; font-weight: 400; font-style: italic; }
.foal-namer .fn-name-save { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; background: var(--gold); color: var(--green-deep); padding: 0.55rem 0.9rem; border-radius: 20px; font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; margin-top: auto; }
.foal-namer .fn-name-save:hover { background: #C9A06B; }
.foal-namer .fn-name-save svg { width: 13px; height: 13px; }
.foal-namer .fn-name-save:disabled { opacity: 0.6; cursor: wait; }
.foal-namer .fn-prefix-note { margin-top: 1rem; padding: 0.75rem 1rem; background: #FAEFD3; border: 1px solid #E8D49C; border-radius: 6px; font-size: 0.82rem; color: #856220; display: flex; gap: 0.55rem; align-items: flex-start; line-height: 1.45; }
.foal-namer .fn-prefix-note svg { flex-shrink: 0; margin-top: 2px; }
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

const EVOCATIVE=['Reckless','Mischief','Whisper','Spitfire','Saunter','Renegade','Maverick','Daydream','Heartbeat','Mayhem','Tempest','Twilight','Eclipse','Quicksilver','Lightning','Thunder','Wildcard','Trouble','Rumour','Promise','Memory','Echo','Whirlwind','Rascal','Dauntless','Aurora'];
const PHRASES=['Last Light','Once Upon','Tonight Tonight','So It Goes','Born Lucky','Just Because','Fair Warning','Take It Slow','Best Laid Plans','Out of the Blue','In Good Time','Tell Me Why','Word of Mouth','Cross My Heart','Going Steady','All At Once','Quietly Furious','Lost the Plot','Off the Record','Plain Sailing'];
const VERBS=['Whispers','Saunters','Wanders','Rides','Comes','Dances','Drifts','Strides','Returns','Calls','Sings','Crosses'];
const IRISH=[{w:'M\u00f3r',m:'great'},{w:'Beag',m:'small'},{w:'Dubh',m:'dark'},{w:'B\u00e1n',m:'fair'},{w:'Rua',m:'red'},{w:'Fionn',m:'bright'},{w:'\u00d3g',m:'young'},{w:'Glas',m:'green'},{w:'Saoirse',m:'freedom'},{w:'Aoibhinn',m:'radiant'},{w:'Caoimhe',m:'gentle'},{w:'Niamh',m:'brightness'},{w:'R\u00e9alta',m:'star'},{w:'Gaoth',m:'wind'},{w:'Tine',m:'fire'},{w:'Sneachta',m:'snow'},{w:'Ceol',m:'music'},{w:'Cail\u00edn',m:'maiden'},{w:'Sionnach',m:'fox'},{w:'Bu\u00ed',m:'golden'},{w:'Donn',m:'brown'}];
const MYTHO=[{w:'Aoibhinn',m:'radiant beauty'},{w:'Niamh',m:'mythological princess'},{w:'Mac Cumhaill',m:'son of Cumhall'},{w:'Cuchulainn',m:'mythic warrior'},{w:'Macha',m:'goddess of war'},{w:'Brigid',m:'goddess of poetry'},{w:'Sionna',m:'goddess of the Shannon'},{w:'Caoilte',m:'Fianna warrior'},{w:'Aengus',m:'god of love'},{w:'\u00c9tain',m:'mythic queen'},{w:'Oisin',m:'son of Fionn'},{w:'Deirdre',m:'tragic heroine'}];
const PASTORAL=['Heather','Meadow','Mist','Bracken','Foxglove','Hawthorn','Bluebell','Marram','Gorse','Thistle','Cotton Grass','Sedge','Driftwood','Headland','Foreshore','Quietude','Stillness','Wildflower','Stonechat'];
const MODERN_Q=['Quintessential','Bravura','Provenance','Lyric','Cadence','Vignette','Reverie','Solstice','Bellweather','Encore','Hallmark','Vanguard','Sovereign','Pinnacle','Threshold','Crescent','Equinox','Marquee','Tableau'];
const PLACES=['Aran','Lough','Sliabh','Maam','Cliff','Roundstone','Errislannan','Letterfrack','Renvyle','Bunowen','Inagh','Killary','Doolough','Maumean','Cleggan','Diamond','Connemara','Glassilaun','Inishbofin','Kylemore','Spiddal','Clifden'];
const QF=['Lass','Lady','Belle','Rose','Pearl','Dawn','Bonnie','Aria','Misty'];
const QM=['Knight','Hero','Captain','Prince','Earl','Rebel','Squire','Strider','Cavalier'];
const COLOUR_MAP={grey:{w:'B\u00e1n',m:'fair'},bay:{w:'Donn',m:'brown'},dun:{w:'Bu\u00ed',m:'golden'},black:{w:'Dubh',m:'dark'},palomino:{w:'Bu\u00ed',m:'golden'},chestnut:{w:'Rua',m:'red'}};

function cap(s){if(!s)return'';return s.toString().trim().split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');}
function dword(n){if(!n)return'';const sw=new Set(['the','of','and','de','la','del','le','an','na']);const ws=n.split(/\s+/).filter(w=>w.length>2&&!sw.has(w.toLowerCase()));if(!ws.length)return'';return ws.sort((a,b)=>b.length-a.length)[0];}
function r(a){return a[Math.floor(Math.random()*a.length)];}
function gTilt(g){if(g==='colt')return QM;if(g==='filly')return QF;return QF.concat(QM);}

function patternsForStyle(style,ctx){
const px=ctx.prefix;
const useP=s=>px?px+' '+s:s;
const col=ctx.colour?COLOUR_MAP[ctx.colour]:null;
const tilt=gTilt(ctx.gender);

if(style==='traditional'){return[
()=>{const i=r(IRISH);return{name:useP(r(PLACES)+' '+i.w),meta:i.w+' means '+i.m+' in Irish'};},
()=>{const i=r(IRISH);const q=r(tilt);return{name:useP(i.w+' '+q),meta:i.w+' means '+i.m+' in Irish'};},
()=>{const i1=r(IRISH);return{name:useP(i1.w+' '+r(PLACES)),meta:i1.w+' ('+i1.m+'), a Connemara place'};},
()=>col?{name:useP(col.w+' '+r(tilt)),meta:'Colour: '+col.w+' ('+col.m+')'}:null,
()=>{const i=r(IRISH);const i2=r(IRISH);if(i.w===i2.w)return null;return{name:useP(i.w+' '+i2.w),meta:i.w+' ('+i.m+') and '+i2.w+' ('+i2.m+')'};},
];}

if(style==='modern'){return[
()=>{const w=r(MODERN_Q);return{name:useP(w),meta:'A modern signature name'};},
()=>{const w=r(EVOCATIVE);return{name:useP(w),meta:'Single-word, evocative'};},
()=>{const w=r(MODERN_Q);const q=r(tilt);return{name:useP(w+' '+q),meta:'Modern composed name'};},
()=>{if(!ctx.dWord)return null;return{name:useP(ctx.dWord+"'s "+r(MODERN_Q)),meta:"Carries the dam's name"};},
()=>{const p=r(PHRASES);return{name:useP(p),meta:'A phrase that travels'};},
];}

if(style==='pastoral'){return[
()=>{const w=r(PASTORAL);return{name:useP(w),meta:'A pastoral, single-word name'};},
()=>{const w=r(PASTORAL);const q=r(tilt);return{name:useP(w+' '+q),meta:'Pastoral with a gendered touch'};},
()=>{const w1=r(PASTORAL);const w2=r(PASTORAL);if(w1===w2)return null;return{name:useP(w1+' '+w2),meta:'A landscape in two words'};},
()=>{const p=r(PASTORAL);const i=r(IRISH);return{name:useP(p+' '+i.w),meta:'Landscape with '+i.w.toLowerCase()+' ('+i.m+')'};},
()=>{const v=r(VERBS);const p=r(PASTORAL);return{name:useP(v+' through '+p),meta:'A moving landscape'};},
];}

if(style==='mythological'){return[
()=>{const m=r(MYTHO);return{name:useP(m.w),meta:m.m};},
()=>{const m=r(MYTHO);const p=r(PLACES);return{name:useP(m.w+' of '+p),meta:m.m+' \u00b7 named for '+p};},
()=>{const m=r(MYTHO);const w=r(EVOCATIVE);return{name:useP(m.w+"'s "+w),meta:m.m};},
()=>{const m=r(MYTHO);const v=r(VERBS);return{name:useP(m.w+' '+v+' Home'),meta:m.m+', returning'};},
()=>{const i=r(IRISH);const m=r(MYTHO);return{name:useP(i.w+' '+m.w),meta:i.w+' ('+i.m+') of '+m.m};},
];}

if(style==='place'){return[
()=>{const p=r(PLACES);return{name:useP(p),meta:'A pure Connemara place name'};},
()=>{const p=r(PLACES);const v=r(VERBS);return{name:useP(p+' '+v+' Home'),meta:'Coming home to '+p};},
()=>{const p=r(PLACES);const w=r(EVOCATIVE);return{name:useP(p+' '+w),meta:'Of '+p};},
()=>{const p1=r(PLACES);const p2=r(PLACES);if(p1===p2)return null;return{name:useP(p1+' to '+p2),meta:'A Connemara journey'};},
()=>{const v=r(VERBS);const p=r(PLACES);return{name:useP(v+' from '+p),meta:'Out of '+p};},
];}

return[patternsForStyle('traditional',ctx),patternsForStyle('modern',ctx),patternsForStyle('pastoral',ctx),patternsForStyle('mythological',ctx),patternsForStyle('place',ctx)].flat();
}

function gen(inp){
const dWord=dword(inp.dam)||'';
const px=inp.prefix?cap(inp.prefix):'';
const ctx={prefix:px,dam:inp.dam,dWord,gender:inp.gender,colour:inp.colour};
const pats=patternsForStyle(inp.style,ctx);
const seen=new Set();const out=[];let att=0;
while(out.length<3&&att<60){
att++;const fn=r(pats);const result=fn();
if(!result||!result.name)continue;
result.name=result.name.replace(/\s+/g,' ').trim();
const key=result.name.toLowerCase();
if(seen.has(key))continue;
if(key.length>42)continue;
if(!result.name.includes(' ')&&!px)continue;
seen.add(key);out.push(result);
}
return out;
}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

SECTION.querySelectorAll('.fn-chips').forEach(grp=>{
const chips=grp.querySelectorAll('.fn-chip');
chips.forEach(c=>c.addEventListener('click',()=>{
chips.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-checked','false');});
c.classList.add('active');c.setAttribute('aria-checked','true');
}));
});

const mt=document.getElementById('fn-more-toggle');
const mc=document.getElementById('fn-more');
mt.addEventListener('click',()=>{const e=mt.getAttribute('aria-expanded')==='true';mt.setAttribute('aria-expanded',!e);mc.hidden=e;});

function getInp(){
const m=document.getElementById('fn-mare').value.trim();
const p=document.getElementById('fn-prefix').value.trim();
const c=document.getElementById('fn-colour').value;
const gc=SECTION.querySelector('[data-group="gender"] .fn-chip.active');
const sc=SECTION.querySelector('[data-group="style"] .fn-chip.active');
return{sire:SIRE,dam:m,prefix:p,gender:gc?gc.dataset.gender:'either',style:sc?sc.dataset.style:'any',colour:c};
}

function buildCard(fn,inp){
const ff=inp.gender==='filly';const cc=inp.gender==='colt';
const tag=ff?"a filly that doesn't exist yet.":cc?"a colt that doesn't exist yet.":"a foal that doesn't exist yet.";
const ns=fn.length>26?44:fn.length>20?52:58;
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
'</div></div>';
}

function save(fn,inp,btn){
const st=document.getElementById('fn-card-stage');st.innerHTML=buildCard(fn,inp);const el=st.firstChild;
btn.disabled=true;const o=btn.innerHTML;btn.innerHTML='Rendering...';
domtoimage.toBlob(el,{width:600,height:600,bgcolor:'#FAF7F2'}).then(b=>{
const s=fn.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const f='foal-name-'+s+'.png';const u=URL.createObjectURL(b);
const a=document.createElement('a');a.href=u;a.download=f;
document.body.appendChild(a);a.click();document.body.removeChild(a);
setTimeout(()=>URL.revokeObjectURL(u),500);
toast('Image saved \u2014 share it anywhere');
if(window.gtag)gtag('event','foal_name_download',{stallion:inp.sire,stallion_slug:STALLION_SLUG,foal_name:fn,style:inp.style});
}).catch(()=>toast("Couldn't render image. Try again?")).finally(()=>{btn.disabled=false;btn.innerHTML=o;st.innerHTML='';});
}

function toast(m){let t=document.querySelector('.fn-toast');if(!t){t=document.createElement('div');t.className='fn-toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}

function render(ns,inp){
const g=document.getElementById('fn-name-grid');g.innerHTML='';
ns.forEach(n=>{const c=document.createElement('div');c.className='fn-name-card';
c.innerHTML='<div class="fn-name-value">'+esc(n.name)+'</div><div class="fn-name-meta">'+esc(n.meta)+'</div><button type="button" class="fn-name-save" data-name="'+esc(n.name)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Save as image</button>';
g.appendChild(c);});
g.querySelectorAll('.fn-name-save').forEach(b=>b.addEventListener('click',()=>save(b.dataset.name,inp,b)));
document.getElementById('fn-prefix-note').hidden=!!inp.prefix;
document.getElementById('fn-results').hidden=false;
document.getElementById('fn-upsell').hidden=false;
setTimeout(()=>document.getElementById('fn-results').scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}

function go(){
const inp=getInp();
if(!inp.dam){const f=document.getElementById('fn-mare');f.focus();f.style.borderColor='#B85A32';setTimeout(()=>f.style.borderColor='',1400);return;}
const names=gen(inp);
if(names.length===0){toast("Couldn't generate names. Try a different style.");return;}
render(names,inp);
if(window.gtag)gtag('event','foal_name_generate',{stallion:inp.sire,stallion_slug:STALLION_SLUG,gender:inp.gender,style:inp.style,has_prefix:!!inp.prefix,has_colour:!!inp.colour});
}

document.getElementById('fn-generate').addEventListener('click',go);
document.getElementById('fn-retry').addEventListener('click',go);
document.getElementById('fn-mare').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
document.getElementById('fn-prefix').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
})();
</script>
`;
}
