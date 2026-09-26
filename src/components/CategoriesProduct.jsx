import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowUpRight,
  X,
  Scan,
  ChevronRight,
  ShoppingBag,
  MessageCircle,
  Check,
  Truck,
} from "lucide-react";

/* ============================================================
   PRODUCT IMAGES
============================================================ */

// Dining Table
import dt1 from "../assets/dt1.webp";
import dt2 from "../assets/dt2.webp";
import dt3 from "../assets/dt3.webp";
import dt4 from "../assets/dt4.webp";

// Restaurant Furniture
import res1 from "../assets/res1.webp";
import res2 from "../assets/res2.webp";
import res3 from "../assets/res3.webp";
import res4 from "../assets/res4.webp";

// Sofa Set
import sofa1 from "../assets/sofa1.webp";
import sofa2 from "../assets/sofa2.webp";
import sofa3 from "../assets/sofa3.webp";
import sofa4 from "../assets/sofa4.webp";

// Wooden Sofa
import ws1 from "../assets/ws1.webp";
import ws2 from "../assets/ws2.webp";
import ws3 from "../assets/ws3.webp";
import ws4 from "../assets/ws4.webp";

// L Shape Sofa
import l1 from "../assets/l1.webp";
import l2 from "../assets/l2.webp";
import l3 from "../assets/l3.webp";
import l4 from "../assets/l4.webp";

// King Size Bed
import bed1 from "../assets/bed1.webp";
import bed2 from "../assets/bed2.webp";
import bed3 from "../assets/bed3.webp";
import bed4 from "../assets/bed4.webp";

/* ============================================================
   CONFIG
============================================================ */

const CART_KEY = "cart";

const WHATSAPP_NUMBER = "923033939167";

/* ============================================================
   CATEGORIES
============================================================ */

const categories = [
  "Dining Table",
  "Restaurant Furniture",
  "Sofa Set",
  "Wooden Sofa",
  "L.Shape Sofa",
  "King Size Bed",
];

/* ============================================================
   PRODUCT DATA
============================================================ */

const productData = {
  "Dining Table": [
    dt1,
    dt2,
    dt3,
    dt4,
  ],

  "Restaurant Furniture": [
    res1,
    res2,
    res3,
    res4,
  ],

  "Sofa Set": [
    sofa1,
    sofa2,
    sofa3,
    sofa4,
  ],

  "Wooden Sofa": [
    ws1,
    ws2,
    ws3,
    ws4,
  ],

  "L.Shape Sofa": [
    l1,
    l2,
    l3,
    l4,
  ],

  "King Size Bed": [
    bed1,
    bed2,
    bed3,
    bed4,
  ],
};

/* ============================================================
   DESCRIPTIONS
============================================================ */

const descriptions = {
  "Dining Table":
    "Beautifully crafted dining furniture for memorable moments.",

  "Restaurant Furniture":
    "Comfortable and durable furniture for welcoming spaces.",

  "Sofa Set":
    "Elegant seating designed for everyday comfort and relaxation.",

  "Wooden Sofa":
    "Classic wooden craftsmanship with timeless character.",

  "L.Shape Sofa":
    "Spacious seating designed to make the most of your living area.",

  "King Size Bed":
    "A refined bedroom centerpiece made for comfort and relaxation.",
};

/* ============================================================
   CART HELPERS
============================================================ */

const readCart = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_KEY)
    );

    return Array.isArray(saved)
      ? saved
      : [];
  } catch {
    return [];
  }
};

/* ============================================================
   COMPONENT
============================================================ */

