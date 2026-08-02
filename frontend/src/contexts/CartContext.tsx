import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Product } from "../api";

export type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue>({
  items: [],
  add: () => undefined,
  remove: () => undefined,
  setQuantity: () => undefined,
  clear: () => undefined
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    JSON.parse(localStorage.getItem("raco_cart") ?? "[]")
  );

  useEffect(() => {
    localStorage.setItem("raco_cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      add: (product: Product) =>
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          return existing
            ? current.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...current, { ...product, quantity: 1 }];
        }),
      remove: (id: string) =>
        setItems((current) => current.filter((item) => item.id !== id)),
      setQuantity: (id: string, quantity: number) =>
        setItems((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        ),
      clear: () => setItems([])
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
