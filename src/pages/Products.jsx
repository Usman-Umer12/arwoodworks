
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  MessageCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  SlidersHorizontal,
  Truck,
  Armchair,
} from "lucide-react";

/* ================= IMAGES ================= */

const imageModules = import.meta.glob("../assets/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const imageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [
    path.split("/").pop(),
    url,
  ])
);

/* ================= CATEGORIES ================= */

const categories = [
  { name: "Dining Table", slug: "dining-table", prefix: "dt", count: 56 },
  {
    name: "Restaurant Furniture",
    slug: "restaurant-furniture",
    prefix: "res",
    count: 39,
  },
  { name: "Sofa Set", slug: "sofa-set", prefix: "sofa", count: 52 },
  { name: "Wooden Sofa", slug: "wooden-sofa", prefix: "ws", count: 27 },
  { name: "L.Shape Sofa", slug: "l-shape-sofa", prefix: "l", count: 52 },
  { name: "King Size Bed", slug: "king-size-bed", prefix: "bed", count: 50 },
];

const descriptions = {
  "Dining Table":
    "Bring people together with thoughtfully crafted dining furniture.",
  "Restaurant Furniture":
    "Comfortable, durable furniture designed for welcoming spaces.",
  "Sofa Set":
    "Relax in comfort with elegant furniture for your living space.",
  "Wooden Sofa":
    "Timeless wooden craftsmanship with a refined, classic finish.",
  "L.Shape Sofa":
    "Make the most of your living space with stylish, spacious seating.",
  "King Size Bed":
    "Create a restful retreat with beautifully designed bedroom furniture.",
};

const allProducts = categories.flatMap((category) =>
  Array.from({ length: category.count }, (_, index) => {
    const filename = `${category.prefix}${index + 1}.webp`;

    return {
      id: filename,
      title: `${category.name} ${index + 1}`,
      category: category.name,
      slug: category.slug,
      image: imageMap[filename] || "",
      description: descriptions[category.name],
    };
  })
);

const CART_KEY = "cart";
const WHATSAPP_NUMBER = "923033939167";

/* ================= CART STORAGE ================= */

