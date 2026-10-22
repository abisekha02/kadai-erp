"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type WishItem = { id: number; name: string; price: number; category: string; image_url: string | null; stock: number };

type Ctx = {
  items: WishItem[];
  ready: boolean;
  count: number;
  has: (id: number) => boolean;
  toggle: (item: WishItem) => void;
  remove: (id: number) => void;
};

const WishCtx = createContext<Ctx | null>(null);
const KEY = "kadai-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const has = useCallback((id: number) => items.some((i) => i.id === id), [items]);
  const toggle = useCallback((item: WishItem) => {
    setItems((cur) => (cur.some((i) => i.id === item.id) ? cur.filter((i) => i.id !== item.id) : [...cur, item]));
  }, []);
  const remove = useCallback((id: number) => setItems((c) => c.filter((i) => i.id !== id)), []);

  const value = useMemo<Ctx>(() => ({ items, ready, count: items.length, has, toggle, remove }), [items, ready, has, toggle, remove]);
  return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishCtx);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
