// Resolve a project image path (relative to /public) or pass through full URLs.
export const img = (p) => (!p ? "" : /^(https?:|data:|\/)/.test(p) ? p : `${import.meta.env.BASE_URL}${p}`);
