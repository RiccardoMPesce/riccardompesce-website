document.addEventListener("click", event => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  )
    return;
  const link = event.target.closest<HTMLAnchorElement>('a[href*="#"]');
  if (
    !link ||
    link.hasAttribute("download") ||
    (link.target && link.target !== "_self")
  )
    return;
  const url = new URL(link.href, window.location.href);
  if (
    !url.hash ||
    url.origin !== location.origin ||
    url.pathname !== location.pathname ||
    url.search !== location.search
  )
    return;
  let id: string;
  try {
    id = decodeURIComponent(url.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  // Keyboard users must arrive at the section as well as seeing it scroll into view.
  if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  target.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
});
