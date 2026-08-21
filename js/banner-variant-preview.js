/**
 * @file
 * Apply banner variant/overlay classes in edit & preview UIs.
 *
 * React / Layout Paragraphs canvases often render the hero markup before (or
 * without) PHP preprocess, so `.vicf-banner--*` never lands on the wrapper.
 * This keeps the preview in sync with the Banner Style / Overlay selects.
 */
(function (Drupal, once) {
  const VARIANT_RE = /^vicf-banner--/;
  const OVERLAY_RE = /^vicf-banner-overlay--/;

  function isVariantClass(value) {
    return typeof value === 'string' && VARIANT_RE.test(value);
  }

  function isOverlayClass(value) {
    return typeof value === 'string' && OVERLAY_RE.test(value);
  }

  function clearVariantClasses(el) {
    Array.from(el.classList).forEach((className) => {
      if (VARIANT_RE.test(className) || OVERLAY_RE.test(className)) {
        el.classList.remove(className);
      }
    });
  }

  function targetsFor(select) {
    const roots = new Set();
    const component = select.closest(
      '.js-lpb-component, .ptype-stanford-banner, .paragraph--type--stanford-banner, [data-paragraph-type="stanford_banner"]',
    );

    if (component) {
      roots.add(component);
      component.querySelectorAll(
        '.ptype-stanford-banner, .ds-entity--stanford-banner, .paragraph--type--stanford-banner, .su-hero',
      ).forEach((el) => roots.add(el));
    }

    // Layout Paragraphs form dialogs often sit outside the canvas component.
    const form = select.closest('form');
    const dialog = select.closest('.ui-dialog, .lpb-dialog, .ck-body-wrapper');
    const scope = dialog || form || document;
    scope.querySelectorAll(
      '.js-lpb-component--active .ptype-stanford-banner, .js-lpb-component.is-editing .ptype-stanford-banner, .ptype-stanford-banner.vicf-banner-preview-target',
    ).forEach((el) => roots.add(el));

    // Last resort: only when a single banner is on the page.
    if (!roots.size) {
      const banners = document.querySelectorAll('.ptype-stanford-banner, .ds-entity--stanford-banner');
      if (banners.length === 1) {
        roots.add(banners[0]);
      }
    }

    return Array.from(roots);
  }

  function findPair(select) {
    const scope = select.closest(
      '.lpb-behavior-plugins, .behavior-plugins, fieldset, form, .ui-dialog, .paragraphs-behavior',
    ) || select.parentElement;

    const selects = scope
      ? Array.from(scope.querySelectorAll('select'))
      : [select];

    let variantSelect = null;
    let overlaySelect = null;

    selects.forEach((el) => {
      const name = `${el.getAttribute('name') || ''} ${el.id || ''} ${el.getAttribute('data-drupal-selector') || ''}`.toLowerCase();
      const values = Array.from(el.options).map((option) => option.value);
      if (values.some(isVariantClass) || name.includes('banner_variant') || name.includes('banner-variant')) {
        variantSelect = el;
      }
      if (values.some(isOverlayClass) || name.includes('banner_overlay') || name.includes('banner-overlay')) {
        overlaySelect = el;
      }
    });

    return { variantSelect, overlaySelect };
  }

  function applyClasses(select) {
    const { variantSelect, overlaySelect } = findPair(select);
    const variant = variantSelect && isVariantClass(variantSelect.value)
      ? variantSelect.value
      : null;
    const overlay = overlaySelect && isOverlayClass(overlaySelect.value)
      ? overlaySelect.value
      : null;

    targetsFor(select).forEach((el) => {
      clearVariantClasses(el);
      if (variant) {
        el.classList.add(variant);
      }
      if (overlay) {
        el.classList.add(overlay);
      }
      el.classList.add('vicf-banner-preview-target');
    });
  }

  function isBannerBehaviorSelect(select) {
    const name = `${select.getAttribute('name') || ''} ${select.id || ''}`.toLowerCase();
    if (name.includes('banner_variant') || name.includes('banner_overlay') || name.includes('banner-variant') || name.includes('banner-overlay')) {
      return true;
    }
    return Array.from(select.options).some((option) => (
      isVariantClass(option.value) || isOverlayClass(option.value)
    ));
  }

  Drupal.behaviors.vpsaBannerVariantPreview = {
    attach(context) {
      once('vicf-banner-variant-preview', 'select', context).forEach((select) => {
        if (!isBannerBehaviorSelect(select)) {
          return;
        }

        const sync = () => applyClasses(select);
        select.addEventListener('change', sync);
        sync();
      });
    },
  };
})(Drupal, once);
