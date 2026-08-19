/**
 * @file
 * Present people_filtered tags as a single select with Fellows labels.
 *
 * Keeps the original Views field (often tags[]) intact so Form API / Views
 * do not fatal the way runtime BEF/multiple overrides did.
 */
(function (Drupal, once) {
  function relabelOption(value, label) {
    const text = String(label || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .trim()
      .replace(/^[-–—\s]+/, '');

    if (value === 'All' || value === '') {
      return Drupal.t('All Fellows');
    }
    if (/^\d{4}$/.test(text)) {
      return Drupal.t('@year Fellows', { '@year': text });
    }
    return text || label;
  }

  function collectOptions(select) {
    const options = [];
    Array.from(select.options).forEach((option) => {
      // Skip empty placeholder duplicates; keep "All".
      options.push({
        value: option.value,
        label: relabelOption(option.value, option.textContent),
      });
    });
    return options;
  }

  function currentValue(select) {
    if (select.multiple) {
      const selected = Array.from(select.selectedOptions).map((o) => o.value);
      if (!selected.length || selected.includes('All')) {
        return 'All';
      }
      return selected[0];
    }
    return select.value || 'All';
  }

  function applyValue(select, value) {
    if (select.multiple) {
      Array.from(select.options).forEach((option) => {
        option.selected = value === 'All' ? option.value === 'All' || option.value === '' : option.value === value;
      });
      // Ensure "All" clears other selections.
      if (value === 'All') {
        Array.from(select.options).forEach((option) => {
          option.selected = option.value === 'All' || option.value === '';
        });
      }
    }
    else {
      select.value = value;
    }

    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  Drupal.behaviors.vpsaFellowsTagsFilter = {
    attach(context) {
      once('vpsa-fellows-tags-filter', '.people-filtered form.bef-exposed-form', context).forEach((form) => {
        const realSelect = form.querySelector('#edit-tags, select[name="tags"], select[name="tags[]"]');
        if (!realSelect || realSelect.dataset.vpsaFellowsSelect === '1') {
          return;
        }

        const preact = form.querySelector('#preact-tags, .preact-filter, .taxonomy-label-hierarchy-checkbox');
        if (preact) {
          preact.setAttribute('hidden', 'hidden');
          preact.style.display = 'none';
        }

        // Hide the native multi/select; drive it from our single select.
        realSelect.classList.add('visually-hidden');
        realSelect.setAttribute('aria-hidden', 'true');
        realSelect.tabIndex = -1;
        realSelect.dataset.vpsaFellowsSelect = '1';

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

        collectOptions(realSelect).forEach((item) => {
          const option = document.createElement('option');
          option.value = item.value;
          option.textContent = item.label;
          select.appendChild(option);
        });

        select.value = currentValue(realSelect);
        select.addEventListener('change', () => {
          applyValue(realSelect, select.value);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        realSelect.parentNode.insertBefore(wrapper, realSelect);
      });
    },
  };
})(Drupal, once);
