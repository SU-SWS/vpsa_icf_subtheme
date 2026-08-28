# VPSA ICF Subtheme

Stanford Sites subtheme built on `stanford_basic`, scaffolded from `stanford_starter`.

## Developer Setup

1. Install dependencies:
   - `npm install`
2. Build assets once:
   - `npm run build`
3. Watch for changes and rebuild automatically:
   - `npm run watch`

> If you use `nvm`, run `nvm use` first to ensure the correct Node version is active.

This project uses webpack to assemble the CSS, JavaScript, and image assets required by the theme.

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

## Banner edit previews (`vpsa_icf_banner`)

Stanford Sites edits content under Claro/Gin, so this theme’s PHP and CSS do not run in Layout Paragraphs / paragraph widget previews. The companion module in `modules/vpsa_icf_banner` applies `vicf-banner--*` classes and attaches `vpsa_icf_subtheme/allpages` during those previews.

1. Copy or symlink `modules/vpsa_icf_banner` into the site’s `modules/custom/` (Drupal does not discover modules inside a theme directory).
2. Enable: `drush en vpsa_icf_banner -y`
3. Clear caches.
