/**
 * @description Builds a sharing destination without letting page query parameters
 * escape into the destination's own query string.
 * @param baseUrl - HTTPS or mailto destination ending in an empty query parameter.
 * @param pageUrl - Absolute public HTTP(S) URL to share.
 * @returns The destination with the page URL encoded as one parameter value.
 * @throws {TypeError} If either URL is invalid or uses an unsupported format.
 */
export function getShareUrl(baseUrl: string, pageUrl: string): string {
  const page = new URL(pageUrl);
  const destination = new URL(baseUrl);
  if (!["http:", "https:"].includes(page.protocol)) {
    throw new TypeError("Shared pages must use HTTP or HTTPS.");
  }
  if (
    !["https:", "mailto:"].includes(destination.protocol) ||
    !/[?&][^=&?#]+=$/.test(baseUrl)
  ) {
    throw new TypeError(
      "Share destinations must end in an empty query parameter and use HTTPS or mailto."
    );
  }
  return `${baseUrl}${encodeURIComponent(page.href)}`;
}
