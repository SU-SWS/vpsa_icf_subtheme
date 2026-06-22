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
└── theme/       # Visual overrides (buttons, CTAs)

## Naming conventions

| Type | Pattern | Example |
|---|---|---|
| SCSS variable | `$vicf-color-[name]` | `$vicf-color-navy` |
| SCSS mixin | `vicf-[name]` | `vicf-button--primary` |
| CSS class | `.vicf-[component]` | `.vicf-card` |
