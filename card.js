// Draws the Claude Design card (Card.dc.html) on a plain page: a tiny stand-in for the design runtime.
// site.py appends EDS (editions), TPL (the card markup), the card's Component class, then calls mount().
class DCLogic {
  constructor(props) { this.props = props; this.state = {}; }
  setState(s) { Object.assign(this.state, s); if (this._update) this._update(); }
}
const SVG = 'http://www.w3.org/2000/svg';
const look = (e, sc) => {
  e = e.trim();
  if (e === 'true' || e === 'false') return e === 'true';
  return e.split('.').reduce((o, k) => (o == null ? o : o[k]), sc);
};
const sub = (s, sc) => {
  const whole = s.match(/^\{\{([^{}]*)\}\}$/);   // one hole only: "{{a}} · {{b}}" is text
  return whole ? look(whole[1], sc) : s.replace(/\{\{(.*?)\}\}/g, (_, e) => look(e, sc) ?? '');
};
function build(n, sc, out) {
  if (n.nodeType === 3) return out.appendChild(document.createTextNode(sub(n.data, sc)));
  if (n.nodeType !== 1) return;
  const tag = n.localName;
  if (tag === 'sc-for') {
    const as = n.getAttribute('as');
    return (sub(n.getAttribute('list'), sc) || []).forEach((it) => n.childNodes.forEach((c) => build(c, { ...sc, [as]: it }, out)));
  }
  if (tag === 'sc-if') return sub(n.getAttribute('value'), sc) && n.childNodes.forEach((c) => build(c, sc, out));
  const el = n.namespaceURI === SVG ? document.createElementNS(SVG, tag) : document.createElement(tag);
  for (const a of n.attributes) {
    const v = sub(a.value, sc);
    if (a.name.startsWith('on')) el.addEventListener(a.name.slice(2), v);
    else el.setAttribute(a.name, v);
  }
  n.childNodes.forEach((c) => build(c, sc, el));
  out.appendChild(el);
}
function mount() {
  const host = document.getElementById('card');
  const c = new Component({ edition: window.EDITION, member: window.MEMBER, animate: true, delay: 0 });
  c.state.data = EDS;
  const t = document.createElement('template');
  t.innerHTML = TPL;
  t.content.childNodes.forEach((n) => build(n, c.renderVals(), host));
  // only the tilt changes while the card moves, so patch just that element
  const tilt = host.querySelector('.tilt');
  c._update = () => {
    const v = c.renderVals();
    tilt.className = v.tiltClass;
    tilt.setAttribute('style', v.tiltStyle);
  };
  // phones resize the window as the address bar slides; only refit when the width really changes
  let w = 0;
  const fit = () => {
    if (innerWidth === w) return;
    w = innerWidth;
    host.style.setProperty('--s', Math.min(1, (innerWidth - 32) / 480, (innerHeight - 96) / 672));
  };
  fit();
  addEventListener('resize', fit);
  // fade in once the fonts and avatar are ready, so nothing pops or swaps in view
  const img = host.querySelector('img');
  const avatar = img && !img.complete ? new Promise((r) => { img.onload = img.onerror = r; }) : null;
  const ready = Promise.all([document.fonts.ready, avatar]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => document.body.classList.add('ready'));
}

