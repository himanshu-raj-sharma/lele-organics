"use client";

import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({
  productId,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setAdded(false);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to cart"
        );
      }

      setAdded(true);

      // Tell the CartButton that the cart has changed.
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Unable to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      className="mt-4 w-full rounded-full bg-[#234b32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b3c28] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading
        ? "Adding..."
        : added
          ? "Added to Cart ✓"
          : "Add to Cart"}
    </button>
  );
}