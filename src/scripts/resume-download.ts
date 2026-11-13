class ResumeDownload extends HTMLElement {
  #controller: AbortController | undefined;
  #dialog: HTMLDialogElement | undefined;

  connectedCallback(): void {
    this.#controller?.abort();
    const language = this.querySelector<HTMLSelectElement>(
      "[data-resume-language]"
    );
    const format = this.querySelector<HTMLSelectElement>(
      "[data-resume-format]"
    );
    const link = this.querySelector<HTMLAnchorElement>("[data-resume-link]");
    const dialog = this.querySelector<HTMLDialogElement>("dialog");
    const opener = this.querySelector<HTMLButtonElement>("[data-resume-open]");
    const close = this.querySelector<HTMLButtonElement>("[data-resume-close]");
    const fallback = this.querySelector<HTMLElement>("[data-resume-fallback]");
    const status = this.querySelector<HTMLElement>("[data-resume-status]");
    if (
      !language ||
      !format ||
      !link ||
      !dialog ||
      !opener ||
      !close ||
      !fallback ||
      !status
    ) {
      throw new Error("Portfolio download controls are incomplete.");
    }
    const update = (): void => {
      const lang = language.value;
      const extension = format.value;
      if (
        (lang !== "en" && lang !== "it") ||
        (extension !== "pdf" && extension !== "docx")
      ) {
        throw new Error("Unsupported portfolio language or format.");
      }
      const name = `riccardo-pesce-full-portfolio-${lang}.${extension}`;
      link.href = `/portfolio-downloads/${name}`;
      link.download = name;
      link.textContent = `Download portfolio · ${lang === "en" ? "English" : "Italiano"} · ${extension.toUpperCase()}`;
      status.textContent = `${lang === "en" ? "English" : "Italiano"} ${extension.toUpperCase()} portfolio ready to download.`;
    };
    update();
    this.#controller = new AbortController();
    this.#dialog = dialog;
    const { signal } = this.#controller;
    opener.addEventListener(
      "click",
      () => {
        if (dialog.open) return;
        dialog.showModal();
        language.focus();
      },
      { signal }
    );
    close.addEventListener("click", () => dialog.close(), { signal });
    dialog.addEventListener("close", () => opener.focus(), { signal });
    language.addEventListener("change", update, {
      signal: this.#controller.signal,
    });
    format.addEventListener("change", update, {
      signal: this.#controller.signal,
    });
    opener.hidden = false;
    fallback.hidden = true;
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
    this.#dialog?.close();
    this.#dialog = undefined;
    this.#controller = undefined;
  }
}

if (!customElements.get("resume-download")) {
  customElements.define("resume-download", ResumeDownload);
}
