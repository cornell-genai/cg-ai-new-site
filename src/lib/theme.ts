// The theme is set before paint. A saved choice or ?theme=light|dark wins;
// the default is light. Canvas pieces subscribe to the same HTML attribute.
export type Theme = "dark" | "light";
const KEY = "theme";

// This meta is created outside React's managed head. Route navigation must not
// replace a chosen theme-color with an OS-based viewport default.
export const THEME_SCRIPT = `(() => {
    let t = "light";
    try {
        const q = new URLSearchParams(location.search).get("theme");
        const valid = q === "light" || q === "dark";
        t = (valid ? q : localStorage.getItem("${KEY}")) === "dark" ? "dark" : "light";
        if (valid) localStorage.setItem("${KEY}", q);
    } catch {}
    document.documentElement.dataset.theme = t;
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.dataset.siteThemeColor = "";
    meta.content = t === "dark" ? "#121212" : "#f7f7f5";
    document.head.appendChild(meta);
})()`;

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function setTheme(t: Theme) {
    document.documentElement.dataset.theme = t;
    const meta = document.querySelector<HTMLMetaElement>("meta[data-site-theme-color]");
    if (meta) meta.content = t === "dark" ? "#121212" : "#f7f7f5";
    try { localStorage.setItem(KEY, t); } catch {}
}

/** Calls fn now and whenever the theme changes. Returns an unsubscribe. */
export function onTheme(fn: (t: Theme) => void) {
    fn(getTheme());
    const mo = new MutationObserver(() => fn(getTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
}
