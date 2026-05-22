// foal-namer-snippet.mjs — v4
// Sire-themed + dam-themed + combined slots; simplified share (mobile native, desktop = download + copy caption).

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
  <p class="fn-sub">A Connemara-inspired foal name, generated from your mare&rsquo;s name and ${sireEsc}. Pick a style, share the result, picture the future.</p>

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

<div id="fn-card-stage" aria-hidden="true" style="position:fixed;left:-9999px;top:-9999px;width:600px;height:600px;pointer-events:none;"></div>

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
.foal-namer .fn-name-card { background: var(--linen); border: 1px solid var(--ash); border-radius: var(--radius); padding: 1.5rem 1.25rem 1.1rem; text-align: center; transition: all 0.2s ease; position: relative; display: flex; flex-direction: column; gap: 0.65rem; }
.foal-namer .fn-name-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(184,145,92,0.12); }
.foal-namer .fn-name-slot { font-family: var(--font-body); font-size: 0.62rem; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; }
.foal-namer .fn-name-value { font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: 1.45rem; color: var(--green-deep); line-height: 1.15; letter-spacing: -0.005em; }
.foal-namer .fn-name-meta { font-family: var(--font-body); font-size: 0.72rem; color: var(--fog); letter-spacing: 0.02em; font-weight: 400; font-style: italic; line-height: 1.4; }
.foal-namer .fn-name-share { display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; background: var(--gold); color: var(--green-deep); padding: 0.7rem 0.9rem; border-radius: 24px; font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; margin-top: auto; }
.foal-namer .fn-name-share:hover { background: #C9A06B; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(184,145,92,0.25); }
.foal-namer .fn-name-share svg { width: 14px; height: 14px; }
.foal-namer .fn-name-share:disabled { opacity: 0.6; cursor: wait; }
.foal-namer .fn-prefix-note { margin-top: 1rem; padding: 0.75rem 1rem; background: #FAEFD3; border: 1px solid #E8D49C; border-radius: 6px; font-size: 0.82rem; color: #856220; display: flex; gap: 0.55rem; align-items: flex-start; line-height: 1.45; }
.foal-namer .fn-prefix-note[hidden] { display: none; }
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
.fn-toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--green-deep); color: var(--white); padding: 0.85rem 1.4rem; border-radius: 30px; font-family: var(--font-body); font-size: 0.88rem; font-weight: 500; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.18); opacity: 0; transition: opacity 0.25s, transform 0.25s; pointer-events: none; max-width: 90vw; text-align: center; }
.fn-toast.show { opacity: 1; transform: translateX(-50%) translateY(-4px); }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>
(function(){
const SECTION=document.getElementById('foal-namer');if(!SECTION)return;
const SIRE=SECTION.dataset.sire||'this stallion';
const STALLION_SLUG=SECTION.dataset.stallionSlug||'';
const STRIPE_URL=SECTION.dataset.stripe||'https://buy.stripe.com/cNi6oI1m8d4Ha654aZ2B200';
const PAGE_URL='https://directory.breedpulse.com/stallions/'+STALLION_SLUG+'/';

// === WORD BANKS ===
const EVOCATIVE=['Reckless','Mischief','Whisper','Spitfire','Renegade','Maverick','Daydream','Heartbeat','Mayhem','Tempest','Twilight','Eclipse','Quicksilver','Lightning','Thunder','Wildcard','Trouble','Rumour','Promise','Memory','Echo','Whirlwind','Rascal','Dauntless','Aurora','Marvel'];
const PHRASES=['Last Light','Once Upon','Tonight Tonight','So It Goes','Born Lucky','Fair Warning','Take It Slow','Best Laid Plans','Out of the Blue','In Good Time','Tell Me Why','Word of Mouth','Cross My Heart','Going Steady','All At Once','Quietly Furious','Plain Sailing','Just So','As You Wish'];
const VERBS=['Whispers','Saunters','Wanders','Rides','Comes','Dances','Drifts','Strides','Returns','Calls','Sings','Crosses','Carries'];
const IRISH=[{w:'M\u00f3r',m:'great'},{w:'Beag',m:'small'},{w:'Dubh',m:'dark'},{w:'B\u00e1n',m:'fair'},{w:'Rua',m:'red'},{w:'Fionn',m:'bright'},{w:'\u00d3g',m:'young'},{w:'Glas',m:'green'},{w:'Saoirse',m:'freedom'},{w:'Aoibhinn',m:'radiant'},{w:'Caoimhe',m:'gentle'},{w:'Niamh',m:'brightness'},{w:'R\u00e9alta',m:'star'},{w:'Gaoth',m:'wind'},{w:'Tine',m:'fire'},{w:'Sneachta',m:'snow'},{w:'Ceol',m:'music'},{w:'Cail\u00edn',m:'maiden'},{w:'Sionnach',m:'fox'},{w:'Bu\u00ed',m:'golden'},{w:'Donn',m:'brown'}];
const MYTHO=[{w:'Aoibhinn',m:'radiant beauty'},{w:'Niamh',m:'mythological princess'},{w:'Mac Cumhaill',m:'son of Cumhall'},{w:'Cuchulainn',m:'mythic warrior'},{w:'Macha',m:'goddess of war'},{w:'Brigid',m:'goddess of poetry'},{w:'Sionna',m:'goddess of the Shannon'},{w:'Caoilte',m:'Fianna warrior'},{w:'Aengus',m:'god of love'},{w:'\u00c9tain',m:'mythic queen'},{w:'Oisin',m:'son of Fionn'},{w:'Deirdre',m:'tragic heroine'}];
const PASTORAL=['Heather','Meadow','Mist','Bracken','Foxglove','Hawthorn','Bluebell','Gorse','Thistle','Driftwood','Headland','Wildflower','Stonechat','Willow','Cedar','Hazel'];
const MODERN_Q=['Quintessential','Bravura','Lyric','Cadence','Reverie','Solstice','Hallmark','Vanguard','Sovereign','Pinnacle','Crescent','Equinox','Marquee','Vignette'];
const QF=['Lass','Lady','Belle','Rose','Pearl','Dawn','Bonnie','Misty'];
const QM=['Knight','Hero','Captain','Prince','Earl','Rebel','Squire','Strider','Cavalier'];
const COLOUR_MAP={grey:{w:'B\u00e1n',m:'fair'},bay:{w:'Donn',m:'brown'},dun:{w:'Bu\u00ed',m:'golden'},black:{w:'Dubh',m:'dark'},palomino:{w:'Bu\u00ed',m:'golden'},chestnut:{w:'Rua',m:'red'}};
const SKIP_WORDS=new Set(['the','of','and','de','la','del','le','an','na','my','your','his','her','a','to','from','by']);

function cap(s){if(!s)return'';return s.toString().trim().split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');}
function r(a){return a[Math.floor(Math.random()*a.length)];}
function gTilt(g){if(g==='colt')return QM;if(g==='filly')return QF;return QF.concat(QM);}

// Extract distinctive word from a name (longest non-skip word)
function distinctiveWord(n){
  if(!n)return null;
  const ws=n.split(/\s+/).filter(w=>w.length>2&&!SKIP_WORDS.has(w.toLowerCase()));
  if(!ws.length)return null;
  return ws.sort((a,b)=>b.length-a.length)[0];
}

// Style "flavour" — picks an Irish, evocative, mythological, pastoral, or modern qualifier
function flavourWord(style){
  if(style==='traditional')return r(IRISH).w;
  if(style==='modern')return r(MODERN_Q);
  if(style==='pastoral')return r(PASTORAL);
  if(style==='mythological')return r(MYTHO).w;
  // Any: mix
  return r([r(IRISH).w,r(EVOCATIVE),r(MYTHO).w,r(PASTORAL),r(MODERN_Q)]);
}

// ===== SIRE-THEMED PATTERNS =====
function sireName(ctx){
  const px=ctx.prefix;const useP=s=>px?px+' '+s:s;
  const sw=ctx.sireWord;
  const tilt=gTilt(ctx.gender);
  if(!sw){
    // Fallback: use stallion fullname essence
    const fl=flavourWord(ctx.style);
    return {name:useP(fl+' '+r(tilt)),meta:'In '+ctx.sire+'\u2019s line'};
  }
  const patterns=[
    ()=>{const fl=flavourWord(ctx.style);return{name:useP(sw+' '+fl),meta:'Carries '+ctx.sire+'\u2019s line'};},
    ()=>({name:useP("After the "+sw),meta:'A nod to '+ctx.sire}),
    ()=>{const w=r(EVOCATIVE);return{name:useP(sw+"\u2019s "+w),meta:'A nod to '+ctx.sire};},
    ()=>{const v=r(VERBS);return{name:useP(sw+' '+v+' Home'),meta:'Of '+ctx.sire+'\u2019s line'};},
    ()=>{const ip=ctx.gender==='colt'?'Son':ctx.gender==='filly'?'Daughter':'Heir';return{name:useP(ip+' of '+sw),meta:'A nod to '+ctx.sire};},
  ];
  return r(patterns)();
}

// ===== DAM-THEMED PATTERNS =====
function damName(ctx){
  const px=ctx.prefix;const useP=s=>px?px+' '+s:s;
  const dw=ctx.damWord;
  const tilt=gTilt(ctx.gender);
  if(!dw){
    // Fallback: a flavour pattern not referencing sire
    const fl=flavourWord(ctx.style);
    return {name:useP(fl+' '+r(tilt)),meta:'From your mare\u2019s line'};
  }
  const patterns=[
    ()=>{const fl=flavourWord(ctx.style);return{name:useP(dw+' '+fl),meta:'Carries '+ctx.dam+'\u2019s line'};},
    ()=>{const w=r(EVOCATIVE);return{name:useP(dw+"\u2019s "+w),meta:'A nod to '+ctx.dam};},
    ()=>{const v=r(VERBS);return{name:useP(dw+' '+v),meta:'From '+ctx.dam+'\u2019s line'};},
    ()=>{const fl=flavourWord(ctx.style);return{name:useP(fl+"\u2019s "+dw),meta:'A nod to '+ctx.dam};},
    ()=>{const p=r(PHRASES);return{name:useP(dw+' '+p),meta:'From '+ctx.dam+'\u2019s line'};},
  ];
  return r(patterns)();
}

// ===== COMBINED (SIRE + DAM) PATTERNS =====
function combinedName(ctx){
  const px=ctx.prefix;const useP=s=>px?px+' '+s:s;
  const sw=ctx.sireWord;const dw=ctx.damWord;
  if(!sw||!dw){
    // Fallback: pick whichever exists, else style-neutral
    if(sw)return sireName(ctx);
    if(dw)return damName(ctx);
    const fl=flavourWord(ctx.style);
    return {name:useP(fl+' '+r(gTilt(ctx.gender))),meta:'A name of their own'};
  }
  const patterns=[
    ()=>({name:useP(sw+' '+dw),meta:'From '+ctx.sire+' and '+ctx.dam}),
    ()=>({name:useP(dw+"\u2019s "+sw),meta:'Where the lines meet'}),
    ()=>({name:useP(sw+' and '+dw),meta:'From both lines'}),
    ()=>({name:useP(dw+' After '+sw),meta:'Both sides honoured'}),
    ()=>{const fl=flavourWord(ctx.style);return{name:useP(sw+' '+fl+' '+dw),meta:'Both lines, one foal'};},
  ];
  return r(patterns)();
}

// ===== MAIN GENERATOR — slots: [sire, dam, combined] =====
function gen(inp){
  const sireWord=distinctiveWord(inp.sire);
  const damWord=distinctiveWord(inp.dam);
  const px=inp.prefix?cap(inp.prefix):'';
  const ctx={
    prefix:px,
    sire:inp.sire,
    dam:inp.dam||'your mare',
    sireWord,
    damWord,
    gender:inp.gender,
    style:inp.style,
    colour:inp.colour
  };
  // Apply colour as Irish word if present (decorates dam or combined slot)
  const colourPick=inp.colour?COLOUR_MAP[inp.colour]:null;

  const out=[];
  const seen=new Set();
  // Helper: generate one slot with retries, dedup
  function trySlot(fn,label,maxTries){
    for(let i=0;i<maxTries;i++){
      const result=fn(ctx);
      if(!result||!result.name)continue;
      result.name=result.name.replace(/\s+/g,' ').trim();
      const key=result.name.toLowerCase();
      if(seen.has(key))continue;
      if(key.length>44)continue;
      seen.add(key);
      result.slot=label;
      return result;
    }
    return null;
  }
  const s1=trySlot(sireName,'Sire\u2019s line',20);if(s1)out.push(s1);
  const s2=trySlot(damName,'Dam\u2019s line',20);if(s2)out.push(s2);
  const s3=trySlot(combinedName,'Both lines',20);if(s3)out.push(s3);

  // If we got fewer than 3 (e.g. due to dedup collisions), backfill from style-flavour
  while(out.length<3){
    const fl=flavourWord(inp.style);
    const tilt=gTilt(inp.gender);
    const nm=(px?px+' ':'')+fl+' '+r(tilt);
    const key=nm.toLowerCase();
    if(!seen.has(key)){seen.add(key);out.push({name:nm,meta:'A name of their own',slot:'Wildcard'});}
    else if(out.length<3){
      // Last resort: append a counter (extremely rare)
      out.push({name:nm+' '+(out.length+1),meta:'A name of their own',slot:'Wildcard'});
    }
  }

  // Optional colour decoration: append Irish colour word to slot 2 (dam)
  if(colourPick&&out[1]&&!out[1].name.includes(colourPick.w)){
    out[1].name=out[1].name+' '+colourPick.w;
    out[1].meta=out[1].meta+' \u00b7 '+colourPick.w+' ('+colourPick.m+')';
  }
  return out;
}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

// === UI WIRING ===
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

// === SHARE CARD BUILDER (Georgia + system sans for reliability) ===
function buildCard(fn,inp){
const ff=inp.gender==='filly';const cc=inp.gender==='colt';
const tag=ff?"a filly that doesn't exist yet.":cc?"a colt that doesn't exist yet.":"a foal that doesn't exist yet.";
let ns=58;if(fn.length>32)ns=36;else if(fn.length>26)ns=44;else if(fn.length>20)ns=52;
const serif="Georgia,'Times New Roman',serif";
const sans="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
return ''+
'<div style="width:600px;height:600px;background:#FAF7F2;color:#2C2825;display:flex;flex-direction:column;box-sizing:border-box;font-family:'+sans+';">'+
  '<div style="background:#142F22;padding:20px 32px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">'+
    '<div style="font-family:'+serif+';font-style:italic;font-size:28px;color:#FFFFFF;letter-spacing:0.01em;line-height:1;">Breed<span style="color:#B8915C;">Pulse</span></div>'+
    '<div style="font-family:'+sans+';font-size:10px;color:#B8915C;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">Foal name idea</div>'+
  '</div>'+
  '<div style="flex:1;padding:48px 40px 36px;text-align:center;display:flex;flex-direction:column;justify-content:center;">'+
    '<div style="font-family:'+sans+';font-size:12px;color:#5C5248;letter-spacing:0.24em;text-transform:uppercase;margin-bottom:24px;font-weight:600;">Meet</div>'+
    '<div style="font-family:'+serif+';font-style:italic;font-weight:400;font-size:'+ns+'px;color:#142F22;line-height:1.05;letter-spacing:-0.01em;margin-bottom:20px;padding:0 8px;">'+esc(fn)+'</div>'+
    '<div style="font-family:'+serif+';font-style:italic;font-size:19px;color:#85562C;font-weight:400;margin-bottom:32px;line-height:1.3;">'+esc(tag)+'</div>'+
    '<div style="background:#FFFFFF;border:1px solid #E6E1DB;border-radius:8px;padding:18px 24px;margin:0 auto;max-width:480px;width:100%;box-sizing:border-box;">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">'+
        '<div style="text-align:left;flex:1;min-width:0;">'+
          '<div style="font-family:'+sans+';font-size:9px;color:#5C5248;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:4px;font-weight:600;">Sire</div>'+
          '<div style="font-family:'+serif+';font-style:italic;font-size:17px;color:#142F22;font-weight:400;line-height:1.2;word-wrap:break-word;">'+esc(inp.sire)+'</div>'+
        '</div>'+
        '<div style="font-family:'+serif+';font-size:24px;color:#B8915C;font-weight:300;line-height:1;flex-shrink:0;">\u00d7</div>'+
        '<div style="text-align:right;flex:1;min-width:0;">'+
          '<div style="font-family:'+sans+';font-size:9px;color:#5C5248;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:4px;font-weight:600;">Dam</div>'+
          '<div style="font-family:'+serif+';font-style:italic;font-size:17px;color:#142F22;font-weight:400;line-height:1.2;word-wrap:break-word;">'+esc(inp.dam||'Your mare')+'</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
  '<div style="background:#1E4D38;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">'+
    '<div style="font-family:'+sans+';font-size:11px;color:rgba(255,255,255,0.8);letter-spacing:0.04em;font-weight:400;">Generated on BreedPulse</div>'+
    '<div style="font-family:'+sans+';font-size:13px;color:#B8915C;letter-spacing:0.04em;font-weight:600;">breedpulse.com</div>'+
  '</div>'+
'</div>';
}

function renderCardToBlob(fn,inp){
const st=document.getElementById('fn-card-stage');
st.innerHTML=buildCard(fn,inp);
const el=st.firstChild;
return html2canvas(el,{width:600,height:600,backgroundColor:'#FAF7F2',scale:2,logging:false,useCORS:true}).then(canvas=>{
return new Promise((res,rej)=>{canvas.toBlob(b=>{st.innerHTML='';b?res(b):rej(new Error('blob failed'));},'image/png',0.95);});
});
}

// === SHARE TEXT (no escape sequences, immune to copy-paste mangling) ===
function shareText(fn,inp){
var NL=String.fromCharCode(10);
return 'Meet '+fn+' \u2014 a '+(inp.gender==='colt'?'colt':inp.gender==='filly'?'filly':'foal')+" that doesn't exist yet."+NL+NL+'Generated on BreedPulse, the verified Connemara stallion directory.'+NL+NL+'Try it: '+PAGE_URL;
}

// === SHARE (Option D: native mobile share OR desktop download+copy) ===
async function shareName(fn,inp,btn){
const original=btn.innerHTML;btn.disabled=true;btn.innerHTML='Preparing\u2026';
try{
const blob=await renderCardToBlob(fn,inp);
const filename='foal-name-'+fn.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';
const file=new File([blob],filename,{type:'image/png'});
const text=shareText(fn,inp);

// Mobile path: native share sheet with image + caption
if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
try{
await navigator.share({title:fn+' \u2014 BreedPulse',text:text,files:[file]});
toast('Shared!');
if(window.gtag)gtag('event','foal_name_share',{stallion:inp.sire,stallion_slug:STALLION_SLUG,foal_name:fn,style:inp.style,method:'native'});
}catch(err){if(err&&err.name!=='AbortError')throw err;}
return;
}

// Desktop path: download image + copy caption to clipboard
const u=URL.createObjectURL(blob);
const a=document.createElement('a');a.href=u;a.download=filename;
document.body.appendChild(a);a.click();document.body.removeChild(a);
setTimeout(()=>URL.revokeObjectURL(u),500);

// Copy caption (best effort)
let copied=false;
try{
if(navigator.clipboard&&navigator.clipboard.writeText){
await navigator.clipboard.writeText(text);
copied=true;
}
}catch(e){/* clipboard denied — still show toast */}

// Also try to copy image to clipboard for paste-into-post (modern browsers)
try{
if(navigator.clipboard&&navigator.clipboard.write&&window.ClipboardItem){
await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
}
}catch(e){/* image clipboard not supported — that's OK, download already happened */}

toast(copied?'Image saved \u00b7 Caption copied to clipboard':'Image saved');
if(window.gtag)gtag('event','foal_name_share',{stallion:inp.sire,stallion_slug:STALLION_SLUG,foal_name:fn,style:inp.style,method:'desktop_download'});

}catch(err){
toast("Couldn't prepare share. Try again?");
}finally{btn.disabled=false;btn.innerHTML=original;}
}

function toast(m){let t=document.querySelector('.fn-toast');if(!t){t=document.createElement('div');t.className='fn-toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}

function render(ns,inp){
const g=document.getElementById('fn-name-grid');g.innerHTML='';
ns.forEach(n=>{
const c=document.createElement('div');c.className='fn-name-card';
c.innerHTML='<div class="fn-name-slot">'+esc(n.slot||'')+'</div>'+
'<div class="fn-name-value">'+esc(n.name)+'</div>'+
'<div class="fn-name-meta">'+esc(n.meta)+'</div>'+
'<button type="button" class="fn-name-share" data-name="'+esc(n.name)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share this name</button>';
g.appendChild(c);});
g.querySelectorAll('.fn-name-share').forEach(b=>b.addEventListener('click',()=>shareName(b.dataset.name,inp,b)));
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
