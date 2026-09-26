import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link, useParams } from "react-router-dom";

import {
  Search,
  ShoppingBag,
  MessageCircle,
  Eye,
  X,
  Check,
  SlidersHorizontal,
  Truck,
  Armchair,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../lib/supabase";

/* ============================================================
   CATEGORIES
============================================================ */

const categories = [
  {
    name: "Dining Table",
    slug: "dining-table",
  },
  {
    name: "Restaurant Furniture",
    slug: "restaurant-furniture",
  },
  {
    name: "Sofa Set",
    slug: "sofa-set",
  },
  {
    name: "Wooden Sofa",
    slug: "wooden-sofa",
  },
  {
    name: "L.Shape Sofa",
    slug: "l-shape-sofa",
  },
  {
    name: "King Size Bed",
    slug: "king-size-bed",
  },
];

/* ============================================================
   CONSTANTS
============================================================ */

const CART_KEY = "cart";

const WHATSAPP_NUMBER = "923033939167";

const DELIVERY_TEXT = "Delivery all over Pakistan.";

/* ============================================================
   CART STORAGE
============================================================ */

const readCart = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_KEY)
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

/* ============================================================
   CATEGORY SLUG HELPER
============================================================ */

const getCategorySlug = (categoryName) => {
  const found = categories.find(
    (item) => item.name === categoryName
  );

  return found?.slug || "";
};

/* ============================================================
   PRICE FORMATTER
============================================================ */

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return null;
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return null;
  }

  return `PKR ${numericPrice.toLocaleString("en-PK")}`;
};

/* ============================================================
   PRODUCTS COMPONENT
============================================================ */

