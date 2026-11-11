class ProjectCarousel extends HTMLElement {
  #controller: AbortController | undefined;
  #observer: ResizeObserver | undefined;
  #frame: number | undefined;

  connectedCallback(): void {
    this.#controller?.abort();
    this.#observer?.disconnect();
    if (this.#frame !== undefined) cancelAnimationFrame(this.#frame);
    this.#frame = undefined;
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    const viewport = this.querySelector<HTMLElement>("[data-project-viewport]");
    const controls = this.querySelector<HTMLElement>("[data-project-controls]");
    const previews = this.querySelector<HTMLElement>("[data-project-previews]");
    const navigation = this.querySelector<HTMLElement>(
      "[data-project-navigation]"
    );
    const previous = this.querySelector<HTMLButtonElement>(
      "[data-project-previous]"
    );
    const next = this.querySelector<HTMLButtonElement>("[data-project-next]");
    const status = this.querySelector<HTMLElement>("[data-project-status]");
    const previewPrevious = this.querySelector<HTMLButtonElement>(
      "[data-project-preview-previous]"
    );
    const previewNext = this.querySelector<HTMLButtonElement>(
      "[data-project-preview-next]"
    );
    const slides = [
      ...this.querySelectorAll<HTMLElement>("[data-project-slide]"),
    ];
    const buttons = [
      ...this.querySelectorAll<HTMLButtonElement>("[data-project-preview]"),
    ];
    if (
      !viewport ||
      !controls ||
      !previews ||
      !navigation ||
      !previous ||
      !next ||
      !status ||
      !previewPrevious ||
      !previewNext ||
      !slides.length ||
      buttons.length !== slides.length
    ) {
      throw new Error(
        "Project carousel controls and slides must be complete and paired."
      );
    }
    for (const [index, button] of buttons.entries()) {
      if (
        !button.id ||
        button.getAttribute("aria-controls") !== slides[index].id
      ) {
        throw new Error(
          "Each project preview must reference its matching slide."
        );
      }
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let selected = 0;
    let requested: number | null = null;
    const updatePreviewArrows = (): void => {
      const limit = Math.max(0, previews.scrollWidth - previews.clientWidth);
      previewPrevious.disabled = previews.scrollLeft <= 1;
      previewNext.disabled = previews.scrollLeft >= limit - 1;
    };
    const reflect = (): void => {
      for (const [index, button] of buttons.entries()) {
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(index === selected));
        button.tabIndex = index === selected ? 0 : -1;
        slides[index].setAttribute("role", "tabpanel");
        slides[index].setAttribute("aria-labelledby", button.id);
        slides[index].setAttribute("aria-hidden", String(index !== selected));
        slides[index].inert = index !== selected;
        slides[index].tabIndex = index === selected ? 0 : -1;
      }
      previous.disabled = selected === 0;
      next.disabled = selected === slides.length - 1;
      status.textContent = `Project ${selected + 1} of ${slides.length}`;
    };
    const select = (index: number, animate: boolean): void => {
      selected = Math.max(0, Math.min(index, slides.length - 1));
      requested =
        animate && !reducedMotion.matches && viewport.clientWidth > 0
          ? selected
          : null;
      reflect();
      if (viewport.clientWidth > 0) {
        viewport.scrollTo({
          left: selected * viewport.clientWidth,
          behavior: animate && !reducedMotion.matches ? "smooth" : "instant",
        });
      }
      const button = buttons[selected];
      const left = button.offsetLeft - buttons[0].offsetLeft;
      if (
        left < previews.scrollLeft ||
        left + button.offsetWidth > previews.scrollLeft + previews.clientWidth
      ) {
        previews.scrollTo({
          left: Math.max(
            0,
            left - (previews.clientWidth - button.offsetWidth) / 2
          ),
          behavior: "instant",
        });
      }
      updatePreviewArrows();
    };
    const scrollPreviews = (direction: number): void => {
      const limit = Math.max(0, previews.scrollWidth - previews.clientWidth);
      previews.scrollTo({
        left: Math.max(
          0,
          Math.min(
            limit,
            previews.scrollLeft + direction * previews.clientWidth * 0.8
          )
        ),
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
      updatePreviewArrows();
    };
    previewPrevious.addEventListener("click", () => scrollPreviews(-1), {
      signal,
    });
    previewNext.addEventListener("click", () => scrollPreviews(1), { signal });
    previews.addEventListener("scroll", updatePreviewArrows, {
      passive: true,
      signal,
    });
    previews.addEventListener(
      "wheel",
      event => {
        if (
          event.ctrlKey ||
          event.shiftKey ||
          Math.abs(event.deltaX) >= Math.abs(event.deltaY)
        )
          return;
        const unit =
          event.deltaMode === 1
            ? 16
            : event.deltaMode === 2
              ? previews.clientWidth
              : 1;
        const limit = Math.max(0, previews.scrollWidth - previews.clientWidth);
        const left = Math.max(
          0,
          Math.min(limit, previews.scrollLeft + event.deltaY * unit)
        );
        if (left === previews.scrollLeft) return;
        event.preventDefault();
        previews.scrollTo({ left, behavior: "instant" });
        updatePreviewArrows();
      },
      { passive: false, signal }
    );

    const enableMouseDrag = (element: HTMLElement): void => {
      let drag:
        | {
            readonly id: number;
            readonly x: number;
            readonly y: number;
            readonly left: number;
            active: boolean;
          }
        | undefined;
      let suppressClick = false;
      const finish = (): void => {
        if (!drag) return;
        const completed = drag;
        drag = undefined;
        suppressClick = completed.active;
        element.removeAttribute("data-dragging");
        if (element.hasPointerCapture(completed.id))
          element.releasePointerCapture(completed.id);
      };
      element.addEventListener(
        "pointerdown",
        event => {
          if (
            event.pointerType !== "mouse" ||
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey
          )
            return;
          suppressClick = false;
          drag = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            left: element.scrollLeft,
            active: false,
          };
        },
        { signal }
      );
      window.addEventListener(
        "pointermove",
        event => {
          if (!drag || event.pointerId !== drag.id) return;
          if (event.buttons === 0) {
            finish();
            return;
          }
          const dx = event.clientX - drag.x;
          if (!drag.active) {
            if (
              Math.abs(dx) < 6 ||
              Math.abs(dx) < Math.abs(event.clientY - drag.y)
            )
              return;
            if (element.scrollWidth <= element.clientWidth) return;
            drag.active = true;
            element.setAttribute("data-dragging", "");
            element.setPointerCapture(drag.id);
          }
          event.preventDefault();
          element.scrollTo({
            left: Math.max(
              0,
              Math.min(
                element.scrollWidth - element.clientWidth,
                drag.left - dx
              )
            ),
            behavior: "instant",
          });
        },
        { passive: false, signal }
      );
      for (const name of ["pointerup", "pointercancel"]) {
        window.addEventListener(
          name,
          event => {
            if (drag && (event as PointerEvent).pointerId === drag.id) finish();
          },
          { signal }
        );
      }
      element.addEventListener("lostpointercapture", finish, { signal });
      window.addEventListener("blur", finish, { signal });
      element.addEventListener(
        "click",
        event => {
          if (suppressClick && event.detail > 0) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          suppressClick = false;
        },
        { capture: true, signal }
      );
      element.addEventListener("dragstart", event => event.preventDefault(), {
        signal,
      });
      signal.addEventListener("abort", finish, { once: true });
    };
    enableMouseDrag(previews);
    enableMouseDrag(viewport);
    for (const [index, button] of buttons.entries()) {
      button.addEventListener("click", () => select(index, true), { signal });
      button.addEventListener(
        "keydown",
        event => {
          let target: number;
          if (event.key === "ArrowRight") target = (index + 1) % slides.length;
          else if (event.key === "ArrowLeft")
            target = (index - 1 + slides.length) % slides.length;
          else if (event.key === "Home") target = 0;
          else if (event.key === "End") target = slides.length - 1;
          else return;
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          select(target, true);
          buttons[target].focus({ preventScroll: true });
        },
        { signal }
      );
    }
    previous.addEventListener("click", () => select(selected - 1, true), {
      signal,
    });
    next.addEventListener("click", () => select(selected + 1, true), {
      signal,
    });
    viewport.addEventListener(
      "scroll",
      () => {
        if (this.#frame !== undefined) return;
        this.#frame = requestAnimationFrame(() => {
          this.#frame = undefined;
          if (viewport.clientWidth <= 0) return;
          const index = Math.max(
            0,
            Math.min(
              Math.round(viewport.scrollLeft / viewport.clientWidth),
              slides.length - 1
            )
          );
          if (requested !== null && index !== requested) return;
          requested = null;
          if (index !== selected) {
            selected = index;
            reflect();
          }
        });
      },
      { passive: true, signal }
    );
    for (const event of ["pointerdown", "wheel"]) {
      viewport.addEventListener(
        event,
        () => {
          requested = null;
        },
        { passive: true, signal }
      );
    }
    this.#observer = new ResizeObserver(() => select(selected, false));
    this.#observer.observe(viewport);
    this.#observer.observe(previews);
    this.setAttribute("role", "region");
    this.setAttribute("aria-roledescription", "carousel");
    previews.setAttribute("role", "tablist");
    previews.setAttribute("aria-orientation", "horizontal");
    this.setAttribute("data-enhanced", "");
    controls.hidden = false;
    navigation.hidden = false;
    select(0, false);
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
    this.#observer?.disconnect();
    if (this.#frame !== undefined) cancelAnimationFrame(this.#frame);
    this.#frame = undefined;
  }
}

if (!customElements.get("project-carousel")) {
  customElements.define("project-carousel", ProjectCarousel);
}
