"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  quantity: number;
}

interface CartResponse {
  success: boolean;
  cart?: {
    items?: CartItem[];
  };
}

export default function CartButton() {
  const router = useRouter();
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch("/api/cart", {
          cache: "no-store",
        });

        const data: CartResponse = await response.json();

        if (response.ok && data.success) {
          const items = data.cart?.items ?? [];

          const total = items.reduce(
            (total: number, item: CartItem) =>
              total + item.quantity,
            0
          );

          setTotalItems(total);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();

    const handleCartUpdated = () => {
      loadCart();
    };

    window.addEventListener(
      "cart-updated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdated
      );
    };
  }, []);

  const handleOpenCart = () => {
    router.push("/cart");
  };

  return (
    <button
      type="button"
      aria-label="Shopping bag"
      onClick={handleOpenCart}
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#ebe5d7]"
    >
      <ShoppingBag
        size={19}
        strokeWidth={1.8}
      />

      {totalItems > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c99a3e] px-1 text-[9px] font-bold text-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}