const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export default function Products() {
  const { category: routeCategory } = useParams();

  const activeCategory = categories.some(
    (item) => item.slug === routeCategory
  )
    ? routeCategory
    : "all";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState(readCart);
  const [preview, setPreview] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);

  const imageRefs = useRef({});
  const animationRef = useRef(null);
  const addedTimerRef = useRef(null);
  const pendingRef = useRef(new Set());
  const mountedRef = useRef(false);

  const selectedCategory =
    categories.find((item) => item.slug === activeCategory)?.name ||
    "All Products";

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = useMemo(() => {
    let products = allProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.slug === activeCategory;

      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "name-asc") {
      products = [...products].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "name-desc") {
      products = [...products].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return products;
  }, [activeCategory, search, sortBy]);

  /* ================= SAVE CART ================= */

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      // Storage may be unavailable.
    }
  }, [cart]);

  useEffect(() => {
    setSearch("");
    setPreview(null);
  }, [activeCategory]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      animationRef.current?.cancel();
      clearTimeout(addedTimerRef.current);
      pendingRef.current.clear();
    };
  }, []);

  /* ================= PREVIEW KEYBOARD ================= */

  useEffect(() => {
    if (!preview) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPreview(null);
      if (event.key === "ArrowLeft") changePreview(-1);
      if (event.key === "ArrowRight") changePreview(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [preview, filteredProducts]);

  /* ================= ADD PRODUCT ================= */

  const addProductToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (Number(item.quantity) || 1) + 1,
              }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setAddedId(product.id);

    clearTimeout(addedTimerRef.current);

    addedTimerRef.current = setTimeout(() => {
      setAddedId((current) =>
        current === product.id ? null : current
      );
    }, 1600);
  };

  /* ================= ZIGZAG ANIMATION TO NAVBAR ================= */

  const addToCart = (product) => {
    if (pendingRef.current.has(product.id)) return;

    const imageElement = imageRefs.current[product.id];

    // Navbar cart target
    const cartElement =
      document.querySelector("[data-cart-target]") ||
      document.querySelector('header a[href="/cart"]');

    if (
      !imageElement ||
      !cartElement ||
      !product.image ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      addProductToCart(product);
      return;
    }

    const imageRect = imageElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();

    const startX = imageRect.left + imageRect.width / 2;
    const startY = imageRect.top + imageRect.height / 2;

    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const size = Math.min(imageRect.width * 0.42, 86);
    const dx = endX - startX;
    const dy = endY - startY;
    const zigzag = Math.min(70, Math.max(24, Math.abs(dx) * 0.12));

    pendingRef.current.add(product.id);

    setFlyingItem({
      id: product.id,
      image: product.image,
      size,
      startX,
      startY,
    });

    requestAnimationFrame(() => {
      const flyingElement = document.querySelector(
        "[data-cart-flying-image]"
      );

      if (!flyingElement) {
        addProductToCart(product);
        pendingRef.current.delete(product.id);
        setFlyingItem(null);
        return;
      }

      const point = (x, y, scale, rotate) =>
        `translate(${x - size / 2}px, ${y - size / 2}px) scale(${scale}) rotate(${rotate}deg)`;

      const animation = flyingElement.animate(
        [
          {
            transform: point(startX, startY, 1, 0),
            opacity: 1,
          },
          {
            transform: point(
              startX + dx * 0.2 + zigzag,
              startY + dy * 0.2 - 35,
              0.85,
              12
            ),
            opacity: 1,
          },
          {
            transform: point(
              startX + dx * 0.4 - zigzag,
              startY + dy * 0.4 + 25,
              0.7,
              -12
            ),
            opacity: 0.95,
          },
          {
            transform: point(
              startX + dx * 0.62 + zigzag * 0.55,
              startY + dy * 0.62 - 18,
              0.5,
              10
            ),
            opacity: 0.8,
          },
          {
            transform: point(
              startX + dx * 0.82 - zigzag * 0.3,
              startY + dy * 0.82 + 8,
              0.3,
              -6
            ),
            opacity: 0.6,
          },
          {
            transform: point(endX, endY, 0.08, 0),
            opacity: 0,
          },
        ],
        {
          duration: 850,
          easing: "cubic-bezier(.22,.75,.3,1)",
          fill: "forwards",
        }
      );

      animationRef.current = animation;

      animation.onfinish = () => {
        if (mountedRef.current) {
          addProductToCart(product);
          setFlyingItem(null);
        }

        pendingRef.current.delete(product.id);
        animationRef.current = null;
      };

      animation.oncancel = () => {
        pendingRef.current.delete(product.id);
        animationRef.current = null;
      };
    });
  };

  /* ================= WHATSAPP ================= */

  const openWhatsApp = (product) => {
    const message = `Hello! I'm interested in ${product.title}. Please share more details.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ================= IMAGE PREVIEW ================= */

  const changePreview = (direction) => {
    if (!preview || !filteredProducts.length) return;

    const currentIndex = filteredProducts.findIndex(
      (product) => product.id === preview.id
    );

    const nextIndex =
      (currentIndex + direction + filteredProducts.length) %
      filteredProducts.length;

    setPreview(filteredProducts[nextIndex]);
  };

  /* ================= UI ================= */

  return (
    <section className="min-h-screen bg-[#F7F9FA] text-[#172B3A]">
      <style>{`
        @keyframes cartBadgePop {
          0% { transform: scale(1); }
          35% { transform: scale(1.3); }
          65% { transform: scale(.92); }
          100% { transform: scale(1); }
        }

        .cart-badge-pop {
          animation: cartBadgePop .5s ease-out;
        }

        .cart-fly-image {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          pointer-events: none;
          overflow: hidden;
          border: 2px solid white;
          border-radius: 14px;
          box-shadow: 0 15px 40px rgba(7, 31, 48, .25);
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .cart-badge-pop {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1440px] px-3 py-5 sm:px-6 sm:py-8 lg:px-10">

        {/* HERO */}

        <div className="relative mb-8 flex min-h-[220px] items-center overflow-hidden rounded-2xl bg-[#14283D] px-5 py-8 text-white sm:min-h-[260px] sm:px-10 lg:px-14">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#079FC0]/15 blur-3xl" />
          <div className="absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-cyan-300 sm:text-sm">
              <span className="h-px w-8 bg-cyan-400" />
              Furniture Collection
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Discover furniture
              <br className="hidden sm:block" /> designed for your space.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
              Explore thoughtfully designed furniture for your home and workspace.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-slate-200 sm:text-sm">
              <Truck size={16} className="text-cyan-300" />
              Delivery all over Pakistan
            </div>
          </div>
        </div>

        {/* CATEGORY TITLE */}

        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#079FC0] sm:text-xs">
            Shop by collection
          </p>

          <h2 className="mt-1 text-xl font-bold sm:text-2xl">
            {selectedCategory}
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Find furniture that feels like home.
          </p>
        </div>

        {/* CATEGORY FILTERS */}

        <div className="sticky top-0 z-40 -mx-3 mb-6 border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              to="/products"
              className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                activeCategory === "all"
                  ? "border-[#14283D] bg-[#14283D] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#079FC0] hover:text-[#079FC0]"
              }`}
            >
              All Products
            </Link>

            {categories.map((item) => (
              <Link
                key={item.slug}
                to={`/products/${item.slug}`}
                className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  activeCategory === item.slug
                    ? "border-[#14283D] bg-[#14283D] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#079FC0] hover:text-[#079FC0]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* SEARCH + SORT */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search furniture..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#079FC0] focus:ring-4 focus:ring-cyan-50"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500 sm:text-sm">
              <span className="font-bold text-[#172B3A]">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
              <SlidersHorizontal size={16} className="text-[#079FC0]" />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort products"
                className="max-w-[145px] bg-transparent py-3 text-xs outline-none sm:text-sm"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;
              const isAdding = pendingRef.current.has(product.id);

              return (
                <article
                  key={product.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-[4/4.2] overflow-hidden bg-[#F0F3F5]">
                    {product.image ? (
                      <img
                        ref={(element) => {
                          imageRefs.current[product.id] = element;
                        }}
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                        <Armchair size={30} strokeWidth={1.5} />
                        <span className="text-xs">
                          Image unavailable
                        </span>
                      </div>
                    )}

                    <span className="absolute left-2 top-2 max-w-[calc(100%-3.5rem)] truncate rounded-md bg-white/95 px-2.5 py-1.5 text-[9px] font-semibold text-[#087F99] shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                      {product.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPreview(product)}
                      aria-label={`View ${product.title} full size`}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-[#14283D] shadow-sm transition hover:bg-[#079FC0] hover:text-white sm:right-3 sm:top-3"
                    >
                      <Eye size={17} />
                    </button>
                  </div>

                  {/* DETAILS */}

                  <div className="p-3 sm:p-4">
                    <h3 className="truncate text-sm font-bold text-[#172B3A] sm:text-base">
                      {product.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-[36px] text-[11px] leading-[18px] text-slate-500 sm:min-h-[40px] sm:text-sm sm:leading-5">
                      {product.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold text-[#0789A6] sm:text-xs">
                      <Truck size={13} />
                      Delivery across Pakistan
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 grid grid-cols-[1fr_40px] gap-2 sm:grid-cols-[1fr_44px]">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={isAdding}
                        aria-live="polite"
                        className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-semibold text-white transition-all duration-200 disabled:cursor-wait sm:gap-2 sm:text-sm ${
                          isAdded
                            ? "bg-emerald-600"
                            : "bg-[#14283D] hover:bg-[#079FC0]"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} className="shrink-0" />
                            <span className="truncate">Added to Cart</span>
                          </>
                        ) : isAdding ? (
                          <>
                            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            <span className="truncate">Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} className="shrink-0" />
                            <span className="truncate">Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openWhatsApp(product)}
                        aria-label={`Ask about ${product.title} on WhatsApp`}
                        className="flex h-10 items-center justify-center rounded-lg border border-[#BDE8D0] bg-[#F0FBF5] text-[#21834D] transition hover:bg-[#21834D] hover:text-white"
                      >
                        <MessageCircle size={19} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <Search
              className="mx-auto mb-3 text-slate-400"
              size={30}
            />

            <h3 className="text-lg font-bold">No products found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or browse our collections.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex rounded-lg bg-[#079FC0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#087F99]"
            >
              View all products
            </Link>
          </div>
        )}
      </div>

      {/* FLYING IMAGE */}

      {flyingItem && (
        <div
          key={flyingItem.id}
          data-cart-flying-image
          className="cart-fly-image"
          style={{
            width: flyingItem.size,
            height: flyingItem.size,
            transform: `translate(${
              flyingItem.startX - flyingItem.size / 2
            }px, ${
              flyingItem.startY - flyingItem.size / 2
            }px)`,
          }}
        >
          <img
            src={flyingItem.image}
            alt=""
            draggable="false"
            decoding="async"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>
      )}

      {/* FULL IMAGE PREVIEW */}

      {preview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071522]/85 p-2 backdrop-blur-sm sm:p-5"
          onClick={() => setPreview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${preview.title} image preview`}
            className="relative flex max-h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold sm:text-base">
                  {preview.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {preview.category}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Close image preview"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 transition hover:bg-[#14283D] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-50 p-2 sm:p-5">
              <button
                type="button"
                onClick={() => changePreview(-1)}
                aria-label="Previous product"
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#14283D]/90 text-white hover:bg-[#079FC0] sm:left-4 sm:h-11 sm:w-11"
              >
                <ChevronLeft size={22} />
              </button>

              {preview.image ? (
                <img
                  src={preview.image}
                  alt={preview.title}
                  loading="eager"
                  decoding="async"
                  className="max-h-[72dvh] max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-slate-500">
                  Image unavailable
                </p>
              )}

              <button
                type="button"
                onClick={() => changePreview(1)}
                aria-label="Next product"
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#14283D]/90 text-white hover:bg-[#079FC0] sm:right-4 sm:h-11 sm:w-11"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:px-6">
              <p className="text-xs text-slate-500">
                Full image preview
              </p>

              <button
                type="button"
                onClick={() => openWhatsApp(preview)}
                className="flex items-center gap-2 rounded-lg bg-[#079FC0] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#087F99] sm:px-4 sm:text-sm"
              >
                <MessageCircle size={16} />
                Inquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}