(() => {
  const selectors = {
    cartCount: '[data-cart-count]',
    cartDrawer: '#CartDrawer',
    mainContent: '#MainContent',
  };

  const debounce = (callback, wait = 250) => {
    let timeout;
    return (...args) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => callback(...args), wait);
    };
  };

  const escapeSelector = (value) => {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return value.replace(/["\\]/g, '\\$&');
  };

  const formatMoney = (cents, format = window.theme?.moneyFormat || '${{amount}}') => {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    const value = Number(cents || 0);
    const placeholder = /\{\{\s*(\w+)\s*\}\}/;
    const formatWithDelimiters = (amount, precision = 2, thousands = ',', decimal = '.') => {
      if (!Number.isFinite(amount)) return '0';
      const parts = (amount / 100).toFixed(precision).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return parts[1] ? `${parts[0]}${decimal}${parts[1]}` : parts[0];
    };

    const match = format.match(placeholder);
    if (!match) return formatWithDelimiters(value);

    let output;
    switch (match[1]) {
      case 'amount_no_decimals':
        output = formatWithDelimiters(value, 0);
        break;
      case 'amount_with_comma_separator':
        output = formatWithDelimiters(value, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        output = formatWithDelimiters(value, 0, '.', ',');
        break;
      case 'amount_with_apostrophe_separator':
        output = formatWithDelimiters(value, 2, "'", '.');
        break;
      case 'amount_with_space_separator':
        output = formatWithDelimiters(value, 2, ' ', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        output = formatWithDelimiters(value, 0, ' ', ',');
        break;
      case 'amount_with_period_and_space_separator':
        output = formatWithDelimiters(value, 2, ' ', '.');
        break;
      default:
        output = formatWithDelimiters(value);
    }
    return format.replace(placeholder, output);
  };

  const updateCartCount = (count) => {
    document.querySelectorAll(selectors.cartCount).forEach((element) => {
      element.textContent = String(count);
      element.hidden = count < 1;
      const cartLabel = window.theme.strings.cartItemCount.replace('__COUNT__', String(count));
      element.closest('[data-cart-link]')?.setAttribute('aria-label', cartLabel);
    });
  };

  const replaceCartDrawer = async () => {
    const response = await fetch(`${window.theme.routes.cart}?section_id=cart-drawer`, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!response.ok) throw new Error(window.theme.strings.cartError);

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const incoming = parsed.querySelector(selectors.cartDrawer);
    const current = document.querySelector(selectors.cartDrawer);
    if (incoming && current) current.replaceWith(incoming);
  };

  const refreshCart = async ({ open = false } = {}) => {
    const cartResponse = await fetch(`${window.theme.routes.cart}.js`, {
      headers: { Accept: 'application/json' },
    });
    if (!cartResponse.ok) throw new Error(window.theme.strings.cartError);
    const cart = await cartResponse.json();
    updateCartCount(cart.item_count);
    await replaceCartDrawer();
    if (open) document.querySelector(selectors.cartDrawer)?.open();
    return cart;
  };

  class ThemeDialog extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('dialog');
      if (!this.dialog || this.initialized) return;
      this.initialized = true;
      this.dialog.addEventListener('click', (event) => {
        if (event.target === this.dialog || event.target.closest('[data-dialog-close]')) {
          this.close();
        }
      });
      this.dialog.addEventListener('close', () => {
        this.trigger?.focus?.();
        this.trigger = null;
      });
    }

    open(trigger) {
      this.trigger = trigger || document.activeElement;
      if (!this.dialog?.open) this.dialog?.showModal();
      window.requestAnimationFrame(() => this.dialog?.querySelector('input, button, a')?.focus());
    }

    close() {
      if (this.dialog?.open) this.dialog.close();
    }
  }

  class CartDrawer extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('dialog');
      if (this.initialized) return;
      this.initialized = true;

      this.dialog?.addEventListener('close', () => {
        this.trigger?.focus?.();
        this.trigger = null;
      });

      this.addEventListener('click', (event) => {
        if (event.target === this.dialog || event.target.closest('[data-dialog-close]')) this.close();

        const control = event.target.closest('[data-cart-quantity]');
        if (control) {
          event.preventDefault();
          const quantity = Number(control.dataset.quantity || 0);
          this.changeLine(Number(control.dataset.line), quantity);
        }
      });

      this.addEventListener(
        'change',
        debounce((event) => {
          const input = event.target.closest('[data-cart-line-input]');
          if (input) this.changeLine(Number(input.dataset.line), Number(input.value));
        }, 350),
      );
    }

    open(trigger) {
      this.trigger = trigger || document.activeElement;
      if (!this.dialog?.open) this.dialog?.showModal();
      window.requestAnimationFrame(() => this.dialog?.querySelector('[data-dialog-close]')?.focus());
    }

    close() {
      if (this.dialog?.open) this.dialog.close();
    }

    async changeLine(line, quantity) {
      this.setAttribute('aria-busy', 'true');
      const status = this.querySelector('[data-cart-status]');
      if (status) {
        status.textContent = '';
        status.hidden = true;
      }
      try {
        const response = await fetch(`${window.theme.routes.cartChange}.js`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ line, quantity }),
        });
        if (!response.ok) throw new Error(window.theme.strings.cartError);
        const cart = await response.json();
        updateCartCount(cart.item_count);
        await replaceCartDrawer();
        document.querySelector(selectors.cartDrawer)?.open();
      } catch (error) {
        if (status) {
          status.textContent = error.message;
          status.hidden = false;
        }
      } finally {
        this.removeAttribute('aria-busy');
      }
    }
  }

  class ProductForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form[action*="/cart/add"]');
      if (!this.form || this.initialized) return;
      this.initialized = true;
      this.form.addEventListener('submit', (event) => this.onSubmit(event));
    }

    async onSubmit(event) {
      if (window.theme.cartType !== 'drawer') return;
      event.preventDefault();

      if (this.isSubmitting) return;
      this.isSubmitting = true;

      const submitButton = this.form.querySelector('[type="submit"]');
      const status = this.querySelector('[data-product-form-status]');
      const wasDisabled = submitButton?.disabled;
      if (submitButton) submitButton.disabled = true;
      submitButton?.setAttribute('aria-disabled', 'true');
      this.setAttribute('aria-busy', 'true');
      if (status) status.textContent = '';

      try {
        const response = await fetch(`${window.theme.routes.cartAdd}.js`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: new FormData(this.form),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.description || window.theme.strings.cartError);
        await refreshCart({ open: true });
        if (status) status.textContent = this.dataset.successMessage || window.theme.strings.addedToCart;
      } catch (error) {
        if (status) status.textContent = error.message;
      } finally {
        if (submitButton) submitButton.disabled = Boolean(wasDisabled);
        submitButton?.removeAttribute('aria-disabled');
        this.removeAttribute('aria-busy');
        this.isSubmitting = false;
      }
    }
  }

  class QuantityInput extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.input = this.querySelector('input');
      this.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-step]');
        if (!button || !this.input) return;
        event.preventDefault();
        const previous = this.input.value;
        button.dataset.step === 'up' ? this.input.stepUp() : this.input.stepDown();
        if (previous !== this.input.value) this.input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  }

  class VariantSelects extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.productInfo = this.closest('product-info');
      this.addEventListener('change', () => this.productInfo?.updateVariant());
    }

    get options() {
      return [...this.querySelectorAll('[data-option-position]')].reduce((values, input) => {
        const position = Number(input.dataset.optionPosition) - 1;
        if (input.matches('select')) values[position] = input.value;
        if (input.matches('input:checked')) values[position] = input.value;
        return values;
      }, []);
    }
  }

  class ProductInfo extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      const data = this.querySelector('[data-product-variants]');
      this.variants = data ? JSON.parse(data.textContent) : [];
      this.variantSelects = this.querySelector('variant-selects');
      const selectedVariantId = this.querySelector('input[name="id"], select[name="id"]')?.value;
      this.currentVariant = this.variants.find((variant) => String(variant.id) === String(selectedVariantId));
      this.addEventListener('change', (event) => {
        if (!event.target.matches('[data-selling-plan-input]')) return;
        this.updatePrice(this.currentVariant);
        this.updateAvailability(this.currentVariant);
        this.updateUrl(this.currentVariant);
      });
    }

    updateVariant() {
      const options = this.variantSelects?.options || [];
      const variant = this.variants.find((candidate) =>
        candidate.options.every((value, index) => value === options[index]),
      );
      const selectedPlanId = this.getSelectedSellingPlanInput()?.value || '';
      this.currentVariant = variant;
      this.updateForm(variant);
      this.updateSellingPlans(variant, selectedPlanId);
      this.updatePrice(variant);
      this.updateAvailability(variant);
      this.updateQuantity(variant);
      this.updateMedia(variant);
      this.updateUrl(variant);
      this.updatePickup(variant);
    }

    updateForm(variant) {
      this.querySelectorAll('input[name="id"], select[name="id"]').forEach((input) => {
        input.value = variant?.id || '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    updatePrice(variant) {
      const price = this.querySelector('[data-product-price]');
      const compare = this.querySelector('[data-product-compare-price]');
      const unit = this.querySelector('[data-product-unit-price]');
      const selectedPlan = this.getSelectedSellingPlanInput();
      if (!price) return;

      if (!variant) {
        price.textContent = '';
        if (compare) compare.hidden = true;
        if (unit) unit.hidden = true;
        return;
      }

      const currentPrice = selectedPlan?.value ? Number(selectedPlan.dataset.price) : variant.price;
      const currentCompareAtPrice = selectedPlan?.value
        ? Number(selectedPlan.dataset.compareAtPrice || 0)
        : variant.compare_at_price;
      const currentUnitPrice = selectedPlan?.value
        ? Number(selectedPlan.dataset.unitPrice || 0)
        : variant.unit_price;

      price.textContent = formatMoney(currentPrice);
      if (compare) {
        compare.hidden = !(currentCompareAtPrice > currentPrice);
        compare.textContent = currentCompareAtPrice ? formatMoney(currentCompareAtPrice) : '';
      }
      if (unit) {
        unit.hidden = !currentUnitPrice;
        const measurement = variant.unit_price_measurement;
        if (currentUnitPrice && measurement) {
          const referenceValue = Number(measurement.reference_value || 1);
          const reference = `${referenceValue !== 1 ? `${referenceValue} ` : ''}${measurement.reference_unit}`;
          const unitText = `${formatMoney(currentUnitPrice)} / ${reference}`;
          unit.textContent = unitText;
          unit.setAttribute('aria-label', `${window.theme.strings.unitPrice}: ${unitText}`);
        } else {
          unit.textContent = '';
          unit.removeAttribute('aria-label');
        }
      }
    }

    updateAvailability(variant) {
      this.querySelectorAll('[data-add-to-cart]').forEach((button) => {
        const planContainer = this.getActiveSellingPlanContainer();
        const requiresSellingPlan = planContainer?.dataset.requiresSellingPlan === 'true';
        const selectedPlan = this.getSelectedSellingPlanInput();
        const variantAvailable = Boolean(variant?.available);
        const needsPlanSelection = variantAvailable && requiresSellingPlan && !selectedPlan?.value;
        const available = variantAvailable && !needsPlanSelection;
        button.disabled = !available;
        const label = button.querySelector('[data-add-to-cart-text]');
        if (!label) return;
        label.textContent = !variant
          ? window.theme.strings.unavailable
          : available
            ? window.theme.strings.addToCart
            : needsPlanSelection
              ? window.theme.strings.choosePurchaseOption
              : window.theme.strings.soldOut;
      });
      const sku = this.querySelector('[data-product-sku]');
      if (sku) sku.textContent = variant?.sku || '';
      const inventory = this.querySelector('[data-product-inventory]');
      if (inventory) {
        const threshold = Number(inventory.dataset.lowStockThreshold || 0);
        const rawQuantity = variant?.inventory_quantity;
        const quantity = Number(rawQuantity);
        if (!variant?.available) {
          inventory.textContent = window.theme.strings.inventoryOutOfStock;
        } else if (
          variant.inventory_management
          && variant.inventory_policy !== 'continue'
          && rawQuantity != null
          && Number.isFinite(quantity)
          && quantity > 0
          && quantity <= threshold
        ) {
          inventory.textContent = window.theme.strings.inventoryLow.replace('__COUNT__', String(quantity));
        } else {
          inventory.textContent = window.theme.strings.inventoryInStock;
        }
      }
    }

    updateQuantity(variant) {
      const input = this.querySelector('input[name="quantity"]');
      if (!input || !variant) return;
      const rule = variant.quantity_rule || {};
      const minimum = Number(rule.min || 1);
      input.min = String(minimum);
      input.step = String(rule.increment || 1);
      if (rule.max) input.max = String(rule.max);
      else input.removeAttribute('max');
      if (Number(input.value) < minimum) input.value = String(minimum);
    }

    updateMedia(variant) {
      const mediaId = variant?.featured_media?.id;
      if (!mediaId) return;
      const media = this.querySelector(`[data-media-id="${escapeSelector(String(mediaId))}"]`);
      if (media) {
        media.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        this.querySelectorAll('[data-media-thumbnail]').forEach((thumbnail) => {
          thumbnail.setAttribute('aria-current', String(thumbnail.dataset.mediaThumbnail === String(mediaId)));
        });
      }
    }

    updateUrl(variant) {
      if (!variant || !this.dataset.url || this.dataset.updateUrl === 'false') return;
      const url = new URL(this.dataset.url, window.location.origin);
      url.searchParams.set('variant', variant.id);
      const selectedPlan = this.getSelectedSellingPlanInput();
      if (selectedPlan?.value) url.searchParams.set('selling_plan', selectedPlan.value);
      else url.searchParams.delete('selling_plan');
      window.history.replaceState({}, '', url);
    }

    getActiveSellingPlanContainer() {
      return this.querySelector('[data-selling-plan-variant]:not([hidden])');
    }

    getSelectedSellingPlanInput() {
      return this.getActiveSellingPlanContainer()?.querySelector('[data-selling-plan-input]:checked');
    }

    updateSellingPlans(variant, preferredPlanId = '') {
      const containers = this.querySelectorAll('[data-selling-plan-variant]');
      if (!containers.length) return;

      let activeContainer;
      containers.forEach((container) => {
        const isActive = Boolean(variant) && container.dataset.sellingPlanVariant === String(variant.id);
        container.hidden = !isActive;
        container.querySelectorAll('[data-selling-plan-input]').forEach((input) => {
          input.disabled = !isActive;
        });
        if (isActive) activeContainer = container;
      });
      if (!activeContainer) return;

      const inputs = [...activeContainer.querySelectorAll('[data-selling-plan-input]')];
      const requiresSellingPlan = activeContainer.dataset.requiresSellingPlan === 'true';
      let nextInput = inputs.find((input) => input.value === preferredPlanId);
      if (!nextInput && !requiresSellingPlan) nextInput = inputs.find((input) => input.value === '');
      if (!nextInput) nextInput = inputs.find((input) => input.value !== '');
      if (nextInput) nextInput.checked = true;
    }

    async updatePickup(variant) {
      const pickup = this.querySelector('[data-pickup-availability]');
      if (!pickup || !variant || !this.dataset.section) return;
      try {
        const url = `${this.dataset.url}?variant=${variant.id}&section_id=${this.dataset.section}`;
        const response = await fetch(url);
        if (!response.ok) return;
        const html = await response.text();
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const nextPickup = parsed.querySelector('[data-pickup-availability]');
        if (nextPickup) pickup.replaceWith(nextPickup);
      } catch (_error) {
        // Pickup availability is an enhancement; the product form remains usable.
      }
    }
  }

  class ThemeSlideshow extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.slides = [...this.querySelectorAll('[data-slideshow-slide]')];
      this.status = this.querySelector('[data-slideshow-status]');
      this.liveRegion = this.querySelector('.slideshow__viewport');
      this.toggle = this.querySelector('[data-slideshow-toggle]');
      this.currentIndex = Math.max(
        0,
        this.slides.findIndex((slide) => slide.dataset.active === 'true'),
      );
      this.userPaused = false;
      this.interactionPaused = false;
      this.isVisible = true;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      this.querySelector('[data-slideshow-previous]')?.addEventListener('click', () => {
        this.pauseFromInteraction();
        this.showSlide(this.currentIndex - 1);
      });
      this.querySelector('[data-slideshow-next]')?.addEventListener('click', () => {
        this.pauseFromInteraction();
        this.showSlide(this.currentIndex + 1);
      });
      this.toggle?.addEventListener('click', () => {
        this.userPaused = !this.userPaused;
        this.updateAutoplay();
      });
      this.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        this.pauseFromInteraction();
        this.showSlide(this.currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
      });
      this.addEventListener('pointerenter', () => {
        this.interactionPaused = true;
        this.updateAutoplay();
      });
      this.addEventListener('pointerleave', () => {
        this.interactionPaused = false;
        this.updateAutoplay();
      });
      this.addEventListener('focusin', () => {
        this.interactionPaused = true;
        this.updateAutoplay();
      });
      this.addEventListener('focusout', (event) => {
        if (this.contains(event.relatedTarget)) return;
        this.interactionPaused = false;
        this.updateAutoplay();
      });

      this.handleMotionPreference = () => this.updateAutoplay();
      if (this.reducedMotion.addEventListener) {
        this.reducedMotion.addEventListener('change', this.handleMotionPreference);
      } else {
        this.reducedMotion.addListener(this.handleMotionPreference);
      }
      this.handleVisibilityChange = () => this.updateAutoplay();
      document.addEventListener('visibilitychange', this.handleVisibilityChange);

      if (window.IntersectionObserver) {
        this.visibilityObserver = new IntersectionObserver(
          ([entry]) => {
            this.isVisible = entry.isIntersecting;
            this.updateAutoplay();
          },
          { threshold: 0.2 },
        );
        this.visibilityObserver.observe(this);
      }

      this.handleBlockSelect = (event) => {
        const slide = event.target.closest?.('[data-slideshow-slide]');
        const index = this.slides.indexOf(slide);
        if (index < 0) return;
        this.userPaused = true;
        this.showSlide(index);
      };
      this.addEventListener('shopify:block:select', this.handleBlockSelect);

      this.showSlide(this.currentIndex);
      this.updateAutoplay();
    }

    disconnectedCallback() {
      window.clearInterval(this.autoplayTimer);
      this.visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      if (this.reducedMotion?.removeEventListener) {
        this.reducedMotion.removeEventListener('change', this.handleMotionPreference);
      } else {
        this.reducedMotion?.removeListener(this.handleMotionPreference);
      }
    }

    showSlide(index) {
      if (!this.slides.length) return;
      this.currentIndex = (index + this.slides.length) % this.slides.length;
      this.slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === this.currentIndex;
        slide.dataset.active = String(isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      if (this.status) this.status.textContent = this.slides[this.currentIndex].getAttribute('aria-label') || '';
    }

    pauseFromInteraction() {
      this.userPaused = true;
      this.updateAutoplay();
    }

    updateAutoplay() {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
      const canAutoplay =
        this.dataset.autoplay === 'true' &&
        this.slides.length > 1 &&
        !document.body.classList.contains('motion-none') &&
        !this.userPaused &&
        !this.interactionPaused &&
        !this.reducedMotion.matches &&
        this.isVisible &&
        !document.hidden;

      if (canAutoplay) {
        const interval = Math.max(4, Number(this.dataset.interval || 6)) * 1000;
        this.autoplayTimer = window.setInterval(() => this.showSlide(this.currentIndex + 1), interval);
      }

      if (this.liveRegion) this.liveRegion.setAttribute('aria-live', canAutoplay ? 'off' : 'polite');
      if (this.toggle) {
        const isPaused = this.userPaused || this.reducedMotion.matches;
        this.toggle.disabled = this.reducedMotion.matches;
        this.toggle.setAttribute('aria-pressed', String(this.userPaused));
        this.toggle.setAttribute(
          'aria-label',
          isPaused ? this.toggle.dataset.playLabel : this.toggle.dataset.pauseLabel,
        );
        const icon = this.toggle.querySelector('[data-slideshow-toggle-icon]');
        if (icon) icon.textContent = isPaused ? '▶' : 'Ⅱ';
      }
    }
  }

  class PredictiveSearch extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      if (this.dataset.enabled === 'false') return;
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-predictive-results]');
      this.status = this.querySelector('[data-predictive-status]');
      if (!this.input || !this.results) return;
      this.input.setAttribute('role', 'combobox');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-controls', this.results.id);
      this.input.setAttribute('aria-haspopup', 'listbox');
      this.input.setAttribute('aria-autocomplete', 'list');
      this.activeIndex = -1;
      this.debouncedSearch = debounce(() => this.search(), 250);
      this.input.addEventListener('input', () => {
        this.close();
        this.debouncedSearch();
      });
      this.input.addEventListener('keydown', (event) => this.onKeydown(event));
      this.closest('dialog')?.addEventListener('close', () => this.close());
    }

    async search() {
      const term = this.input.value.trim();
      if (!term) {
        this.close();
        return;
      }

      this.abortController?.abort();
      const controller = new AbortController();
      this.abortController = controller;
      this.setAttribute('aria-busy', 'true');
      try {
        const url = new URL(window.theme.routes.predictiveSearch, window.location.origin);
        url.searchParams.set('q', term);
        url.searchParams.set('section_id', 'predictive-search');
        url.searchParams.set('resources[type]', 'product,collection,page,article,query');
        url.searchParams.set('resources[limit]', '8');
        url.searchParams.set('resources[options][unavailable_products]', 'last');
        url.searchParams.set('resources[options][fields]', 'title,product_type,variants.title,vendor');
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(response.statusText);
        const html = await response.text();
        if (this.input.value.trim() !== term) return;
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const content = parsed.querySelector('#PredictiveSearchResults');
        if (!content) return;
        this.results.innerHTML = content.innerHTML;
        this.resetActiveOption();
        this.results.hidden = false;
        this.input.setAttribute('aria-expanded', 'true');
        const resultCount = Number(content.dataset.resultCount || 0);
        if (this.status) {
          this.status.textContent = resultCount > 0
            ? this.dataset.resultsLabel.replace('__COUNT__', String(resultCount))
            : this.dataset.noResultsLabel;
        }
      } catch (error) {
        if (error.name !== 'AbortError') this.close();
      } finally {
        if (this.abortController === controller) {
          this.abortController = null;
          this.removeAttribute('aria-busy');
        }
      }
    }

    getOptions() {
      return [...this.results.querySelectorAll('[role="option"]')];
    }

    onKeydown(event) {
      const options = this.getOptions();
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!options.length) return;
        event.preventDefault();
        this.results.hidden = false;
        this.input.setAttribute('aria-expanded', 'true');
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        let nextIndex = this.activeIndex + direction;
        if (this.activeIndex < 0) nextIndex = direction > 0 ? 0 : options.length - 1;
        this.setActiveOption(nextIndex, options);
        return;
      }

      if (event.key === 'Enter' && this.activeIndex >= 0) {
        const activeOption = options[this.activeIndex];
        if (activeOption) {
          event.preventDefault();
          activeOption.click();
        }
        return;
      }

      if (event.key === 'Escape' && this.input.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        event.stopPropagation();
        this.close();
        return;
      }

      if (event.key === 'Tab') this.close();
    }

    setActiveOption(index, options = this.getOptions()) {
      if (!options.length) return;
      const normalizedIndex = (index + options.length) % options.length;
      options.forEach((option, optionIndex) => {
        option.setAttribute('aria-selected', String(optionIndex === normalizedIndex));
      });
      const activeOption = options[normalizedIndex];
      this.activeIndex = normalizedIndex;
      this.input.setAttribute('aria-activedescendant', activeOption.id);
      activeOption.scrollIntoView({ block: 'nearest' });
    }

    resetActiveOption() {
      this.getOptions().forEach((option) => option.setAttribute('aria-selected', 'false'));
      this.activeIndex = -1;
      this.input.removeAttribute('aria-activedescendant');
    }

    close() {
      this.abortController?.abort();
      this.abortController = null;
      this.results.hidden = true;
      this.input.setAttribute('aria-expanded', 'false');
      this.resetActiveOption();
      if (this.status) this.status.textContent = '';
      this.removeAttribute('aria-busy');
    }
  }

  class ProductRecommendations extends HTMLElement {
    connectedCallback() {
      if (!this.dataset.url || this.initialized) return;
      this.initialized = true;
      this.load();
    }

    async load() {
      try {
        const response = await fetch(this.dataset.url);
        if (!response.ok) return;
        const html = await response.text();
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const content = parsed.querySelector('[data-recommendations-content]');
        if (content?.children.length) this.innerHTML = content.innerHTML;
        else this.hidden = true;
      } catch (_error) {
        this.hidden = true;
      }
    }
  }

  class FacetsForm extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.form = this.querySelector('form');
      this.addEventListener(
        'change',
        debounce((event) => {
          if (event.target.matches('[data-facet-input], [data-sort-by]')) this.form?.requestSubmit();
        }, 300),
      );
    }
  }

  const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

  const interpolateMotion = (values, progress) => {
    const index = progress <= 0.5 ? 0 : 1;
    const localProgress = progress <= 0.5 ? progress * 2 : (progress - 0.5) * 2;
    return values[index] + (values[index + 1] - values[index]) * localProgress;
  };

  const bridgeMotions = {
    'sweep-right': {
      viewport: [92, 8],
      mainX: [-8, 0, 8],
      accentX: [-16, 0, 16],
      accentY: [12, 0, -12],
      mainRotate: [-4, 0, 4],
      accentRotate: [-3, 0, 3],
      accentWidth: [46, 70, 88],
    },
    'sweep-left': {
      viewport: [90, 10],
      mainX: [8, 0, -8],
      accentX: [18, 0, -14],
      accentY: [-10, 0, 12],
      mainRotate: [4, 0, -4],
      accentRotate: [4, 0, -4],
      accentWidth: [86, 66, 48],
    },
    'long-drift': {
      viewport: [100, 0],
      mainX: [-4, 2, 9],
      accentX: [-22, -4, 12],
      accentY: [18, 4, -8],
      mainRotate: [-6, -1, 3],
      accentRotate: [6, 2, -5],
      accentWidth: [38, 62, 80],
    },
    'snap-cross': {
      viewport: [82, 18],
      mainX: [10, 0, -12],
      accentX: [-10, 6, 20],
      accentY: [-18, 0, 16],
      mainRotate: [6, 0, -2],
      accentRotate: [-7, 0, 7],
      accentWidth: [72, 45, 86],
    },
    rise: {
      viewport: [94, 6],
      mainX: [0, -7, 5],
      accentX: [12, -6, -18],
      accentY: [22, 0, -20],
      mainRotate: [2, -3, 5],
      accentRotate: [8, 0, -8],
      accentWidth: [52, 86, 58],
    },
    'reverse-rise': {
      viewport: [96, 4],
      mainX: [-7, 4, -3],
      accentX: [18, 2, -20],
      accentY: [-18, 0, 18],
      mainRotate: [-3, 4, -5],
      accentRotate: [-8, 0, 9],
      accentWidth: [82, 56, 74],
    },
  };

  const accentMotions = {
    cross: {
      viewport: [94, 6],
      rails: [
        { x: [-12, 0, 12], y: [-24, 0, 20], rotate: [-13, -2, 10], scale: [0.72, 1, 0.84] },
        { x: [18, 0, -18], y: [22, 0, -22], rotate: [14, 2, -12], scale: [0.88, 0.7, 1] },
        { x: [-24, 2, 20], y: [4, -18, 16], rotate: [-4, 8, -7], scale: [0.58, 0.82, 0.66] },
      ],
    },
    fan: {
      viewport: [92, 8],
      rails: [
        { x: [-16, 0, 10], y: [18, 0, -16], rotate: [-18, -7, 4], scale: [0.68, 0.94, 0.8] },
        { x: [14, 0, -12], y: [14, 0, -14], rotate: [18, 7, -5], scale: [0.76, 1, 0.72] },
        { x: [2, -8, 12], y: [26, 10, -18], rotate: [4, -2, -10], scale: [0.52, 0.74, 0.62] },
      ],
    },
    parallel: {
      viewport: [96, 4],
      rails: [
        { x: [-18, 0, 18], y: [-18, -14, -10], rotate: [-7, -4, -1], scale: [0.7, 0.96, 0.78] },
        { x: [18, 0, -18], y: [12, 16, 20], rotate: [-7, -4, -1], scale: [0.82, 1, 0.72] },
        { x: [-10, 8, 22], y: [38, 34, 30], rotate: [-7, -4, -1], scale: [0.48, 0.68, 0.56] },
      ],
    },
    split: {
      viewport: [90, 10],
      rails: [
        { x: [-28, -8, 12], y: [-14, -5, 6], rotate: [-10, -4, 3], scale: [0.62, 0.82, 0.72] },
        { x: [28, 8, -12], y: [18, 7, -8], rotate: [11, 5, -3], scale: [0.62, 0.86, 0.74] },
        { x: [-6, 0, 8], y: [34, 2, -30], rotate: [2, 0, -2], scale: [0.46, 0.72, 0.5] },
      ],
    },
  };

  const motionElements = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionFrame;
  let motionRuntimeReady = false;

  const scheduleMotionUpdate = () => {
    if (motionFrame) return;
    motionFrame = window.requestAnimationFrame(() => {
      motionFrame = null;
      motionElements.forEach((element) => element.updateMotion());
    });
  };

  const initializeMotionRuntime = () => {
    if (motionRuntimeReady) return;
    motionRuntimeReady = true;
    document.addEventListener('scroll', scheduleMotionUpdate, { passive: true });
    window.addEventListener('resize', scheduleMotionUpdate);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', scheduleMotionUpdate);
    else reducedMotion.addListener(scheduleMotionUpdate);
  };

  class ScrollMotion extends HTMLElement {
    connectedCallback() {
      if (this.motionRegistered) return;
      this.motionRegistered = true;
      motionElements.add(this);
      initializeMotionRuntime();
      scheduleMotionUpdate();
    }

    disconnectedCallback() {
      motionElements.delete(this);
    }

    getProgress(viewport = [92, 8]) {
      const rect = this.getBoundingClientRect();
      const start = window.innerHeight * (viewport[0] / 100);
      const end = window.innerHeight * (viewport[1] / 100) - rect.height;
      return clamp((start - rect.top) / Math.max(start - end, 1));
    }

    setMotionProperty(name, value, unit = '') {
      this.style.setProperty(name, `${Math.round(value * 1000) / 1000}${unit}`);
    }

    updateMotion() {
      const isStatic = reducedMotion.matches || document.body.classList.contains('motion-none');
      const globalIntensity = document.body.classList.contains('motion-expressive') ? 1 : 0.62;
      const sectionIntensity = clamp(Number(this.dataset.motionIntensity || 100) / 100, 0.5, 1.5);
      const intensity = isStatic ? 0 : globalIntensity * sectionIntensity;
      const kind = this.dataset.motionKind;

      if (kind === 'bridge') this.updateBridge(intensity, isStatic);
      if (kind === 'accents') this.updateAccents(intensity, isStatic);
      this.dataset.motionReady = 'true';
    }

    updateBridge(intensity, isStatic) {
      const config = bridgeMotions[this.dataset.motionVariant] || bridgeMotions['sweep-right'];
      const progress = isStatic ? 0.5 : this.getProgress(config.viewport);
      const scaled = (values) => interpolateMotion(values, progress) * intensity;

      this.setMotionProperty('--bridge-main-x', scaled(config.mainX), '%');
      this.setMotionProperty('--bridge-accent-x', scaled(config.accentX), '%');
      this.setMotionProperty('--bridge-accent-y', scaled(config.accentY), '%');
      this.setMotionProperty('--bridge-main-rotate', scaled(config.mainRotate), 'deg');
      this.setMotionProperty('--bridge-accent-rotate', scaled(config.accentRotate), 'deg');

      const width = interpolateMotion(config.accentWidth, progress);
      const widthScale = 1 + (width / 70 - 1) * (isStatic ? 0 : intensity);
      this.setMotionProperty('--bridge-accent-scale', widthScale);
    }

    updateAccents(intensity, isStatic) {
      const config = accentMotions[this.dataset.motionVariant] || accentMotions.cross;
      const progress = isStatic ? 0.5 : this.getProgress(config.viewport);
      const names = ['one', 'two', 'three'];

      config.rails.forEach((rail, index) => {
        const prefix = `--accent-${names[index]}`;
        const scaled = (values) => interpolateMotion(values, progress) * intensity;
        this.setMotionProperty(`${prefix}-x`, scaled(rail.x), '%');
        this.setMotionProperty(`${prefix}-y`, scaled(rail.y), '%');
        this.setMotionProperty(`${prefix}-rotate`, scaled(rail.rotate), 'deg');

        const scale = interpolateMotion(rail.scale, progress);
        this.setMotionProperty(`${prefix}-scale`, 1 + (scale - 1) * (isStatic ? 0 : intensity));
      });
    }
  }

  const initializeReveal = (root = document) => {
    const elements = root.querySelectorAll('[data-reveal]:not([data-reveal-ready])');
    if (!elements.length) return;

    if (!window.IntersectionObserver || document.body.dataset.revealEnabled !== 'true') {
      elements.forEach((element) => {
        element.setAttribute('data-reveal-ready', 'true');
        element.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );
    elements.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      element.setAttribute('data-reveal-ready', 'true');

      if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
        element.classList.add('is-visible');
        return;
      }

      observer.observe(element);
    });
  };

  const initializeHeaderTone = () => {
    const header = document.querySelector('[data-site-header]');
    if (!header || header.dataset.toneReady) return;
    header.dataset.toneReady = 'true';
    const update = () => {
      const sampleY = Math.min(window.innerHeight - 1, Math.max(header.getBoundingClientRect().bottom + 1, 1));
      const sample = document
        .elementsFromPoint(Math.round(window.innerWidth / 2), sampleY)
        .map((element) => element.closest?.('[data-nav-tone]'))
        .find(Boolean);
      let tone = sample?.dataset.navTone;
      const sampleStyle = sample ? window.getComputedStyle(sample) : null;
      if (sample && sample.dataset.navToneManual !== 'true') {
        tone = sampleStyle.getPropertyValue('--scheme-nav-tone').trim() || tone;
      }
      if (sample?.dataset.navToneBottom) {
        const sampleRect = sample.getBoundingClientRect();
        if (sampleY > sampleRect.top + sampleRect.height * 0.45) {
          tone = sampleStyle.getPropertyValue('--bridge-bottom-nav-tone').trim() || sample.dataset.navToneBottom;
        }
      }
      header.dataset.tone = tone === 'dark' ? 'dark' : 'light';
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    update();
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  const initializeMotionMedia = (root = document) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const videos = [...root.querySelectorAll('video.motion-aware-media')];
    if (!videos.length) return;

    const update = () => {
      const pauseMotion = reducedMotion.matches || document.body.classList.contains('motion-none');
      videos.forEach((video) => {
        if (video.dataset.motionAutoplay === undefined) {
          video.dataset.motionAutoplay = String(video.autoplay);
        }
        if (pauseMotion) {
          video.pause();
          video.autoplay = false;
          video.controls = true;
        } else if (video.dataset.motionAutoplay === 'true') {
          video.autoplay = true;
          video.play().catch(() => {});
        }
      });
    };

    update();
    reducedMotion.addEventListener?.('change', update);
  };

  const bindGlobalActions = () => {
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-dialog-open]');
      if (opener) {
        event.preventDefault();
        const target = document.querySelector(opener.dataset.dialogOpen);
        target?.open?.(opener);
        return;
      }

      const cartLink = event.target.closest('[data-cart-link]');
      if (cartLink && window.theme.cartType === 'drawer') {
        event.preventDefault();
        document.querySelector(selectors.cartDrawer)?.open(cartLink);
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('details')) {
        document.querySelectorAll('details[data-menu-disclosure][open]').forEach((details) => {
          details.removeAttribute('open');
        });
      }
    });

    document.addEventListener('shopify:section:load', (event) => {
      initializeReveal(event.target);
      initializeHeaderTone();
      initializeMotionMedia(event.target);
    });
  };

  customElements.define('theme-dialog', ThemeDialog);
  customElements.define('cart-drawer', CartDrawer);
  customElements.define('product-form', ProductForm);
  customElements.define('quantity-input', QuantityInput);
  customElements.define('variant-selects', VariantSelects);
  customElements.define('product-info', ProductInfo);
  customElements.define('theme-slideshow', ThemeSlideshow);
  customElements.define('predictive-search', PredictiveSearch);
  customElements.define('product-recommendations', ProductRecommendations);
  customElements.define('facets-form', FacetsForm);
  customElements.define('scroll-motion', ScrollMotion);

  document.addEventListener('DOMContentLoaded', () => {
    bindGlobalActions();
    initializeReveal();
    initializeHeaderTone();
    initializeMotionMedia();
  });

  window.themeCart = { refresh: refreshCart, formatMoney };
})();
