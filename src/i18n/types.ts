export interface UIStrings {
  nav: {
    home: string;
    posts: string;
    tags: string;
    about: string;
    /** @description Label for the public career portfolio navigation link. */
    readonly portfolio: string;
    contacts: string;
    archives: string;
    search: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    sharePostIntro: string;
    sharePostOn: string;
    sharePostViaEmail: string;
    tagLabel: string;
    backToTop: string;
    /** Optional until v8, so older locale files still type-check. */
    tableOfContents?: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
  };
  sharing: {
    readonly shareSite: string;
    readonly moreOptions: string;
    readonly linkLabel: string;
    readonly copyLink: string;
    readonly copied: string;
    readonly manualCopy: string;
    readonly copyError: string;
    readonly shareError: string;
    readonly newTab: string;
  };
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
  home: {
    socialLinks: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
    builtWith: string;
    basedOn: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;

    postsTitle: string;
    postsDesc: string;

    archivesTitle: string;
    archivesDesc: string;

    searchTitle: string;
    searchDesc: string;
  };
  a11y: {
    skipToContent: string;
    /** Optional until v8, so older locale files still type-check. */
    skipTableOfContents?: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    searchPlaceholder: string;
    noResults: string;
    goToPreviousPage: string;
    goToNextPage: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
