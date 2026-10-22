// Light / dark theme. The theme lives on <html data-theme>, set before first
// paint by THEME_SCRIPT (saved choice, or ?theme=light|dark in the URL).
// CSS tokens flip on that attribute; canvas pieces read it via onTheme().

export type Theme = "dark" | "light";

const KEY = "theme";

export const THEME_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get("theme");var t=q==="light"||q==="dark"?q:localStorage.getItem("${KEY}");if(q)localStorage.setItem("${KEY}",q);document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function setTheme(t: Theme) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(KEY, t); } catch {}
}

/** Calls fn now and whenever the theme changes. Returns an unsubscribe. */
export function onTheme(fn: (t: Theme) => void) {
    fn(getTheme());
    const mo = new MutationObserver(() => fn(getTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
}
