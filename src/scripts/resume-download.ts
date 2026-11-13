class ResumeDownload extends HTMLElement {
  #controller: AbortController | undefined;

  connectedCallback(): void {
    this.#controller?.abort();
    const language = this.querySelector<HTMLSelectElement>(
      "[data-resume-language]"
    );
    const format = this.querySelector<HTMLSelectElement>(
      "[data-resume-format]"
    );
    const link = this.querySelector<HTMLAnchorElement>("[data-resume-link]");
    const controls = this.querySelector<HTMLElement>("[data-resume-controls]");
    const fallback = this.querySelector<HTMLElement>("[data-resume-fallback]");
    const status = this.querySelector<HTMLElement>("[data-resume-status]");
    if (!language || !format || !link || !controls || !fallback || !status) {
      throw new Error("Resume download controls are incomplete.");
    }
    const update = (): void => {
      const lang = language.value;
      const extension = format.value;
      if (
        (lang !== "en" && lang !== "it") ||
        (extension !== "pdf" && extension !== "docx")
      ) {
        throw new Error("Unsupported resume language or format.");
      }
      const name = `riccardo-pesce-master-resume-${lang}.${extension}`;
      link.href = `/resume/${name}`;
      link.download = name;
      link.textContent = `Download résumé · ${lang === "en" ? "English" : "Italiano"} · ${extension.toUpperCase()}`;
      status.textContent = `${lang === "en" ? "English" : "Italiano"} ${extension.toUpperCase()} résumé ready to download.`;
    };
    update();
    this.#controller = new AbortController();
    language.addEventListener("change", update, {
      signal: this.#controller.signal,
    });
    format.addEventListener("change", update, {
      signal: this.#controller.signal,
    });
    controls.hidden = false;
    fallback.hidden = true;
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
    this.#controller = undefined;
  }
}

if (!customElements.get("resume-download")) {
  customElements.define("resume-download", ResumeDownload);
}
