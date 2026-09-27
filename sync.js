#!/usr/bin/env node
// Writes the house style into a product, stamped with its version and
// fingerprint:  node sync.js <path to the product's copy>
// The product's own check (house.check, below) recomputes the fingerprint,
// so an edit made to a product's copy instead of here fails that product's
// tests rather than drifting quietly.
const fs = require('fs');
const path = require('path');
const house = require('./house');

const target = process.argv[2];
if (!target) { console.error('Usage: node sync.js <path to the product copy of ws-house.css>'); process.exit(1); }
const source = fs.readFileSync(path.join(__dirname, 'ws-house.css'), 'utf8');
const { version } = require('./package.json');
fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
fs.writeFileSync(target, house.stamp(source, version));
console.log('Wrote ws-house.css ' + version + ' to ' + target);
