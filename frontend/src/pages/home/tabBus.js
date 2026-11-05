// Tiny event bus so the header (outside the sheet) can switch the sheet's tab.
export const TAB_EVENT = "sheet:set-tab";
export const scrollToTab = (tab) => window.dispatchEvent(new CustomEvent(TAB_EVENT, { detail: tab }));
