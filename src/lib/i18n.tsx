"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "@/content/en";
import { ru } from "@/content/ru";
import type { Content, Locale } from "@/content/types";

const dictionaries: Record<Locale, Content> = { ru, en };
const STORAGE_KEY = "abyss:locale";

type LocaleState = {
  locale: Locale;
  t: Content;
  toggle: () => void;
  formatNumber: (value: number, digits?: number) => string;
};

const LocaleContext = createContext<LocaleState | null>(null);

function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "ru" || value === "en" ? value : null;
  } catch {
    return null;
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru");

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocale(stored);
    else if (!navigator.language.toLowerCase().startsWith("ru")) setLocale("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = dictionaries[locale].meta.title;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {}
  }, [locale]);

  const toggle = useCallback(() => setLocale((current) => (current === "ru" ? "en" : "ru")), []);

  const value = useMemo<LocaleState>(() => {
    const formatters = new Map<number, Intl.NumberFormat>();
    const formatNumber = (n: number, digits = 0) => {
      let formatter = formatters.get(digits);
      if (!formatter) {
        formatter = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        });
        formatters.set(digits, formatter);
      }
      return formatter.format(n);
    };
    return { locale, t: dictionaries[locale], toggle, formatNumber };
  }, [locale, toggle]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