const EDS = {
 "ivory": {
  "label": "Ivory",
  "edition": "IVORY",
  "bg": "#f6f1e6",
  "ink": "#2a2723",
  "sub": "#5d564c",
  "accent": "#2a2723",
  "faint": "rgba(42,39,35,.45)",
  "fill": "#ddd4c1",
  "initial": "#3a352e",
  "shape": "square",
  "corner": "none",
  "name": "pewter",
  "under": [
   "u-paper"
  ],
  "foil": {
   "kind": "none"
  },
  "glare": 0.35,
  "light": true,
  "drop": "common",
  "texture": "paper"
 },
 "sapphire": {
  "label": "Sapphire",
  "edition": "SAPPHIRE",
  "bg": "radial-gradient(circle at 50% 30%,#1a3466 0%,#0c1834 50%,#060c1c 100%)",
  "ink": "#e8eefb",
  "sub": "#a2b3d4",
  "accent": "#c4cfe2",
  "faint": "rgba(184,196,218,.35)",
  "fill": "radial-gradient(circle at 45% 35%,#2a4c8f,#0f1f45)",
  "initial": "#dbe6fb",
  "shape": "circle",
  "corner": "star",
  "name": "silver",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-cosmos",
   "op": 0.85,
   "blend": "color-dodge",
   "scope": "portrait"
  },
  "glare": 0.55,
  "light": false,
  "drop": "rare"
 },
 "amethyst": {
  "label": "Amethyst",
  "edition": "AMETHYST",
  "bg": "linear-gradient(170deg,#2b1342 0%,#160924 58%,#0c0516 100%)",
  "ink": "#efe4ff",
  "sub": "#b9a0e6",
  "accent": "#b48cff",
  "faint": "rgba(200,170,255,.4)",
  "fill": "radial-gradient(circle at 50% 35%,#4a2380,#1e0d36)",
  "initial": "#d9c2ff",
  "shape": "arch",
  "corner": "deco",
  "name": "prism",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-lines",
   "op": 0.75,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.55,
  "light": false,
  "drop": "epic"
 },
 "aurum": {
  "label": "Aurum",
  "edition": "AURUM",
  "bg": "radial-gradient(circle at 50% 33%,#3b2b0d 0%,#171106 52%,#080603 100%)",
  "ink": "#f7ecd0",
  "sub": "#c3a565",
  "accent": "#d8ab48",
  "faint": "rgba(233,196,106,.5)",
  "fill": "radial-gradient(circle at 40% 35%,#3a2c12,#1a1307)",
  "initial": "#e3bd63",
  "shape": "circle",
  "corner": "fil",
  "name": "gold",
  "under": [
   "u-rays"
  ],
  "foil": {
   "kind": "gold",
   "mask": "m-etch",
   "op": 0.9,
   "blend": "overlay",
   "scope": "card"
  },
  "glare": 0.6,
  "light": false,
  "drop": "legendary"
 },
 "pearl": {
  "label": "Pearl",
  "edition": "PEARL",
  "bg": "radial-gradient(circle at 50% 30%,#ffffff 0%,#f1eef4 55%,#e2dfe8 100%)",
  "ink": "#2c2a33",
  "sub": "#615d6e",
  "accent": "#9aa3b5",
  "faint": "rgba(154,163,181,.45)",
  "fill": "radial-gradient(circle at 45% 35%,#ffffff,#e4e0ea)",
  "initial": "#5b5769",
  "shape": "circle",
  "corner": "star",
  "name": "pewter",
  "under": [],
  "foil": {
   "kind": "pastel",
   "mask": "none",
   "op": 0.55,
   "blend": "soft-light",
   "scope": "card"
  },
  "glare": 0.45,
  "light": true,
  "drop": "common"
 },
 "obsidian": {
  "label": "Obsidian",
  "edition": "OBSIDIAN",
  "bg": "linear-gradient(160deg,#1b1c22 0%,#0b0b0f 60%,#050507 100%)",
  "ink": "#eceef3",
  "sub": "#a3a8b6",
  "accent": "#c3c9d6",
  "faint": "rgba(195,201,214,.3)",
  "fill": "linear-gradient(160deg,#2a2c35,#121318)",
  "initial": "#d9dde6",
  "shape": "hex",
  "corner": "bracket",
  "name": "chrome",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.35,
   "blend": "screen",
   "scope": "card"
  },
  "glare": 0.7,
  "light": false,
  "drop": "rare"
 },
 "jade": {
  "label": "Jade",
  "edition": "JADE",
  "bg": "radial-gradient(circle at 50% 30%,#1e5a47 0%,#0f3529 55%,#08201a 100%)",
  "ink": "#f1ead2",
  "sub": "#cdbb84",
  "accent": "#d4b25c",
  "faint": "rgba(212,178,92,.4)",
  "fill": "radial-gradient(circle at 45% 35%,#2b7259,#123d30)",
  "initial": "#ead79a",
  "shape": "arch",
  "corner": "leaf",
  "name": "gold",
  "under": [
   "u-flecks"
  ],
  "foil": {
   "kind": "gold",
   "mask": "m-glitter",
   "op": 0.8,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.5,
  "light": false,
  "drop": "rare"
 },
 "rosegold": {
  "label": "Rose Gold",
  "edition": "ROSE GOLD",
  "bg": "linear-gradient(165deg,#fbefeb 0%,#f3dcd5 60%,#ead0c8 100%)",
  "ink": "#4a2f2b",
  "sub": "#86574f",
  "accent": "#c08476",
  "faint": "rgba(192,132,118,.45)",
  "fill": "linear-gradient(160deg,#f6e2dc,#e7c4ba)",
  "initial": "#8f5a50",
  "shape": "square",
  "corner": "bracket",
  "name": "rose",
  "under": [],
  "foil": {
   "kind": "rose",
   "mask": "none",
   "op": 0.5,
   "blend": "soft-light",
   "scope": "card"
  },
  "glare": 0.45,
  "light": true,
  "drop": "common"
 },
 "aurora": {
  "label": "Aurora",
  "edition": "AURORA",
  "bg": "linear-gradient(170deg,#0b2a33 0%,#071a22 55%,#040e13 100%)",
  "ink": "#e6fbf6",
  "sub": "#8fd3c6",
  "accent": "#7fe0cc",
  "faint": "rgba(127,224,204,.35)",
  "fill": "radial-gradient(circle at 50% 40%,#123d48,#06161c)",
  "initial": "#bdf3e7",
  "shape": "diamond",
  "corner": "star",
  "name": "aurora",
  "under": [
   "u-aurora"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-glitter",
   "op": 0.6,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.5,
  "light": false,
  "drop": "epic"
 },
 "frost": {
  "label": "Frost",
  "edition": "FROST",
  "bg": "linear-gradient(170deg,#f2f9ff 0%,#dcecf9 55%,#c8def2 100%)",
  "ink": "#1d3550",
  "sub": "#4a6d8f",
  "accent": "#7fa6c8",
  "faint": "rgba(127,166,200,.45)",
  "fill": "linear-gradient(160deg,#eaf5ff,#c4dcf1)",
  "initial": "#3c6286",
  "shape": "hex",
  "corner": "star",
  "name": "ice",
  "under": [
   "u-ice"
  ],
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.7,
   "blend": "multiply",
   "scope": "card"
  },
  "glare": 0.5,
  "light": true,
  "drop": "common",
  "texture": "glass"
 },
 "ember": {
  "label": "Ember",
  "edition": "EMBER",
  "bg": "linear-gradient(175deg,#26201d 0%,#16110f 60%,#0c0807 100%)",
  "ink": "#f7e7da",
  "sub": "#d39a6d",
  "accent": "#c97a45",
  "faint": "rgba(201,122,69,.38)",
  "fill": "radial-gradient(circle at 50% 40%,#3a2a22,#140d0a)",
  "initial": "#f0b07c",
  "shape": "square",
  "corner": "bracket",
  "name": "copper",
  "under": [
   "u-ember"
  ],
  "foil": {
   "kind": "copper",
   "mask": "m-etch",
   "op": 0.85,
   "blend": "overlay",
   "scope": "card"
  },
  "glare": 0.5,
  "light": false,
  "drop": "rare"
 },
 "sakura": {
  "label": "Sakura",
  "edition": "SAKURA",
  "bg": "linear-gradient(170deg,#fff8f3 0%,#fbeae8 60%,#f6dfe1 100%)",
  "ink": "#4a2533",
  "sub": "#8e4a62",
  "accent": "#d87f9e",
  "faint": "rgba(216,127,158,.42)",
  "fill": "radial-gradient(circle at 45% 35%,#fff3f5,#f3d3dc)",
  "initial": "#9a3d60",
  "shape": "circle",
  "corner": "petal",
  "name": "sakura",
  "under": [
   "u-petals"
  ],
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.6,
   "blend": "multiply",
   "scope": "card"
  },
  "glare": 0.4,
  "light": true,
  "drop": "common",
  "texture": "paper"
 },
 "nebula": {
  "label": "Nebula",
  "edition": "NEBULA",
  "bg": "radial-gradient(circle at 50% 35%,#24124a 0%,#120827 55%,#07030f 100%)",
  "ink": "#efe6ff",
  "sub": "#b89be8",
  "accent": "#a98bff",
  "faint": "rgba(169,139,255,.35)",
  "fill": "radial-gradient(circle at 50% 40%,#2f1a63,#0d0620)",
  "initial": "#e2d2ff",
  "shape": "circle",
  "corner": "star",
  "name": "nebula",
  "under": [
   "u-nebula",
   "u-stars"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-cosmos",
   "op": 0.7,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.5,
  "light": false,
  "drop": "legendary"
 },
 "noir": {
  "label": "Noir Deco",
  "edition": "NOIR DECO",
  "bg": "linear-gradient(170deg,#18181b 0%,#0d0d10 60%,#060608 100%)",
  "ink": "#f2f3f6",
  "sub": "#b4b8c4",
  "accent": "#c9ced8",
  "faint": "rgba(201,206,216,.32)",
  "fill": "linear-gradient(170deg,#25262c,#0e0e12)",
  "initial": "#e7e9ef",
  "shape": "arch",
  "corner": "deco",
  "name": "chrome",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.6,
   "blend": "screen",
   "scope": "card"
  },
  "glare": 0.65,
  "light": false,
  "drop": "epic"
 },
 "crest": {
  "label": "Emerald Crest",
  "edition": "EMERALD CREST",
  "bg": "radial-gradient(circle at 50% 30%,#0f5a3c 0%,#073826 55%,#032016 100%)",
  "ink": "#f4ecd2",
  "sub": "#d9c07a",
  "accent": "#d8b45a",
  "faint": "rgba(216,180,90,.4)",
  "fill": "radial-gradient(circle at 50% 35%,#13724c,#04281a)",
  "initial": "#efd78f",
  "shape": "shield",
  "corner": "fil",
  "name": "gold",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "gold",
   "mask": "m-etch",
   "op": 0.85,
   "blend": "overlay",
   "scope": "card"
  },
  "glare": 0.55,
  "light": false,
  "drop": "epic"
 },
 "prism": {
  "label": "Prism",
  "edition": "PRISM",
  "bg": "linear-gradient(170deg,#ffffff 0%,#f4f4f7 100%)",
  "ink": "#1f1d2b",
  "sub": "#4f4b63",
  "accent": "#8a86a6",
  "faint": "rgba(138,134,166,.4)",
  "fill": "linear-gradient(160deg,#ffffff,#eceaf3)",
  "initial": "#3f3a58",
  "shape": "diamond",
  "corner": "star",
  "name": "prism-dark",
  "under": [],
  "foil": {
   "kind": "pastel",
   "mask": "none",
   "op": 0.75,
   "blend": "multiply",
   "scope": "card"
  },
  "glare": 0.45,
  "light": true,
  "drop": "legendary"
 },
 "matcha": {
  "label": "Matcha",
  "bg": "linear-gradient(170deg,#f6f8ee 0%,#e6eed6 60%,#dbe6c8 100%)",
  "ink": "#2f3d22",
  "sub": "#5f7346",
  "accent": "#8aa560",
  "faint": "rgba(138,165,96,.42)",
  "fill": "radial-gradient(circle at 45% 35%,#f4f8ea,#d9e5c2)",
  "initial": "#4f6a2e",
  "shape": "arch",
  "corner": "leaf",
  "name": "pewter",
  "under": [
   "u-paper"
  ],
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.45,
   "blend": "multiply",
   "scope": "card"
  },
  "glare": 0.4,
  "light": true,
  "drop": "common",
  "edition": "MATCHA",
  "texture": "paper"
 },
 "coral": {
  "label": "Coral",
  "bg": "linear-gradient(165deg,#fff6f0 0%,#fde3d6 60%,#f9d2c2 100%)",
  "ink": "#4d2a20",
  "sub": "#a3594a",
  "accent": "#e58a6f",
  "faint": "rgba(229,138,111,.42)",
  "fill": "radial-gradient(circle at 45% 35%,#fff1ea,#f6cdbd)",
  "initial": "#b5533c",
  "shape": "circle",
  "corner": "petal",
  "name": "rose",
  "under": [],
  "foil": {
   "kind": "rose",
   "mask": "none",
   "op": 0.5,
   "blend": "soft-light",
   "scope": "card"
  },
  "glare": 0.45,
  "light": true,
  "drop": "common",
  "edition": "CORAL"
 },
 "lavender": {
  "label": "Lavender",
  "bg": "linear-gradient(170deg,#faf7ff 0%,#efe8fb 60%,#e3d9f6 100%)",
  "ink": "#33264d",
  "sub": "#6f5a99",
  "accent": "#a48ad6",
  "faint": "rgba(164,138,214,.42)",
  "fill": "radial-gradient(circle at 45% 35%,#f7f2ff,#ddd0f3)",
  "initial": "#5f4594",
  "shape": "hex",
  "corner": "star",
  "name": "prism-dark",
  "under": [],
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.55,
   "blend": "multiply",
   "scope": "card"
  },
  "glare": 0.45,
  "light": true,
  "drop": "common",
  "edition": "LAVENDER"
 },
 "washi": {
  "label": "Washi",
  "bg": "linear-gradient(175deg,#f7f1e3 0%,#f1e9d8 60%,#efe6d2 100%)",
  "ink": "#1c1a17",
  "sub": "#6b6152",
  "accent": "#b23a2e",
  "faint": "rgba(28,26,23,.25)",
  "fill": "radial-gradient(circle at 45% 35%,#f8f2e4,#e7dcc4)",
  "initial": "#b23a2e",
  "shape": "square",
  "corner": "bracket",
  "name": "pewter",
  "under": [
   "u-paper"
  ],
  "foil": {
   "kind": "none"
  },
  "glare": 0.3,
  "light": true,
  "drop": "common",
  "edition": "WASHI",
  "texture": "paper"
 },
 "crimson": {
  "label": "Crimson",
  "bg": "radial-gradient(circle at 50% 30%,#5a0f1c 0%,#2e0710 55%,#14030a 100%)",
  "ink": "#fbe9e4",
  "sub": "#d9a28f",
  "accent": "#d8ab48",
  "faint": "rgba(216,171,72,.4)",
  "fill": "radial-gradient(circle at 45% 35%,#6b1424,#2a0610)",
  "initial": "#f0c97a",
  "shape": "shield",
  "corner": "deco",
  "name": "gold",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "gold",
   "mask": "m-etch",
   "op": 0.7,
   "blend": "overlay",
   "scope": "card"
  },
  "glare": 0.55,
  "light": false,
  "drop": "rare",
  "edition": "CRIMSON"
 },
 "storm": {
  "label": "Storm",
  "bg": "linear-gradient(170deg,#2a3340 0%,#161c25 60%,#0b0f15 100%)",
  "ink": "#e9eef5",
  "sub": "#9aa7b8",
  "accent": "#b7c3d4",
  "faint": "rgba(183,195,212,.32)",
  "fill": "radial-gradient(circle at 45% 35%,#36414f,#141a22)",
  "initial": "#dde5ef",
  "shape": "diamond",
  "corner": "bracket",
  "name": "silver",
  "under": [
   "u-ice"
  ],
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.45,
   "blend": "screen",
   "scope": "card"
  },
  "glare": 0.65,
  "light": false,
  "drop": "rare",
  "edition": "STORM"
 },
 "glacier": {
  "label": "Glacier",
  "bg": "linear-gradient(170deg,#0e3b44 0%,#082831 60%,#04161c 100%)",
  "ink": "#e6fbff",
  "sub": "#8fd1dc",
  "accent": "#7fd8e6",
  "faint": "rgba(127,216,230,.35)",
  "fill": "radial-gradient(circle at 45% 35%,#145360,#06222a)",
  "initial": "#c8f4fb",
  "shape": "hex",
  "corner": "star",
  "name": "silver",
  "under": [
   "u-ice"
  ],
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.55,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.55,
  "light": false,
  "drop": "rare",
  "edition": "GLACIER",
  "texture": "glass"
 },
 "royal": {
  "label": "Royal",
  "bg": "radial-gradient(circle at 50% 30%,#1c2a5c 0%,#0e1636 55%,#060a1c 100%)",
  "ink": "#f3ecd8",
  "sub": "#c9b37a",
  "accent": "#d4af5a",
  "faint": "rgba(212,175,90,.4)",
  "fill": "radial-gradient(circle at 45% 35%,#22336b,#0b1230)",
  "initial": "#e8c879",
  "shape": "shield",
  "corner": "fil",
  "name": "gold",
  "under": [
   "u-velvet"
  ],
  "foil": {
   "kind": "gold",
   "mask": "m-lines",
   "op": 0.6,
   "blend": "overlay",
   "scope": "card"
  },
  "glare": 0.55,
  "light": false,
  "drop": "rare",
  "edition": "ROYAL"
 },
 "twilight": {
  "label": "Twilight",
  "bg": "linear-gradient(175deg,#2b1a4f 0%,#5a2a5e 45%,#b0533f 100%)",
  "ink": "#fff1e6",
  "sub": "#f2b8a0",
  "accent": "#ffb38a",
  "faint": "rgba(255,179,138,.38)",
  "fill": "radial-gradient(circle at 45% 35%,#4a2560,#1d1033)",
  "initial": "#ffd2b8",
  "shape": "arch",
  "corner": "star",
  "name": "prism",
  "under": [
   "u-stars"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-glitter",
   "op": 0.6,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.55,
  "light": false,
  "drop": "epic",
  "edition": "TWILIGHT"
 },
 "solar": {
  "label": "Solar",
  "bg": "radial-gradient(circle at 50% 33%,#ffb347 0%,#e0652b 55%,#5c1a0e 100%)",
  "ink": "#fff6e3",
  "sub": "#ffe2b8",
  "accent": "#ffe0a3",
  "faint": "rgba(255,224,163,.45)",
  "fill": "radial-gradient(circle at 45% 35%,#ffcf7a,#d9622a)",
  "initial": "#7a2a10",
  "shape": "circle",
  "corner": "fil",
  "name": "sunfire",
  "under": [
   "u-rays",
   "u-flecks"
  ],
  "foil": {
   "kind": "gold",
   "mask": "m-etch",
   "op": 0.7,
   "blend": "overlay",
   "scope": "card"
  },
  "glare": 0.6,
  "light": false,
  "drop": "epic",
  "edition": "SOLAR"
 },
 "chrome": {
  "label": "Chrome",
  "bg": "linear-gradient(160deg,#e9edf2 0%,#aeb6c2 35%,#f5f7fa 55%,#8d97a5 100%)",
  "ink": "#1b2028",
  "sub": "#4b5563",
  "accent": "#6b7686",
  "faint": "rgba(40,48,60,.3)",
  "fill": "radial-gradient(circle at 45% 35%,#ffffff,#c3cad4)",
  "initial": "#2b323d",
  "shape": "hex",
  "corner": "bracket",
  "name": "pewter",
  "under": [],
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.7,
   "blend": "soft-light",
   "scope": "card"
  },
  "glare": 0.7,
  "light": true,
  "drop": "epic",
  "edition": "CHROME"
 },
 "abyss": {
  "label": "Abyss",
  "bg": "radial-gradient(circle at 50% 30%,#0b3a5c 0%,#061d33 55%,#020a14 100%)",
  "ink": "#e3f4ff",
  "sub": "#7fb8db",
  "accent": "#5cc8ff",
  "faint": "rgba(92,200,255,.32)",
  "fill": "radial-gradient(circle at 45% 35%,#0f4a73,#04182b)",
  "initial": "#bfe8ff",
  "shape": "diamond",
  "corner": "star",
  "name": "aurora",
  "under": [
   "u-aurora",
   "u-stars"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-cosmos",
   "op": 0.55,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.5,
  "light": false,
  "drop": "epic",
  "edition": "ABYSS"
 },
 "opal": {
  "label": "Opal",
  "bg": "linear-gradient(160deg,#ffffff 0%,#f3f0fb 50%,#eaf4f6 100%)",
  "ink": "#2b2840",
  "sub": "#6c6890",
  "accent": "#b9a6e6",
  "faint": "rgba(150,140,200,.35)",
  "fill": "radial-gradient(circle at 45% 35%,#ffffff,#e4def5)",
  "initial": "#5b4f8f",
  "shape": "circle",
  "corner": "star",
  "name": "prism-dark",
  "under": [],
  "foil": {
   "kind": "pastel",
   "mask": "m-cosmos",
   "op": 0.8,
   "blend": "multiply",
   "scope": "card"
  },
  "glare": 0.5,
  "light": true,
  "drop": "legendary",
  "edition": "OPAL",
  "texture": "glass"
 },
 "lunar": {
  "label": "Lunar",
  "bg": "radial-gradient(circle at 50% 32%,#2b3142 0%,#141824 55%,#07090f 100%)",
  "ink": "#f1f3f8",
  "sub": "#a9b1c4",
  "accent": "#d9dee8",
  "faint": "rgba(217,222,232,.3)",
  "fill": "radial-gradient(circle at 38% 32%,#f4f6fa 0%,#c9ced8 45%,#8c93a3 100%)",
  "initial": "#3a4152",
  "shape": "circle",
  "corner": "star",
  "name": "silver",
  "under": [
   "u-stars",
   "u-velvet"
  ],
  "foil": {
   "kind": "silver",
   "mask": "m-glitter",
   "op": 0.55,
   "blend": "screen",
   "scope": "card"
  },
  "glare": 0.6,
  "light": false,
  "drop": "legendary",
  "edition": "LUNAR"
 },
 "celestial": {
  "label": "Celestial",
  "bg": "radial-gradient(circle at 50% 35%,#120a2a 0%,#070414 55%,#000000 100%)",
  "ink": "#ffffff",
  "sub": "#c8b8ff",
  "accent": "#e6d7ff",
  "faint": "rgba(230,215,255,.35)",
  "fill": "radial-gradient(circle at 50% 40%,#1e1145,#05020f)",
  "initial": "#ffffff",
  "shape": "diamond",
  "corner": "star",
  "name": "prism",
  "under": [
   "u-nebula",
   "u-stars",
   "u-aurora"
  ],
  "foil": {
   "kind": "rainbow",
   "mask": "m-cosmos",
   "op": 0.9,
   "blend": "color-dodge",
   "scope": "card"
  },
  "glare": 0.65,
  "light": false,
  "drop": "mythic",
  "edition": "CELESTIAL"
 },
 "fullart": {
  "label": "Full Art",
  "edition": "FULL ART",
  "layout": "fullart",
  "drop": "epic",
  "bg": "#111114",
  "ink": "#ffffff",
  "sub": "#dddddd",
  "accent": "#e9c46a",
  "faint": "rgba(255,255,255,.3)",
  "fill": "radial-gradient(circle at 45% 35%,#2a2a33,#0d0d10)",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "prism",
  "under": [],
  "glare": 0.6,
  "light": false,
  "foil": {
   "kind": "rainbow",
   "mask": "m-lines",
   "op": 0.45,
   "blend": "color-dodge",
   "scope": "card"
  }
 },
 "gilded": {
  "label": "Gilded Art",
  "edition": "GILDED ART",
  "layout": "fullart",
  "drop": "legendary",
  "bg": "#111114",
  "ink": "#fff8e6",
  "sub": "#f1d9a0",
  "accent": "#d8ab48",
  "faint": "rgba(255,240,200,.3)",
  "fill": "radial-gradient(circle at 45% 35%,#3a2c12,#120d05)",
  "initial": "#fff8e6",
  "shape": "circle",
  "corner": "none",
  "name": "gold",
  "under": [],
  "glare": 0.65,
  "light": false,
  "foil": {
   "kind": "gold",
   "mask": "m-etch",
   "op": 0.75,
   "blend": "overlay",
   "scope": "card"
  }
 },
 "arcade": {
  "label": "Arcade",
  "edition": "ARCADE",
  "layout": "pixel",
  "drop": "rare",
  "bg": "#1a1c2c",
  "ink": "#f4f4f4",
  "sub": "#29adff",
  "accent": "#ff004d",
  "faint": "rgba(244,244,244,.35)",
  "fill": "#2b2f4a",
  "initial": "#f4f4f4",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "gameboy": {
  "label": "Game Boy",
  "edition": "GAME BOY",
  "layout": "pixel",
  "drop": "common",
  "bg": "#9bbc0f",
  "ink": "#0f380f",
  "sub": "#306230",
  "accent": "#306230",
  "faint": "rgba(15,56,15,.35)",
  "fill": "#8bac0f",
  "initial": "#0f380f",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.3,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "outrun": {
  "label": "Outrun",
  "edition": "OUTRUN",
  "layout": "synth",
  "drop": "epic",
  "bg": "linear-gradient(180deg,#140630 0%,#3a0d5c 36%,#ff3cac 50%,#0d0221 50.2%)",
  "ink": "#ffffff",
  "sub": "#4dfff3",
  "accent": "#ff3cac",
  "faint": "rgba(77,255,243,.35)",
  "fill": "#0d0221",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.5,
  "light": false,
  "foil": {
   "kind": "rainbow",
   "mask": "m-lines",
   "op": 0.3,
   "blend": "color-dodge",
   "scope": "card"
  }
 },
 "terminal": {
  "label": "Terminal",
  "edition": "TERMINAL",
  "layout": "term",
  "drop": "rare",
  "bg": "radial-gradient(ellipse at 50% 45%,#0b1a0e 0%,#050a06 100%)",
  "ink": "#4dff7a",
  "sub": "#1fa046",
  "accent": "rgba(77,255,122,.6)",
  "faint": "rgba(77,255,122,.3)",
  "fill": "#06100a",
  "initial": "#4dff7a",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.3,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "amber": {
  "label": "Amber",
  "edition": "AMBER",
  "layout": "term",
  "drop": "common",
  "bg": "radial-gradient(ellipse at 50% 45%,#1c1204 0%,#0b0702 100%)",
  "ink": "#ffb000",
  "sub": "#b87a00",
  "accent": "rgba(255,176,0,.6)",
  "faint": "rgba(255,176,0,.3)",
  "fill": "#120b02",
  "initial": "#ffb000",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.3,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "manga": {
  "label": "Manga",
  "edition": "MANGA",
  "layout": "manga",
  "drop": "epic",
  "bg": "#f7f4ec",
  "ink": "#111111",
  "sub": "#444444",
  "accent": "#e63946",
  "faint": "rgba(0,0,0,.2)",
  "fill": "#fbf9f2",
  "initial": "#111111",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "silver",
   "mask": "m-glitter",
   "op": 0.5,
   "blend": "multiply",
   "scope": "card"
  }
 },
 "shojo": {
  "label": "Shōjo",
  "edition": "SHŌJO",
  "layout": "manga",
  "drop": "rare",
  "bg": "#fff5f9",
  "ink": "#111111",
  "sub": "#444444",
  "accent": "#ff5fa2",
  "faint": "rgba(0,0,0,.2)",
  "fill": "#fff8fb",
  "initial": "#111111",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.6,
   "blend": "multiply",
   "scope": "card"
  }
 },
 "blueprint": {
  "label": "Blueprint",
  "edition": "BLUEPRINT",
  "layout": "blueprint",
  "drop": "rare",
  "bg": "linear-gradient(170deg,#1f5394 0%,#173f74 60%,#12335e 100%)",
  "ink": "#eaf3ff",
  "sub": "#9cc3ef",
  "accent": "#ffffff",
  "faint": "rgba(234,243,255,.35)",
  "fill": "#1b4a80",
  "initial": "#eaf3ff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.4,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "swiss": {
  "label": "Swiss",
  "edition": "SWISS",
  "layout": "swiss",
  "drop": "common",
  "bg": "#f2efe8",
  "ink": "#111111",
  "sub": "#555555",
  "accent": "#e63022",
  "faint": "rgba(0,0,0,.18)",
  "fill": "#f2efe8",
  "initial": "#111111",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "klein": {
  "label": "Klein",
  "edition": "KLEIN",
  "layout": "swiss",
  "drop": "rare",
  "bg": "#f2efe8",
  "ink": "#111111",
  "sub": "#555555",
  "accent": "#002fa7",
  "faint": "rgba(0,0,0,.18)",
  "fill": "#f2efe8",
  "initial": "#111111",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "polaroid": {
  "label": "Polaroid",
  "edition": "POLAROID",
  "layout": "polaroid",
  "drop": "common",
  "bg": "linear-gradient(160deg,#dcc7a6 0%,#cdb38c 60%,#c2a57b 100%)",
  "ink": "#2b2620",
  "sub": "#6b5a45",
  "accent": "#f6dd6b",
  "faint": "rgba(43,38,32,.25)",
  "fill": "#fffdf6",
  "initial": "#2b2620",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [
   "u-paper"
  ],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "tarot": {
  "label": "Tarot",
  "edition": "TAROT",
  "layout": "tarot",
  "drop": "epic",
  "bg": "radial-gradient(circle at 50% 30%,#1b2140 0%,#0e1228 55%,#070914 100%)",
  "ink": "#f3e9cf",
  "sub": "#c7b07a",
  "accent": "#d8b25a",
  "faint": "rgba(216,178,90,.4)",
  "fill": "radial-gradient(circle at 45% 35%,#232a52,#0c0f22)",
  "initial": "#f3e9cf",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.55,
  "light": false,
  "foil": {
   "kind": "gold",
   "mask": "m-etch",
   "op": 0.6,
   "blend": "overlay",
   "scope": "card"
  }
 },
 "vinyl": {
  "label": "Vinyl",
  "edition": "VINYL",
  "layout": "vinyl",
  "drop": "rare",
  "bg": "#f1ece2",
  "ink": "#1b1b1b",
  "sub": "#6b6358",
  "accent": "#ff6b35",
  "faint": "rgba(0,0,0,.15)",
  "fill": "#f6f1e7",
  "initial": "#1b1b1b",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "bluenote": {
  "label": "Blue Note",
  "edition": "BLUE NOTE",
  "layout": "vinyl",
  "drop": "common",
  "bg": "#eef0f2",
  "ink": "#1b1b1b",
  "sub": "#5d6670",
  "accent": "#1f4e8c",
  "faint": "rgba(0,0,0,.15)",
  "fill": "#f4f6f8",
  "initial": "#1b1b1b",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "receipt": {
  "label": "Receipt",
  "edition": "RECEIPT",
  "layout": "receipt",
  "drop": "common",
  "bg": "linear-gradient(160deg,#3a3f47 0%,#2b2f36 60%,#23262c 100%)",
  "ink": "#1b1b1b",
  "sub": "#444444",
  "accent": "#1b1b1b",
  "faint": "rgba(255,255,255,.2)",
  "fill": "#fbfaf6",
  "initial": "#1b1b1b",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "wanted": {
  "label": "Wanted",
  "edition": "WANTED",
  "layout": "wanted",
  "drop": "rare",
  "bg": "radial-gradient(ellipse at 50% 40%,#f1e2bb 0%,#e3cc97 60%,#cfb27a 100%)",
  "ink": "#3b2a1a",
  "sub": "#6b4f30",
  "accent": "#8b2b1a",
  "faint": "rgba(59,42,26,.3)",
  "fill": "#ead8ad",
  "initial": "#3b2a1a",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "passport": {
  "label": "Passport",
  "edition": "PASSPORT",
  "layout": "passport",
  "drop": "rare",
  "bg": "linear-gradient(165deg,#eef3f0 0%,#e2ebe6 60%,#d6e2dc 100%)",
  "ink": "#1f2a2e",
  "sub": "#5b6e72",
  "accent": "#7a1f2b",
  "faint": "rgba(31,42,46,.12)",
  "fill": "#dfe8e4",
  "initial": "#1f2a2e",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.4,
  "light": true,
  "foil": {
   "kind": "pastel",
   "mask": "m-cosmos",
   "op": 0.45,
   "blend": "multiply",
   "scope": "card"
  }
 },
 "neon": {
  "label": "Neon",
  "edition": "NEON",
  "layout": "neon",
  "drop": "epic",
  "bg": "linear-gradient(170deg,#2a1218 0%,#1a0b10 60%,#0f0609 100%)",
  "ink": "#ffffff",
  "sub": "#ff9bd2",
  "accent": "#ff2fa0",
  "faint": "rgba(255,47,160,.22)",
  "fill": "#000000",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.45,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "neonblue": {
  "label": "Neon Blue",
  "edition": "NEON BLUE",
  "layout": "neon",
  "drop": "rare",
  "bg": "linear-gradient(170deg,#101a2a 0%,#0a1120 60%,#060a14 100%)",
  "ink": "#ffffff",
  "sub": "#8ff3ff",
  "accent": "#19d3ff",
  "faint": "rgba(25,211,255,.22)",
  "fill": "#000000",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.45,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "glass": {
  "label": "Stained Glass",
  "edition": "STAINED GLASS",
  "layout": "glass",
  "drop": "legendary",
  "bg": "#120d0a",
  "ink": "#f6ead2",
  "sub": "#d8b679",
  "accent": "#d8a73c",
  "faint": "rgba(216,167,60,.35)",
  "fill": "#2a1c12",
  "initial": "#f6ead2",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.6,
  "light": false,
  "foil": {
   "kind": "gold",
   "mask": "m-glitter",
   "op": 0.35,
   "blend": "screen",
   "scope": "card"
  }
 },
 "cyber": {
  "label": "Cyber",
  "edition": "CYBER",
  "layout": "cyber",
  "drop": "epic",
  "bg": "linear-gradient(170deg,#0a0b10 0%,#08090d 60%,#050608 100%)",
  "ink": "#f2f2f2",
  "sub": "#00f0ff",
  "accent": "#fcee0a",
  "faint": "rgba(0,240,255,.35)",
  "fill": "#000000",
  "initial": "#f2f2f2",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.45,
  "light": false,
  "foil": {
   "kind": "rainbow",
   "mask": "m-lines",
   "op": 0.25,
   "blend": "color-dodge",
   "scope": "card"
  }
 },
 "sunny": {
  "label": "Sunny",
  "edition": "SUNNY",
  "layout": "weather",
  "drop": "common",
  "bg": "linear-gradient(180deg,#2f80d8 0%,#5aa6ec 55%,#8cc7f5 100%)",
  "ink": "#ffffff",
  "sub": "#e6f2ff",
  "accent": "#ffd36b",
  "faint": "rgba(255,211,107,.6)",
  "fill": "#ffd36b",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.4,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "sunset": {
  "label": "Sunset",
  "edition": "SUNSET",
  "layout": "weather",
  "drop": "rare",
  "bg": "linear-gradient(180deg,#3b2a6b 0%,#c0567a 55%,#f5a35c 100%)",
  "ink": "#ffffff",
  "sub": "#ffe3d1",
  "accent": "#ffb36b",
  "faint": "rgba(255,150,100,.6)",
  "fill": "#ffb36b",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.4,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "starry": {
  "label": "Starry Night",
  "edition": "STARRY NIGHT",
  "layout": "weather",
  "drop": "epic",
  "bg": "linear-gradient(180deg,#070b1f 0%,#15204a 60%,#26386e 100%)",
  "ink": "#ffffff",
  "sub": "#cfd6ff",
  "accent": "#e8e3ff",
  "faint": "rgba(200,200,255,.45)",
  "fill": "#e8e3ff",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [
   "u-stars"
  ],
  "glare": 0.45,
  "light": false,
  "foil": {
   "kind": "pastel",
   "mask": "m-cosmos",
   "op": 0.4,
   "blend": "screen",
   "scope": "card"
  }
 },
 "recipe": {
  "label": "Recipe",
  "edition": "RECIPE",
  "layout": "recipe",
  "drop": "common",
  "bg": "#fbf6ea",
  "ink": "#2b2a3a",
  "sub": "#6a6278",
  "accent": "#d0453b",
  "faint": "rgba(0,0,0,.12)",
  "fill": "#ffffff",
  "initial": "#2b2a3a",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "firstclass": {
  "label": "First Class",
  "edition": "FIRST CLASS",
  "layout": "boarding",
  "drop": "rare",
  "bg": "#f7f7f5",
  "ink": "#111111",
  "sub": "#707070",
  "accent": "#1d3f8f",
  "faint": "rgba(0,0,0,.15)",
  "fill": "#e8ecf4",
  "initial": "#111111",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.4,
  "light": true,
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.3,
   "blend": "multiply",
   "scope": "card"
  }
 },
 "premiere": {
  "label": "Premiere",
  "edition": "PREMIERE",
  "layout": "poster",
  "drop": "epic",
  "bg": "#111111",
  "ink": "#ffffff",
  "sub": "#c9c9c9",
  "accent": "#c0392b",
  "faint": "rgba(255,255,255,.2)",
  "fill": "#111111",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.5,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "noircinema": {
  "label": "Noir Cinema",
  "edition": "NOIR CINEMA",
  "layout": "poster",
  "drop": "rare",
  "bg": "#0c1118",
  "ink": "#ffffff",
  "sub": "#b9c4d2",
  "accent": "#3b6ea8",
  "faint": "rgba(255,255,255,.2)",
  "fill": "#0c1118",
  "initial": "#ffffff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.5,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "cartridge": {
  "label": "Cartridge",
  "edition": "CARTRIDGE",
  "layout": "cart",
  "drop": "common",
  "bg": "linear-gradient(160deg,#2a2d34 0%,#22252b 60%,#1b1d22 100%)",
  "ink": "#1d1d1d",
  "sub": "#444444",
  "accent": "#e4572e",
  "faint": "rgba(0,0,0,.2)",
  "fill": "#a3a6ab",
  "initial": "#1d1d1d",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.45,
  "light": false,
  "foil": {
   "kind": "none"
  }
 },
 "atomic": {
  "label": "Atomic Purple",
  "edition": "ATOMIC PURPLE",
  "layout": "cart",
  "drop": "rare",
  "bg": "linear-gradient(160deg,#2a2d34 0%,#22252b 60%,#1b1d22 100%)",
  "ink": "#f4f0ff",
  "sub": "#d6c8f5",
  "accent": "#f2c14e",
  "faint": "rgba(255,255,255,.2)",
  "fill": "#6b4fa3",
  "initial": "#f4f0ff",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.5,
  "light": false,
  "foil": {
   "kind": "pastel",
   "mask": "m-glitter",
   "op": 0.35,
   "blend": "screen",
   "scope": "card"
  }
 },
 "indigowave": {
  "label": "Indigo Wave",
  "edition": "INDIGO WAVE",
  "layout": "wave",
  "drop": "rare",
  "bg": "#f3ead6",
  "ink": "#1b2238",
  "sub": "#c0392b",
  "accent": "#1e3a6e",
  "faint": "rgba(27,34,56,.2)",
  "fill": "#f3ead6",
  "initial": "#1b2238",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 },
 "blackcard": {
  "label": "Black Card",
  "edition": "BLACK CARD",
  "layout": "blackcard",
  "drop": "legendary",
  "bg": "linear-gradient(160deg,#2a2a2e 0%,#141416 60%,#0b0b0c 100%)",
  "ink": "#e9e9ec",
  "sub": "#9a9aa3",
  "accent": "#6e6e78",
  "faint": "rgba(255,255,255,.18)",
  "fill": "#202024",
  "initial": "#e9e9ec",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.7,
  "light": false,
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.25,
   "blend": "screen",
   "scope": "card"
  }
 },
 "titanium": {
  "label": "Titanium",
  "edition": "TITANIUM",
  "layout": "blackcard",
  "drop": "epic",
  "bg": "linear-gradient(160deg,#f4f4f2 0%,#e2e2df 60%,#d3d3cf 100%)",
  "ink": "#2b2b2e",
  "sub": "#77777d",
  "accent": "#b9b9be",
  "faint": "rgba(0,0,0,.12)",
  "fill": "#e6e6e3",
  "initial": "#2b2b2e",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.6,
  "light": true,
  "foil": {
   "kind": "silver",
   "mask": "m-lines",
   "op": 0.35,
   "blend": "soft-light",
   "scope": "card"
  }
 },
 "trailhead": {
  "label": "Trailhead",
  "edition": "TRAILHEAD",
  "layout": "topo",
  "drop": "rare",
  "bg": "#efe7d2",
  "ink": "#2c3a2e",
  "sub": "#6b7a5e",
  "accent": "#d2552f",
  "faint": "rgba(44,58,46,.2)",
  "fill": "#f7f1e1",
  "initial": "#2c3a2e",
  "shape": "circle",
  "corner": "none",
  "name": "silver",
  "under": [],
  "glare": 0.35,
  "light": true,
  "foil": {
   "kind": "none"
  }
 }
};
const TPL = "\n\u003cdiv class=\"stage\" style=\"width: 480px; height: 672px; font-family: Jost, system-ui, sans-serif\">\n  \u003cdiv class=\"{{tiltClass}}\" style=\"{{tiltStyle}}\" onPointerDown=\"{{onDown}}\" onPointerMove=\"{{onMove}}\" onPointerUp=\"{{onUp}}\" onPointerCancel=\"{{onUp}}\" onPointerLeave=\"{{onLeave}}\">\n    \u003cdiv class=\"face\" style=\"{{faceStyle}}\">\n      \u003csc-for list=\"{{under}}\" as=\"u\" hint-placeholder-count=\"1\">\u003cdiv class=\"{{u}}\">\u003c/div>\u003c/sc-for>\n      \u003csc-if value=\"{{classic}}\" hint-placeholder-val=\"{{ true }}\">\n      \u003cdiv style=\"{{frame1}}\">\u003c/div>\n      \u003cdiv style=\"{{frame2}}\">\u003c/div>\n      \u003csc-for list=\"{{corners}}\" as=\"c\" hint-placeholder-count=\"4\">\n        \u003csc-if value=\"{{c.fil}}\" hint-placeholder-val=\"{{ false }}\">\u003csvg width=\"34\" height=\"34\" viewBox=\"0 0 34 34\" fill=\"none\" stroke=\"{{c.color}}\" stroke-width=\"1.3\" aria-hidden=\"true\" style=\"{{c.style}}\">\u003cpath d=\"M3 31C3 15 15 3 31 3\">\u003c/path>\u003cpath d=\"M9 31C9 19 19 9 31 9\">\u003c/path>\u003ccircle cx=\"31\" cy=\"3\" r=\"2\" fill=\"{{c.color}}\">\u003c/circle>\u003ccircle cx=\"3\" cy=\"31\" r=\"2\" fill=\"{{c.color}}\">\u003c/circle>\u003c/svg>\u003c/sc-if>\n        \u003csc-if value=\"{{c.deco}}\" hint-placeholder-val=\"{{ false }}\">\u003csvg width=\"24\" height=\"24\" viewBox=\"0 0 22 22\" fill=\"{{c.color}}\" aria-hidden=\"true\" style=\"{{c.style}}\">\u003cpath d=\"M0 0h10v4H4v6H0z\">\u003c/path>\u003c/svg>\u003c/sc-if>\n        \u003csc-if value=\"{{c.star}}\" hint-placeholder-val=\"{{ false }}\">\u003csvg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"{{c.color}}\" aria-hidden=\"true\" style=\"{{c.style}}\">\u003cpath d=\"M12 0C13 9 15 11 24 12C15 13 13 15 12 24C11 15 9 13 0 12C9 11 11 9 12 0Z\">\u003c/path>\u003c/svg>\u003c/sc-if>\n        \u003csc-if value=\"{{c.bracket}}\" hint-placeholder-val=\"{{ false }}\">\u003csvg width=\"26\" height=\"26\" viewBox=\"0 0 26 26\" fill=\"none\" stroke=\"{{c.color}}\" stroke-width=\"1.5\" aria-hidden=\"true\" style=\"{{c.style}}\">\u003cpath d=\"M1 25V1h24\">\u003c/path>\u003cpath d=\"M6 25V6h19\">\u003c/path>\u003c/svg>\u003c/sc-if>\n        \u003csc-if value=\"{{c.leaf}}\" hint-placeholder-val=\"{{ false }}\">\u003csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" stroke=\"{{c.color}}\" stroke-width=\"1.2\" aria-hidden=\"true\" style=\"{{c.style}}\">\u003cpath d=\"M4 36C8 22 18 10 36 4\">\u003c/path>\u003cpath d=\"M14 22c5-1 8-5 8-10c-5 1-8 5-8 10z\" fill=\"{{c.color}}\">\u003c/path>\u003cpath d=\"M8 30c4 0 7-3 7-7c-4 0-7 3-7 7z\" fill=\"{{c.color}}\">\u003c/path>\u003c/svg>\u003c/sc-if>\n        \u003csc-if value=\"{{c.petal}}\" hint-placeholder-val=\"{{ false }}\">\u003csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" fill=\"{{c.color}}\" aria-hidden=\"true\" style=\"{{c.style}}\">\u003cpath d=\"M8 8c0-5 4-7 6-4c2-3 6-1 6 4c4 0 5 4 2 6c3 2 1 6-3 6c0 4-4 6-6 3c-2 3-6 1-6-3c-4 0-5-4-2-6c-3-2-1-6 3-6z\" opacity=\".85\">\u003c/path>\u003c/svg>\u003c/sc-if>\n      \u003c/sc-for>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{foilCard}}\" hint-placeholder-val=\"{{ true }}\">\u003cdiv class=\"{{foilClass}}\" style=\"{{foilStyle}}\">\u003c/div>\u003c/sc-if>\n      \u003csc-if value=\"{{classic}}\" hint-placeholder-val=\"{{ true }}\">\n      \u003cdiv style=\"position: absolute; inset: 34px 36px 30px; display: flex; flex-direction: column; align-items: center\">\n        \u003cp style=\"{{edStyle}}\">{{edition}}\u003c/p>\n        \u003cdiv class=\"float-hi\" style=\"{{pOuter}}\">\n          \u003cdiv style=\"{{pInner}}\">\n            \u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\" style=\"{{avStyle}}\">\u003c/sc-if>\n            \u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan style=\"{{initStyle}}\">{{m.initial}}\u003c/span>\u003cspan style=\"{{phStyle}}\">[MEMBER AVATAR]\u003c/span>\u003c/sc-if>\n            \u003csc-if value=\"{{foilPortrait}}\" hint-placeholder-val=\"{{ false }}\">\u003cdiv class=\"{{foilClass}}\" style=\"{{foilStyle}}\">\u003c/div>\u003c/sc-if>\n          \u003c/div>\n        \u003c/div>\n        \u003ch1 class=\"float-lo fname\" style=\"{{nameStyle}}\">{{m.name}}\u003c/h1>\n        \u003cp style=\"{{tagStyle}}\">{{m.tags}}\u003c/p>\n        \u003cdiv style=\"{{rule}}\">\u003c/div>\n        \u003cdiv style=\"margin-top: 16px; width: 100%; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); text-align: center\">\n          \u003cdiv>\u003cdiv style=\"{{numStyle}}\">{{m.voice}}\u003c/div>\u003cdiv style=\"{{labStyle}}\">VOICE\u003c/div>\u003c/div>\n          \u003cdiv>\u003cdiv style=\"{{numStyle}}\">{{m.msgs}}\u003c/div>\u003cdiv style=\"{{labStyle}}\">MESSAGES\u003c/div>\u003c/div>\n          \u003cdiv>\u003cdiv style=\"{{numStyle}}\">{{m.zeni}}\u003c/div>\u003cdiv style=\"{{labStyle}}\">ZENI\u003c/div>\u003c/div>\n          \u003cdiv>\u003cdiv style=\"{{numStyle}}\">{{m.fame}}\u003c/div>\u003cdiv style=\"{{labStyle}}\">FAME\u003c/div>\u003c/div>\n        \u003c/div>\n        \u003cp style=\"{{platStyle}}\">{{m.plays}}\u003c/p>\n        \u003cp style=\"{{quoteStyle}}\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003cp style=\"{{footStyle}}\">{{m.foot}}\u003c/p>\n      \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.fullart}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer fa-art float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cdiv class=\"layer fa-scrim\">\u003c/div>\n        \u003cp class=\"fa-top\">{{edition}}\u003c/p>\n        \u003cdiv class=\"fa-body\">\n          \u003ch1 class=\"fname float-lo\" style=\"{{nameStyle}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"fa-tags\">{{m.tags}} \u00b7 {{m.plays}}\u003c/p>\n          \u003cdiv class=\"fa-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>\u003ci>VOICE\u003c/i>\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>\u003ci>MESSAGES\u003c/i>\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>\u003ci>ZENI\u003c/i>\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>\u003ci>FAME\u003c/i>\u003c/div>\u003c/div>\n          \u003cp class=\"fa-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n          \u003cp class=\"fa-foot\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.pixel}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"px-frame\">\u003c/div>\n        \u003cdiv class=\"px-col\">\n          \u003cp class=\"px-top\">{{edition}}\u003c/p>\n          \u003cdiv class=\"px-portrait float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{pxAvatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003ch1 class=\"px-name float-lo\" style=\"{{pxName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"px-tags\">PLAYER 1 \u00b7 {{m.tags}}\u003c/p>\n          \u003cdiv class=\"px-stats\">\u003cdiv>\u003cspan>VOICE\u003c/span>\u003cb>{{m.voice}}\u003c/b>\u003c/div>\u003cdiv>\u003cspan>MSGS\u003c/span>\u003cb>{{m.msgs}}\u003c/b>\u003c/div>\u003cdiv>\u003cspan>ZENI\u003c/span>\u003cb>{{m.zeni}}\u003c/b>\u003c/div>\u003cdiv>\u003cspan>FAME\u003c/span>\u003cb>{{m.fame}}\u003c/b>\u003c/div>\u003c/div>\n          \u003cdiv class=\"px-box\">{{m.quote}}\u003ci>\u25bc\u003c/i>\u003c/div>\n          \u003cp class=\"px-foot\">{{m.plays}}\u003c/p>\n        \u003c/div>\n        \u003cdiv class=\"layer px-scan\">\u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.synth}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"sw-sun float-hi\">\u003c/div>\n        \u003cdiv class=\"sw-ground\">\u003cdiv class=\"sw-lines\">\u003cdiv class=\"sw-grid\">\u003c/div>\u003c/div>\u003c/div>\n        \u003cdiv class=\"sw-col\">\n          \u003cp class=\"sw-top\">{{edition}}\u003c/p>\n          \u003cdiv class=\"sw-portrait float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003ch1 class=\"sw-name float-lo\" style=\"{{swName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"sw-tags\">{{m.tags}}\u003c/p>\n          \u003cdiv class=\"sw-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>VOICE\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>MSGS\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>ZENI\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>FAME\u003c/div>\u003c/div>\n          \u003cp class=\"sw-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n          \u003cp class=\"sw-foot\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.term}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"tm-col\">\n          \u003cp class=\"tm-bar\">\u003ci>\u003c/i>\u003ci>\u003c/i>\u003ci>\u003c/i>\u003cspan>whis@tcds-scord: ~\u003c/span>\u003c/p>\n          \u003cp class=\"tm-l\">\u003cem>$\u003c/em> whois {{m.name}}\u003c/p>\n          \u003cdiv class=\"tm-head\">\n            \u003cdiv class=\"tm-av float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{pxAvatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n            \u003ch1 class=\"tm-name float-lo\" style=\"{{tmName}}\">{{m.name}}\u003c/h1>\n          \u003c/div>\n          \u003cdiv class=\"tm-kv\">\u003cspan>role\u003c/span>\u003cb>{{m.tags}}\u003c/b>\u003cspan>voice\u003c/span>\u003cb>{{m.voice}}\u003c/b>\u003cspan>messages\u003c/span>\u003cb>{{m.msgs}}\u003c/b>\u003cspan>zeni\u003c/span>\u003cb>{{m.zeni}}\u003c/b>\u003cspan>fame\u003c/span>\u003cb>{{m.fame}}\u003c/b>\u003cspan>plays\u003c/span>\u003cb>{{m.plays}}\u003c/b>\u003c/div>\n          \u003cp class=\"tm-l\">\u003cem>$\u003c/em> cat quote.txt\u003c/p>\n          \u003cp class=\"tm-q\">{{m.quote}}\u003c/p>\n          \u003cp class=\"tm-l\">\u003cem>$\u003c/em> \u003cspan class=\"tm-cur\">\u003c/span>\u003c/p>\n          \u003cp class=\"tm-foot\">{{edition}} \u00b7 {{m.foot}}\u003c/p>\n        \u003c/div>\n        \u003cdiv class=\"layer px-scan\">\u003c/div>\n        \u003cdiv class=\"layer tm-glow\">\u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.manga}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"mg-panel mg-p1\">\u003cdiv class=\"mg-in\">\u003cdiv class=\"mg-art float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\u003c/div>\u003c/div>\n        \u003cp class=\"mg-sfx\">DON!\u003c/p>\n        \u003cdiv class=\"mg-panel mg-p2\">\u003cdiv class=\"mg-in\">\u003cp class=\"mg-top\">{{edition}}\u003c/p>\u003ch1 class=\"mg-name float-lo\" style=\"{{mgName}}\">{{m.name}}\u003c/h1>\u003cp class=\"mg-tags\">{{m.tags}}\u003c/p>\u003c/div>\u003c/div>\n        \u003cdiv class=\"mg-panel mg-p3\">\u003cdiv class=\"mg-in\">\n          \u003cp class=\"mg-bubble\" style=\"{{mgQuote}}\">{{m.quote}}\u003c/p>\n          \u003cdiv class=\"mg-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>VOICE\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>MSGS\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>ZENI\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>FAME\u003c/div>\u003c/div>\n        \u003c/div>\u003c/div>\n        \u003cp class=\"mg-foot\">{{m.foot}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.blueprint}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer bp-grid\">\u003c/div>\n        \u003cdiv class=\"bp-frame\">\u003c/div>\n        \u003cp class=\"bp-top\">{{edition}} \u00b7 SHEET 1 OF 1\u003c/p>\n        \u003cdiv class=\"bp-part float-hi\">\n          \u003cdiv class=\"bp-av\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003ci class=\"bp-cross\">\u003c/i>\n          \u003cspan class=\"bp-dim\">\u2300 180 MM\u003c/span>\n        \u003c/div>\n        \u003cdiv class=\"bp-col\">\n          \u003ch1 class=\"bp-name float-lo\" style=\"{{bpName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"bp-quote\">NOTE 1: \u201c{{m.quote}}\u201d\u003c/p>\n          \u003cdiv class=\"bp-block\">\n            \u003cspan>ROLE\u003c/span>\u003cb>{{m.tags}}\u003c/b>\u003cspan>VOICE\u003c/span>\u003cb>{{m.voice}}\u003c/b>\n            \u003cspan>MSGS\u003c/span>\u003cb>{{m.msgs}}\u003c/b>\u003cspan>ZENI\u003c/span>\u003cb>{{m.zeni}}\u003c/b>\n            \u003cspan>FAME\u003c/span>\u003cb>{{m.fame}}\u003c/b>\u003cspan>SCALE\u003c/span>\u003cb>1 : 1\u003c/b>\n            \u003cspan>PLAYS\u003c/span>\u003cb class=\"bp-wide\">{{m.plays}}\u003c/b>\n            \u003cspan>DWG\u003c/span>\u003cb class=\"bp-wide\">{{m.foot}}\u003c/b>\n          \u003c/div>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.swiss}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"sx-block\">\u003c/div>\n        \u003cdiv class=\"sx-av float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003ch1 class=\"sx-name float-lo\" style=\"{{sxName}}\">{{m.name}}\u003c/h1>\n        \u003cp class=\"sx-top\">{{edition}}\u003c/p>\n        \u003cdiv class=\"sx-col\">\n          \u003cp class=\"sx-tags\">{{m.tags}}\u003c/p>\n          \u003cdiv class=\"sx-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>Voice\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>Messages\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>Zeni\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>Fame\u003c/div>\u003c/div>\n          \u003cp class=\"sx-quote\">{{m.quote}}\u003c/p>\n          \u003cp class=\"sx-foot\">{{m.plays}}\u003cbr>{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.polaroid}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"float-hi pl-wrap\">\u003cdiv class=\"pl-photo\">\n          \u003ci class=\"pl-tape pl-t1\">\u003c/i>\u003ci class=\"pl-tape pl-t2\">\u003c/i>\n          \u003cdiv class=\"pl-img\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003ch1 class=\"pl-name\" style=\"{{plName}}\">{{m.name}}\u003c/h1>\n        \u003c/div>\u003c/div>\n        \u003cdiv class=\"float-lo pl-nwrap\">\u003cp class=\"pl-note\" style=\"{{plQuote}}\">\u201c{{m.quote}}\u201d\u003c/p>\u003c/div>\n        \u003cdiv class=\"pl-ticket\">\n          \u003cp class=\"pl-ed\">{{edition}}\u003c/p>\n          \u003cdiv class=\"pl-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>VOICE\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>MSGS\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>ZENI\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>FAME\u003c/div>\u003c/div>\n          \u003cp class=\"pl-tags\">{{m.tags}}\u003c/p>\n        \u003c/div>\n        \u003cp class=\"pl-foot\">{{m.foot}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.tarot}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"tr-frame\">\u003c/div>\n        \u003cp class=\"tr-num\">{{trNum}}\u003c/p>\n        \u003cdiv class=\"tr-arch float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cp class=\"tr-sky\">\u2726 \u263e \u2726\u003c/p>\n        \u003ch1 class=\"tr-name float-lo\" style=\"{{trName}}\">THE {{m.name}}\u003c/h1>\n        \u003cdiv class=\"tr-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>VOICE\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>WORDS\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>ZENI\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>FAME\u003c/div>\u003c/div>\n        \u003cp class=\"tr-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003cp class=\"tr-foot\">{{edition}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.vinyl}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"vn-wrap float-lo\">\u003cdiv class=\"vn-disc\">\u003cdiv class=\"vn-label\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\u003c/div>\u003cdiv class=\"vn-sheen\">\u003c/div>\u003c/div>\n        \u003cdiv class=\"vn-sleeve float-hi\">\n          \u003cp class=\"vn-top\">{{edition}}\u003c/p>\n          \u003ch1 class=\"vn-name\" style=\"{{vnName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"vn-sub\">{{m.tags}}\u003c/p>\n        \u003c/div>\n        \u003cdiv class=\"vn-tracks\">\n          \u003cp class=\"vn-side\">SIDE A\u003c/p>\n          \u003cdiv>\u003ci>1\u003c/i>\u003cspan>Voice\u003c/span>\u003cb>{{m.voice}}\u003c/b>\u003c/div>\n          \u003cdiv>\u003ci>2\u003c/i>\u003cspan>Messages\u003c/span>\u003cb>{{m.msgs}}\u003c/b>\u003c/div>\n          \u003cdiv>\u003ci>3\u003c/i>\u003cspan>Zeni\u003c/span>\u003cb>{{m.zeni}}\u003c/b>\u003c/div>\n          \u003cdiv>\u003ci>4\u003c/i>\u003cspan>Fame\u003c/span>\u003cb>{{m.fame}}\u003c/b>\u003c/div>\n          \u003cp class=\"vn-quote\">Hidden track: \u201c{{m.quote}}\u201d\u003c/p>\n        \u003c/div>\n        \u003cp class=\"vn-foot\">{{m.plays}} \u00b7 {{m.foot}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.receipt}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"rc-paper float-hi\">\n          \u003cp class=\"rc-store\">TCD'S SCORD\u003c/p>\n          \u003cp class=\"rc-c\">MEMBER RECEIPT \u00b7 {{edition}}\u003c/p>\n          \u003cdiv class=\"rc-av\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{pxAvatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003ch1 class=\"rc-name\" style=\"{{rcName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"rc-c\">{{m.tags}}\u003c/p>\n          \u003cp class=\"rc-rule\">\u003c/p>\n          \u003cdiv class=\"rc-row\">\u003cspan>VOICE HOURS\u003c/span>\u003cb>{{m.voice}}\u003c/b>\u003c/div>\n          \u003cdiv class=\"rc-row\">\u003cspan>MESSAGES\u003c/span>\u003cb>{{m.msgs}}\u003c/b>\u003c/div>\n          \u003cdiv class=\"rc-row\">\u003cspan>FAME\u003c/span>\u003cb>{{m.fame}}\u003c/b>\u003c/div>\n          \u003cdiv class=\"rc-row\">\u003cspan>PLAYS\u003c/span>\u003cb>{{m.plays}}\u003c/b>\u003c/div>\n          \u003cp class=\"rc-rule\">\u003c/p>\n          \u003cdiv class=\"rc-row rc-total\">\u003cspan>ZENI\u003c/span>\u003cb>{{m.zeni}}\u003c/b>\u003c/div>\n          \u003cp class=\"rc-note\">NOTE: {{m.quote}}\u003c/p>\n          \u003cp class=\"rc-c\">*** THANK YOU FOR HANGING OUT ***\u003c/p>\n          \u003cdiv class=\"rc-bar\">\u003c/div>\n          \u003cp class=\"rc-c\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.wanted}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer wt-age\">\u003c/div>\n        \u003cdiv class=\"wt-col\">\n          \u003cp class=\"wt-head\">WANTED\u003c/p>\n          \u003cdiv class=\"wt-photo float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003cp class=\"wt-doa\">DEAD OR ALIVE\u003c/p>\n          \u003ch1 class=\"wt-name float-lo\" style=\"{{wtName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"wt-bounty\">{{m.zeni}}\u003csmall> ZENI\u003c/small>\u003c/p>\n          \u003cp class=\"wt-small\">Known for {{m.tags}} \u00b7 {{m.voice}} in voice \u00b7 {{m.msgs}} messages \u00b7 {{m.fame}} times famous\u003c/p>\n          \u003cp class=\"wt-small\">Last heard saying \u201c{{m.quote}}\u201d\u003c/p>\n          \u003cp class=\"wt-foot\">BY ORDER OF TCD'S SCORD \u00b7 {{edition}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.passport}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer pp-guil\">\u003c/div>\n        \u003cdiv class=\"pp-head\">\u003cb>TCD'S SCORD\u003c/b>\u003cspan>PASSPORT \u00b7 PASSEPORT \u00b7 PASAPORTE\u003c/span>\u003c/div>\n        \u003cdiv class=\"pp-photo float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cdiv class=\"pp-fields float-lo\">\n          \u003cp>\u003ci>Type / Edition\u003c/i>P \u00b7 {{edition}}\u003c/p>\n          \u003cp>\u003ci>Name\u003c/i>\u003cb style=\"{{ppName}}\">{{m.name}}\u003c/b>\u003c/p>\n          \u003cp>\u003ci>Role\u003c/i>{{m.tags}}\u003c/p>\n          \u003cp>\u003ci>Voice \u00b7 Messages\u003c/i>{{m.voice}} \u00b7 {{m.msgs}}\u003c/p>\n          \u003cp>\u003ci>Zeni \u00b7 Fame\u003c/i>{{m.zeni}} \u00b7 {{m.fame}}\u003c/p>\n          \u003cp>\u003ci>Plays\u003c/i>{{m.plays}}\u003c/p>\n        \u003c/div>\n        \u003cp class=\"pp-quote\">Remarks: \u201c{{m.quote}}\u201d\u003c/p>\n        \u003cp class=\"pp-issued\">{{m.foot}}\u003c/p>\n        \u003cdiv class=\"pp-mrz\">\u003cp>{{mrz1}}\u003c/p>\u003cp>{{mrz2}}\u003c/p>\u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.neon}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer ne-wall\">\u003c/div>\n        \u003cdiv class=\"layer ne-spill\">\u003c/div>\n        \u003cp class=\"ne-top\">{{edition}}\u003c/p>\n        \u003cdiv class=\"ne-ring float-hi\">\u003cdiv class=\"ne-av\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\u003c/div>\n        \u003ch1 class=\"ne-name float-lo\" style=\"{{neName}}\">{{m.name}}\u003c/h1>\n        \u003cp class=\"ne-open\">{{m.tags}}\u003c/p>\n        \u003cdiv class=\"ne-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>voice\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>msgs\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>zeni\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>fame\u003c/div>\u003c/div>\n        \u003cp class=\"ne-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003cp class=\"ne-foot\">{{m.foot}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.glass}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer sg-glass\">\u003c/div>\n        \u003cdiv class=\"layer sg-lead\">\u003c/div>\n        \u003cdiv class=\"sg-rose float-hi\">\u003cdiv class=\"sg-av\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\u003c/div>\n        \u003cdiv class=\"sg-panel\">\n          \u003cp class=\"sg-top\">{{edition}}\u003c/p>\n          \u003ch1 class=\"sg-name float-lo\" style=\"{{sgName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"sg-tags\">{{m.tags}}\u003c/p>\n          \u003cdiv class=\"sg-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>VOICE\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>MESSAGES\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>ZENI\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>FAME\u003c/div>\u003c/div>\n          \u003cp class=\"sg-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n          \u003cp class=\"sg-foot\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.cyber}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer cy-grid\">\u003c/div>\n        \u003cdiv class=\"layer cy-scan\">\u003c/div>\n        \u003ci class=\"cy-br cy-tl\">\u003c/i>\u003ci class=\"cy-br cy-tr\">\u003c/i>\u003ci class=\"cy-br cy-bl\">\u003c/i>\u003ci class=\"cy-br cy-br2\">\u003c/i>\n        \u003cp class=\"cy-top\">\u003cspan>// {{edition}}\u003c/span>\u003cspan>ID {{trNum}}\u003c/span>\u003c/p>\n        \u003cdiv class=\"cy-hex float-hi\">\u003cdiv class=\"cy-av\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\u003c/div>\n        \u003ch1 class=\"cy-name float-lo\" style=\"{{cyName}}\" data-text=\"{{m.name}}\">{{m.name}}\u003c/h1>\n        \u003cp class=\"cy-tags\">&gt; {{m.tags}} \u00b7 {{m.plays}}\u003c/p>\n        \u003cdiv class=\"cy-stats\">\u003cdiv>\u003ci>VOICE\u003c/i>\u003cb>{{m.voice}}\u003c/b>\u003c/div>\u003cdiv>\u003ci>MSGS\u003c/i>\u003cb>{{m.msgs}}\u003c/b>\u003c/div>\u003cdiv>\u003ci>ZENI\u003c/i>\u003cb>{{m.zeni}}\u003c/b>\u003c/div>\u003cdiv>\u003ci>FAME\u003c/i>\u003cb>{{m.fame}}\u003c/b>\u003c/div>\u003c/div>\n        \u003cp class=\"cy-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003cp class=\"cy-foot\">{{m.foot}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.weather}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"wx-sun float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cdiv class=\"wx-col\">\n          \u003cp class=\"wx-loc\">\u27a4 TCD'S SCORD\u003c/p>\n          \u003ch1 class=\"wx-name float-lo\" style=\"{{wxName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"wx-big\">{{m.msgs}}\u003c/p>\n          \u003cp class=\"wx-cond\">{{m.tags}}\u003c/p>\n          \u003cp class=\"wx-hl\">Voice {{m.voice}} \u00b7 Fame {{m.fame}}\u003c/p>\n          \u003cdiv class=\"wx-glass wx-hours\">\u003cp class=\"wx-cap\">\u2600\ufe0f TODAY'S FORECAST \u00b7 {{edition}}\u003c/p>\n            \u003cdiv class=\"wx-row\">\u003cdiv>Voice\u003ci>\ud83c\udfa7\u003c/i>\u003cb>{{m.voice}}\u003c/b>\u003c/div>\u003cdiv>Msgs\u003ci>\ud83d\udcac\u003c/i>\u003cb>{{m.msgs}}\u003c/b>\u003c/div>\u003cdiv>Zeni\u003ci>\ud83e\ude99\u003c/i>\u003cb>{{m.zeni}}\u003c/b>\u003c/div>\u003cdiv>Fame\u003ci>\u2b50\u003c/i>\u003cb>{{m.fame}}\u003c/b>\u003c/div>\u003c/div>\u003c/div>\n          \u003cdiv class=\"wx-glass\">\u003cp class=\"wx-cap\">\ud83c\udf24 OUTLOOK\u003c/p>\u003cp class=\"wx-quote\">\u201c{{m.quote}}\u201d\u003c/p>\u003cp class=\"wx-plays\">{{m.plays}}\u003c/p>\u003c/div>\n          \u003cp class=\"wx-foot\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.recipe}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer rp-lines\">\u003c/div>\n        \u003cdiv class=\"layer rp-stain\">\u003c/div>\n        \u003cdiv class=\"rp-photo float-hi\">\u003ci class=\"rp-clip\">\u003c/i>\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cdiv class=\"rp-col\">\n          \u003cp class=\"rp-type\">RECIPE FOR:\u003c/p>\n          \u003ch1 class=\"rp-name float-lo\" style=\"{{rpName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"rp-type\">SERVES: everyone \u00b7 PREP: {{m.voice}} \u00b7 {{m.tags}}\u003c/p>\n          \u003cp class=\"rp-type rp-h\">INGREDIENTS\u003c/p>\n          \u003cp class=\"rp-hand\">\u00b7 {{m.msgs}} messages, finely chatted\u003c/p>\n          \u003cp class=\"rp-hand\">\u00b7 {{m.zeni}} Zeni, saved up\u003c/p>\n          \u003cp class=\"rp-hand\">\u00b7 {{m.fame}} spoonfuls of fame\u003c/p>\n          \u003cp class=\"rp-hand\">\u00b7 a dash of {{m.plays}}\u003c/p>\n          \u003cp class=\"rp-type rp-h\">DIRECTIONS\u003c/p>\n          \u003cp class=\"rp-hand rp-dir\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003c/div>\n        \u003cp class=\"rp-foot\">From the kitchen of TCD's scord \u00b7 {{edition}}\u003c/p>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.boarding}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"bd-head\">\u003cb>SCORD AIR\u003c/b>\u003cspan>{{edition}}\u003c/span>\u003c/div>\n        \u003cdiv class=\"bd-route\">\u003cdiv>\u003cb>{{bdFrom}}\u003c/b>{{m.name}}\u003c/div>\u003ci>\u2708\u003c/i>\u003cdiv class=\"bd-r\">\u003cb>SCD\u003c/b>TCD's scord\u003c/div>\u003c/div>\n        \u003cdiv class=\"bd-who\">\u003cdiv class=\"bd-av float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n          \u003cdiv class=\"float-lo\">\u003cp class=\"bd-l\">PASSENGER\u003c/p>\u003cp class=\"bd-v bd-name\">{{m.name}}\u003c/p>\u003cp class=\"bd-l\">STATUS\u003c/p>\u003cp class=\"bd-v\">{{m.tags}}\u003c/p>\u003c/div>\u003c/div>\n        \u003cdiv class=\"bd-grid\">\u003cdiv>\u003cp class=\"bd-l\">VOICE\u003c/p>\u003cp class=\"bd-v\">{{m.voice}}\u003c/p>\u003c/div>\u003cdiv>\u003cp class=\"bd-l\">MESSAGES\u003c/p>\u003cp class=\"bd-v\">{{m.msgs}}\u003c/p>\u003c/div>\n          \u003cdiv>\u003cp class=\"bd-l\">ZENI\u003c/p>\u003cp class=\"bd-v\">{{m.zeni}}\u003c/p>\u003c/div>\u003cdiv>\u003cp class=\"bd-l\">FAME\u003c/p>\u003cp class=\"bd-v\">{{m.fame}}\u003c/p>\u003c/div>\u003c/div>\n        \u003cp class=\"bd-note\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003cdiv class=\"bd-tear\">\u003c/div>\n        \u003cdiv class=\"bd-stub\">\u003cdiv class=\"bd-qr\">\u003c/div>\u003cdiv>\u003cp class=\"bd-l\">FLIGHT\u003c/p>\u003cp class=\"bd-v\">SC {{trNum}}\u003c/p>\u003cp class=\"bd-l\">CARRY-ON\u003c/p>\u003cp class=\"bd-v bd-small\">{{m.plays}}\u003c/p>\u003cp class=\"bd-foot\">{{m.foot}}\u003c/p>\u003c/div>\u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.poster}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"mv-art float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cdiv class=\"layer mv-tint\">\u003c/div>\n        \u003cdiv class=\"layer mv-fade\">\u003c/div>\n        \u003cp class=\"mv-tag\">\u201c{{m.quote}}\u201d\u003c/p>\n        \u003cdiv class=\"mv-laurel\">\u003ci>\u2766\u003c/i>\u003cp>OFFICIAL SELECTION\u003cbr>\u003cb>TCD'S SCORD\u003c/b>\u003c/p>\u003ci class=\"mv-flip\">\u2766\u003c/i>\u003c/div>\n        \u003cdiv class=\"mv-bottom\">\n          \u003ch1 class=\"mv-title float-lo\" style=\"{{mvName}}\">{{m.name}}\u003c/h1>\n          \u003cp class=\"mv-credits\">TCD'S SCORD PRESENTS A {{edition}} PRODUCTION \u00b7 STARRING {{m.name}} AS {{m.tags}} \u00b7 {{m.voice}} OF VOICE \u00b7 {{m.msgs}} MESSAGES \u00b7 {{m.zeni}} ZENI \u00b7 {{m.fame}} TIMES IN THE HALL OF FAME \u00b7 FEATURING {{m.plays}} \u00b7 {{m.foot}}\u003c/p>\n          \u003cp class=\"mv-soon\">NOW SHOWING\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.cart}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"ct-cart\">\n          \u003cdiv class=\"ct-ridge\">\u003c/div>\n          \u003cdiv class=\"ct-label float-hi\">\n            \u003cdiv class=\"ct-art\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n            \u003cdiv class=\"ct-band\">\u003ch1 class=\"ct-name\" style=\"{{ctName}}\">{{m.name}}\u003c/h1>\u003cp>SCORD SOFT \u00b7 {{edition}}\u003c/p>\u003c/div>\n          \u003c/div>\n          \u003cp class=\"ct-emboss\">\u25b2 INSERT THIS END \u25b2\u003c/p>\n          \u003cdiv class=\"ct-save\">\u003cp class=\"ct-slot\">SAVE 1 \u00b7 {{m.tags}}\u003c/p>\n            \u003cdiv class=\"ct-stats\">\u003cspan>VOICE \u003cb>{{m.voice}}\u003c/b>\u003c/span>\u003cspan>MSGS \u003cb>{{m.msgs}}\u003c/b>\u003c/span>\u003cspan>ZENI \u003cb>{{m.zeni}}\u003c/b>\u003c/span>\u003cspan>FAME \u003cb>{{m.fame}}\u003c/b>\u003c/span>\u003c/div>\n            \u003cp class=\"ct-quote\">\u201c{{m.quote}}\u201d\u003c/p>\u003c/div>\n          \u003cdiv class=\"ct-grip\">\u003c/div>\n          \u003cp class=\"ct-foot\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.wave}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"wv-waves\">\u003c/div>\n        \u003cdiv class=\"wv-sun float-hi\">\u003cdiv class=\"wv-av\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\u003c/div>\n        \u003ch1 class=\"wv-name float-lo\" style=\"{{wvName}}\">{{m.name}}\u003c/h1>\n        \u003cp class=\"wv-top\">{{edition}}\u003c/p>\n        \u003cdiv class=\"wv-seal\">{{m.initial}}\u003c/div>\n        \u003cdiv class=\"wv-panel\">\n          \u003cp class=\"wv-tags\">{{m.tags}}\u003c/p>\n          \u003cdiv class=\"wv-stats\">\u003cdiv>\u003cb>{{m.voice}}\u003c/b>voice\u003c/div>\u003cdiv>\u003cb>{{m.msgs}}\u003c/b>messages\u003c/div>\u003cdiv>\u003cb>{{m.zeni}}\u003c/b>zeni\u003c/div>\u003cdiv>\u003cb>{{m.fame}}\u003c/b>fame\u003c/div>\u003c/div>\n          \u003cp class=\"wv-quote\">\u201c{{m.quote}}\u201d\u003c/p>\n          \u003cp class=\"wv-foot\">{{m.foot}}\u003c/p>\n        \u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.blackcard}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cp class=\"bc-brand\">SCORD\u003c/p>\n        \u003cp class=\"bc-tier\">{{edition}}\u003c/p>\n        \u003cdiv class=\"bc-chip\">\u003c/div>\n        \u003cdiv class=\"bc-wave\">\u003ci>\u003c/i>\u003ci>\u003c/i>\u003ci>\u003c/i>\u003c/div>\n        \u003cdiv class=\"bc-holo float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cp class=\"bc-num float-lo\">{{bcNum}}\u003c/p>\n        \u003cdiv class=\"bc-meta\">\u003cp>\u003ci>MEMBER\u003cbr>SINCE\u003c/i>{{bcSince}}\u003c/p>\u003cp>\u003ci>STATUS\u003c/i>{{m.tags}}\u003c/p>\u003c/div>\n        \u003cdiv class=\"bc-perks\">\u003cspan>VOICE {{m.voice}}\u003c/span>\u003cspan>MSGS {{m.msgs}}\u003c/span>\u003cspan>ZENI {{m.zeni}}\u003c/span>\u003cspan>FAME {{m.fame}}\u003c/span>\u003c/div>\n        \u003cp class=\"bc-sig\">{{m.quote}}\u003c/p>\n        \u003ch1 class=\"bc-name\">{{m.name}}\u003c/h1>\n        \u003cdiv class=\"bc-net\">\u003ci>\u003c/i>\u003ci>\u003c/i>\u003c/div>\n      \u003c/sc-if>\n      \u003csc-if value=\"{{L.topo}}\" hint-placeholder-val=\"{{ false }}\">\n        \u003cdiv class=\"layer tp-map\">\u003c/div>\n        \u003csvg class=\"tp-trail\" viewBox=\"0 0 480 672\" aria-hidden=\"true\">\u003cpath d=\"M58 650 C 130 590, 40 530, 128 470 S 300 440, 236 360 S 200 250, 300 222\">\u003c/path>\u003c/svg>\n        \u003cp class=\"tp-head\">SUMMIT OF\u003c/p>\n        \u003ch1 class=\"tp-name float-lo\" style=\"{{tpName}}\">{{m.name}}\u003c/h1>\n        \u003cdiv class=\"tp-pin float-hi\">\u003csc-if value=\"{{m.avatar}}\" hint-placeholder-val=\"{{ false }}\">\u003cimg src=\"{{m.avatar}}\" alt=\"\">\u003c/sc-if>\u003csc-if value=\"{{noAvatar}}\" hint-placeholder-val=\"{{ true }}\">\u003cspan>{{m.initial}}\u003c/span>\u003c/sc-if>\u003c/div>\n        \u003cdiv class=\"tp-compass\">\u003cb>N\u003c/b>\u003ci>\u2726\u003c/i>\u003c/div>\n        \u003cdiv class=\"tp-legend\">\n          \u003cp class=\"tp-lh\">TRAIL GUIDE \u00b7 {{edition}}\u003c/p>\n          \u003cp>\u003cspan>Elevation\u003c/span>\u003cb>{{m.msgs}} msgs\u003c/b>\u003c/p>\u003cp>\u003cspan>Time on trail\u003c/span>\u003cb>{{m.voice}}\u003c/b>\u003c/p>\n          \u003cp>\u003cspan>Supplies\u003c/span>\u003cb>{{m.zeni}} zeni\u003c/b>\u003c/p>\u003cp>\u003cspan>Landmarks\u003c/span>\u003cb>{{m.fame}}\u003c/b>\u003c/p>\n          \u003cp class=\"tp-note\">Field note: \u201c{{m.quote}}\u201d\u003c/p>\n          \u003cdiv class=\"tp-scale\">\u003ci>\u003c/i>\u003cspan>{{m.tags}}\u003c/span>\u003c/div>\n        \u003c/div>\n        \u003cp class=\"tp-foot\">{{m.foot}}\u003c/p>\n      \u003c/sc-if>\n      \u003c!--LAYOUTS-->\n      \u003cdiv class=\"tx tx-grain\">\u003c/div>\n      \u003cdiv class=\"{{txClass}}\">\u003c/div>\n      \u003cdiv class=\"layer glare\" style=\"{{glareStyle}}\">\u003c/div>\n      \u003cdiv class=\"{{vigClass}}\">\u003c/div>\n      \u003cdiv class=\"layer bevel\">\u003c/div>\n    \u003c/div>\n    \u003cdiv class=\"back\" style=\"{{faceStyle}}\">\n      \u003csc-for list=\"{{under}}\" as=\"u\" hint-placeholder-count=\"1\">\u003cdiv class=\"{{u}}\">\u003c/div>\u003c/sc-for>\n      \u003cdiv class=\"layer\" style=\"{{backPattern}}\">\u003c/div>\n      \u003cdiv style=\"{{frame1}}\">\u003c/div>\n      \u003cdiv style=\"{{frame2}}\">\u003c/div>\n      \u003cdiv style=\"position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center\">\n        \u003cdiv style=\"{{medal}}\">\u003cdiv style=\"{{medalIn}}\">\u003csvg width=\"96\" height=\"96\" viewBox=\"0 0 24 24\" fill=\"{{accent}}\" aria-hidden=\"true\">\u003cpath d=\"M12 0C13 9 15 11 24 12C15 13 13 15 12 24C11 15 9 13 0 12C9 11 11 9 12 0Z\">\u003c/path>\u003c/svg>\u003c/div>\u003c/div>\n        \u003cp style=\"{{backWord}}\">TCD'S SCORD\u003c/p>\n        \u003cp style=\"{{edStyle}}\">{{edition}}\u003c/p>\n      \u003c/div>\n      \u003csc-if value=\"{{foilBack}}\" hint-placeholder-val=\"{{ true }}\">\u003cdiv class=\"{{foilClass}}\" style=\"{{foilStyle}}\">\u003c/div>\u003c/sc-if>\n      \u003cdiv class=\"tx tx-grain\">\u003c/div>\n      \u003cdiv class=\"{{txClass}}\">\u003c/div>\n      \u003cdiv class=\"layer glare\" style=\"{{glareStyle}}\">\u003c/div>\n      \u003cdiv class=\"{{vigClass}}\">\u003c/div>\n      \u003cdiv class=\"layer bevel\">\u003c/div>\n    \u003c/div>\n  \u003c/div>\n\u003c/div>\n";

const FOIL = {
  rainbow: '#ff6fb5 0%,#ffd86f 6%,#6fffc8 12%,#6fb8ff 18%,#c08bff 24%,#ff6fb5 30%',
  pastel: '#ffc6e3 0%,#fff1b8 6%,#c8ffe9 12%,#c6e2ff 18%,#e6d2ff 24%,#ffc6e3 30%',
  gold: '#fff1c1 0%,#c8922c 6%,#fff8e0 12%,#a8761a 18%,#ffe7a3 24%,#fff1c1 30%',
  silver: '#ffffff 0%,#8f9bb0 6%,#f3f6fb 12%,#6f7b90 18%,#dfe6f2 24%,#ffffff 30%',
  rose: '#ffe2da 0%,#c98276 6%,#fff2ee 12%,#b06a5f 18%,#f3c3b6 24%,#ffe2da 30%',
  copper: '#ffd2a8 0%,#b8632d 6%,#ffe6cc 12%,#9a4f20 18%,#f2b27a 24%,#ffd2a8 30%',
};
const NAME = {
  pewter: '#3f4651,#6d7581 30%,#c9ced6 40%,#5a626e 48%,#47505b 70%,#8a929e 85%,#3f4651',
  silver: '#8e9bb2,#eef3fb 20%,#ffffff 28%,#a9b6cc 44%,#e3eaf6 62%,#8391a8 80%,#dfe7f4',
  chrome: '#8c97a6,#ffffff 30%,#aeb8c6 50%,#eef2f8 70%,#8c97a6',
  gold: '#8a6214,#f6dd8a 20%,#fff7da 28%,#c9932a 44%,#f9e6a0 62%,#a3741b 80%,#f3d47c',
  prism: '#e9d5ff,#ffb3e1 18%,#fff3c4 34%,#b6f5e6 50%,#b9d4ff 66%,#e4c2ff 82%,#e9d5ff',
  'prism-dark': '#c2185b,#7b1fa2 25%,#1565c0 50%,#00838f 75%,#c2185b',
  rose: '#9c5a52,#e8a99c 30%,#b8736a 50%,#e2a597 70%,#9c5a52',
  aurora: '#7ef5cf,#b9a6ff 30%,#7fd6ff 50%,#d8b8ff 70%,#86f0c8',
  ice: '#3f6f99,#7fb0d8 30%,#2f5f8a 50%,#6fa3cf 70%,#3f6f99',
  copper: '#b8632d,#f2b27a 30%,#d07a3f 50%,#ffc993 70%,#b8632d',
  sunfire: '#5c1a0e,#9a3412 30%,#3d1208 50%,#8a2c12 70%,#5c1a0e',
  sakura: '#a8325f,#d9668f 30%,#9a2c55 50%,#cf5a84 70%,#a8325f',
  nebula: '#d6a8ff,#ffb3e1 30%,#a8c4ff 50%,#e6c8ff 70%,#d6a8ff',
};
const SHAPES = {
  circle: [214, 214, '', '50%'], arch: [212, 242, '', '106px 106px 14px 14px'], square: [206, 206, '', '6px'],
  hex: [240, 210, 'clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);', '0'],
  diamond: [236, 236, 'clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);', '0'],
  shield: [210, 236, 'clip-path:polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);', '0'],
};
const CORNERS = ['left:24px;top:24px', 'right:24px;top:24px;transform:scaleX(-1)',
  'left:24px;bottom:24px;transform:scaleY(-1)', 'right:24px;bottom:24px;transform:scale(-1,-1)'];
const FALLBACK = { edition: '', bg: '#1a1a20', ink: '#eee', sub: '#999', accent: '#777', faint: 'rgba(255,255,255,.2)',
  fill: '#2a2a30', initial: '#ccc', shape: 'circle', corner: 'none', name: 'silver', under: [], foil: { kind: 'none' }, glare: 0.4, light: false };
const SAMPLE = { name: 'TCD', initial: 'T', avatar: '', tags: 'OG · MOD', voice: '0h', msgs: '100', zeni: '0', fame: '0',
  plays: 'SWITCH 2 · PC · PS5', quote: 'I can ask Steven to add you.', foot: "NO. 001 · SINCE MARCH 2023 · TCD'S SCORD" };
const roman = (n) => [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  .reduce((out, [v, c]) => { while (n >= v) { out += c; n -= v; } return out; }, '') || '0';
// what each layout is printed on; classic cards get linen stock (light) or brushed metal (dark)
const TEXTURE = { fullart: 'film', pixel: 'crt', synth: 'film', term: 'crt', manga: 'paper', blueprint: 'none', swiss: 'paper', polaroid: 'parchment',
  tarot: 'linen', vinyl: 'paper', receipt: 'none', wanted: 'parchment', passport: 'paper', neon: 'film', glass: 'glass', cyber: 'film',
  weather: 'film', recipe: 'paper', boarding: 'paper', poster: 'film', cart: 'brushed', wave: 'paper', blackcard: 'brushed', topo: 'paper' };
const SERIF = "font-family:'Cormorant Garamond',Georgia,serif;";

class Component extends DCLogic {
  constructor(props) {
    super(props);
    // idle: slow loop · hover: tilt toward pointer · drag/spin: free rotation · rest: settled on a side
    this.state = { data: null, mode: 'idle', x: 0.5, y: 0.5, rx: 0, ry: 0, base: 0 };
  }
  componentDidMount() {
    fetch('/_blob/b240693f9171fc96a78cfc4565e59879').then((r) => r.json()).then((data) => this.setState({ data }))
      .catch(() => {});
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.idleT);
  }
  settle(ry) {
    const base = Math.round(ry / 180) * 180;
    this.setState({ mode: 'rest', rx: 0, ry: base, base });
    if (Math.abs(Math.round(base / 180)) % 2 === 0) {
      this.idleT = setTimeout(() => { this.resumed = true; this.setState({ mode: 'idle', ry: 0, base: 0 }); }, 2500);
    }
  }
  renderVals() {
    const { data, mode, x, y, rx, ry, base } = this.state;
    const animate = this.props.animate ?? true;
    const t = (data && data[this.props.edition ?? 'aurum']) || FALLBACK;
    const [w, h, clip, radius] = SHAPES[t.shape] || SHAPES.circle;
    const f = t.foil || { kind: 'none' };
    const hasFoil = f.kind && f.kind !== 'none';
    const m = { ...SAMPLE, ...(this.props.member || {}) };
    // the light comes from the card's angle, so foil and glare track every turn
    const pose = (ax, ay) => {
      const sx = Math.sin(ay * Math.PI / 180), sy = Math.sin(ax * Math.PI / 180);
      const c = (v) => Math.max(-1, Math.min(1, v));
      return `--rx:${ax.toFixed(2)}deg;--ry:${ay.toFixed(2)}deg;--px:${c(sx * 3).toFixed(3)};--py:${(-c(sy * 3)).toFixed(3)};` +
        `--hl:${Math.min(1, (Math.abs(sx) + Math.abs(sy)) * 2.4).toFixed(2)}`;
    };
    const tiltStyle = mode === 'idle' ? `--d:-${this.resumed ? 4 : this.props.delay ?? 0}s`
      : mode === 'hover' ? pose((0.5 - y) * 16, base + (x - 0.5) * 20) : pose(rx, ry);
    return {
      tiltClass: 'tilt ' + (mode === 'idle' ? (animate ? 'idle' : 'still') : mode === 'drag' || mode === 'spin' ? 'live' : ''),
      tiltStyle,
      onDown: (e) => {
        cancelAnimationFrame(this.raf);
        clearTimeout(this.idleT);
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
        const { mode, x, y, base } = this.state;
        let { rx, ry } = this.state;
        if (mode === 'hover') { rx = (0.5 - y) * 16; ry = base + (x - 0.5) * 20; }
        if (mode === 'idle') {
          // pick the card up exactly where the idle loop has it right now
          try {
            const mt = new DOMMatrix(getComputedStyle(e.currentTarget).transform);
            ry = Math.asin(Math.max(-1, Math.min(1, mt.m31))) * 180 / Math.PI;
            rx = Math.atan2(mt.m23, mt.m22) * 180 / Math.PI;
          } catch (_) { rx = 0; ry = 0; }
        }
        this.drag = { x: e.clientX, y: e.clientY, t: performance.now(), v: 0 };
        this.setState({ mode: 'drag', rx, ry });
      },
      onMove: (e) => {
        const d = this.drag;
        if (this.state.mode === 'drag' && d) {
          const now = performance.now(), dx = e.clientX - d.x, dy = e.clientY - d.y;
          d.v = (dx * 0.6) / Math.max(1, now - d.t);
          Object.assign(d, { x: e.clientX, y: e.clientY, t: now });
          this.setState({ ry: this.state.ry + dx * 0.6, rx: Math.max(-60, Math.min(60, this.state.rx - dy * 0.4)) });
          return;
        }
        if (this.state.mode === 'spin') return;
        const r = e.currentTarget.getBoundingClientRect();
        this.setState({ mode: 'hover', x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
          y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) });
      },
      onUp: () => {
        if (this.state.mode !== 'drag') return;
        // a flick keeps spinning and slows with friction; a stale grab just settles
        let v = performance.now() - this.drag.t > 80 ? 0 : this.drag.v, last = performance.now();
        const step = (now) => {
          const dt = Math.max(0, Math.min(48, now - last));
          last = now;
          v *= Math.pow(0.996, dt);
          const ry = this.state.ry + v * dt;
          if (Math.abs(v) < 0.03) return this.settle(ry);
          this.setState({ mode: 'spin', ry, rx: this.state.rx * Math.pow(0.994, dt) });
          this.raf = requestAnimationFrame(step);
        };
        this.raf = requestAnimationFrame(step);
      },
      onLeave: () => {
        if (this.state.mode === 'hover') this.setState({ mode: this.state.base ? 'rest' : 'idle' });
      },
      accent: t.accent,
      backPattern: `opacity:.6;background:repeating-linear-gradient(45deg,${t.faint} 0 1px,transparent 1px 14px),` +
        `repeating-linear-gradient(-45deg,${t.faint} 0 1px,transparent 1px 14px);` +
        `-webkit-mask-image:radial-gradient(circle,transparent 0 120px,#000 230px);mask-image:radial-gradient(circle,transparent 0 120px,#000 230px)`,
      medal: `width:180px;height:180px;padding:3px;box-sizing:border-box;border-radius:50%;` +
        `background:linear-gradient(145deg,#ffffff 0%,${t.accent} 35%,${t.accent} 65%,rgba(0,0,0,.35) 100%);` +
        `filter:drop-shadow(0 10px 18px rgba(0,0,0,${t.light ? '.18' : '.45'}))`,
      medalIn: `width:100%;height:100%;border-radius:50%;background:${t.fill};box-shadow:inset 0 6px 18px rgba(0,0,0,.35);` +
        `display:flex;align-items:center;justify-content:center`,
      backWord: SERIF + `margin:28px 0 10px;font-weight:700;font-size:30px;letter-spacing:8px;color:${t.ink}`,
      foilBack: hasFoil,
      m,
      noAvatar: !m.avatar,
      avStyle: 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover',
      faceStyle: `background:${t.bg};color:${t.ink};--ink:${t.ink};--sub:${t.sub};--accent:${t.accent};--faint:${t.faint};--fill:${t.fill}`,
      classic: !t.layout,
      tpName: `font-size:${m.name.length <= 6 ? 50 : m.name.length <= 11 ? 36 : 24}px`,
      bcNum: [(m.foot.match(/No\.\s*(\d+)/i) || [])[1] || '0', (m.foot.match(/(\d{4})/) || [])[1] || '2023', m.zeni, m.msgs]
        .map((v) => String(v).replace(/\D/g, '').padStart(4, '0').slice(-4)).join(' '),
      bcSince: ((x) => x ? x[1].slice(0, 3) + ' ' + x[2].slice(2) : '—')(m.foot.match(/since\s+([A-Za-z]+)\s+(\d{4})/i)),
      wvName: `font-size:${m.name.length <= 6 ? 40 : m.name.length <= 10 ? 28 : m.name.length <= 15 ? 20 : 14}px`,
      ctName: `font-size:${m.name.length <= 8 ? 20 : m.name.length <= 14 ? 13 : 9}px`,
      mvName: `font-size:${m.name.length <= 5 ? 128 : m.name.length <= 9 ? 92 : m.name.length <= 15 ? 60 : 40}px`,
      bdFrom: (m.name.replace(/[^A-Za-z]/g, '').slice(0, 3) || 'TCD').toUpperCase(),
      rpName: `font-size:${m.name.length <= 8 ? 54 : m.name.length <= 14 ? 40 : 28}px`,
      wxName: `font-size:${m.name.length <= 8 ? 36 : m.name.length <= 14 ? 28 : 21}px`,
      txClass: 'tx tx-' + (t.texture || TEXTURE[t.layout] || (t.light ? 'linen' : 'brushed')),
      cyName: `font-size:${m.name.length <= 6 ? 46 : m.name.length <= 10 ? 34 : m.name.length <= 16 ? 23 : 16}px`,
      sgName: `font-size:${m.name.length <= 8 ? 34 : m.name.length <= 14 ? 24 : 17}px`,
      neName: `font-size:${m.name.length <= 6 ? 76 : m.name.length <= 10 ? 56 : m.name.length <= 16 ? 40 : 28}px`,
      ppName: `font-size:${m.name.length <= 10 ? 22 : 15}px`,
      mrz1: ('P<SCD' + m.name.toUpperCase().replace(/[^A-Z0-9]+/g, '<') + '<<').padEnd(44, '<').slice(0, 44),
      mrz2: (String(parseInt((m.foot.match(/No\.\s*(\d+)/i) || [])[1] || '0', 10)).padStart(9, '0') + '<8SCD' +
        [m.voice, m.msgs, m.zeni, m.fame].join('').replace(/\D/g, '')).padEnd(44, '<').slice(0, 44),
      wtName: `font-size:${m.name.length <= 8 ? 40 : m.name.length <= 14 ? 28 : 20}px`,
      rcName: `font-size:${m.name.length <= 8 ? 30 : m.name.length <= 14 ? 22 : 16}px`,
      vnName: `font-size:${m.name.length <= 5 ? 72 : m.name.length <= 9 ? 50 : m.name.length <= 13 ? 34 : m.name.length <= 18 ? 25 : 18}px`,
      trNum: roman(parseInt((m.foot.match(/No\.\s*(\d+)/i) || [])[1] || '0', 10)),
      trName: `font-size:${m.name.length <= 6 ? 34 : m.name.length <= 12 ? 26 : 19}px`,
      plName: `font-size:${m.name.length <= 8 ? 46 : m.name.length <= 14 ? 34 : 24}px`,
      plQuote: `font-size:${m.quote.length > 90 ? 17 : m.quote.length > 45 ? 21 : 26}px`,
      sxName: `font-size:${Math.min(118, Math.floor(600 / (Math.max(1, m.name.length) * 0.74)))}px`,   // fill the edge, never overflow
      bpName: `font-size:${m.name.length <= 8 ? 40 : m.name.length <= 14 ? 28 : 20}px`,
      mgName: `font-size:${m.name.length <= 6 ? 84 : m.name.length <= 10 ? 60 : m.name.length <= 16 ? 42 : 30}px`,
      mgQuote: `font-size:${m.quote.length > 90 ? 14 : m.quote.length > 50 ? 17 : 20}px`,
      tmName: `font-size:${m.name.length <= 8 ? 64 : m.name.length <= 14 ? 44 : 30}px`,
      swName: `font-size:${m.name.length <= 6 ? 50 : m.name.length <= 10 ? 36 : m.name.length <= 16 ? 24 : 17}px`,
      pxAvatar: m.avatar.replace(/([?&])size=\d+/, '$1size=32'),   // Discord serves a true 32×32, drawn blocky
      pxName: `font-size:${m.name.length <= 6 ? 30 : m.name.length <= 10 ? 22 : m.name.length <= 16 ? 15 : 11}px`,
      L: { [t.layout || 'classic']: true },
      under: (t.under || []).map((u) => 'layer ' + u),
      frame1: `position:absolute;inset:14px;border:1.5px solid ${t.accent};border-radius:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 1px 0 rgba(0,0,0,.25)`,
      frame2: `position:absolute;inset:20px;border:1px solid ${t.faint};border-radius:8px`,
      corners: t.corner === 'none' ? [] : CORNERS.map((pos) => ({ style: 'position:absolute;' + pos, color: t.accent,
        fil: t.corner === 'fil', deco: t.corner === 'deco', star: t.corner === 'star', bracket: t.corner === 'bracket',
        leaf: t.corner === 'leaf', petal: t.corner === 'petal' })),
      edition: t.drop ? `${t.drop.toUpperCase()} · ${t.edition}` : t.edition,
      edStyle: `margin:0;font-size:11px;font-weight:500;letter-spacing:6px;color:${t.sub}`,
      pOuter: `margin-top:22px;width:${w}px;height:${h}px;padding:3px;box-sizing:border-box;border-radius:${radius};${clip}` +
        `background:linear-gradient(145deg,#ffffff 0%,${t.accent} 35%,${t.accent} 65%,rgba(0,0,0,.35) 100%);` +
        `filter:drop-shadow(0 10px 18px rgba(0,0,0,${t.light ? '.18' : '.45'}))`,
      pInner: `position:relative;overflow:hidden;width:100%;height:100%;border-radius:${radius};${clip}background:${t.fill};` +
        `box-shadow:inset 0 6px 18px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center`,
      initStyle: SERIF + `font-weight:700;font-size:${t.shape === 'diamond' ? 72 : 92}px;line-height:1;color:${t.initial}`,
      phStyle: `font-size:10px;letter-spacing:2px;color:${t.sub}`,
      nameStyle: SERIF + `margin:22px 0 0;font-weight:700;font-size:${m.name.length <= 6 ? 58 : m.name.length <= 10 ? 46 : m.name.length <= 16 ? 36 : 28}px;line-height:1.05;max-width:100%;text-align:center;overflow-wrap:anywhere;background-image:linear-gradient(100deg,${NAME[t.name] || NAME.silver})`,
      tagStyle: `margin:8px 0 0;text-transform:uppercase;font-size:12px;font-weight:500;letter-spacing:6px;color:${t.sub}`,
      rule: `margin-top:14px;width:120px;height:1px;background:linear-gradient(90deg,transparent,${t.accent},transparent)`,
      numStyle: SERIF + `font-weight:600;font-size:28px;line-height:1;color:${t.ink}`,
      labStyle: `margin-top:5px;font-size:10px;letter-spacing:2.5px;color:${t.sub}`,
      platStyle: `margin:14px 0 0;text-transform:uppercase;text-align:center;font-size:11px;letter-spacing:3px;color:${t.sub}`,
      quoteStyle: SERIF + `margin:14px 0 0;max-width:360px;text-align:center;font-style:italic;font-weight:500;font-size:${m.quote.length > 90 ? 17 : 22}px;line-height:1.25;color:${t.ink}`,
      footStyle: `margin:auto 0 0;text-transform:uppercase;font-size:10px;letter-spacing:2.5px;color:${t.sub}`,
      foilCard: hasFoil && f.scope !== 'portrait',
      foilPortrait: hasFoil && f.scope === 'portrait',
      foilClass: 'layer foil ' + (f.mask && f.mask !== 'none' ? f.mask : ''),
      foilStyle: hasFoil ? `--foil:repeating-linear-gradient(110deg,${FOIL[f.kind]});--op:${f.op};mix-blend-mode:${f.blend}` : '',
      glareStyle: `--g:${t.glare}`,
      vigClass: 'layer vignette' + (t.light ? ' soft' : ''),
    };
  }
}

mount();
