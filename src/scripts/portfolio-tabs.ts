interface PortfolioTab {
  readonly link: HTMLAnchorElement;
  readonly panel: HTMLElement;
  readonly headingId: string;
}

class PortfolioTabs extends HTMLElement {
  #controller: AbortController | undefined;
  #frame: number | undefined;
  #resizeObserver: ResizeObserver | undefined;

  connectedCallback(): void {
    this.#controller?.abort();
    if (this.#frame !== undefined) cancelAnimationFrame(this.#frame);
    this.#frame = undefined;
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    const list = this.querySelector<HTMLElement>("[data-tablist]");
    const toggle = this.querySelector<HTMLButtonElement>("[data-view-all]");
    const navigation = this.querySelector<HTMLElement>(
      "[data-section-navigation]"
    );
    const bar = this.querySelector<HTMLElement>("[data-navigation-bar]");
    const sentinel = this.querySelector<HTMLElement>(
      "[data-navigation-sentinel]"
    );
    const panels = [...this.querySelectorAll<HTMLElement>("[data-tab-panel]")];
    if (
      !list ||
      !toggle ||
      !navigation ||
      !bar ||
      !sentinel ||
      !panels.length
    ) {
      throw new Error(
        "Portfolio tabs are missing navigation, panels or the full CV control."
      );
    }
    const tabs: readonly PortfolioTab[] = [
      ...list.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    ].map(link => {
      const panel = panels.find(
        candidate => candidate.id === link.hash.slice(1)
      );
      const headingId = panel?.getAttribute("aria-labelledby");
      if (!panel || !headingId || !link.id) {
        throw new Error(
          `Portfolio tab target or label is missing: ${link.hash}`
        );
      }
      return { link, panel, headingId };
    });
    if (
      tabs.length !== panels.length ||
      new Set(tabs.map(tab => tab.panel)).size !== panels.length
    ) {
      throw new Error("Each portfolio panel must have exactly one tab.");
    }
    const wide = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let selected = 0;
    let full = false;

    const targetFromHash = (): HTMLElement | null => {
      try {
        return document.getElementById(
          decodeURIComponent(window.location.hash.slice(1))
        );
      } catch {
        // A malformed external fragment should leave the default section usable.
        return null;
      }
    };
    const indexFor = (target: HTMLElement | null): number =>
      target
        ? tabs.findIndex(
            tab => tab.panel === target || tab.panel.contains(target)
          )
        : -1;

    const render = (): void => {
      if (full) {
        list.removeAttribute("role");
        list.removeAttribute("aria-orientation");
      } else {
        list.setAttribute("role", "tablist");
        list.setAttribute(
          "aria-orientation",
          wide.matches ? "horizontal" : "vertical"
        );
      }
      for (const [index, tab] of tabs.entries()) {
        tab.panel.hidden = !full && index !== selected;
        tab.panel.setAttribute(
          "aria-labelledby",
          full ? tab.headingId : tab.link.id
        );
        if (full) {
          tab.link.removeAttribute("role");
          tab.link.removeAttribute("aria-selected");
          tab.link.removeAttribute("aria-controls");
          tab.link.removeAttribute("tabindex");
          tab.panel.removeAttribute("role");
          tab.panel.removeAttribute("tabindex");
          if (index === selected)
            tab.link.setAttribute("aria-current", "location");
          else tab.link.removeAttribute("aria-current");
        } else {
          tab.link.removeAttribute("aria-current");
          tab.link.setAttribute("role", "tab");
          tab.link.setAttribute("aria-selected", String(index === selected));
          tab.link.setAttribute("aria-controls", tab.panel.id);
          tab.link.tabIndex = index === selected ? 0 : -1;
          tab.panel.setAttribute("role", "tabpanel");
          tab.panel.tabIndex = 0;
        }
        if (tab.panel.hidden && tab.panel.contains(document.activeElement)) {
          tabs[selected].link.focus({ preventScroll: true });
        }
      }
      toggle.setAttribute("aria-pressed", String(full));
    };
    const updateNavigation = (): void => {
      if (!navigation.hasAttribute("data-stuck")) {
        this.style.setProperty(
          "--portfolio-expanded-navigation",
          `${bar.getBoundingClientRect().height}px`
        );
      }
      const stuck = wide.matches && sentinel.getBoundingClientRect().top < 0;
      navigation.toggleAttribute("data-stuck", stuck);
      const offset = wide.matches
        ? bar.getBoundingClientRect().height + 16
        : 16;
      this.style.setProperty("--portfolio-nav-offset", `${offset}px`);
      if (full) {
        let current = 0;
        for (const [index, tab] of tabs.entries()) {
          if (tab.panel.getBoundingClientRect().top <= offset + 16)
            current = index;
        }
        selected = current;
        for (const [index, tab] of tabs.entries()) {
          if (index === selected)
            tab.link.setAttribute("aria-current", "location");
          else tab.link.removeAttribute("aria-current");
        }
      }
    };
    const scheduleNavigation = (): void => {
      if (this.#frame === undefined)
        this.#frame = requestAnimationFrame(() => {
          this.#frame = undefined;
          updateNavigation();
        });
    };
    const scrollToTarget = (target: HTMLElement, animate: boolean): void => {
      updateNavigation();
      const wasStuck = navigation.hasAttribute("data-stuck");
      // Measure the destination's compact toolbar before starting the scroll.
      // The reserved outer height keeps content stationary during this measurement.
      if (wide.matches) navigation.setAttribute("data-stuck", "");
      const offset = wide.matches
        ? bar.getBoundingClientRect().height + 16
        : 16;
      navigation.toggleAttribute("data-stuck", wasStuck);
      window.scrollTo({
        top: Math.max(
          0,
          window.scrollY + target.getBoundingClientRect().top - offset
        ),
        behavior: animate && !reducedMotion.matches ? "smooth" : "instant",
      });
    };
    const writeUrl = (replace = false): void => {
      const url = new URL(window.location.href);
      if (full) url.searchParams.set("view", "all");
      else url.searchParams.delete("view");
      url.hash = tabs[selected].panel.id;
      if (url.href === window.location.href) return;
      const method = replace ? "replaceState" : "pushState";
      window.history[method](window.history.state, "", url);
    };
    const syncUrl = (): void => {
      full = new URL(window.location.href).searchParams.get("view") === "all";
      const target = targetFromHash();
      const index = indexFor(target);
      selected = index >= 0 ? index : 0;
      render();
      // Deep links to a role or a nested disclosure must reveal their container.
      if (target && index >= 0) {
        for (
          let ancestor = target.parentElement;
          ancestor && ancestor !== this;
          ancestor = ancestor.parentElement
        ) {
          if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
        }
        if (window.location.hash) scrollToTarget(target, false);
      }
    };

    this.addEventListener(
      "click",
      event => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          !(event.target instanceof Element)
        )
          return;
        const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link || !this.contains(link)) return;
        const target = document.getElementById(link.hash.slice(1));
        const index = indexFor(target);
        if (index < 0) return;
        event.preventDefault();
        selected = index;
        render();
        writeUrl();
        if (full || link !== tabs[index].link) {
          if (full) tabs[index].panel.tabIndex = -1;
          tabs[index].panel.focus({ preventScroll: true });
          scrollToTarget(target ?? tabs[index].panel, true);
        }
      },
      { signal }
    );

    list.addEventListener(
      "keydown",
      event => {
        if (
          full ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          !(event.target instanceof Element)
        )
          return;
        const index = tabs.findIndex(tab => tab.link === event.target);
        if (index < 0) return;
        let next: number;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else if (event.key === (wide.matches ? "ArrowRight" : "ArrowDown"))
          next = (index + 1) % tabs.length;
        else if (event.key === (wide.matches ? "ArrowLeft" : "ArrowUp"))
          next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === " " || event.key === "Enter") next = index;
        else return;
        event.preventDefault();
        selected = next;
        render();
        tabs[next].link.focus();
        writeUrl(true);
      },
      { signal }
    );

    toggle.addEventListener(
      "click",
      () => {
        full = !full;
        render();
        writeUrl();
      },
      { signal }
    );
    wide.addEventListener(
      "change",
      () => {
        render();
        scheduleNavigation();
      },
      { signal }
    );
    window.addEventListener("scroll", scheduleNavigation, {
      passive: true,
      signal,
    });
    window.addEventListener("resize", scheduleNavigation, {
      passive: true,
      signal,
    });
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = new ResizeObserver(scheduleNavigation);
    this.#resizeObserver.observe(bar);
    window.addEventListener("hashchange", syncUrl, { signal });
    window.addEventListener("popstate", syncUrl, { signal });
    syncUrl();
    toggle.hidden = false;
    updateNavigation();
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
    this.#resizeObserver?.disconnect();
    if (this.#frame !== undefined) cancelAnimationFrame(this.#frame);
    this.#frame = undefined;
  }
}

if (!customElements.get("portfolio-tabs")) {
  customElements.define("portfolio-tabs", PortfolioTabs);
}
