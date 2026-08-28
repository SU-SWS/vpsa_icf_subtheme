/**
 * @file
 * Present people_filtered tags as a single select with Fellows labels.
 *
 * Inserts a visible select *outside* #preact-tags (which we hide via CSS once
 * this mounts), and drives the real tags[] field so Views/BEF keep working.
 */
(function (Drupal, once) {
  const ALL_VALUE = '__all__';

  function yearLabel(text) {
    return String(text || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .trim()
      // Hierarchy options look like "-2023".
      .replace(/^[-–—\s]+/, '');
  }

  function collectOptions(realSelect) {
    const options = [{ value: ALL_VALUE, label: Drupal.t('All Fellows') }];
    const seen = new Set();

    Array.from(realSelect.options).forEach((option) => {
      const text = yearLabel(option.textContent);
      if (!/^\d{4}$/.test(text) || seen.has(option.value)) {
        return;
      }
      seen.add(option.value);
      options.push({
        value: option.value,
        label: Drupal.t('@year Fellows', { '@year': text }),
      });
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
    const yearOption = Array.from(realSelect.options).find((option) => (
      selected.includes(option.value) && /^\d{4}$/.test(yearLabel(option.textContent))
    ));
    return yearOption ? yearOption.value : ALL_VALUE;
  }

  function applyValue(realSelect, value) {
    Array.from(realSelect.options).forEach((option) => {
      option.selected = value !== ALL_VALUE && option.value === value;
    });

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

    select.addEventListener('toggle', () => {
      setOpen(matchesOpen());
    });

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

  function findRealSelect(form) {
    return form.querySelector(
      'select[data-drupal-selector="edit-tags"], #edit-tags, select[name="tags[]"], select[name="tags"]',
    );
  }

  function isFellowsFilterForm(form) {
    return Boolean(
      form.closest('.people-filtered')
      || form.querySelector('#preact-tags')
      || findRealSelect(form),
    );
  }

  function mountFilter(form) {
    if (form.querySelector('[data-vpsa-fellows-tags]')) {
      return true;
    }

    const realSelect = findRealSelect(form);
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
      // Match the form itself so AJAX/BigPipe contexts still work. Do not require
      // `.people-filtered` as an ancestor inside `context` (that breaks once()).
      once('vpsa-fellows-tags-filter', 'form.bef-exposed-form', context).forEach((form) => {
        if (!isFellowsFilterForm(form)) {
          return;
        }

        if (mountFilter(form)) {
          return;
        }

        const observer = new MutationObserver(() => {
          if (mountFilter(form)) {
            observer.disconnect();
          }
        });
        observer.observe(form, { childList: true, subtree: true });
        window.setTimeout(() => observer.disconnect(), 15000);
      });
    },
  };
})(Drupal, once);
