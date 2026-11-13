import { readFile } from "node:fs/promises";

/**
 * @description Loads local static WOFF fonts because Satori cannot consume variable WOFF2.
 * @returns Regular and bold Inter buffers, in that order.
 * @throws When either installed font file is missing or unreadable.
 */
export async function loadOgFonts(): Promise<readonly [Buffer, Buffer]> {
  return Promise.all([
    readFile(
      new URL(
        import.meta
          .resolve("@fontsource/inter/files/inter-latin-400-normal.woff")
      )
    ),
    readFile(
      new URL(
        import.meta
          .resolve("@fontsource/inter/files/inter-latin-700-normal.woff")
      )
    ),
  ]);
}
