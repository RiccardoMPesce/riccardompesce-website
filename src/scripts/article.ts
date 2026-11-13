let cleanup: (() => void) | undefined;

function setupArticle(): void {
  cleanup?.();
  const article = document.querySelector<HTMLElement>("#article");
  if (!article) return;
  const controller = new AbortController();
  const { signal } = controller;
  let frame = 0;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const progress = document.querySelector<HTMLElement>(
    "[data-reading-progress]"
  );
  const updateProgress = (): void => {
    frame = 0;
    if (!progress) return;
    const bounds = article.getBoundingClientRect();
    const start = window.scrollY + bounds.top - 100;
    const distance = Math.max(
      1,
      article.offsetHeight - window.innerHeight + 100
    );
    const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
    progress.style.transform = `scaleX(${ratio})`;
  };
  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(updateProgress);
  };
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", schedule, { signal });
  const observer = new ResizeObserver(schedule);
  observer.observe(article);
  updateProgress();

  for (const block of article.querySelectorAll<HTMLPreElement>("pre")) {
    const code = block.querySelector("code");
    if (!code || block.parentElement?.classList.contains("code-block"))
      continue;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    block.before(wrapper);
    wrapper.append(block);
    block.tabIndex = 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy";
    button.setAttribute("data-pagefind-ignore", "");
    const status = document.createElement("span");
    status.className = "sr-only";
    status.setAttribute("role", "status");
    status.setAttribute("data-pagefind-ignore", "");
    wrapper.append(button, status);
    button.addEventListener(
      "click",
      async () => {
        button.disabled = true;
        try {
          if (!navigator.clipboard) throw new Error("Clipboard unavailable");
          await navigator.clipboard.writeText(code.textContent ?? "");
          if (signal.aborted) return;
          button.textContent = "Copied";
          button.dataset.copied = "";
          status.textContent = "Code copied.";
        } catch {
          if (signal.aborted) return;
          button.textContent = "Retry";
          status.textContent =
            "Copy failed. Select the code and copy it manually.";
        } finally {
          if (!signal.aborted) {
            button.disabled = false;
            const timer = setTimeout(() => {
              button.textContent = "Copy";
              delete button.dataset.copied;
              timers.delete(timer);
            }, 1800);
            timers.add(timer);
          }
        }
      },
      { signal }
    );
  }
  cleanup = () => {
    controller.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
    timers.forEach(clearTimeout);
  };
}
document.addEventListener("astro:page-load", setupArticle);
document.addEventListener("astro:before-swap", () => {
  cleanup?.();
  cleanup = undefined;
});
