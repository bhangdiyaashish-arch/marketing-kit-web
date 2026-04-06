import { getCoverIllustration, getUnitIcon } from './illustrations';
import type { PropertyData, GeneratedContent } from './types';

const DEFAULT_COLORS = {
  glamping:    { dark: '#1C2B1C', accent: '#C4A24A', tint: '#F2EDE0' },
  villa:       { dark: '#1A1E2E', accent: '#C9A87C', tint: '#F5F0EC' },
  hotel:       { dark: '#1C1C1C', accent: '#B8A082', tint: '#F8F5F0' },
  'eco-lodge': { dark: '#1B2B1B', accent: '#7BAF6F', tint: '#EEF2EB' },
  ecolodge:    { dark: '#1B2B1B', accent: '#7BAF6F', tint: '#EEF2EB' },
  campsite:    { dark: '#1E1A2E', accent: '#E8894A', tint: '#F2EAE2' },
} as Record<string, { dark: string; accent: string; tint: string }>;

function resolveColors(property: PropertyData) {
  if (property.colors?.dark && property.colors?.accent && property.colors?.tint) return property.colors;
  return DEFAULT_COLORS[(property.type || '').toLowerCase()] || DEFAULT_COLORS.glamping;
}

function e(str: unknown): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function buildHTML(property: PropertyData, content: GeneratedContent): string {
  const colors = resolveColors(property);
  const { dark, accent, tint } = colors;
  const coverSVG = getCoverIllustration(property.type, colors);

  const reviews = property.reviews || [];
  const featured = reviews.find(r => r.featured) || reviews[0] || { author: '', text: '' };
  const supporting = reviews.filter(r => r !== featured).slice(0, 3);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --dark:${dark};--accent:${accent};--tint:${tint};--white:#FFF;
  --muted:color-mix(in srgb,${dark} 45%,${tint});
  --serif:'Playfair Display',Georgia,serif;
  --sans:'Inter',system-ui,sans-serif;
}
html,body{background:#111}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;break-after:page;page-break-after:always}
@page{size:A4;margin:0}
@media print{html,body{background:transparent}.page{break-after:page}}
.label{font-family:var(--sans);font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);font-weight:500}
.body-text{font-family:var(--serif);font-size:14.5px;line-height:1.9;color:var(--dark);max-width:480px}
.page-cover{background:var(--dark);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:54px 56px 0}
.cover-eyebrow{font-family:var(--sans);font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--accent);opacity:.85;margin-bottom:22px}
.cover-name{font-family:var(--serif);font-size:54px;font-weight:500;color:var(--white);text-align:center;line-height:1.1;letter-spacing:-.5px}
.cover-divider{width:32px;height:1px;background:var(--accent);margin:22px auto;opacity:.7}
.cover-tagline{font-family:var(--serif);font-style:italic;font-size:17px;color:var(--white);opacity:.72;text-align:center;max-width:360px;line-height:1.6}
.cover-illustration{position:absolute;bottom:0;left:0;width:100%;height:55%}
.cover-illustration svg{width:100%;height:100%}
.cover-fade{position:absolute;bottom:0;left:0;width:100%;height:55%;background:linear-gradient(to bottom,var(--dark) 0%,transparent 30%);pointer-events:none}
.cover-location{position:absolute;bottom:40px;left:0;right:0;text-align:center;font-family:var(--sans);font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--white);opacity:.4}
.page-white{background:var(--white);padding:52px 60px}
.page-tint{background:var(--tint);padding:52px 60px}
.page-label{position:absolute;top:28px;right:52px;font-family:var(--sans);font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);opacity:.7}
.page-label-light{position:absolute;top:28px;right:52px;font-family:var(--sans);font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--white);opacity:.35}
.story-drop-cap::first-letter{font-family:var(--serif);font-size:72px;font-weight:600;color:var(--accent);float:left;line-height:.78;margin-right:10px;margin-top:6px}
.pullquote{border-left:3px solid var(--accent);padding:4px 0 4px 20px;margin:32px 0}
.pullquote-text{font-family:var(--serif);font-style:italic;font-size:21px;line-height:1.55;color:var(--accent);max-width:420px}
.pillar-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;margin-top:40px}
.pillar{padding-top:20px;border-top:1.5px solid var(--accent)}
.pillar-label{font-family:var(--sans);font-size:8.5px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.pillar-headline{font-family:var(--serif);font-size:19px;font-weight:500;color:var(--dark);line-height:1.25;margin-bottom:12px}
.pillar-body{font-family:var(--sans);font-size:12px;line-height:1.75;color:var(--dark);opacity:.75}
.units-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:20px;margin-top:36px}
.unit-card{background:var(--white);border-radius:4px;padding:24px 20px 20px;display:flex;flex-direction:column;gap:12px}
.unit-card-name{font-family:var(--serif);font-size:16px;font-weight:500;color:var(--dark)}
.unit-card-tagline{font-family:var(--sans);font-size:11.5px;line-height:1.65;color:var(--dark);opacity:.72;flex:1}
.unit-card-price{font-family:var(--sans);font-size:11px;letter-spacing:1px;color:var(--accent);font-weight:500;border-top:1px solid color-mix(in srgb,var(--accent) 25%,transparent);padding-top:10px}
.page-gallery{background:var(--dark);padding:0;width:210mm;height:297mm;display:grid;grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr;gap:3px}
.gallery-cell{background:color-mix(in srgb,var(--dark) 70%,var(--accent));overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative}
.gallery-cell:nth-child(3){grid-column:1/2;grid-row:2/3}
.gallery-cell:nth-child(4){grid-column:2/3;grid-row:1/3}
.gallery-cell img{width:100%;height:100%;object-fit:cover;display:block}
.gallery-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.hero-experience{background:var(--dark);padding:32px 36px;border-radius:4px;margin-bottom:32px}
.hero-exp-label{font-family:var(--sans);font-size:8.5px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.hero-exp-name{font-family:var(--serif);font-size:26px;font-weight:500;color:var(--white);margin-bottom:16px;line-height:1.2}
.hero-exp-narrative{font-family:var(--serif);font-style:italic;font-size:14px;line-height:1.85;color:var(--white);opacity:.72;max-width:480px}
.addons-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
.addon-item{padding:18px 0;border-bottom:1px solid color-mix(in srgb,var(--dark) 12%,transparent);padding-right:24px}
.addon-name{font-family:var(--sans);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.addon-line{font-family:var(--serif);font-size:13px;line-height:1.7;color:var(--dark)}
.featured-quote-mark{font-family:var(--serif);font-size:96px;color:var(--accent);opacity:.25;line-height:.7;display:block}
.featured-quote-text{font-family:var(--serif);font-style:italic;font-size:22px;line-height:1.6;color:var(--dark);max-width:500px}
.featured-quote-author{font-family:var(--sans);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-top:16px}
.supporting-reviews{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:36px;padding-top:28px;border-top:1px solid color-mix(in srgb,var(--dark) 12%,transparent)}
.supporting-review-text{font-family:var(--serif);font-style:italic;font-size:12.5px;line-height:1.75;color:var(--dark);opacity:.80;margin-bottom:10px}
.supporting-review-author{font-family:var(--sans);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);opacity:.80}
.archetypes-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;margin-top:40px}
.archetype-item{padding-top:20px;border-top:1.5px solid var(--accent)}
.archetype-number{font-family:var(--serif);font-size:36px;font-weight:500;color:var(--accent);opacity:.35;line-height:1;margin-bottom:10px}
.archetype-title{font-family:var(--serif);font-size:17px;font-weight:500;color:var(--dark);margin-bottom:14px;line-height:1.3}
.archetype-text{font-family:var(--sans);font-size:12px;line-height:1.75;color:var(--dark);opacity:.72}
.location-map{width:100%;height:54mm;background:var(--dark);border-radius:4px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.location-map svg{width:100%;height:100%}
.how-to-reach{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.reach-item-label{font-family:var(--sans);font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.reach-item-text{font-family:var(--sans);font-size:11.5px;line-height:1.65;color:var(--dark);opacity:.75}
.page-closing{background:var(--dark);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;text-align:center}
.closing-eyebrow{font-family:var(--sans);font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--accent);opacity:.75;margin-bottom:24px}
.closing-name{font-family:var(--serif);font-size:52px;font-weight:500;color:var(--white);line-height:1.1;letter-spacing:-.5px}
.closing-divider{width:32px;height:1px;background:var(--accent);margin:26px auto;opacity:.6}
.closing-line{font-family:var(--serif);font-style:italic;font-size:18px;color:var(--white);opacity:.65;max-width:340px;line-height:1.65;margin-bottom:48px}
.closing-contacts{display:flex;gap:28px;align-items:center;justify-content:center;flex-wrap:wrap}
.closing-contact-item{font-family:var(--sans);font-size:9.5px;letter-spacing:1.5px;color:var(--white);opacity:.40}
.closing-illustration{position:absolute;bottom:0;left:0;width:100%;height:42%;opacity:.25;pointer-events:none}
.closing-illustration svg{width:100%;height:100%}
.section-headline{font-family:var(--serif);font-size:36px;font-weight:500;color:var(--dark);line-height:1.15;margin-bottom:8px}
.section-sub{font-family:var(--sans);font-size:12px;color:var(--dark);opacity:.55;line-height:1.6;max-width:380px}
.page-number{position:absolute;bottom:28px;right:52px;font-family:var(--sans);font-size:9px;letter-spacing:2px;color:var(--muted);opacity:.5}
.page-number-light{position:absolute;bottom:28px;right:52px;font-family:var(--sans);font-size:9px;letter-spacing:2px;color:var(--white);opacity:.25}
.property-watermark{position:absolute;bottom:28px;left:52px;font-family:var(--sans);font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);opacity:.40}
.property-watermark-light{position:absolute;bottom:28px;left:52px;font-family:var(--sans);font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:var(--white);opacity:.20}
</style>
</head>
<body>

<!-- PAGE 1 COVER -->
<div class="page page-cover">
  <div class="cover-illustration">${coverSVG}</div>
  <div class="cover-fade"></div>
  <span class="cover-eyebrow">${e((property.location?.area || '').toUpperCase())}</span>
  <h1 class="cover-name">${e(property.name)}</h1>
  <div class="cover-divider"></div>
  <p class="cover-tagline">${e(content.tagline)}</p>
  <div class="cover-location">${e(property.location?.area || '')}</div>
  <span class="page-number-light">01</span>
</div>

<!-- PAGE 2 OUR STORY -->
<div class="page page-white" style="position:relative">
  <span class="page-label">Our Story</span>
  <div style="max-width:520px;margin:52px auto 0;padding-top:20px">
    <p class="label" style="margin-bottom:14px">The Beginning</p>
    <p class="body-text story-drop-cap" style="margin-bottom:24px">${e(content.story.p1)}</p>
    <div class="pullquote"><p class="pullquote-text">${e(content.pullquote)}</p></div>
    <p class="body-text" style="margin-bottom:24px">${e(content.story.p2)}</p>
    <p class="body-text">${e(content.story.p3)}</p>
  </div>
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">02</span>
</div>

<!-- PAGE 3 THE EXPERIENCE -->
<div class="page page-tint" style="position:relative">
  <span class="page-label">The Experience</span>
  <div style="padding-top:24px">
    <p class="label" style="margin-bottom:12px">Being Here</p>
    <h2 class="section-headline">What the days feel like.</h2>
  </div>
  <div style="max-width:480px;margin:20px 0 32px">
    <p class="body-text" style="margin-bottom:20px">${e(content.experience.p1)}</p>
    <p class="body-text">${e(content.experience.p2)}</p>
  </div>
  <div class="pillar-grid">
    ${content.experience_pillars.map(p => `
    <div class="pillar">
      <p class="pillar-label">${e(p.label)}</p>
      <h3 class="pillar-headline">${e(p.headline)}</h3>
      <p class="pillar-body">${e(p.body)}</p>
    </div>`).join('')}
  </div>
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">03</span>
</div>

<!-- PAGE 4 STAY OPTIONS -->
<div class="page page-white" style="position:relative">
  <span class="page-label">Where You Stay</span>
  <div style="padding-top:24px">
    <p class="label" style="margin-bottom:12px">Your Space</p>
    <h2 class="section-headline">Choose how you sleep.</h2>
    <p class="section-sub" style="margin-top:8px">Each space is built around a specific kind of quiet.</p>
  </div>
  <div class="units-grid">
    ${content.units.map(u => {
      const pu = (property.units || []).find(x => x.name.toLowerCase() === u.name.toLowerCase()) || { type: 'tent', price: 0 };
      return `<div class="unit-card">
        <div>${getUnitIcon(pu.type || 'tent', colors)}</div>
        <div class="unit-card-name">${e(u.name)}</div>
        <div class="unit-card-tagline">${e(u.tagline)}</div>
        ${pu.price ? `<div class="unit-card-price">From ₹${Number(pu.price).toLocaleString()} / night</div>` : ''}
      </div>`;
    }).join('')}
  </div>
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">04</span>
</div>

<!-- PAGE 5 GALLERY -->
<div class="page page-gallery">
  ${galleryGrid(property.images || [], dark, accent)}
  <span class="page-number-light" style="z-index:2">05</span>
</div>

<!-- PAGE 6 EXPERIENCES -->
<div class="page page-white" style="position:relative">
  <span class="page-label">Experiences</span>
  <div style="padding-top:24px;margin-bottom:24px">
    <p class="label" style="margin-bottom:12px">While You're Here</p>
    <h2 class="section-headline">What to do with the hours.</h2>
  </div>
  <div class="hero-experience">
    <p class="hero-exp-label">Featured</p>
    <h3 class="hero-exp-name">${e(content.hero_experience.name)}</h3>
    <p class="hero-exp-narrative">${e(content.hero_experience.narrative)}</p>
  </div>
  <div class="addons-grid">
    ${content.add_ons.map(addon => `
    <div class="addon-item">
      <p class="addon-name">${e(addon.name)}</p>
      <p class="addon-line">${e(addon.line1)}</p>
      <p class="addon-line" style="opacity:.65;font-style:italic;font-size:12.5px;margin-top:4px">${e(addon.line2)}</p>
    </div>`).join('')}
  </div>
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">06</span>
</div>

<!-- PAGE 7 REVIEWS -->
<div class="page page-tint" style="position:relative">
  <span class="page-label">What Guests Say</span>
  <div style="padding-top:24px;margin-bottom:28px">
    <p class="label" style="margin-bottom:12px">The Word From Here</p>
  </div>
  <span class="featured-quote-mark">"</span>
  <p class="featured-quote-text">${e(featured.text)}</p>
  <p class="featured-quote-author">${e(featured.author)}</p>
  ${supporting.length > 0 ? `<div class="supporting-reviews">
    ${supporting.map(r => `<div>
      <p class="supporting-review-text">"${e(r.text)}"</p>
      <p class="supporting-review-author">${e(r.author)}</p>
    </div>`).join('')}
  </div>` : ''}
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">07</span>
</div>

<!-- PAGE 8 WHO COMES HERE -->
<div class="page page-white" style="position:relative">
  <span class="page-label">Who Comes Here</span>
  <div style="padding-top:24px;margin-bottom:8px">
    <p class="label" style="margin-bottom:12px">The Right Guests</p>
    <h2 class="section-headline">You will know if this is for you.</h2>
  </div>
  <div class="archetypes-grid">
    ${content.archetypes.map((a, i) => `
    <div class="archetype-item">
      <div class="archetype-number">0${i + 1}</div>
      <h3 class="archetype-title">${e(a.title)}</h3>
      <p class="archetype-text">${e(a.invitation)}</p>
    </div>`).join('')}
  </div>
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">08</span>
</div>

<!-- PAGE 9 LOCATION -->
<div class="page page-tint" style="position:relative">
  <span class="page-label">Finding Us</span>
  <div style="padding-top:24px;margin-bottom:24px">
    <p class="label" style="margin-bottom:12px">Location</p>
    <h2 class="section-headline">${e(property.location?.area || 'How to find us')}</h2>
  </div>
  <div class="location-map">${locationMap(property, colors)}</div>
  <div class="how-to-reach">
    <div>
      <p class="reach-item-label">Getting Here</p>
      <p class="reach-item-text">${e(property.location?.how_to_reach || property.location?.description || '')}</p>
    </div>
    ${property.contact?.email || property.contact?.phone ? `<div>
      <p class="reach-item-label">Get In Touch</p>
      <p class="reach-item-text">${[property.contact?.phone, property.contact?.email, property.contact?.website].filter(Boolean).map(e).join('<br/>')}</p>
    </div>` : ''}
  </div>
  <span class="property-watermark">${e(property.name)}</span>
  <span class="page-number">09</span>
</div>

<!-- PAGE 10 CLOSING -->
<div class="page page-closing" style="position:relative">
  <div class="closing-illustration">${coverSVG}</div>
  <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center">
    <p class="closing-eyebrow">${e((property.location?.area || '').toUpperCase())}</p>
    <h2 class="closing-name">${e(property.name)}</h2>
    <div class="closing-divider"></div>
    <p class="closing-line">${e(content.closing_line)}</p>
    <div class="closing-contacts">
      ${[property.contact?.phone, property.contact?.email, property.contact?.website, property.contact?.instagram]
        .filter(Boolean)
        .map(c => `<span class="closing-contact-item">${e(c)}</span>`)
        .join('<span style="color:${accent};opacity:.35;font-size:12px;margin:0 4px">·</span>')}
    </div>
  </div>
  <span class="page-number-light">10</span>
</div>

</body></html>`;
}

function galleryGrid(images: string[], dark: string, accent: string): string {
  const patterns = [
    `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="${dark}"/><circle cx="200" cy="150" r="80" fill="${accent}" opacity=".12"/><circle cx="200" cy="150" r="50" fill="${accent}" opacity=".08"/><line x1="0" y1="150" x2="400" y2="150" stroke="${accent}" stroke-width=".5" opacity=".12"/><line x1="200" y1="0" x2="200" y2="300" stroke="${accent}" stroke-width=".5" opacity=".12"/></svg>`,
    `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="${dark}"/><polygon points="200,40 360,260 40,260" fill="${accent}" opacity=".15"/><polygon points="200,80 320,240 80,240" fill="${accent}" opacity=".08"/></svg>`,
    `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="${dark}"/><path d="M0,200 Q100,100 200,180 Q300,260 400,150 L400,300 L0,300Z" fill="${accent}" opacity=".12"/><path d="M0,230 Q100,150 200,210 Q300,280 400,200 L400,300 L0,300Z" fill="${accent}" opacity=".08"/></svg>`,
    `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="600" fill="${dark}"/>${Array.from({length:8},(_,i)=>`<line x1="${i*55}" y1="0" x2="${i*55+55}" y2="600" stroke="${accent}" stroke-width=".5" opacity=".10"/>`).join('')}<rect x="100" y="200" width="200" height="200" fill="${accent}" opacity=".08" rx="2"/></svg>`,
  ];
  return [0,1,2,3].map(i => {
    const img = images[i];
    const inner = img
      ? `<img src="${img}" alt="Property"/>`
      : `<div class="gallery-placeholder">${patterns[i]}</div>`;
    return `<div class="gallery-cell">${inner}</div>`;
  }).join('');
}

function locationMap(property: PropertyData, colors: { dark: string; accent: string; tint: string }): string {
  const { dark, accent } = colors;
  const area = property.location?.area || '';
  const name = property.name;
  return `<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <rect width="560" height="220" fill="${dark}"/>
    ${Array.from({length:8},(_,i)=>`<line x1="${i*80}" y1="0" x2="${i*80}" y2="220" stroke="${accent}" stroke-width=".3" opacity=".10"/>`).join('')}
    ${Array.from({length:4},(_,i)=>`<line x1="0" y1="${i*73}" x2="560" y2="${i*73}" stroke="${accent}" stroke-width=".3" opacity=".10"/>`).join('')}
    <path d="M0,160 Q80,120 140,135 Q200,150 260,115 Q320,80 400,105 Q460,120 560,95 L560,220 L0,220Z" fill="${accent}" opacity=".08"/>
    <path d="M0,180 Q100,150 180,165 Q260,180 340,152 Q420,124 520,145 L560,150 L560,220 L0,220Z" fill="${accent}" opacity=".12"/>
    <path d="M80,220 Q120,170 200,145 Q280,120 320,100" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,4" opacity=".25"/>
    <path d="M560,120 Q480,125 420,115 Q380,108 320,100" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,4" opacity=".20"/>
    <circle cx="320" cy="100" r="14" fill="${accent}" opacity=".15"/>
    <circle cx="320" cy="100" r="7" fill="${accent}" opacity=".35"/>
    <circle cx="320" cy="100" r="2.5" fill="${accent}" opacity="1"/>
    <line x1="320" y1="86" x2="320" y2="68" stroke="${accent}" stroke-width="1" opacity=".5"/>
    <circle cx="320" cy="64" r="4" fill="${accent}" opacity=".7"/>
    <rect x="246" y="40" width="148" height="20" rx="3" fill="${dark}" opacity=".85"/>
    <text x="320" y="54" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="${accent}" letter-spacing="2" opacity=".90">${e(name.toUpperCase())}</text>
    <text x="320" y="135" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="${accent}" letter-spacing="1.5" opacity=".40">${e(area)}</text>
    <text x="510" y="25" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="${accent}" opacity=".30" letter-spacing="1">N</text>
    <line x1="510" y1="28" x2="510" y2="42" stroke="${accent}" stroke-width="1" opacity=".25"/>
    <polygon points="510,28 507,36 513,36" fill="${accent}" opacity=".25"/>
  </svg>`;
}
