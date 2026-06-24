/** Mobile bottom nav height — matches MobilePortfolio `pb-[80px]`. */
export const WIZARD_NAV_HEIGHT = "5rem";

/** Sticky action bar content height. */
export const WIZARD_ACTION_BAR_HEIGHT = "3.75rem";

/** Collapsed price drawer height (approx). */
export const WIZARD_DRAWER_HEIGHT = "3.25rem";

/** Fixed offset from viewport bottom — sits directly above mobile bottom nav. */
export const WIZARD_CHROME_BOTTOM = `calc(${WIZARD_NAV_HEIGHT} + env(safe-area-inset-bottom))`;

/** Bottom offset for collapsed drawer + expanded sheet (nav + action bar). */
export const WIZARD_DRAWER_BOTTOM = `calc(${WIZARD_NAV_HEIGHT} + ${WIZARD_ACTION_BAR_HEIGHT} + 1.5rem + env(safe-area-inset-bottom))`;

/** Bottom padding for wizard step scroll areas (drawer + action bar above nav). */
export const WIZARD_STEP_BOTTOM_PADDING = `pb-[calc(15rem+env(safe-area-inset-bottom))] lg:pb-0`;

/** z-index above MobileBottomNav (z-50). */
export const WIZARD_CHROME_Z = 60;
