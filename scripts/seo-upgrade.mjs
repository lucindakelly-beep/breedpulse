#!/usr/bin/env node
/**
 * BreedPulse SEO Auto-Upgrade
 *
 * Runs in GitHub Actions on every push. Does:
 *   1. Scans /stallions/ folder for all subfolders containing index.html
 *   2. Injects GA4 tracking + JSON-LD schema + meta tags into each
 *   3. Rebuilds sitemap.xml at repo root
 *   4. Rebuilds robots.txt at repo root
 *
 * No stallions.json needed — uses the folder structure as source of truth.
 * No local clone needed — runs entirely on GitHub's servers.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

// ---------- CONFIG ----------
const GA4_MEASUREMENT_ID = 'G-DE787X6F6L';
const SITE_ORIGIN = 'https://directory.breedpulse.com';
const MAIN_SITE = 'https://breedpulse.com';
const STALLIONS_DIR = path.resolve('stallions');
const SITEMAP_PATH = path.resolve('sitemap.xml');
const ROBOTS_PATH = path.resolve('robots.txt');

// ---------- HELPERS ----------
const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const slugToName = (slug) =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Try to pull the stallion name out of the existing page (preferred over slug-based fallback)
function extractName(html, fallback) {
  // Try og:title first
  const og = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (og) {
    return og[1].split('—')[0].split('|')[0].trim();
  }
  // Then <h1>
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    return h1[1].replace(/<[^>]+>/g, '').trim();
  }
  // Then <title>
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (t) {
    return t[1].split('—')[0].split('|')[0].trim();
  }
  return fallback;
}

// Pull studbook and country from the page if present (these appear as labelled rows in v12 pages)
function extractField(html, label) {
  // Match patterns like: <dt>Studbook</dt><dd>CPBS</dd>  or  <span class="label">Studbook</span><span class="value">CPBS</span>
  const patterns = [
    new RegExp(`<dt[^>]*>\\s*${label}\\s*</dt>\\s*<dd[^>]*>([^<]+)</dd>`, 'i'),
    new RegExp(`<th[^>]*>\\s*${label}\\s*</th>\\s*<td[^>]*>([^<]+)</td>`, 'i'),
    new RegExp(`<span[^>]*class="[^"]*label[^"]*"[^>]*>\\s*${label}\\s*</span>\\s*<span[^>]*>([^<]+)</span>`, 'i'),
    new RegExp(`<div[^>]*class="[^"]*label[^"]*"[^>]*>\\s*${label}\\s*</div>\\s*<div[^>]*>([^<]+)</div>`, 'i'),
    new RegExp(`${label}\\s*:?\\s*</[a-z]+>\\s*<[a-z][^>]*>([^<]+)</`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1].trim();
  }
  return null;
}

// ---------- GA4 SNIPPET ----------
const ga4Snippet = () => `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA4_MEASUREMENT_ID}');
</script>`;

// ---------- META TAGS ----------
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

// ---------- JSON-LD ----------
function jsonLdBlock(stallion) {
  const url = `${SITE_ORIGIN}/stallions/${stallion.slug}/`;
  const photoUrl = `https://photos.breedpulse.com/stallions/${stallion.slug}/primary.jpg`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: stallion.name,
    description: `${stallion.name} — verified Connemara stallion${stallion.studbook ? ` (${stallion.studbook})` : ''}${stallion.country ? `, standing in ${stallion.country}` : ''}.`,
    image: photoUrl,
    url,
    category: 'Connemara Stallion',
    brand: { '@type': 'Brand', name: 'BreedPulse' },
    additionalProperty: [
      stallion.studbook && { '@type': 'PropertyValue', name: 'Studbook', value: stallion.studbook },
      stallion.country && { '@type': 'PropertyValue', name: 'Country', value: stallion.country },
    ].filter(Boolean),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'BreedPulse', item: MAIN_SITE },
      { '@type': 'ListItem', position: 2, name: 'Stallion Directory', item: `${SITE_ORIGIN}/all-stallions.html` },
      { '@type': 'ListItem', position: 3, name: stallion.name, item: url },
    ],
  };

  return `
<script type="application/ld+json">${JSON.stringify(productSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
}

// ---------- UPGRADE ONE PAGE ----------
async function upgradePage(stallion) {
  const pagePath = path.join(STALLIONS_DIR, stallion.slug, 'index.html');
  let html;
  try {
    html = await fs.readFile(pagePath, 'utf8');
  } catch {
    return { ok: false, reason: 'file-missing' };
  }

  // Enrich the stallion record from the page itself
  stallion.name = extractName(html, slugToName(stallion.slug));
  stallion.studbook = extractField(html, 'Studbook') || stallion.studbook;
  stallion.country = extractField(html, 'Country') || stallion.country;

  let updated = html;
  let changed = false;

  // 1. Inject GA4 if not already there
  if (!updated.includes(`gtag/js?id=${GA4_MEASUREMENT_ID}`)) {
    if (updated.includes('</head>')) {
      updated = updated.replace('</head>', `${ga4Snippet()}\n</head>`);
      changed = true;
    }
  }

  // 2. Replace JSON-LD blocks
  const newJsonLd = jsonLdBlock(stallion);
  const jsonLdRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g;
  if (jsonLdRegex.test(updated)) {
    updated = updated.replace(jsonLdRegex, '');
    changed = true;
  }
  if (updated.includes('</head>')) {
    updated = updated.replace('</head>', `${newJsonLd}\n</head>`);
    changed = true;
  }

  // 3. Replace meta tags — strip existing title/description/og/twitter/canonical
  const newMeta = metaBlock(stallion);
  const before = updated;
  updated = updated.replace(/<title>[\s\S]*?<\/title>\s*/g, '');
  updated = updated.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '');
  updated = updated.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  updated = updated.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>\s*/gi, '');
  updated = updated.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>\s*/gi, '');

  if (updated.includes('<meta charset')) {
    updated = updated.replace(/(<meta\s+charset[^>]*>)/i, `$1${newMeta}`);
    changed = true;
  } else if (updated.includes('<head>')) {
    updated = updated.replace('<head>', `<head>${newMeta}`);
    changed = true;
  }

  if (changed && updated !== before) {
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
  const stallionUrls = stallions.map((s) => ({
    loc: `${SITE_ORIGIN}/stallions/${s.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const urlEntries = [...staticUrls, ...stallionUrls]
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n');

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
  console.log('🐎 BreedPulse SEO auto-upgrade starting…\n');

  // Discover all stallion folders
  let entries;
  try {
    entries = await fs.readdir(STALLIONS_DIR, { withFileTypes: true });
  } catch (err) {
    console.error(`❌ Cannot read /stallions/ folder at ${STALLIONS_DIR}`);
    process.exit(1);
  }

  const stallions = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(STALLIONS_DIR, entry.name, 'index.html');
    try {
      await fs.access(indexPath);
      stallions.push({ slug: entry.name });
    } catch {
      // No index.html in this folder — skip silently
    }
  }

  console.log(`   Found ${stallions.length} stallion pages\n`);

  // Upgrade each
  let upgraded = 0;
  let unchanged = 0;
  let failed = 0;
  for (const s of stallions) {
    const result = await upgradePage(s);
    if (!result.ok) {
      failed++;
      console.log(`   ✗ ${s.slug} (${result.reason})`);
    } else if (result.noChange) {
      unchanged++;
    } else {
      upgraded++;
      console.log(`   ✓ ${result.name}`);
    }
  }

  // Build sitemap.xml
  await fs.writeFile(SITEMAP_PATH, buildSitemap(stallions), 'utf8');
  console.log(`\n   ✓ sitemap.xml (${stallions.length + 6} URLs)`);

  // Build robots.txt
  await fs.writeFile(ROBOTS_PATH, buildRobots(), 'utf8');
  console.log(`   ✓ robots.txt`);

  console.log(`\n✅ Done. ${upgraded} upgraded, ${unchanged} already current, ${failed} failed.`);
}

main().catch((err) => {
  console.error('❌ Script crashed:', err);
  process.exit(1);
});