export default function FurnitureCategories() {
  /* ==========================================================
     ACTIVE CATEGORY
  ========================================================== */

  const [activeCategory, setActiveCategory] =
    useState("Dining Table");

  /* ==========================================================
     IMAGE PREVIEW
  ========================================================== */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  /* ==========================================================
     CART
  ========================================================== */

  const [cart, setCart] =
    useState(readCart);

  /* ==========================================================
     ADDED STATE
  ========================================================== */

  const [addedId, setAddedId] =
    useState(null);

  /* ==========================================================
     PRODUCTS
  ========================================================== */

  const products = useMemo(() => {
    return (
      productData[activeCategory] || []
    ).map((image, index) => ({
      id: `${activeCategory}-${index + 1}`,

      title: `${activeCategory} ${index + 1}`,

      category: activeCategory,

      image,

      description:
        descriptions[activeCategory],

      quantity: 1,
    }));
  }, [activeCategory]);

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
      // Storage may be unavailable.
    }
  }, [cart]);

  /* ==========================================================
     ADD TO CART
  ========================================================== */

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  (Number(
                    item.quantity
                  ) || 1) + 1,
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

    window.setTimeout(() => {
      setAddedId((current) =>
        current === product.id
          ? null
          : current
      );
    }, 1600);
  };

  /* ==========================================================
     WHATSAPP
  ========================================================== */

  const openWhatsApp = (product) => {
    const message =
      `Hello! I'm interested in ${product.title}.\n` +
      `Category: ${product.category}\n` +
      `Please share more details and pricing.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ==========================================================
     CLOSE PREVIEW
  ========================================================== */

  const closePreview = () => {
    setSelectedProduct(null);
  };

  /* ==========================================================
     PREVIEW BODY LOCK
     
     Only ESC key closes the popup.
     No left/right keyboard navigation.
  ========================================================== */

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.body.style.overflow =
      "hidden";

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
  }, [selectedProduct]);

  /* ==========================================================
     SHOW ALL PRODUCTS
  ========================================================== */

  const showAllProducts = () => {
    window.location.href =
      "/products";
  };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <>
      {/* ======================================================
          MAIN SECTION
      ====================================================== */}

      <section className="relative -mt-7 w-full overflow-hidden bg-white pb-12 pt-8 text-[#172B3A] sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-10">

          {/* ==================================================
              SECTION HEADING
          ================================================== */}

          <div className="mb-6 sm:mb-8">

            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">

              <span className="h-[2px] w-7 bg-[#079FC0]" />

              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#079FC0] sm:text-xs">
                Our Furniture Collection
              </p>

            </div>

            <div className="text-center sm:text-left">

              <h2 className="text-[25px] font-bold leading-[1.2] tracking-tight text-[#14283D] sm:text-3xl lg:text-[42px]">
                Discover furniture
                <br className="hidden sm:block" />
                designed for your space.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:mx-0 sm:text-sm sm:leading-6 lg:text-base">
                Explore thoughtfully crafted
                furniture for every corner of
                your home and workspace.
              </p>

            </div>

          </div>

          {/* ==================================================
              CATEGORY FILTERS
          ================================================== */}

          <div className="mb-6 sm:mb-8">

            <div className="mb-3 flex items-center justify-between gap-3">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400 sm:text-xs">
                  Shop by collection
                </p>

                <h3 className="mt-0.5 text-base font-bold text-[#14283D] sm:text-lg">
                  Explore Categories
                </h3>

              </div>

              <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-500 sm:text-xs">
                {categories.length} Collections
              </span>

            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {categories.map(
                (category) => {

                  const isActive =
                    activeCategory ===
                    category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setActiveCategory(
                          category
                        );

                        closePreview();
                      }}
                      className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-[11px] font-semibold transition-all duration-200 sm:px-5 sm:py-3 sm:text-sm ${
                        isActive
                          ? "border-[#14283D] bg-[#14283D] text-white shadow-md shadow-slate-900/10"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#079FC0] hover:text-[#079FC0]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* ==================================================
              ACTIVE CATEGORY
          ================================================== */}

          <div className="mb-4 flex items-end justify-between gap-3 border-b border-slate-100 pb-3 sm:mb-5 sm:pb-4">

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#079FC0] sm:text-xs">
                Featured Collection
              </p>

              <h3 className="mt-0.5 text-lg font-bold text-[#14283D] sm:text-2xl">
                {activeCategory}
              </h3>

            </div>

            <span className="shrink-0 rounded-md bg-[#EAF7FA] px-3 py-2 text-[10px] font-bold text-[#087F99] sm:text-xs">
              {products.length} Products
            </span>

          </div>

          {/* ==================================================
              PRODUCT GRID
          ================================================== */}

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">

            {products.map(
              (product) => {

                const isAdded =
                  addedId ===
                  product.id;

                return (
                  <article
                    key={product.id}
                    className="group min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/60"
                  >

                    {/* ========================================
                        PRODUCT IMAGE
                    ======================================== */}

                    <div className="relative aspect-[4/4.2] overflow-hidden bg-[#F0F3F5]">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProduct(
                            product
                          )
                        }
                        aria-label={`View ${product.title} full image`}
                        className="block h-full w-full"
                      >

                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      </button>

                      {/* CATEGORY BADGE */}

                      <span className="absolute left-2 top-2 max-w-[calc(100%-3.5rem)] truncate rounded-md bg-white/95 px-2.5 py-1.5 text-[9px] font-semibold text-[#087F99] shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                        {product.category}
                      </span>

                      {/* IMAGE PREVIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProduct(
                            product
                          )
                        }
                        aria-label={`Expand ${product.title}`}
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-[#14283D] shadow-sm transition hover:bg-[#079FC0] hover:text-white sm:right-3 sm:top-3"
                      >

                        <Scan size={17} />

                      </button>

                    </div>

                    {/* ========================================
                        PRODUCT DETAILS
                    ======================================== */}

                    <div className="p-3 sm:p-4 lg:p-4">

                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#079FC0] sm:text-[10px]">
                        Premium Collection
                      </p>

                      <h3 className="truncate text-sm font-bold text-[#172B3A] sm:text-base">
                        {product.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 min-h-[34px] text-[10px] leading-[17px] text-slate-500 sm:min-h-[40px] sm:text-xs sm:leading-5">
                        {product.description}
                      </p>

                      {/* DELIVERY */}

                      <div className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold text-[#0789A6] sm:text-xs">

                        <Truck size={13} />

                        Delivery across Pakistan

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="mt-3 grid grid-cols-[1fr_38px] gap-2 sm:mt-4 sm:grid-cols-[1fr_44px]">

                        {/* ADD TO CART */}

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                          aria-live="polite"
                          className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[10px] font-semibold text-white transition-all duration-200 sm:gap-2 sm:text-sm ${
                            isAdded
                              ? "bg-emerald-600"
                              : "bg-[#14283D] hover:bg-[#079FC0]"
                          }`}
                        >

                          {isAdded ? (
                            <>
                              <Check
                                size={15}
                                className="shrink-0"
                              />

                              <span className="truncate">
                                Added
                              </span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag
                                size={15}
                                className="shrink-0"
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
                            openWhatsApp(
                              product
                            )
                          }
                          aria-label={`Ask about ${product.title} on WhatsApp`}
                          className="flex h-10 items-center justify-center rounded-lg border border-[#BDE8D0] bg-[#F0FBF5] text-[#21834D] transition hover:bg-[#21834D] hover:text-white"
                        >

                          <MessageCircle
                            size={19}
                          />

                        </button>

                      </div>

                      {/* VIEW FULL IMAGE */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProduct(
                            product
                          )
                        }
                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#0789A6] transition hover:text-[#14283D] sm:text-xs"
                      >

                        View Full Image

                        <ArrowUpRight
                          size={14}
                        />

                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

          {/* ==================================================
              EXPLORE ALL PRODUCTS
          ================================================== */}

          <div className="mt-7 flex justify-center sm:mt-10">

            <button
              type="button"
              onClick={
                showAllProducts
              }
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#14283D] px-6 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#079FC0] hover:shadow-lg sm:px-8 sm:text-sm"
            >

              Explore All Products

              <ChevronRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          </div>

        </div>
      </section>

      {/* ======================================================
          FULL IMAGE PREVIEW POPUP
          
          IMPORTANT:
          NO LEFT ARROW
          NO RIGHT ARROW
          NO PRODUCT NAVIGATION
      ====================================================== */}

      {selectedProduct && (

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071522]/85 p-2 backdrop-blur-sm sm:p-5 lg:p-8"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePreview();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProduct.title} image preview`}
        >

          <div className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl">

            {/* ==================================================
                POPUP HEADER
            ================================================== */}

            <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF7FA] text-[#079FC0] sm:h-11 sm:w-11">

                  <Scan size={19} />

                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#079FC0] sm:text-[10px]">
                    Furniture Preview
                  </p>

                  <h3 className="truncate text-sm font-bold text-[#14283D] sm:text-base">
                    {selectedProduct.title}
                  </h3>

                  <p className="truncate text-[10px] text-slate-500 sm:text-xs">
                    {selectedProduct.category}
                  </p>

                </div>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={closePreview}
                aria-label="Close image preview"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#14283D] transition hover:bg-[#14283D] hover:text-white sm:h-10 sm:w-10"
              >

                <X size={20} />

              </button>

            </div>

            {/* ==================================================
                FULL IMAGE
            ================================================== */}

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#F1F4F6] p-2 sm:p-5 lg:p-7">

              {selectedProduct.image ? (

                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.title
                  }
                  loading="eager"
                  decoding="async"
                  className="block h-auto max-h-[calc(94dvh-130px)] max-w-full object-contain sm:max-h-[calc(90dvh-155px)]"
                />

              ) : (

                <div className="flex flex-col items-center justify-center text-center">

                  <Scan
                    size={35}
                    className="mb-3 text-slate-300"
                  />

                  <p className="text-sm font-medium text-slate-500">
                    Image unavailable
                  </p>

                </div>

              )}

            </div>

            {/* ==================================================
                POPUP FOOTER
            ================================================== */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4">

              {/* FOOTER INFO */}

              <div className="min-w-0">

                <p className="truncate text-[10px] font-semibold text-[#14283D] sm:text-xs">
                  {selectedProduct.title}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400 sm:text-xs">
                  Full image preview
                </p>

              </div>

              {/* FOOTER ACTIONS */}

              <div className="flex shrink-0 items-center gap-2">

                {/* ADD TO CART */}

                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      selectedProduct
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-[10px] font-bold text-white transition sm:px-4 sm:text-xs ${
                    addedId ===
                    selectedProduct.id
                      ? "bg-emerald-600"
                      : "bg-[#14283D] hover:bg-[#079FC0]"
                  }`}
                >

                  {addedId ===
                  selectedProduct.id ? (
                    <>
                      <Check size={15} />

                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag
                        size={15}
                      />

                      Add to Cart
                    </>
                  )}

                </button>

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp(
                      selectedProduct
                    )
                  }
                  aria-label="Inquire on WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#BDE8D0] bg-[#F0FBF5] text-[#21834D] transition hover:bg-[#21834D] hover:text-white"
                >

                  <MessageCircle
                    size={19}
                  />

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
}