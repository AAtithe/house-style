// The stylesheet against its own rules, and the stamp round trip.
const fs = require('fs');
const assert = require('assert');
const house = require('./house');

const css = fs.readFileSync(__dirname + '/ws-house.css', 'utf8');
const body = css.replace(/\/\*[\s\S]*?\*\//g, '');
let n = 0;
const ok = (what, fn) => { fn(); n++; console.log('  ok   ' + what); };

ok('every var(--...) names a token defined on :root', () => {
  const defined = new Set([...body.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  const used = [...new Set([...body.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))];
  assert.deepStrictEqual(used.filter((v) => !defined.has(v)), []);
});
ok('no hex typed outside :root, white aside', () => {
  const rest = body.replace(/:root\{[^}]*\}/, '');
  assert.deepStrictEqual((rest.match(/#[0-9a-fA-F]{3,6}\b/g) || []).filter((h) => !/^#fff(fff)?$/i.test(h)), []);
});
ok('no table heading draws navy writing on the navy fill', () => {
  const bad = [...body.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((r) => /\bth\b/.test(r[1]) && /color:var\(--navy\)/.test(r[2]) && !/background:transparent/.test(r[2]));
  assert.deepStrictEqual(bad.map((r) => r[1].trim()), []);
});
ok('no system-ui in the type stack', () => assert(!/system-ui/.test(body)));
ok('a stamped copy checks, an edited one does not', () => {
  const s = house.stamp(css, '9.9.9');
  assert.strictEqual(house.check(s).version, '9.9.9');
  assert.strictEqual(house.check(s).css, css);
  assert.throws(() => house.check(s.replace('--navy:#003359', '--navy:#000000')), /edited/);
  assert.throws(() => house.check(css), /no house-style stamp/);
});

// The logos: every file present, drawn only in house colours, and no script in an SVG.
const brand = __dirname + '/brand/';
const token = (name) => (body.match(new RegExp(name + ':(#[0-9a-fA-F]{6})')) || [])[1].toUpperCase();
const FILES = ['ws-wordmark', 'ws-wordmark-reversed', 'ws-monogram', 'ws-monogram-reversed'];
ok('every logo is here as SVG and PNG, with the icon', () => {
  for (const f of FILES) { assert(fs.existsSync(brand + f + '.svg'), f + '.svg'); assert(fs.existsSync(brand + f + '.png'), f + '.png'); }
  assert(fs.existsSync(brand + 'ws-icon-256.png'));
});
ok('logos use only navy, coral and WS blue (white on the reversed ones)', () => {
  const allowed = new Set([token('--navy'), token('--coral'), token('--wsblue')]);
  for (const f of FILES) {
    const svg = fs.readFileSync(brand + f + '.svg', 'utf8');
    const fills = [...svg.matchAll(/fill="(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toUpperCase());
    const extra = fills.filter((c) => !allowed.has(c) && !(f.endsWith('reversed') && c === '#FFFFFF'));
    assert.deepStrictEqual(extra, [], f);
    assert(fills.includes(f.endsWith('reversed') ? '#FFFFFF' : token('--navy')), f + ' has its main colour');
  }
});
ok('no SVG carries script, links or external references', () => {
  for (const f of FILES) assert(!/<script|on\w+=|href=|xlink/i.test(fs.readFileSync(brand + f + '.svg', 'utf8')), f);
});
console.log(n + ' passed');
