// Tiny localization module.
// All visible text lives in the dictionary files (en.js, it.js, ...) and is
// looked up with t("some.key"). To add a language: create xx.js with the same
// keys, then register it in DICTIONARIES below.
import en from "./en.js";
import it from "./it.js";

const DICTIONARIES = { en, it };
export const LANGUAGES = Object.keys(DICTIONARIES);

// Used when a key is missing in the current language
const FALLBACK_LANG = "en";
const STORAGE_KEY = "game.lang";

let current = detectInitialLang();
applyToPage();

// Saved choice first, then the browser language, then the fallback
function detectInitialLang(){
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved in DICTIONARIES) return saved;
    } catch (e) { /* storage not available: ignore */ }
    if (typeof navigator !== "undefined"){
        const browser = (navigator.language || "").slice(0, 2).toLowerCase();
        if (browser in DICTIONARIES) return browser;
    }
    return FALLBACK_LANG;
}

// Keep the page title and <html lang> in sync with the current language
function applyToPage(){
    if (typeof document === "undefined") return;
    document.documentElement.lang = current;
    document.title = t("ui.title");
}

export function getLang(){
    return current;
}

export function setLang(lang){
    if (!(lang in DICTIONARIES)) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    applyToPage();
}

// Switch to the next language in the list (en -> it -> en ...)
export function toggleLang(){
    setLang(LANGUAGES[(LANGUAGES.indexOf(current) + 1) % LANGUAGES.length]);
}

// Translate a key. Returns a string, or an array of strings for dialog lines.
// {placeholders} are replaced with the values in params.
export function t(key, params = {}){
    const value = DICTIONARIES[current][key] ?? DICTIONARIES[FALLBACK_LANG][key];
    if (value === undefined){
        console.warn(`Missing translation key: ${key}`);
        return key; // visible in the game, so a missing key is easy to spot
    }
    const fill = (s) => s.replace(/\{(\w+)\}/g, (m, name) => params[name] ?? m);
    return Array.isArray(value) ? value.map(fill) : fill(value);
}

// Development helper: keys present in some languages but missing in others.
// Returns {} when every language is complete.
export function findMissingKeys(){
    const all = new Set(Object.values(DICTIONARIES).flatMap((d) => Object.keys(d)));
    const missing = {};
    for (const [lang, dict] of Object.entries(DICTIONARIES)){
        const keys = [...all].filter((k) => !(k in dict));
        if (keys.length) missing[lang] = keys;
    }
    return missing;
}
