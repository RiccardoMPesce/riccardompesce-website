let controller: AbortController | undefined;

function setupNavigation(): void {
  controller?.abort();
  controller = new AbortController();
  const button = document.querySelector<HTMLButtonElement>("#menu-btn");
  const items = document.querySelector<HTMLElement>("#menu-items");
  const menuIcon = document.querySelector<SVGElement>("#menu-icon");
  const closeIcon = document.querySelector<SVGElement>("#close-icon");
  if (!button || !items || !menuIcon || !closeIcon) return;
  const signal = controller.signal;
  const setOpen = (open: boolean): void => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open
        ? (button.dataset.labelClose ?? "Close menu")
        : (button.dataset.labelOpen ?? "Open menu")
    );
    items.classList.toggle("hidden", !open);
    items.classList.toggle("grid", open);
    menuIcon.classList.toggle("hidden", open);
    closeIcon.classList.toggle("hidden", !open);
  };
  button.hidden = false;
  setOpen(false);
  button.addEventListener(
    "click",
    () => setOpen(button.getAttribute("aria-expanded") !== "true"),
    { signal }
  );
  items.addEventListener(
    "keydown",
    event => {
      if (
        event.key !== "Escape" ||
        button.getAttribute("aria-expanded") !== "true"
      )
        return;
      setOpen(false);
      button.focus();
    },
    { signal }
  );
  button.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") setOpen(false);
    },
    { signal }
  );
}

setupNavigation();
document.addEventListener("astro:after-swap", setupNavigation);
document.addEventListener("astro:before-swap", () => controller?.abort());
