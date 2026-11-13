let expandedForPrint: readonly HTMLDetailsElement[] = [];

window.addEventListener("beforeprint", () => {
  if (expandedForPrint.length > 0) return;
  expandedForPrint = Array.from(
    document.querySelectorAll<HTMLDetailsElement>("main details:not([open])")
  );
  for (const details of expandedForPrint) details.open = true;
});

window.addEventListener("afterprint", () => {
  for (const details of expandedForPrint) details.open = false;
  expandedForPrint = [];
});
