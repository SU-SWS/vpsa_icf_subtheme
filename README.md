# VPSA ICF Subtheme

Stanford Sites subtheme built on `stanford_basic`, scaffolded from `stanford_starter`.

Documentation for users: https://docs.google.com/document/d/1qrgTpmH6HRbN6dLG8A5pQX5kEWWV88QkxMtXqQrpY6Q/edit?usp=sharing

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

## Paragraph variants

Author-selectable variants (banner styles, banner overlay, text area image
styles) are declared in `vpsa_icf_subtheme.react_behaviors.yml` as React
Paragraphs behavior plugins. Each option key *is* the CSS class that gets
emitted; `vpsa_icf_subtheme.theme` reads the setting and appends the class, and
the styles live in `src/scss/`.

### Known limitation: variants do not render in edit previews

Stanford Sites edits content under Claro/Gin, so this theme’s preprocess
functions and CSS do not run in Layout Paragraphs / paragraph widget previews.
Authors pick a variant and see no visual change until they save and view the
page on the front end.

This cannot be fixed from the theme, and Stanford Sites does not allow
per-site custom modules, so there is no workaround available to us. Treat it as
expected behavior and note it in author-facing documentation.
