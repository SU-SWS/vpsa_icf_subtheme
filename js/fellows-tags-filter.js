/**
 * @file
 * Present people_filtered tags as a single select with Fellows labels.
 *
 * Inserts a visible select *outside* #preact-tags (which we hide), and drives
 * the real tags[] field so Views/BEF keep working without PHP overrides.
 */
(function (Drupal, once) {
  const ALL_VALUE = '__all__';

  function yearLabel(text) {
    const cleaned = String(text || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .trim()
      .replace(/^[-–—\s]+/, '');
    return cleaned;
  }

  function collectOptions(realSelect) {
    const options = [{ value: ALL_VALUE, label: Drupal.t('All Fellows') }];
    Array.from(realSelect.options).forEach((option) => {
      const text = yearLabel(option.textContent);
      if (/^\d{4}$/.test(text)) {
        options.push({
          value: option.value,
          label: Drupal.t('@year Fellows', { '@year': text }),
        });
      }
    });
    return options;
  }

  function currentValue(realSelect) {
    const selected = Array.from(realSelect.selectedOptions)
      .map((option) => option.value)
      .filter(Boolean);
    if (!selected.length) {
      return ALL_VALUE;
    }
    // Prefer a year tid if one is selected.
    const yearOption = Array.from(realSelect.options).find((option) => (
      selected.includes(option.value) && /^\d{4}$/.test(yearLabel(option.textContent))
    ));
    return yearOption ? yearOption.value : ALL_VALUE;
  }

  function applyValue(realSelect, value) {
    Array.from(realSelect.options).forEach((option) => {
      option.selected = value !== ALL_VALUE && option.value === value;
    });

    // Notify Chosen / BEF / Preact listeners.
    if (typeof window.jQuery === 'function') {
      const $select = window.jQuery(realSelect);
      $select.trigger('chosen:updated');
      $select.trigger('change');
    }
    else {
      realSelect.dispatchEvent(new Event('input', { bubbles: true }));
      realSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function syncOpenState(select, wrapper) {
    const setOpen = (open) => {
      wrapper.classList.toggle('is-open', Boolean(open));
    };

    const matchesOpen = () => {
      try {
        return select.matches(':open');
      }
      catch (e) {
        return false;
      }
    };

    // Chromium / Safari: fires when the picker opens or closes.
    select.addEventListener('toggle', () => {
      setOpen(matchesOpen());
    });

    // Fallback when :open / toggle is unavailable.
    select.addEventListener('mousedown', () => {
      window.requestAnimationFrame(() => {
        setOpen(matchesOpen() || true);
      });
    });

    select.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key === ' ' || event.key === 'Enter' || event.key === 'ArrowDown') {
        window.requestAnimationFrame(() => {
          setOpen(matchesOpen() || true);
        });
      }
    });

    select.addEventListener('blur', () => setOpen(false));
    select.addEventListener('change', () => setOpen(false));
  }

  function mountFilter(form) {
    if (form.querySelector('[data-vpsa-fellows-tags]')) {
      return true;
    }

    const realSelect = form.querySelector('#edit-tags, select[name="tags[]"], select[name="tags"]');
    if (!realSelect) {
      return false;
    }

    const options = collectOptions(realSelect);
    if (options.length < 2) {
      return false;
    }

    const preact = form.querySelector('#preact-tags');
    const wrapper = document.createElement('div');
    wrapper.className = 'form-item vpsa-fellows-tags-filter';

    const label = document.createElement('label');
    label.className = 'visually-hidden';
    label.setAttribute('for', 'vpsa-fellows-tags-select');
    label.textContent = Drupal.t('Fellows year');

    const select = document.createElement('select');
    select.id = 'vpsa-fellows-tags-select';
    select.className = 'form-select';
    select.setAttribute('data-vpsa-fellows-tags', '1');

    options.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });

    select.value = currentValue(realSelect);
    select.addEventListener('change', () => {
      applyValue(realSelect, select.value);
    });
    syncOpenState(select, wrapper);

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    // Place visible select before the Preact block (Preact stays hidden via CSS).
    if (preact && preact.parentNode) {
      preact.parentNode.insertBefore(wrapper, preact);
    }
    else {
      form.insertBefore(wrapper, form.firstChild);
      realSelect.classList.add('visually-hidden');
    }

    realSelect.dataset.vpsaFellowsSelect = '1';
    return true;
  }

  Drupal.behaviors.vpsaFellowsTagsFilter = {
    attach(context) {
      // .people-filtered is on the view wrapper; form is a descendant.
      once('vpsa-fellows-tags-filter', '.people-filtered form.bef-exposed-form', context).forEach((form) => {
        if (mountFilter(form)) {
          return;
        }

        // tags[] options may not be ready on first attach — retry briefly.
        const observer = new MutationObserver(() => {
          if (mountFilter(form)) {
            observer.disconnect();
          }
        });
        observer.observe(form, { childList: true, subtree: true });
        window.setTimeout(() => observer.disconnect(), 10000);
      });
    },
  };
})(Drupal, once);
