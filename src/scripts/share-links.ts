class ShareLinks extends HTMLElement {
  private controller: AbortController | undefined;

  connectedCallback(): void {
    this.controller?.abort();
    this.controller = new AbortController();
    const { signal } = this.controller;
    const input = this.querySelector<HTMLInputElement>("input");
    const status = this.querySelector<HTMLParagraphElement>('[role="status"]');
    const copies = this.querySelectorAll<HTMLButtonElement>("[data-copy-link]");
    const dialog = this.querySelector<HTMLDialogElement>("dialog");
    const opener = this.querySelector<HTMLButtonElement>("[data-open-share]");
    const close = this.querySelector<HTMLButtonElement>("[data-close-share]");
    const modalStatus = this.querySelector<HTMLParagraphElement>(
      "[data-modal-status]"
    );
    const share = this.querySelector<HTMLButtonElement>("[data-native-share]");
    if (
      !input ||
      !status ||
      copies.length === 0 ||
      !share ||
      !dialog ||
      !opener ||
      !close ||
      !modalStatus
    ) {
      throw new Error(
        "Share controls require a URL field, statuses, dialog and action buttons."
      );
    }

    let returnFocus: HTMLElement = opener;
    const openDialog = (trigger: HTMLElement): void => {
      if (dialog.open) return;
      returnFocus = trigger;
      dialog.showModal();
      close.focus();
    };
    const setStatus = (message: string): void => {
      status.textContent = "";
      modalStatus.textContent = "";
      (dialog.open ? modalStatus : status).textContent = message;
    };
    opener.hidden = false;
    opener.addEventListener("click", () => openDialog(opener), { signal });
    close.addEventListener("click", () => dialog.close(), { signal });
    dialog.addEventListener("close", () => returnFocus.focus(), { signal });

    // Check coordinates so clicks inside the dialog's own padding stay inside.
    const isOutside = (event: MouseEvent): boolean => {
      const bounds = dialog.getBoundingClientRect();
      return (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      );
    };
    let startedOutside = false;
    dialog.addEventListener(
      "pointerdown",
      event => {
        startedOutside = event.target === dialog && isOutside(event);
      },
      { signal }
    );
    dialog.addEventListener(
      "click",
      event => {
        if (startedOutside && event.target === dialog && isOutside(event))
          dialog.close();
        startedOutside = false;
      },
      { signal }
    );

    input.addEventListener("click", () => input.select(), { signal });
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      for (const copy of copies) {
        copy.hidden = false;
        copy.addEventListener(
          "click",
          async () => {
            copy.disabled = true;
            setStatus("");
            try {
              await navigator.clipboard.writeText(input.value);
              if (signal.aborted) return;
              setStatus(status.dataset.copied ?? "Link copied.");
            } catch {
              if (signal.aborted) return;
              openDialog(copy);
              input.focus();
              input.select();
              setStatus(
                status.dataset.copyError ??
                  "Copy failed. Copy the selected link manually."
              );
            } finally {
              copy.disabled = false;
            }
          },
          { signal }
        );
      }
    }

    if (window.isSecureContext && typeof navigator.share === "function") {
      share.hidden = false;
      share.addEventListener(
        "click",
        async () => {
          share.disabled = true;
          setStatus("");
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
            setStatus(
              status.dataset.shareError ??
                "Sharing is unavailable. Use a social link or copy the URL."
            );
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
    this.querySelector<HTMLDialogElement>("dialog")?.close();
  }
}

if (!customElements.get("share-links")) {
  customElements.define("share-links", ShareLinks);
}
