interface SearchInstance {
  readonly triggerSearch: (term: string) => void;
  readonly destroy: () => void;
}

interface SearchOptions {
  readonly element: HTMLElement;
  readonly bundlePath: string;
  readonly showImages: boolean;
  readonly showSubResults: boolean;
  readonly processTerm: (term: string) => string;
}

class SiteSearch extends HTMLElement {
  private search: SearchInstance | undefined;
  private controller: AbortController | undefined;

  connectedCallback(): void {
    this.controller?.abort();
    this.controller = new AbortController();
    void this.initialize(this.controller.signal);
  }

  disconnectedCallback(): void {
    this.controller?.abort();
    this.search?.destroy();
    this.search = undefined;
  }

  private async initialize(signal: AbortSignal): Promise<void> {
    const bundlePath = this.dataset.bundlePath;
    const label = this.dataset.searchLabel;
    const status = this.querySelector<HTMLElement>("[data-search-status]");
    try {
      if (!bundlePath || !label)
        throw new Error("Search requires a bundle path and accessible label.");
      // Pagefind's distributed UI has no TypeScript declarations.
      // @ts-expect-error Missing types for @pagefind/default-ui.
      const { PagefindUI } = (await import("@pagefind/default-ui")) as {
        readonly PagefindUI: new (options: SearchOptions) => SearchInstance;
      };
      if (signal.aborted) return;
      const updateTerm = (term: string): string => {
        const url = new URL(window.location.href);
        if (term.trim()) url.searchParams.set("q", term);
        else url.searchParams.delete("q");
        history.replaceState(
          history.state,
          "",
          `${url.pathname}${url.search}${url.hash}`
        );
        try {
          sessionStorage.setItem(
            "backUrl",
            `${this.dataset.backurl ?? url.pathname}${url.search}`
          );
        } catch {
          // Query URLs still work when browser storage is blocked.
        }
        return term;
      };
      this.search = new PagefindUI({
        element: this,
        bundlePath,
        showImages: false,
        showSubResults: true,
        processTerm: updateTerm,
      });
      const input = this.querySelector<HTMLInputElement>(
        ".pagefind-ui__search-input"
      );
      if (!input) throw new Error("Pagefind did not create its search input.");
      input.setAttribute("aria-label", label);
      input.setAttribute("type", "search");
      input.addEventListener(
        "input",
        () => {
          if (!input.value.trim()) updateTerm("");
        },
        { signal }
      );
      this.querySelector(".pagefind-ui__search-clear")?.addEventListener(
        "click",
        () => {
          updateTerm("");
          input.focus();
        },
        { signal }
      );
      const query = new URL(window.location.href).searchParams.get("q");
      if (query) this.search.triggerSearch(query);
      status?.remove();
    } catch {
      if (signal.aborted) return;
      this.search?.destroy();
      this.search = undefined;
      const failure = document.createElement("p");
      failure.setAttribute("role", "alert");
      failure.textContent =
        "Article search could not load. Reload this page or browse Blog using the navigation.";
      this.replaceChildren(failure);
    }
  }
}

if (!customElements.get("site-search"))
  customElements.define("site-search", SiteSearch);
