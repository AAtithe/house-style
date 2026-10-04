# house-style

The Williams, Stanley & Co. house style: one stylesheet every product shares.

`ws-house.css` holds the tokens, the frame (the white band with the coral
rule, the navy header) and the components every product draws the same way:
the figures strip, tabs, filters, controls, cards, tables, pills, buttons,
notes, the drawer, the modal and the toast. A product's sidebar and its own
areas are the product's.

## Who uses it

| Product | Repository | Its copy | Loaded |
|---|---|---|---|
| Signal | WilliamsStanleyCo/Signal | `build/house/ws-house.css` | inlined first by `build/build.js` |
| Client Operations | WilliamsStanleyCo/WSCIP | `build/house/ws-house.css` | inlined first by `build/build.js` |
| Aimelia | AAtithe/Aimelia | `src/app/ws-house.css` | imported before `house.css` in `src/app/layout.tsx` |

A product loads this first and its own rules after, so a product rule of the
same specificity wins. That is how a product extends a component. It is not
how a product changes one: a change to a shared component is made here.

## Logos

`brand/` holds the firm's marks. Every product takes its logos from here,
the same way it takes the stylesheet.

| File | Use |
|---|---|
| `ws-wordmark.svg` | WILLIAMS STANLEY &CO on white or light backgrounds |
| `ws-wordmark-reversed.svg` | The same on navy: the letters white, &CO and the rule kept |
| `ws-monogram.svg` | WS with &CO and the coral rule, for small spaces |
| `ws-monogram-reversed.svg` | The monogram on navy |
| `*.png` | The same four at high resolution, transparent, for email and PDFs, which cannot use SVG |
| `ws-icon-256.png` | The square app icon and favicon: the reversed monogram on navy |

The SVGs were traced from the firm's logo artwork, one shape per colour, in
exactly `--navy`, `--wsblue` and `--coral`. The tests hold them to those
colours and refuse any script inside an SVG.

Rules:

- Use the SVG on screens, the PNG only where SVG cannot go (email, PDF).
- Size a mark by its height and let the width follow. Never set both, and
  never let a layout stretch it: in a flex column give it `align-self:flex-start`
  or `flex:none`. A logo pulled wide looks broken at once.
- Navy or white for the letters, nothing else. The reversed files are for
  navy grounds only. Payroll's BRANDING.md says internal apps put the logo on
  white only; the reversed files exist for the client deal room's navy header.
  Whether internal apps may use them too is a brand decision still to make.
- Keep clear space of at least the height of the &CO around a mark.
- The firm's name in words is "Williams, Stanley & Co".
- For print or signage, use the designer's master artwork if the firm holds
  it: these are traced and are sharp at any screen size, not a print master.

To take the logos into a product: `node ../house-style/sync.js --brand <folder>`,
for example `public/brand` or `assets/brand`. For a folder a website serves,
add `--no-readme` so the copy's provenance note is not published. Add it to the usual sync to take
both at once: `node ../house-style/sync.js build/house/ws-house.css --brand assets/brand`.

| Product | Repository | Its logos |
|---|---|---|
| Deal Room | WilliamsStanleyCo/wsdealroom | `public/brand/` |
| WSOP (Client Operations) | WilliamsStanleyCo/WSCIP | `assets/brand/` |
| Payroll | WilliamsStanleyCo/payrollcommandcenter | `assets/brand/` |
| Website | WilliamsStanleyCo/williamsstanleymarketing | `brand/`, stored, not published |

## Why a copy in each product, and not a link

Each product carries its own stamped copy rather than loading this file from
a URL at run time. A link would make every product's look depend on one more
host being up, and a release here would change every product at once without
any of them being tested against it. A copy changes a product only when that
product takes the new version, runs its tests and ships.

The copy is stamped with the version and a SHA-256 of its contents.
`house.js` is copied beside it, and each product's tests call `check()`: an
edit made to the product's copy instead of here fails that product's build.

## Changing the house style

1. Change `ws-house.css` here. `npm test` checks tokens, stray hex values,
   navy-on-navy headings and the type stack.
2. Raise the version in `package.json`: patch for a finish, minor for a new
   component, major for a change that needs product markup to change.
3. In each product: `node ../house-style/sync.js <its copy>`, run its tests,
   look at it at 1400px and 390px, and ship.

## Versions

- 1.3.0: the logos, in `brand/`: wordmark and monogram as SVG and high-resolution PNG, normal and reversed, and the icon. `sync.js --brand <folder>` copies them into a product. The stylesheet is unchanged.
- 1.2.0: ticks and radios in a filter bar keep their own size; an `<input>` with no type gets the control finish; the README says why a select's `background` shorthand must not be used.
- 1.1.0: `.drawer.wide`, 620px, for a drawer carrying a form with a row of actions (Aimelia's task drawer).
- 1.0.0: the first shared version, taken from Signal's refined finish and Client Operations' measured status fills.

## The rules

- Every colour comes from a token on `:root`. White aside, no hex elsewhere.
- Depth is navy-tinted, never black: `--shadow`, `--shadowUp`.
- One radius for panels (`--radius`, 10px), 7px for controls, 14px for modals.
- Coral marks where you are and the one primary action. It never means status.
- Status pills use the measured fills: Done is `--doneBg`, because white on
  `--green` is too faint for an 11px pill.
- Off-screen panels are hidden, not only moved, so their shadow never shows.
- Segoe UI first, the platform's face after. Never `system-ui`.
- A select's chevron is a background image. Style a select with
  `background-color`, never the `background` shorthand, or the chevron goes.

The palette's measured contrast table is `BRANDING.md` in
payrollcommandcenter. It belongs here, beside the stylesheet it governs.
