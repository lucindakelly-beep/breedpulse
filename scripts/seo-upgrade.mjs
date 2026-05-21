#!/usr/bin/env node
/**
 * BreedPulse SEO Auto-Upgrade — v15 (Foal Namer strip-and-inject fixed)
 *
 * Runs in GitHub Actions on every push. Does:
 *   1. Scans /stallions/ folder for all subfolders containing index.html
 *   2. Injects GA4 tracking + JSON-LD schema + meta tags
 *   3. NUKES every existing foal-namer artefact (section, popover, stage,
 *      style block, all related scripts) before injecting a fresh copy
 *   4. Rebuilds sitemap.xml and robots.txt at repo root
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { foalNamerSection } from './foal-namer-snippet.mjs';

// ---------- CONFIG ----------
const GA4_MEASUREMENT_ID = 'G-DE787X6F6L';
const SITE_ORIGIN = 'https://directory.breedpulse.com';
const MAIN_SITE = 'https://breedpulse.com';
const SEASON_PASS_URL = 'https://buy.stripe.com/cNi6oI1m8d4Ha654aZ2B200';
const STALLIONS_DIR = path.resolve('stallions');
const SITEMAP_PATH = path.resolve('sitemap.xml');
const ROBOTS_PATH = path.resolve('robots.txt');

// ---------- HELPERS ----------
const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const slugToName = (slug) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function extractName(html, fallback) {
  const og = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (og) return og[1].split('—')[0].split('|')[0].trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, '').trim();
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (t) return t[1].split('—')[0].split('|')[0].trim();
  return fallback;
}

function extractField(html, label) {
  const patterns = [
    new RegExp(`<dt[^>]*>\\s*${label}\\s*</dt>\\s*<dd[^>]*>([^<]+)</dd>`, 'i'),
    new RegExp(`<th[^>]*>\\s*${label}\\s*</th>\\s*<td[^>]*>([^<]+)</td>`, 'i'),
  ];
  for (const re of patterns) { const m = html.match(re); if (m) return m[1].trim(); }
  return null;
}

const ga4Snippet = () => `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA4_MEASUREMENT_ID}');
</script>`;

function metaBlock(stallion) {
  const url = `${SITE_ORIGIN}/stallions/${stallion.slug}/`;
  const photoUrl = `https://photos.breedpulse.com/stallions/${stallion.slug}/primary.jpg`;
  const studbookTag = stallion.studbook ? ` (${stallion.studbook})` : '';
  const countryTag = stallion.country ? `, standing in ${stallion.country}` : '';
  const title = `${stallion.name} — Connemara Stallion${studbookTag} | BreedPulse`;
  const desc = `${stallion.name} — verified Connemara stallion${studbookTag}${countryTag}. View pedigree, photos, and stud fee on BreedPulse.`;

  return `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${photoUrl}">
<meta property="og:site_name" content="BreedPulse">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${photoUrl}">`;
}

function jsonLdBlock(stallion) {
  const url = `${SITE_ORIGIN}/stallions/${stallion.slug}/`;
  const photoUrl = `https://photos.breedpulse.com/stallions/${stallion.slug}/primary.jpg`;
  const productSchema = {
    '@context':'https://schema.org','@type':'Product',name:stallion.name,
    description:`${stallion.name} — verified Connemara stallion${stallion.studbook?` (${stallion.studbook})`:''}${stallion.country?`, standing in ${stallion.country}`:''}.`,
    image:photoUrl,url,category:'Connemara Stallion',brand:{'@type':'Brand',name:'BreedPulse'},
    additionalProperty:[
      stallion.studbook && {'@type':'PropertyValue',name:'Studbook',value:stallion.studbook},
      stallion.country && {'@type':'PropertyValue',name:'Country',value:stallion.country},
    ].filter(Boolean),
  };
  const breadcrumbSchema = {
    '@context':'https://schema.org','@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'BreedPulse',item:MAIN_SITE},
      {'@type':'ListItem',position:2,name:'Stallion Directory',item:`${SITE_ORIGIN}/all-stallions.html`},
      {'@type':'ListItem',position:3,name:stallion.name,item:url},
    ],
  };
  return `
<script type="application/ld+json">${JSON.stringify(productSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
}

// ---------- NUKE ALL FOAL NAMER ARTEFACTS ----------
// Removes every element that the foal-namer snippet might leave behind,
// regardless of order, position, or how many copies exist.
function stripAllFoalNamer(html) {
  let out = html;
  let lastLen;

  // Loop until no more matches are found (handles multiple stacked copies)
  do {
    lastLen = out.length;

    // 1. The main foal-namer section
    out = out.replace(/<section[^>]*\bclass="[^"]*\bfoal-namer\b[^"]*"[^>]*>[\s\S]*?<\/section>\s*/g, '');

    // 2. The share popover div (greedy match of outer + nested inner div)
    out = out.replace(/<div\s+id="fn-share-popover"[\s\S]*?<button[^>]*id="fn-share-pop-close"[^>]*>[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*/g, '');
    // Fallback: simpler less-greedy match if structure is partial/broken
    out = out.replace(/<div\s+id="fn-share-popover"[\s\S]{0,3000}?<\/div>\s*<\/div>\s*/g, '');

    // 3. The hidden card stage div (self-closing on outer)
    out = out.replace(/<div\s+id="fn-card-stage"[\s\S]*?<\/div>\s*/g, '');

    // 4. Any <style> block whose content references foal-namer or fn- classes
    out = out.replace(/<style>[^<]*(?:foal-namer|\.fn-)[\s\S]*?<\/style>\s*/g, '');

    // 5. html2canvas / dom-to-image library tags
    out = out.replace(/<script\s+src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/html2canvas[^"]*"[^>]*><\/script>\s*/g, '');
    out = out.replace(/<script\s+src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/dom-to-image[^"]*"[^>]*><\/script>\s*/g, '');

    // 6. Any inline <script> block whose body references foal-namer ids/funcs
    out = out.replace(/<script>\s*\(function\(\)\s*\{\s*const\s+SECTION\s*=\s*document\.getElementById\(\s*'foal-namer'\s*\)[\s\S]*?<\/script>\s*/g, '');

  } while (out.length !== lastLen);

  return out;
}

// ---------- UPGRADE ONE PAGE ----------
async function upgradePage(stallion) {
  const pagePath = path.join(STALLIONS_DIR, stallion.slug, 'index.html');
  let html;
  try { html = await fs.readFile(pagePath, 'utf8'); }
  catch { return { ok: false, reason: 'file-missing' }; }

  stallion.name = extractName(html, slugToName(stallion.slug));
  stallion.studbook = extractField(html, 'Studbook') || stallion.studbook;
  stallion.country = extractField(html, 'Country of Base') || extractField(html, 'Country') || stallion.country;

  let updated = html;

  // 1. GA4 — only inject if not already there
  if (!updated.includes(`gtag/js?id=${GA4_MEASUREMENT_ID}`)) {
    if (updated.includes('</head>')) updated = updated.replace('</head>', `${ga4Snippet()}\n</head>`);
  }

  // 2. JSON-LD — replace existing
  updated = updated.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
  if (updated.includes('</head>')) updated = updated.replace('</head>', `${jsonLdBlock(stallion)}\n</head>`);

  // 3. Meta tags — replace existing
  const newMeta = metaBlock(stallion);
  updated = updated.replace(/<title>[\s\S]*?<\/title>\s*/g, '');
  updated = updated.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '');
  updated = updated.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  updated = updated.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>\s*/gi, '');
  updated = updated.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>\s*/gi, '');
  if (updated.includes('<meta charset')) {
    updated = updated.replace(/(<meta\s+charset[^>]*>)/i, `$1${newMeta}`);
  } else if (updated.includes('<head>')) {
    updated = updated.replace('<head>', `<head>${newMeta}`);
  }

  // 4. Foal Namer — NUKE every trace, then inject ONE fresh copy
  updated = stripAllFoalNamer(updated);

  const foalSection = foalNamerSection({
    stallionName: stallion.name,
    stallionSlug: stallion.slug,
    seasonPassUrl: SEASON_PASS_URL,
  });

  // Inject before the booking upsell section
  let injected = false;

  // Anchor 1: HTML comment marker
  const commentMatch = updated.match(/<!--\s*=+\s*BOOKING UPSELL[\s\S]*?-->/i);
  if (commentMatch) {
    updated = updated.replace(commentMatch[0], foalSection + '\n\n' + commentMatch[0]);
    injected = true;
  }

  // Anchor 2: <section> directly wrapping booking-upsell
  if (!injected) {
    const m = updated.match(/(<section[^>]*class="[^"]*\bdetail\b[^"]*"[^>]*>\s*<div\s+class="booking-upsell")/);
    if (m) {
      updated = updated.replace(m[1], foalSection + '\n\n' + m[1]);
      injected = true;
    }
  }

  // Anchor 3: walk back from booking-upsell class
  if (!injected) {
    const idx = updated.indexOf('class="booking-upsell"');
    if (idx > -1) {
      const sectionIdx = updated.lastIndexOf('<section', idx);
      if (sectionIdx > -1) {
        updated = updated.slice(0, sectionIdx) + foalSection + '\n\n' + updated.slice(sectionIdx);
        injected = true;
      }
    }
  }

  // Anchor 4: fallback — before footer
  if (!injected && updated.includes('<footer>')) {
    updated = updated.replace('<footer>', foalSection + '\n\n<footer>');
    injected = true;
  }

  if (!injected) {
    console.log(`   ⚠ ${stallion.name}: couldn't find injection anchor`);
  }

  if (updated !== html) {
    await fs.writeFile(pagePath, updated, 'utf8');
    return { ok: true, name: stallion.name };
  }
  return { ok: true, name: stallion.name, noChange: true };
}

