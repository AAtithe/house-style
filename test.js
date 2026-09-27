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
console.log(n + ' passed');
