export function getCoverIllustration(type: string, colors: { dark: string; accent: string }): string {
  const d = colors.dark;
  const a = colors.accent;
  switch ((type || '').toLowerCase()) {
    case 'villa':     return villaIllustration(d, a);
    case 'hotel':     return hotelIllustration(d, a);
    case 'eco-lodge':
    case 'ecolodge':  return ecolodgeIllustration(d, a);
    case 'campsite':  return campsiteIllustration(d, a);
    default:          return glampingIllustration(d, a);
  }
}

export function getUnitIcon(unitType: string, colors: { dark: string; accent: string }): string {
  const a = colors.accent;
  const d = colors.dark;
  switch ((unitType || '').toLowerCase()) {
    case 'treehouse': return treeIcon(a, d);
    case 'villa':     return villaIcon(a, d);
    case 'cabin':     return cabinIcon(a, d);
    case 'suite':     return suiteIcon(a, d);
    default:          return tentIcon(a, d);
  }
}

function stars(a: string): string {
  const pts: [number, number, number][] = [
    [80,55,1.8],[150,30,1.2],[230,70,2],[310,25,1.5],[390,50,1],
    [460,30,1.8],[540,65,1.2],[620,20,2],[700,55,1.5],[760,35,1],
    [100,100,1],[270,90,1.5],[430,85,1],[590,95,1.8],[740,80,1.2]
  ];
  const lines = [[0,1],[1,2],[4,5],[5,6],[9,14],[10,11]]
    .map(([i,j]) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${a}" stroke-width="0.4" opacity="0.25"/>`)
    .join('');
  const circles = pts.map(([x,y,r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${a}" opacity="0.65"/>`)
    .join('');
  return circles + lines;
}

function glampingIllustration(d: string, a: string): string {
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    ${stars(a)}
    <path d="M0,320 L120,200 L240,280 L360,160 L480,240 L600,155 L720,220 L800,180 L800,500 L0,500Z" fill="${a}" opacity="0.08"/>
    <path d="M0,360 L100,260 L200,310 L320,220 L440,290 L560,215 L680,275 L800,230 L800,500 L0,500Z" fill="${a}" opacity="0.12"/>
    <polygon points="0,500 0,290 35,195 70,290"     fill="${a}" opacity="0.55"/>
    <polygon points="25,500 55,285 90,175 125,285"  fill="${a}" opacity="0.75"/>
    <polygon points="65,500 100,295 138,180 176,295" fill="${a}" opacity="0.60"/>
    <polygon points="115,500 148,300 183,195 218,300" fill="${a}" opacity="0.70"/>
    <polygon points="0,500 0,295 30,230 60,295"     fill="${d}" opacity="0.35"/>
    <polygon points="45,500 72,300 102,238 132,300" fill="${d}" opacity="0.30"/>
    <polygon points="800,500 800,290 765,195 730,290"  fill="${a}" opacity="0.55"/>
    <polygon points="775,500 745,285 710,175 675,285"  fill="${a}" opacity="0.75"/>
    <polygon points="735,500 700,295 662,180 624,295"  fill="${a}" opacity="0.60"/>
    <polygon points="685,500 652,300 617,195 582,300"  fill="${a}" opacity="0.70"/>
    <polygon points="800,500 800,295 770,230 740,295"  fill="${d}" opacity="0.35"/>
    <polygon points="755,500 728,300 698,238 668,300"  fill="${d}" opacity="0.30"/>
    <polygon points="400,195 268,390 532,390"  fill="${a}" opacity="0.90"/>
    <polygon points="400,195 340,390 460,390"  fill="${d}" opacity="0.25"/>
    <polygon points="400,260 368,390 432,390"  fill="${d}" opacity="0.65"/>
    <line x1="400" y1="195" x2="340" y2="255" stroke="${a}" stroke-width="1" opacity="0.35"/>
    <line x1="400" y1="195" x2="460" y2="255" stroke="${a}" stroke-width="1" opacity="0.35"/>
    <ellipse cx="400" cy="392" rx="52" ry="10" fill="${a}" opacity="0.18"/>
    <line x1="0" y1="392" x2="800" y2="392" stroke="${a}" stroke-width="0.5" opacity="0.2"/>
  </svg>`;
}

function campsiteIllustration(d: string, a: string): string {
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    ${stars(a)}
    <path d="M0,500 L0,280 L200,80 L400,200 L600,60 L800,180 L800,500Z"  fill="${a}" opacity="0.10"/>
    <path d="M0,500 L0,320 L160,150 L350,250 L540,120 L720,230 L800,170 L800,500Z" fill="${a}" opacity="0.15"/>
    <path d="M0,500 L0,370 L140,240 L300,320 L460,220 L640,310 L800,250 L800,500Z" fill="${d}" opacity="0.20"/>
    <polygon points="120,440 140,340 160,440" fill="${a}" opacity="0.65"/>
    <polygon points="150,440 175,320 200,440" fill="${a}" opacity="0.80"/>
    <polygon points="580,440 610,320 640,440" fill="${a}" opacity="0.80"/>
    <polygon points="620,440 648,335 676,440" fill="${a}" opacity="0.65"/>
    <path d="M400,420 C380,390 370,365 390,340 C395,380 400,360 410,340 C415,365 418,390 420,380 C430,360 425,380 430,400 C440,370 435,390 400,420Z" fill="${a}" opacity="0.85"/>
    <ellipse cx="400" cy="422" rx="35" ry="8" fill="${a}" opacity="0.20"/>
  </svg>`;
}

function villaIllustration(d: string, a: string): string {
  const windows = [0,1,2,3,4].map(i => `
    <rect x="${255+i*64}" y="225" width="38" height="50" rx="2" fill="${a}" opacity="0.20"/>
    <line x1="${255+i*64+19}" y1="225" x2="${255+i*64+19}" y2="275" stroke="${a}" stroke-width="0.8" opacity="0.30"/>
    <line x1="${255+i*64}" y1="250" x2="${255+i*64+38}" y2="250" stroke="${a}" stroke-width="0.8" opacity="0.30"/>
  `).join('');
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <line x1="0" y1="360" x2="800" y2="360" stroke="${a}" stroke-width="0.5" opacity="0.25"/>
    <rect x="200" y="370" width="400" height="80" rx="4" fill="${a}" opacity="0.12"/>
    <rect x="220" y="200" width="360" height="160" fill="${a}" opacity="0.08"/>
    <rect x="220" y="200" width="360" height="4" fill="${a}" opacity="0.50"/>
    ${windows}
    <rect x="350" y="300" width="12" height="60" fill="${a}" opacity="0.50"/>
    <rect x="438" y="300" width="12" height="60" fill="${a}" opacity="0.50"/>
    <path d="M350,300 Q400,270 450,300" fill="none" stroke="${a}" stroke-width="2" opacity="0.50"/>
    <rect x="375" y="320" width="50" height="40" rx="2" fill="${a}" opacity="0.30"/>
    <line x1="120" y1="460" x2="120" y2="330" stroke="${a}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>
    <path d="M120,330 C120,290 175,280 170,310" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
    <path d="M120,330 C120,290 65,280 70,310" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
    <line x1="660" y1="460" x2="660" y2="310" stroke="${a}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>
    <path d="M660,310 C660,270 715,260 710,290" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
    <path d="M660,310 C660,270 605,260 610,290" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
  </svg>`;
}

function hotelIllustration(d: string, a: string): string {
  const grid = Array.from({length:6}, (_,row) =>
    Array.from({length:5}, (_,col) => `
      <rect x="${215+col*80}" y="${148+row*44}" width="44" height="32" rx="2" fill="${a}" opacity="0.18"/>
      <line x1="${215+col*80+22}" y1="${148+row*44}" x2="${215+col*80+22}" y2="${148+row*44+32}" stroke="${a}" stroke-width="0.8" opacity="0.25"/>
    `).join('')
  ).join('');
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <rect x="180" y="120" width="440" height="330" fill="${a}" opacity="0.06"/>
    <rect x="180" y="120" width="440" height="6" fill="${a}" opacity="0.55"/>
    <rect x="170" y="126" width="460" height="3" fill="${a}" opacity="0.30"/>
    ${grid}
    <rect x="345" y="380" width="110" height="70" fill="${a}" opacity="0.15"/>
    <path d="M340,380 Q400,345 460,380" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.55"/>
    <rect x="342" y="380" width="10" height="70" fill="${a}" opacity="0.45"/>
    <rect x="448" y="380" width="10" height="70" fill="${a}" opacity="0.45"/>
    <line x1="100" y1="450" x2="700" y2="450" stroke="${a}" stroke-width="0.5" opacity="0.20"/>
  </svg>`;
}

function ecolodgeIllustration(d: string, a: string): string {
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    ${stars(a)}
    <ellipse cx="400" cy="160" rx="320" ry="120" fill="${a}" opacity="0.12"/>
    <ellipse cx="200" cy="180" rx="200" ry="130" fill="${a}" opacity="0.18"/>
    <ellipse cx="600" cy="175" rx="210" ry="135" fill="${a}" opacity="0.18"/>
    <path d="M300,100 Q400,20 500,100 Q400,60 300,100Z" fill="${a}" opacity="0.30"/>
    <path d="M150,130 Q250,50 350,130 Q250,90 150,130Z" fill="${a}" opacity="0.25"/>
    <path d="M450,120 Q550,40 650,120 Q550,80 450,120Z" fill="${a}" opacity="0.25"/>
    <line x1="200" y1="310" x2="200" y2="450" stroke="${a}" stroke-width="12" stroke-linecap="round" opacity="0.50"/>
    <line x1="400" y1="280" x2="400" y2="450" stroke="${a}" stroke-width="14" stroke-linecap="round" opacity="0.50"/>
    <line x1="600" y1="310" x2="600" y2="450" stroke="${a}" stroke-width="12" stroke-linecap="round" opacity="0.50"/>
    <rect x="310" y="340" width="180" height="12" rx="3" fill="${a}" opacity="0.50"/>
    <rect x="330" y="295" width="140" height="50" rx="3" fill="${a}" opacity="0.20"/>
    <path d="M310,295 L400,250 L490,295Z" fill="${a}" opacity="0.45"/>
  </svg>`;
}

function tentIcon(a: string, d: string): string {
  return `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:42px">
    <polygon points="40,5 5,55 75,55" fill="${a}" opacity="0.80"/>
    <polygon points="40,5 27,55 53,55" fill="${d}" opacity="0.20"/>
    <polygon points="40,20 30,55 50,55" fill="${d}" opacity="0.55"/>
  </svg>`;
}

function treeIcon(a: string, d: string): string {
  return `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:49px">
    <line x1="40" y1="65" x2="40" y2="35" stroke="${a}" stroke-width="5" stroke-linecap="round" opacity="0.60"/>
    <ellipse cx="40" cy="25" rx="28" ry="22" fill="${a}" opacity="0.25"/>
    <rect x="22" y="35" width="36" height="14" rx="2" fill="${a}" opacity="0.50"/>
    <path d="M22,35 L40,20 L58,35Z" fill="${a}" opacity="0.55"/>
    <rect x="30" y="40" width="20" height="9" rx="1" fill="${d}" opacity="0.50"/>
  </svg>`;
}

function villaIcon(a: string, d: string): string {
  return `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:42px">
    <rect x="5" y="20" width="70" height="38" fill="${a}" opacity="0.18"/>
    <rect x="5" y="20" width="70" height="4" fill="${a}" opacity="0.60"/>
    ${[0,1,2].map(i=>`<rect x="${14+i*22}" y="28" width="14" height="18" rx="1" fill="${a}" opacity="0.35"/>`).join('')}
    <rect x="30" y="42" width="20" height="16" fill="${a}" opacity="0.30"/>
    <path d="M0,24 L40,6 L80,24Z" fill="${a}" opacity="0.45"/>
  </svg>`;
}

function cabinIcon(a: string, d: string): string {
  return `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:42px">
    <rect x="8" y="30" width="64" height="28" fill="${a}" opacity="0.25"/>
    <path d="M4,32 L40,8 L76,32Z" fill="${a}" opacity="0.55"/>
    <rect x="28" y="40" width="24" height="18" rx="1" fill="${d}" opacity="0.40"/>
    <rect x="12" y="35" width="16" height="12" rx="1" fill="${a}" opacity="0.40"/>
    <rect x="52" y="35" width="16" height="12" rx="1" fill="${a}" opacity="0.40"/>
  </svg>`;
}

function suiteIcon(a: string, d: string): string {
  return `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:42px">
    <rect x="4" y="15" width="72" height="43" fill="${a}" opacity="0.15"/>
    <rect x="4" y="15" width="72" height="4" fill="${a}" opacity="0.55"/>
    ${[0,1,2,3].map(i=>`<rect x="${10+i*17}" y="24" width="11" height="16" rx="1" fill="${a}" opacity="0.28"/>`).join('')}
    <rect x="28" y="42" width="24" height="16" rx="1" fill="${a}" opacity="0.35"/>
  </svg>`;
}
