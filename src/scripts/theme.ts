type Theme = "light" | "dark";

const THEME_KEY = "theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function readSavedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Storage can be blocked by browser policy; theme controls must remain usable.
    return null;
  }
}

function getSystemTheme(): Theme {
  return systemTheme.matches ? "dark" : "light";
}

let preference = readSavedTheme();
let themeValue: Theme = preference ?? getSystemTheme();
let buttonController: AbortController | undefined;

function applyTheme(root: HTMLElement): void {
  root.setAttribute("data-theme", themeValue);
  root.classList.toggle("dark", themeValue === "dark");
  root.style.colorScheme = themeValue;
}

function reflect(): void {
  applyTheme(document.documentElement);
  const label = `Switch to ${themeValue === "dark" ? "light" : "dark"} mode`;
  const button = document.querySelector<HTMLButtonElement>("#theme-btn");
  button?.setAttribute("aria-label", label);
  button?.setAttribute("title", label);

  const background = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", background);
}

function setup(): void {
  buttonController?.abort();
  buttonController = new AbortController();
  reflect();
  document.querySelector<HTMLButtonElement>("#theme-btn")?.addEventListener(
    "click",
    () => {
      themeValue = themeValue === "light" ? "dark" : "light";
      preference = themeValue;
      try {
        localStorage.setItem(THEME_KEY, themeValue);
      } catch {
        // Retain the explicit choice in memory for this visit if persistence is denied.
      }
      reflect();
    },
    { signal: buttonController.signal }
  );
}

setup();
document.addEventListener("astro:after-swap", setup);

document.addEventListener("astro:before-swap", event => {
  const { newDocument } = event as Event & { readonly newDocument: Document };
  // Apply before the swap so navigation cannot briefly restore the system default.
  applyTheme(newDocument.documentElement);
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color)
    newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
});

systemTheme.addEventListener("change", () => {
  if (preference !== null) return;
  themeValue = getSystemTheme();
  reflect();
});

window.addEventListener("storage", event => {
  if (event.key !== THEME_KEY && event.key !== null) return;
  preference = readSavedTheme();
  themeValue = preference ?? getSystemTheme();
  reflect();
});
