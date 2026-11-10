import type { FontData } from "astro:assets";

/**
 * @description Selects a font source matching the requested weight and style.
 * @param fonts Font metadata registered in the active Astro configuration.
 * @param weight Requested numeric font weight.
 * @param options Preferred style and source format.
 * @returns The preferred source URL, the first available source, or undefined if no match exists.
 * @throws {Error} When the font family is missing from the active configuration.
 */
export function getFontPathByWeight(
  fonts: readonly FontData[] | undefined,
  weight: number,
  options?: {
    readonly style?: "normal" | "italic";
    readonly format?: string;
  }
): string | undefined {
  if (fonts === undefined) {
    throw new Error(
      "Font family is not registered. Configure fonts in the active Astro config (astro.config.mjs takes precedence over astro.config.ts)."
    );
  }

  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  for (const font of fonts) {
    if (font.weight === String(weight) && font.style === style) {
      const src = font.src.find(file => file.format === format) ?? font.src[0];
      if (src) return src.url;
    }
  }

  return undefined;
}
