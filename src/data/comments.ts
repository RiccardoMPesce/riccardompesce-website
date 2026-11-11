/** @description Public identifiers required to connect the blog to GitHub Discussions. */
interface CommentsConfig {
  readonly repository: string;
  readonly repositoryId: string;
  readonly category: string;
  readonly categoryId: string;
}

/**
 * @description Resolve the verified giscus category, with optional build-time overrides.
 * @param category Discussion category name supplied by giscus.
 * @param categoryId Discussion category node ID supplied by giscus.
 * @returns Configuration, or null when both overrides are explicitly empty.
 * @throws {Error} If only part of the configuration is supplied or the ID is invalid.
 */
export function resolveCommentsConfig(
  category: string | undefined,
  categoryId: string | undefined
): CommentsConfig | null {
  const useDefault = category === undefined && categoryId === undefined;
  const name = useDefault ? "Announcements" : (category?.trim() ?? "");
  const id = useDefault ? "DIC_kwDOVpgBGs4DK6Ei" : (categoryId?.trim() ?? "");
  if (!name && !id) return null;
  if (!name || !/^DIC_[A-Za-z0-9_-]+$/.test(id)) {
    throw new Error(
      "Set both PUBLIC_GISCUS_CATEGORY and a valid PUBLIC_GISCUS_CATEGORY_ID from giscus.app."
    );
  }
  return {
    repository: "RiccardoMPesce/riccardompesce-website",
    repositoryId: "R_kgDOVpgBGg",
    category: name,
    categoryId: id,
  };
}
