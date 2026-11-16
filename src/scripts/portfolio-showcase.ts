const ROTATION_MS = 6000;

class PortfolioShowcase extends HTMLElement {
  #controller: AbortController | undefined;
  #timer: ReturnType<typeof setTimeout> | undefined;

  connectedCallback(): void {
    this.#controller?.abort();
    clearTimeout(this.#timer);
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    const compact = this.querySelector<HTMLElement>("[data-showcase]");
    const full = this.querySelector<HTMLElement>("[data-full-portfolio]");
    const toggle = this.querySelector<HTMLButtonElement>(
      "[data-showcase-toggle]"
    );
    const previous = this.querySelector<HTMLButtonElement>(
      "[data-showcase-prev]"
    );
    const next = this.querySelector<HTMLButtonElement>("[data-showcase-next]");
    const pause = this.querySelector<HTMLButtonElement>(
      "[data-showcase-pause]"
    );
    const status = this.querySelector<HTMLElement>("[data-showcase-status]");
    const slides = [
      ...this.querySelectorAll<HTMLElement>("[data-showcase-slide]"),
    ];
    const dots = [
      ...this.querySelectorAll<HTMLButtonElement>("[data-showcase-dot]"),
    ];
    if (
      !compact ||
      !full ||
      !toggle ||
      !previous ||
      !next ||
      !pause ||
      !status ||
      !slides.length ||
      slides.length !== dots.length
    ) {
      throw new Error(
        "Portfolio showcase requires matching slides, navigation and full-view controls."
      );
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let selected = 0;
    let plain = false;
    let hovering = false;
    let focused = false;
    let paused = false;
    let remaining = ROTATION_MS;
    let startedAt = 0;
    const stop = (): void => {
      if (this.#timer !== undefined) {
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
        clearTimeout(this.#timer);
        this.#timer = undefined;
      }
    };
    const schedule = (): void => {
      stop();
      const running =
        !plain &&
        !hovering &&
        !focused &&
        !paused &&
        !reduced.matches &&
        !document.hidden &&
        slides.length > 1;
      status.setAttribute("aria-live", running ? "off" : "polite");
      pause.textContent = paused ? "Resume rotation" : "Pause rotation";
      pause.setAttribute("aria-pressed", String(paused));
      pause.disabled = reduced.matches || slides.length === 1;
      if (running) {
        startedAt = performance.now();
        this.#timer = setTimeout(() => {
          this.#timer = undefined;
          select(selected + 1);
        }, remaining);
      }
    };
    const select = (index: number): void => {
      stop();
      selected = (index + slides.length) % slides.length;
      remaining = ROTATION_MS;
      slides.forEach((slide, i) => {
        slide.hidden = i !== selected;
        slide.inert = i !== selected;
        dots[i].setAttribute("aria-current", i === selected ? "true" : "false");
      });
      status.textContent = `Case study ${selected + 1} of ${slides.length}${reduced.matches ? " · Automatic rotation disabled for reduced motion" : ""}`;
      schedule();
    };
    const setPlain = (value: boolean): void => {
      plain = value;
      compact.hidden = plain;
      full.hidden = !plain;
      toggle.textContent = plain
        ? "Back to Compact Showcase"
        : "View Full Plain Portfolio";
      toggle.setAttribute("aria-pressed", String(plain));
      schedule();
    };
    toggle.addEventListener("click", () => setPlain(!plain), { signal });
    previous.addEventListener("click", () => select(selected - 1), { signal });
    next.addEventListener("click", () => select(selected + 1), { signal });
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => select(i), { signal })
    );
    pause.addEventListener(
      "click",
      () => {
        paused = !paused;
        schedule();
      },
      { signal }
    );
    compact.addEventListener(
      "mouseenter",
      () => {
        hovering = true;
        schedule();
      },
      { signal }
    );
    compact.addEventListener(
      "mouseleave",
      () => {
        hovering = false;
        schedule();
      },
      { signal }
    );
    compact.addEventListener(
      "focusin",
      () => {
        focused = true;
        schedule();
      },
      { signal }
    );
    compact.addEventListener(
      "focusout",
      event => {
        focused =
          event.relatedTarget instanceof Node &&
          compact.contains(event.relatedTarget);
        schedule();
      },
      { signal }
    );
    compact.addEventListener(
      "keydown",
      event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
          return;
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        select(selected + (event.key === "ArrowRight" ? 1 : -1));
      },
      { signal }
    );
    document.addEventListener("visibilitychange", schedule, { signal });
    reduced.addEventListener("change", () => select(selected), { signal });
    select(0);
    setPlain(new URL(location.href).searchParams.get("view") === "all");
    toggle.hidden = false;
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
    clearTimeout(this.#timer);
    this.#timer = undefined;
  }
}

if (!customElements.get("portfolio-showcase"))
  customElements.define("portfolio-showcase", PortfolioShowcase);
