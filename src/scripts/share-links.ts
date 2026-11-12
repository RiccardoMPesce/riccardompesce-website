class ShareLinks extends HTMLElement {
  private controller: AbortController | undefined;

  connectedCallback(): void {
    this.controller?.abort();
    this.controller = new AbortController();
    const { signal } = this.controller;
    const input = this.querySelector<HTMLInputElement>("input");
    const status = this.querySelector<HTMLParagraphElement>('[role="status"]');
    const copy = this.querySelector<HTMLButtonElement>("[data-copy-link]");
    const share = this.querySelector<HTMLButtonElement>("[data-native-share]");
    if (!input || !status || !copy || !share) {
      throw new Error(
        "Share controls require a URL field, status and action buttons."
      );
    }

    input.addEventListener("click", () => input.select(), { signal });
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      copy.hidden = false;
      copy.addEventListener(
        "click",
        async () => {
          copy.disabled = true;
          status.textContent = "";
          try {
            await navigator.clipboard.writeText(input.value);
            if (signal.aborted) return;
            status.textContent = status.dataset.copied ?? "Link copied.";
          } catch {
            if (signal.aborted) return;
            const details = input.closest("details");
            if (details) details.open = true;
            input.focus();
            input.select();
            status.textContent =
              status.dataset.copyError ??
              "Copy failed. Copy the selected link manually.";
          } finally {
            copy.disabled = false;
          }
        },
        { signal }
      );
    }

    if (window.isSecureContext && typeof navigator.share === "function") {
      share.hidden = false;
      share.addEventListener(
        "click",
        async () => {
          share.disabled = true;
          status.textContent = "";
          try {
            await navigator.share({
              title: this.dataset.shareTitle,
              url: input.value,
            });
          } catch (error: unknown) {
            // Closing the device chooser is a normal action, not a sharing failure.
            if (
              signal.aborted ||
              (error instanceof DOMException && error.name === "AbortError")
            )
              return;
            status.textContent =
              status.dataset.shareError ??
              "Sharing is unavailable. Use a social link or copy the URL.";
          } finally {
            share.disabled = false;
          }
        },
        { signal }
      );
    }
  }

  disconnectedCallback(): void {
    this.controller?.abort();
  }
}

if (!customElements.get("share-links")) {
  customElements.define("share-links", ShareLinks);
}