// ---------- SITEMAP ----------
function buildSitemap(stallions) {
  const today = new Date().toISOString().split('T')[0];
  const staticUrls = [
    { loc: MAIN_SITE + '/', priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_ORIGIN}/all-stallions.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_ORIGIN}/stallion-search.html`, priority: '0.8', changefreq: 'weekly' },
    { loc: MAIN_SITE + '/how-it-works', priority: '0.6', changefreq: 'monthly' },
    { loc: MAIN_SITE + '/pricing', priority: '0.7', changefreq: 'monthly' },
    { loc: MAIN_SITE + '/submit-your-stallion', priority: '0.7', changefreq: 'monthly' },
  ];
  const stallionUrls = stallions.map(s => ({
    loc: `${SITE_ORIGIN}/stallions/${s.slug}/`,
    priority: '0.8', changefreq: 'monthly',
  }));
  const urlEntries = [...staticUrls, ...stallionUrls].map(u =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

// ---------- MAIN ----------
async function main() {
  console.log('🐎 BreedPulse SEO auto-upgrade v15 (Foal Namer hard-reset) starting…\n');

  let entries;
  try { entries = await fs.readdir(STALLIONS_DIR, { withFileTypes: true }); }
  catch { console.error(`❌ Cannot read /stallions/ folder at ${STALLIONS_DIR}`); process.exit(1); }

  const stallions = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(STALLIONS_DIR, entry.name, 'index.html');
    try { await fs.access(indexPath); stallions.push({ slug: entry.name }); } catch {}
  }

  console.log(`   Found ${stallions.length} stallion pages\n`);

  let upgraded = 0, unchanged = 0, failed = 0;
  for (const s of stallions) {
    const r = await upgradePage(s);
    if (!r.ok) { failed++; console.log(`   ✗ ${s.slug} (${r.reason})`); }
    else if (r.noChange) { unchanged++; }
    else { upgraded++; console.log(`   ✓ ${r.name}`); }
  }

  await fs.writeFile(SITEMAP_PATH, buildSitemap(stallions), 'utf8');
  console.log(`\n   ✓ sitemap.xml (${stallions.length + 6} URLs)`);
  await fs.writeFile(ROBOTS_PATH, buildRobots(), 'utf8');
  console.log(`   ✓ robots.txt`);
  console.log(`\n✅ Done. ${upgraded} upgraded, ${unchanged} already current, ${failed} failed.`);
}

main().catch(err => { console.error('❌ Script crashed:', err); process.exit(1); });
