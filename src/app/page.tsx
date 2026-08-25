import CartButton from "@/components/CartButton";
import AddToCartButton from "@/components/AddToCartButton";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Leaf,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
const categories = [
  {
    name: "Desi Ghee",
    description: "Golden, rich & traditionally crafted",
    className: "bg-[#e9d59a]",
  },
  {
    name: "Raw Honey",
    description: "Naturally sweet, straight from the hive",
    className: "bg-[#d99a35]",
  },
  {
    name: "Pink Rock Salt",
    description: "Pure mineral-rich Himalayan salt",
    className: "bg-[#d9a9a2]",
  },
  {
    name: "Natural Essentials",
    description: "Thoughtfully sourced everyday goodness",
    className: "bg-[#a9b89d]",
  },
];


const values = [
  {
    icon: Leaf,
    title: "Naturally Sourced",
    description:
      "We carefully source ingredients from trusted origins where nature does its best work.",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description:
      "Every product is selected with purity, quality and responsible sourcing in mind.",
  },
  {
    icon: Sparkles,
    title: "Pure by Choice",
    description:
      "No unnecessary compromises. Just thoughtfully made products for everyday living.",
  },
];

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isBestseller: true,
    },
    include: {
  category: true,
  images: true,
},
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });
  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#252a25]">
      {/* Announcement bar */}
      <div className="bg-[#234b32] px-4 py-2.5 text-center text-xs font-medium tracking-[0.16em] text-white sm:text-sm">
        PURE FROM NATURE · MADE FOR EVERYDAY GOODNESS
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e4e0d6]/80 bg-[#f7f4ec]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <a href="#" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#234b32] text-white">
              <Leaf size={19} strokeWidth={1.8} />
            </div>

            <div>
              <div className="text-[21px] font-semibold tracking-[-0.03em] text-[#234b32]">
                LeLe
                <span className="font-normal">-Organics</span>
              </div>
              <div className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#6b716a]">
                Naturally Yours
              </div>
            </div>
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#"
              className="text-sm font-medium text-[#234b32] transition hover:text-[#c99a3e]"
            >
              Home
            </a>
            <a
              href="#shop"
              className="text-sm font-medium text-[#6b716a] transition hover:text-[#234b32]"
            >
              Shop
            </a>
            <a
              href="#story"
              className="text-sm font-medium text-[#6b716a] transition hover:text-[#234b32]"
            >
              Our Story
            </a>
            <a
              href="#why-us"
              className="text-sm font-medium text-[#6b716a] transition hover:text-[#234b32]"
            >
              Why LeLe
            </a>
          </nav>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#ebe5d7] sm:flex"
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            <button
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#ebe5d7] sm:flex"
            >
              <UserRound size={19} strokeWidth={1.8} />
            </button>

            <CartButton />

            <button
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#ebe5d7] lg:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[650px] max-w-[1280px] items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* Hero copy */}
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c99a3e]/30 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4f35]">
              <Sparkles size={14} />
              Purely Natural
            </div>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#234b32] sm:text-6xl lg:text-7xl">
              Goodness,
              <br />
              <span className="font-normal italic">the natural way.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#6b716a] sm:text-lg">
              Discover thoughtfully sourced organic essentials inspired by
              India&apos;s timeless traditions and made for modern living.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#234b32] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#234b32]/15 transition hover:-translate-y-0.5 hover:bg-[#173522]"
              >
                Explore Collection
                <ArrowRight size={17} />
              </a>

              <a
                href="#story"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc9bc] bg-white/40 px-7 py-4 text-sm font-semibold text-[#234b32] transition hover:bg-white"
              >
                Discover Our Story
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#6b716a]">
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#234b32]" />
                Carefully sourced
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#234b32]" />
                Quality focused
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#234b32]" />
                Packed with care
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto h-[480px] w-full max-w-[560px] lg:h-[570px]">
            <div className="absolute right-0 top-0 h-[78%] w-[78%] rounded-[48%_48%_30%_30%] bg-[#d8e0ce]" />

            <div className="absolute bottom-0 left-0 h-[74%] w-[72%] rounded-[42%_42%_12%_12%] bg-[#e8d6a0] shadow-2xl shadow-[#6b4f35]/10" />

            <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full border border-white/50 bg-white/30 backdrop-blur-sm" />

            <div className="absolute right-[10%] top-[12%] rounded-2xl border border-white/50 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-md">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b716a]">
                Our promise
              </div>
              <div className="mt-1 text-sm font-semibold text-[#234b32]">
                Pure. Honest. Natural.
              </div>
            </div>

            <div className="absolute bottom-[8%] left-[10%] w-[68%] rounded-3xl bg-[#234b32] p-7 text-white shadow-2xl shadow-[#234b32]/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Featured
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    Desi Cow Ghee
                  </div>
                  <div className="mt-1 text-sm text-white/65">
                    Rich · Golden · Traditional
                  </div>
                </div>
                <Leaf size={26} className="text-[#e3c77d]" />
              </div>

              <div className="mt-7 flex items-end justify-between">
                <span className="text-sm text-white/60">500 ml</span>
                <span className="text-xl font-semibold">₹1,299</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="shop" className="border-y border-[#e4e0d6] bg-white/55">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c99a3e]">
                Explore
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#234b32] sm:text-4xl">
                Shop by category
              </h2>
            </div>

            <a
              href="#"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#234b32]"
            >
              View all products
              <ChevronRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="group relative min-h-[280px] overflow-hidden rounded-[28px] p-6 transition duration-500 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 ${category.className} transition duration-500 group-hover:scale-105`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="relative flex h-full flex-col justify-end text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                    Collection
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    {category.name}
                  </h3>
                  <p className="mt-2 max-w-[230px] text-sm leading-5 text-white/75">
                    {category.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="bg-[#234b32] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e3c77d]">
              Why LeLe-Organics
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Nature deserves nothing less than our respect.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.06] p-7 transition hover:bg-white/[0.1]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3c77d] text-[#234b32]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-[#f7f4ec]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c99a3e]">
              Customer favourites
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#234b32] sm:text-4xl">
              Our bestsellers
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b716a]">
              Everyday essentials selected for their quality, authenticity and
              naturally delicious character.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <article key={product.name} className="group">
                <div
                  className={`relative aspect-[4/4.6] overflow-hidden rounded-[30px] ${
  product.category.name === "Raw Honey"
    ? "bg-[#c98b32]"
    : product.category.name === "Natural Salts"
      ? "bg-[#d3a29d]"
      : "bg-[#e8d28e]"
}`}
                >
                  {product.images[0] && (
  <img
    src={product.images[0].url}
    alt={product.images[0].altText ?? product.name}
    className="absolute inset-0 h-full w-full object-cover"
  />
)}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 transition group-hover:scale-105" />

                  <div className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#234b32] backdrop-blur">
                    Bestseller
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/80 p-5 backdrop-blur-md">
                    <div className="text-xs text-[#6b716a]">
                      {product.category.name}
                    </div>

                    <div className="mt-1 flex items-end justify-between gap-4">
                      <h3 className="text-lg font-semibold text-[#234b32]">
                        {product.name}
                      </h3>
                      <span className="whitespace-nowrap text-sm font-bold text-[#234b32]">
                        ₹{product.price.toString()}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-[#6b716a]">
                      {product.weight} {product.weightUnit}
                    </div>
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-[#ebe5d7]">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="relative min-h-[430px] overflow-hidden rounded-[36px] bg-[#c3cbb6]">
            <div className="absolute left-8 top-8 h-40 w-40 rounded-full border border-white/50" />
            <div className="absolute bottom-0 right-0 h-[70%] w-[75%] rounded-tl-[50%] bg-[#a9b89d]" />
            <div className="absolute bottom-10 left-10 rounded-2xl bg-[#234b32] px-6 py-5 text-white">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Since day one
              </div>
              <div className="mt-1 text-lg font-semibold">
                Rooted in authenticity
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c99a3e]">
              Our story
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#234b32] sm:text-5xl">
              Bringing the goodness of India&apos;s traditions to modern
              tables.
            </h2>

            <p className="mt-6 text-base leading-7 text-[#6b716a]">
              LeLe-Organics is built around a simple belief: when ingredients
              are sourced thoughtfully and treated with care, their natural
              goodness speaks for itself.
            </p>

            <a
              href="#"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#234b32]"
            >
              Read our story
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#f7f4ec]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 text-center lg:px-8 lg:py-28">
          <Leaf className="mx-auto text-[#c99a3e]" size={28} />

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[#234b32] sm:text-5xl lg:text-6xl">
            Bring something naturally good home.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6b716a] sm:text-base">
            Explore our collection of carefully sourced organic essentials.
          </p>

          <a
            href="#shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#234b32] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#173522]"
          >
            Shop LeLe-Organics
            <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#173522] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3c77d] text-[#234b32]">
                  <Leaf size={19} />
                </div>
                <div className="text-xl font-semibold">
                  LeLe<span className="font-normal">-Organics</span>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
                Thoughtfully sourced organic essentials inspired by nature,
                tradition and a simpler way of living.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Explore</h3>
              <div className="mt-4 space-y-3 text-sm text-white/55">
                <a href="#shop" className="block hover:text-white">
                  Shop
                </a>
                <a href="#story" className="block hover:text-white">
                  Our Story
                </a>
                <a href="#why-us" className="block hover:text-white">
                  Why LeLe
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Help</h3>
              <div className="mt-4 space-y-3 text-sm text-white/55">
                <a href="#" className="block hover:text-white">
                  Contact
                </a>
                <a href="#" className="block hover:text-white">
                  Shipping
                </a>
                <a href="#" className="block hover:text-white">
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
            © 2026 LeLe-Organics. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
