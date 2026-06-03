"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type ToastFn = (msg: string) => void;

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  addToCart: (product: Product, opts?: { size?: string; color?: string; quantity?: number }) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toast: string | null;
  notify: ToastFn;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "luxe.cart";
const WISH_KEY = "luxe.wishlist";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((notify as unknown as { _t?: number })._t);
    (notify as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback<StoreContextValue["addToCart"]>(
    (product, opts = {}) => {
      const size = opts.size || product.sizes[0] || "One Size";
      const color = opts.color || product.colors[0] || "Default";
      const quantity = opts.quantity || 1;
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === product.id && i.size === size && i.color === color
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            price: product.price,
            size,
            color,
            quantity,
          },
        ];
      });
      notify(`${product.name} added to bag`);
    },
    [notify]
  );

  const removeFromCart = useCallback<StoreContextValue["removeFromCart"]>((productId, size, color) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color))
    );
  }, []);

  const updateQuantity = useCallback<StoreContextValue["updateQuantity"]>(
    (productId, size, color, quantity) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(0, quantity) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback<StoreContextValue["toggleWishlist"]>(
    (productId) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          notify("Removed from wishlist");
          return prev.filter((id) => id !== productId);
        }
        notify("Saved to wishlist");
        return [...prev, productId];
      });
    },
    [notify]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((n, i) => n + i.quantity, 0),
      cartSubtotal: cart.reduce((n, i) => n + i.price * i.quantity, 0),
      wishlistCount: wishlist.length,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      toast,
      notify,
      cartOpen,
      setCartOpen,
    }),
    [
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      toast,
      notify,
      cartOpen,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
