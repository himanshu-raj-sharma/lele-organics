"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  weight: number;
  weightUnit: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images?: ProductImage[];
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Cart {
  id: string | null;
  items: CartItem[];
  totalItems?: number;
  subtotal?: string;
}

interface CartResponse {
  success: boolean;
  cart?: Cart;
  message?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  /*
   * Load cart from database
   */
  const loadCart = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/cart", {
        method: "GET",
        cache: "no-store",
      });

      const data: CartResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load cart");
      }

      setCart(data.cart ?? null);
    } catch (error) {
      console.error("Failed to load cart:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load cart when page opens
   *
   * IMPORTANT:
   * We do not call setLoading(true) synchronously
   * from inside the effect.
   */
  useEffect(() => {
    const loadInitialCart = async () => {
      try {
        setError("");

        const response = await fetch("/api/cart", {
          method: "GET",
          cache: "no-store",
        });

        const data: CartResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load cart"
          );
        }

        setCart(data.cart ?? null);
      } catch (error) {
        console.error("Failed to load cart:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load cart"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadInitialCart();
  }, []);

  /*
   * Update quantity or remove item
   */
  const updateQuantity = async (
    itemId: string,
    productId: string,
    newQuantity: number,
    stock: number
  ) => {
    if (!cart) {
      return;
    }

    if (newQuantity > stock) {
      alert(`Only ${stock} units are available in stock.`);
      return;
    }

    if (newQuantity < 0) {
      return;
    }

    if (updatingItemId) {
      return;
    }

    const previousCart = cart;

    /*
     * Optimistic UI update.
     *
     * If quantity becomes 0,
     * immediately remove the product
     * from the visible cart.
     */
    if (newQuantity === 0) {
      setCart({
        ...cart,
        items: cart.items.filter(
          (item) => item.id !== itemId
        ),
      });
    } else {
      setCart({
        ...cart,
        items: cart.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        ),
      });
    }

    setUpdatingItemId(itemId);

    try {
      let response: Response;

      /*
       * Quantity 0 means remove product.
       */
      if (newQuantity === 0) {
        response = await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });
      } else {
        /*
         * Quantity 1+ means update quantity.
         */
        response = await fetch("/api/cart", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity: newQuantity,
          }),
        });
      }

      const data: CartResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (newQuantity === 0
              ? "Unable to remove product from cart"
              : "Unable to update cart quantity")
        );
      }

      /*
       * Refresh cart from database after successful update.
       */
      await loadCart(false);
    } catch (error) {
      console.error("Failed to update cart:", error);

      /*
       * Restore previous UI if request fails.
       */
      setCart(previousCart);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update cart"
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  /*
   * Total number of products
   */
  const totalItems =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  /*
   * Cart subtotal
   */
  const subtotal =
    cart?.items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) * item.quantity,
      0
    ) ?? 0;

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f3eb] px-5 py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-center text-[#6b716a]">
            Loading your cart...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f3eb] px-5 py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <h1 className="text-3xl font-semibold text-[#234b32]">
            Unable to load cart
          </h1>

          <p className="mt-3 text-[#6b716a]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadCart(true)}
            className="mt-6 rounded-full bg-[#234b32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3c28]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /*
   * Empty cart
   */
  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f3eb] px-5 py-20">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#234b32] text-white">
            <span className="text-3xl">🛍️</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold text-[#234b32]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#6b716a]">
            Looks like you haven&apos;t added anything yet.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#234b32] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3c28]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3eb] px-5 py-12">
      <div className="mx-auto max-w-[1180px]">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6b716a] transition hover:text-[#234b32]"
        >
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>

        {/* Heading */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c99a3e]">
            Your Selection
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-[#234b32]">
            Your Cart
          </h1>

          <p className="mt-2 text-[#6b716a]">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Cart Items */}
          <section className="space-y-4">
            {cart.items.map((item) => {
              const image =
                item.product.images?.find(
                  (img) => img.isPrimary
                ) ??
                item.product.images?.[0];

              const itemTotal =
                Number(item.product.price) *
                item.quantity;

              const isUpdating =
                updatingItemId === item.id;

              const canIncrease =
                item.quantity < item.product.stock &&
                !isUpdating;

              return (
                <article
                  key={item.id}
                  className="flex gap-5 rounded-[28px] border border-[#e5dfd3] bg-white/70 p-4 shadow-sm"
                >
                  {/* Image */}
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-[20px] bg-[#ebe5d7]">
                    {image ? (
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          item.product.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-[#6b716a]">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">

                    <div>
                      {item.product.category?.name && (
                        <p className="text-xs text-[#6b716a]">
                          {item.product.category.name}
                        </p>
                      )}

                      <h2 className="mt-1 text-xl font-semibold text-[#234b32]">
                        {item.product.name}
                      </h2>

                      <p className="mt-1 text-sm text-[#6b716a]">
                        {item.product.weight}{" "}
                        {item.product.weightUnit}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

                      {/* Quantity */}
                      <div className="flex items-center rounded-full border border-[#ddd6c8] bg-[#f7f3eb]">

                        {/* Minus */}
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          disabled={isUpdating}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.product.id,
                              item.quantity - 1,
                              item.product.stock
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#234b32] transition hover:bg-[#ebe5d7] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>

                        {/* Quantity */}
                        <span className="w-8 text-center text-sm font-semibold text-[#234b32]">
                          {isUpdating ? "…" : item.quantity}
                        </span>

                        {/* Plus */}
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.product.name}`}
                          disabled={!canIncrease}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.product.id,
                              item.quantity + 1,
                              item.product.stock
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#234b32] transition hover:bg-[#ebe5d7] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#234b32]">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </p>

                        <p className="text-xs text-[#6b716a]">
                          ₹
                          {Number(
                            item.product.price
                          ).toLocaleString("en-IN")}{" "}
                          each
                        </p>
                      </div>

                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Summary */}
          <aside className="h-fit rounded-[28px] bg-[#234b32] p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b65b]">
              Order Summary
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Your Order
            </h2>

            <div className="mt-7 space-y-4 border-b border-white/15 pb-6">

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  Items
                </span>

                <span>
                  {totalItems}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  Subtotal
                </span>

                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  Delivery
                </span>

                <span>
                  Calculated at checkout
                </span>
              </div>

            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-base font-medium">
                Total
              </span>

              <span className="text-2xl font-semibold">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              className="mt-7 w-full rounded-full bg-[#d9b65b] px-5 py-3.5 text-sm font-bold text-[#234b32] transition hover:bg-[#e6c873]"
            >
              Proceed to Checkout
            </button>
          </aside>

        </div>
      </div>
    </main>
  );
}