export default function Products() {
  const { category: routeCategory } = useParams();

  /* ==========================================================
     ACTIVE CATEGORY
  ========================================================== */

  const activeCategory = categories.some(
    (item) => item.slug === routeCategory
  )
    ? routeCategory
    : "all";

  /* ==========================================================
     SUPABASE PRODUCTS
  ========================================================== */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  /* ==========================================================
     UI STATES
  ========================================================== */

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("default");

  const [cart, setCart] = useState(readCart);

  const [preview, setPreview] = useState(null);

  const [addedId, setAddedId] = useState(null);

  const [flyingItem, setFlyingItem] = useState(null);

  /* ==========================================================
     REFS
  ========================================================== */

  const imageRefs = useRef({});

  const animationRef = useRef(null);

  const addedTimerRef = useRef(null);

  const pendingRef = useRef(new Set());

  const mountedRef = useRef(false);

  /* ==========================================================
     SELECTED CATEGORY
  ========================================================== */

  const selectedCategory =
    categories.find(
      (item) => item.slug === activeCategory
    )?.name || "All Products";

  /* ==========================================================
     FETCH PRODUCTS FROM SUPABASE
     
     SUPABASE IS THE ONLY PRODUCT SOURCE
  ========================================================== */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      setErrorMessage("");

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select(`
          id,
          title,
          description,
          price,
          category,
          image_url,
          status,
          featured,
          created_at
        `)
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      /* ======================================================
         NORMALIZE SUPABASE PRODUCTS
      ====================================================== */

      const normalizedProducts = (
        data || []
      ).map((product) => ({
        id: `supabase-${product.id}`,

        databaseId: product.id,

        title:
          product.title ||
          "Untitled Product",

        description:
          product.description ||
          "Quality furniture designed for your space.",

        category:
          product.category ||
          "Furniture",

        slug:
          getCategorySlug(product.category),

        image:
          product.image_url ||
          "",

        price:
          product.price ?? null,

        featured:
          product.featured ?? false,

        status:
          product.status,

        created_at:
          product.created_at,

        source: "supabase",
      }));

      setProducts(normalizedProducts);
    } catch (error) {
      console.error(
        "Supabase products error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     LOAD PRODUCTS
  ========================================================== */

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ==========================================================
     FILTER PRODUCTS
  ========================================================== */

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) => {
        /* ====================================================
           CATEGORY
        ==================================================== */

        const matchesCategory =
          activeCategory === "all" ||
          product.slug === activeCategory;

        /* ====================================================
           SEARCH
        ==================================================== */

        const searchValue =
          search.toLowerCase().trim();

        const matchesSearch =
          !searchValue ||
          product.title
            ?.toLowerCase()
            .includes(searchValue) ||
          product.category
            ?.toLowerCase()
            .includes(searchValue) ||
          product.description
            ?.toLowerCase()
            .includes(searchValue);

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );

    /* ========================================================
       NAME A-Z
    ======================================================== */

    if (sortBy === "name-asc") {
      result = [...result].sort(
        (a, b) =>
          a.title.localeCompare(b.title)
      );
    }

    /* ========================================================
       NAME Z-A
    ======================================================== */

    if (sortBy === "name-desc") {
      result = [...result].sort(
        (a, b) =>
          b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [
    products,
    activeCategory,
    search,
    sortBy,
  ]);

  /* ==========================================================
     SAVE CART
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch {
      // Storage unavailable
    }
  }, [cart]);

  /* ==========================================================
     CATEGORY CHANGE
  ========================================================== */

  useEffect(() => {
    setSearch("");

    setPreview(null);
  }, [activeCategory]);

  /* ==========================================================
     CLEANUP
  ========================================================== */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      animationRef.current?.cancel();

      clearTimeout(
        addedTimerRef.current
      );

      pendingRef.current.clear();
    };
  }, []);

  /* ==========================================================
     PREVIEW KEYBOARD CONTROLS
  ========================================================== */

  useEffect(() => {
    if (!preview) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;
const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    setPreview(null);
  }
};

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    preview,
    filteredProducts,
  ]);

  /* ==========================================================
     ADD PRODUCT TO CART
  ========================================================== */

  const addProductToCart = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  (Number(item.quantity) || 1) +
                  1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setAddedId(product.id);

    clearTimeout(
      addedTimerRef.current
    );

    addedTimerRef.current =
      setTimeout(() => {
        setAddedId((current) =>
          current === product.id
            ? null
            : current
        );
      }, 1600);
  };

  /* ==========================================================
     ADD TO CART ANIMATION
  ========================================================== */

  const addToCart = (product) => {
    if (
      pendingRef.current.has(product.id)
    ) {
      return;
    }

    const imageElement =
      imageRefs.current[product.id];

    const cartElement =
      document.querySelector(
        "[data-cart-target]"
      ) ||
      document.querySelector(
        'header a[href="/cart"]'
      );

    /* ========================================================
       FALLBACK
    ======================================================== */

    if (
      !imageElement ||
      !cartElement ||
      !product.image ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      addProductToCart(product);

      return;
    }

    /* ========================================================
       IMAGE POSITION
    ======================================================== */

    const imageRect =
      imageElement.getBoundingClientRect();

    const cartRect =
      cartElement.getBoundingClientRect();

    const startX =
      imageRect.left +
      imageRect.width / 2;

    const startY =
      imageRect.top +
      imageRect.height / 2;

    const endX =
      cartRect.left +
      cartRect.width / 2;

    const endY =
      cartRect.top +
      cartRect.height / 2;

    const size = Math.min(
      imageRect.width * 0.42,
      86
    );

    const dx = endX - startX;

    const dy = endY - startY;

    const zigzag = Math.min(
      70,
      Math.max(24, Math.abs(dx) * 0.12)
    );

    pendingRef.current.add(product.id);

    setFlyingItem({
      id: product.id,
      image: product.image,
      size,
      startX,
      startY,
    });

    requestAnimationFrame(() => {
      const flyingElement =
        document.querySelector(
          "[data-cart-flying-image]"
        );

      if (!flyingElement) {
        addProductToCart(product);

        pendingRef.current.delete(
          product.id
        );

        setFlyingItem(null);

        return;
      }

      const point = (
        x,
        y,
        scale,
        rotate
      ) =>
        `translate(${
          x - size / 2
        }px, ${
          y - size / 2
        }px) scale(${scale}) rotate(${rotate}deg)`;

      const animation =
        flyingElement.animate(
          [
            {
              transform: point(
                startX,
                startY,
                1,
                0
              ),
              opacity: 1,
            },

            {
              transform: point(
                startX +
                  dx * 0.2 +
                  zigzag,
                startY +
                  dy * 0.2 -
                  35,
                0.85,
                12
              ),
              opacity: 1,
            },

            {
              transform: point(
                startX +
                  dx * 0.4 -
                  zigzag,
                startY +
                  dy * 0.4 +
                  25,
                0.7,
                -12
              ),
              opacity: 0.95,
            },

            {
              transform: point(
                startX +
                  dx * 0.62 +
                  zigzag * 0.55,
                startY +
                  dy * 0.62 -
                  18,
                0.5,
                10
              ),
              opacity: 0.8,
            },

            {
              transform: point(
                startX +
                  dx * 0.82 -
                  zigzag * 0.3,
                startY +
                  dy * 0.82 +
                  8,
                0.3,
                -6
              ),
              opacity: 0.6,
            },

            {
              transform: point(
                endX,
                endY,
                0.08,
                0
              ),
              opacity: 0,
            },
          ],
          {
            duration: 850,

            easing:
              "cubic-bezier(.22,.75,.3,1)",

            fill: "forwards",
          }
        );

      animationRef.current =
        animation;

      animation.onfinish = () => {
        if (mountedRef.current) {
          addProductToCart(product);

          setFlyingItem(null);
        }

        pendingRef.current.delete(
          product.id
        );

        animationRef.current = null;
      };

      animation.oncancel = () => {
        pendingRef.current.delete(
          product.id
        );

        animationRef.current = null;
      };
    });
  };

  /* ==========================================================
     WHATSAPP
  ========================================================== */

  const openWhatsApp = (product) => {
    const message = `Hello! I'm interested in ${product.title}. Please share more details.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#F7F9FA] px-4">
        <div className="text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">

            <RefreshCw
              size={25}
              className="animate-spin text-[#079FC0]"
            />

          </div>

          <h2 className="text-lg font-bold text-[#172B3A]">
            Loading products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while we load our
            furniture collection.
          </p>

        </div>
      </section>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <section className="min-h-screen bg-[#F7F9FA] text-[#172B3A]">

      <style>{`

        @keyframes cartBadgePop {
          0% {
            transform: scale(1);
          }

          35% {
            transform: scale(1.3);
          }

          65% {
            transform: scale(.92);
          }

          100% {
            transform: scale(1);
          }
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
          box-shadow:
            0 15px 40px rgba(7, 31, 48, .25);
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .cart-badge-pop {
            animation: none !important;
          }
        }

      `}</style>

      <div className="mx-auto max-w-[1440px] px-3 py-5 sm:px-6 sm:py-8 lg:px-10">

        {/* ====================================================
            HERO
        ==================================================== */}

        <div className="relative mb-7 flex min-h-[210px] items-center overflow-hidden rounded-2xl bg-[#14283D] px-5 py-7 text-white sm:mb-8 sm:min-h-[260px] sm:px-10 sm:py-8 lg:px-14">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#079FC0]/15 blur-3xl" />

          <div className="absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">

            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-cyan-300 sm:mb-4 sm:text-sm">

              <span className="h-px w-7 bg-cyan-400 sm:w-8" />

              Furniture Collection

            </div>

            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">

              Discover furniture designed-
              <br className="hidden sm:block" />

              for your space.

            </h1>

            <p className="mt-3 max-w-lg text-xs leading-5 text-slate-300 sm:mt-4 sm:text-base sm:leading-6">
              Explore thoughtfully designed
              furniture for your home and
              workspace.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-medium text-slate-200 sm:mt-5 sm:text-sm">

              <Truck
                size={15}
                className="shrink-0 text-cyan-300"
              />

              Delivery all over Pakistan

            </div>

          </div>

        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">

            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">

              <p className="text-sm font-semibold">
                Unable to load products
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                {errorMessage}
              </p>

            </div>

            <button
              type="button"
              onClick={fetchProducts}
              className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
            >
              Retry
            </button>

          </div>
        )}

        {/* ====================================================
            CATEGORY TITLE
        ==================================================== */}

        <div className="mb-4 sm:mb-5">

          <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#079FC0] sm:text-xs">
            Shop by collection
          </p>

          <h2 className="mt-1 text-lg font-bold sm:text-2xl">
            {selectedCategory}
          </h2>

          <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">
            Find furniture that feels like home.
          </p>

        </div>

        {/* ====================================================
            CATEGORY FILTERS
        ==================================================== */}

        <div className="sticky top-0 z-40 -mx-3 mb-5 border-b border-slate-200/80 bg-white/95 px-3 py-2.5 backdrop-blur-md sm:-mx-6 sm:mb-6 sm:px-6 sm:py-3 lg:-mx-10 lg:px-10">

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            <Link
              to="/products"
              className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
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
                className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
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

        {/* ====================================================
            SEARCH + SORT
        ==================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-md">

            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4 sm:size-[18px]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search furniture..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs outline-none transition focus:border-[#079FC0] focus:ring-4 focus:ring-cyan-50 sm:py-3 sm:pl-11 sm:pr-4 sm:text-sm"
            />

          </div>

          <div className="flex items-center justify-between gap-3">

            <p className="text-[11px] text-slate-500 sm:text-sm">

              <span className="font-bold text-[#172B3A]">
                {filteredProducts.length}
              </span>{" "}
              products

            </p>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:gap-2 sm:px-3">

              <SlidersHorizontal
                size={15}
                className="text-[#079FC0]"
              />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                aria-label="Sort products"
                className="max-w-[125px] bg-transparent py-2.5 text-[10px] outline-none sm:max-w-[145px] sm:py-3 sm:text-sm"
              >

                <option value="default">
                  Default
                </option>

                <option value="name-asc">
                  Name: A–Z
                </option>

                <option value="name-desc">
                  Name: Z–A
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ====================================================
            PRODUCT GRID
        ==================================================== */}

        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">

            {filteredProducts.map((product) => {

              const isAdded =
                addedId === product.id;

              const isAdding =
                pendingRef.current.has(
                  product.id
                );

              const displayPrice =
                formatPrice(product.price);

              return (
                <article
                  key={product.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/60"
                >

                  {/* ==================================================
                      IMAGE
                  ================================================== */}

                  <div className="relative aspect-square overflow-hidden bg-[#F0F3F5] sm:aspect-[4/4.2]">

                    {product.image ? (

                      <img
                        ref={(element) => {
                          imageRefs.current[
                            product.id
                          ] = element;
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

                        <Armchair
                          size={26}
                          strokeWidth={1.5}
                        />

                        <span className="px-2 text-center text-[9px] sm:text-xs">
                          Image unavailable
                        </span>

                      </div>

                    )}

                    {/* CATEGORY */}

                    <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-3rem)] truncate rounded-md bg-white/95 px-2 py-1 text-[7px] font-semibold text-[#087F99] shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                      {product.category}
                    </span>

                    {/* PREVIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        setPreview(product)
                      }
                      aria-label={`View ${product.title} full size`}
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-[#14283D] shadow-sm transition hover:bg-[#079FC0] hover:text-white sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:rounded-lg"
                    >

                      <Eye
                        size={14}
                        className="sm:hidden"
                      />

                      <Eye
                        size={17}
                        className="hidden sm:block"
                      />

                    </button>

                  </div>

                  {/* ==================================================
                      DETAILS
                  ================================================== */}

                  <div className="p-2.5 sm:p-4">

                    {/* TITLE */}

                    <h3 className="truncate text-[11px] font-bold leading-5 text-[#172B3A] sm:text-base sm:leading-6">
                      {product.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p className="mt-1 line-clamp-2 text-[9px] leading-3.5 text-slate-500 sm:mt-1.5 sm:text-sm sm:leading-5">
                      {product.description ||
                        "Quality furniture designed for your space."}
                    </p>

                    {/* PRICE */}

                    {displayPrice && (
                      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[#F5F8F9] px-2 py-1.5 sm:mt-2.5 sm:px-3 sm:py-2">

                        <span className="text-[7px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                          Price
                        </span>

                        <span className="truncate text-[10px] font-bold leading-4 text-[#14283D] sm:text-base sm:leading-5">
                          {displayPrice}
                        </span>

                      </div>
                    )}

                    {/* DELIVERY */}

                    <div className="mt-2 flex items-start gap-1 text-[7px] font-semibold leading-3 text-[#0789A6] sm:mt-2.5 sm:gap-1.5 sm:text-xs sm:leading-4">

                      <Truck
                        size={11}
                        className="mt-0.5 shrink-0 sm:h-[13px] sm:w-[13px]"
                      />

                      <span>
                        {DELIVERY_TEXT}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-2.5 grid grid-cols-[1fr_32px] gap-1.5 sm:mt-3 sm:grid-cols-[1fr_44px] sm:gap-2">

                      {/* CART */}

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={isAdding}
                        aria-live="polite"
                        className={`flex min-w-0 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[8px] font-semibold text-white transition-all duration-200 disabled:cursor-wait sm:gap-2 sm:px-2 sm:py-2.5 sm:text-sm ${
                          isAdded
                            ? "bg-emerald-600"
                            : "bg-[#14283D] hover:bg-[#079FC0]"
                        }`}
                      >

                        {isAdded ? (
                          <>
                            <Check
                              size={12}
                              className="shrink-0 sm:h-4 sm:w-4"
                            />

                            <span className="truncate">
                              Added
                            </span>
                          </>
                        ) : isAdding ? (
                          <>
                            <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white sm:h-4 sm:w-4" />

                            <span className="truncate">
                              Adding...
                            </span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag
                              size={12}
                              className="shrink-0 sm:h-[15px] sm:w-[15px]"
                            />

                            <span className="truncate">
                              Add to Cart
                            </span>
                          </>
                        )}

                      </button>

                      {/* WHATSAPP */}

                      <button
                        type="button"
                        onClick={() =>
                          openWhatsApp(product)
                        }
                        aria-label={`Ask about ${product.title} on WhatsApp`}
                        className="flex h-8 items-center justify-center rounded-lg border border-[#BDE8D0] bg-[#F0FBF5] text-[#21834D] transition hover:bg-[#21834D] hover:text-white sm:h-10"
                      >

                        <MessageCircle
                          size={15}
                          className="sm:h-[19px] sm:w-[19px]"
                        />

                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        ) : (

          /* ==================================================
             NO PRODUCTS
          ================================================== */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">

            <Search
              className="mx-auto mb-3 text-slate-400"
              size={30}
            />

            <h3 className="text-lg font-bold">
              No products found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or browse
              our collections.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex rounded-lg bg-[#079FC0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#087F99]"
            >
              View all products
            </Link>

          </div>

        )}

      </div>

      {/* ======================================================
          FLYING IMAGE
      ====================================================== */}

      {flyingItem && (
        <div
          key={flyingItem.id}
          data-cart-flying-image
          className="cart-fly-image"
          style={{
            width: flyingItem.size,
            height: flyingItem.size,
            transform: `translate(${
              flyingItem.startX -
              flyingItem.size / 2
            }px, ${
              flyingItem.startY -
              flyingItem.size / 2
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

      {/* ======================================================
          FULL IMAGE PREVIEW
      ====================================================== */}

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
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-3 py-2.5 sm:px-6 sm:py-3">

              <div className="min-w-0">

                <p className="truncate text-xs font-bold sm:text-base">
                  {preview.title}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                  {preview.category}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setPreview(null)
                }
                aria-label="Close image preview"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition hover:bg-[#14283D] hover:text-white sm:h-9 sm:w-9"
              >

                <X size={18} />

              </button>

            </div>

           {/* ======================================================
    IMAGE
====================================================== */}

<div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-50 p-2 sm:p-5">

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

</div>

            {/* FOOTER */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-3 py-2.5 sm:px-6 sm:py-3">

              <div className="min-w-0">

                {formatPrice(
                  preview.price
                ) && (
                  <p className="truncate text-xs font-bold text-[#14283D] sm:text-sm">
                    {formatPrice(
                      preview.price
                    )}
                  </p>
                )}

                <p className="text-[9px] text-slate-500 sm:text-xs">
                  Full image preview
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  openWhatsApp(preview)
                }
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#079FC0] px-2.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#087F99] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >

                <MessageCircle
                  size={14}
                  className="sm:h-4 sm:w-4"
                />

                <span className="hidden sm:inline">
                  Inquire on WhatsApp
                </span>

                <span className="sm:hidden">
                  WhatsApp
                </span>

              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}