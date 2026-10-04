#!/usr/bin/env node
// Writes the house style into a product, stamped with its version and
// fingerprint:  node sync.js <path to the product's copy>
// The product's own check (house.check, below) recomputes the fingerprint,
// so an edit made to a product's copy instead of here fails that product's
// tests rather than drifting quietly.
//
// The logos travel the same way. Add --brand <folder> to copy brand/ into the
// product too, or run with --brand <folder> alone to copy only the logos:
//   node sync.js build/house/ws-house.css --brand assets/brand
//   node sync.js --brand public/brand
const fs = require('fs');
const path = require('path');
const house = require('./house');

const args = process.argv.slice(2);
const b = args.indexOf('--brand');
const brandDir = b >= 0 ? args[b + 1] : null;
if (b >= 0 && !brandDir) { console.error('--brand needs a folder'); process.exit(1); }
const target = args.filter((_, i) => b < 0 || (i !== b && i !== b + 1))[0];
if (!target && !brandDir) { console.error('Usage: node sync.js <product copy of ws-house.css> [--brand <folder>]'); process.exit(1); }
const { version } = require('./package.json');

if (target) {
  const source = fs.readFileSync(path.join(__dirname, 'ws-house.css'), 'utf8');
  fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
  fs.writeFileSync(target, house.stamp(source, version));
  console.log('Wrote ws-house.css ' + version + ' to ' + target);
}

if (brandDir) {
  const from = path.join(__dirname, 'brand');
  fs.mkdirSync(path.resolve(brandDir), { recursive: true });
  const files = fs.readdirSync(from).filter((f) => /\.(svg|png)$/.test(f));
  for (const f of files) fs.copyFileSync(path.join(from, f), path.join(brandDir, f));
  fs.writeFileSync(path.join(brandDir, 'README.md'),
    '# Williams, Stanley & Co logos\n\n' +
    'Copied from AAtithe/house-style ' + version + ' (brand/). Do not edit these copies:\n' +
    'change them in house-style and run its sync. Usage rules: the house-style README, Logos.\n');
  console.log('Copied ' + files.length + ' logo files (house-style ' + version + ') to ' + brandDir);
}
