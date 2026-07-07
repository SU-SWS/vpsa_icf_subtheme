# VPSA ICF Subtheme

Stanford Sites subtheme built on `stanford_basic`, scaffolded from `stanford_starter`.

## Setup

1. `npm install`
2. `npm run build` — compile CSS once
3. `npm run watch` — compile CSS on file changes

## SCSS structure

src/scss/
├── main.scss                        # Entry point
├── ckeditor5.scss                   # CKEditor 5 editor styles
├── utilities/
│   ├── variables/_colors.scss       # $vicf-color-* variables
│   └── mixins/_buttons|_cta|_link-icon.scss
├── base/        # HTML element styles only
├── components/  # Reusable UI components (.vicf-*)
├── layout/      # Page/grid layout
├── state/       # Client-side state (.is-*, js-*)
├── print/       # Print styles
└── theme/       # Visual overrides (buttons, CTAs, section colors)

## Section color overrides

The following Stanford Sites section background colors are overridden in `src/scss/theme/_sections.scss`. The selector class names are anchored to the original palette hex (set by `stanford_layout_paragraphs`) and will not change if the palette label changes.

| Palette label | Original hex | Override |
|---|---|---|
| Poppy Light 10 | `#f7ecde` | `#fefad7` |
| Palo Alto Light | `#dcefec` | `#d2e3c9` |
| Lagunita Light | `#dcecef` | `#dff3fa` |
| Plum Light | `#f2e8f1` | `src/assets/sunsetbanner.png` (image, `cover`) |

## Naming conventions

| Type | Pattern | Example |
|---|---|---|
| SCSS variable | `$vicf-color-[name]` | `$vicf-color-navy` |
| SCSS mixin | `vicf-[name]` | `vicf-button--primary` |
| CSS class | `.vicf-[component]` | `.vicf-card` |
