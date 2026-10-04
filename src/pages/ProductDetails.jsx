import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../lib/supabase";

const WHATSAPP_NUMBER = "923033939167";

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Contact for Price";
  }

  return `PKR ${Number(price).toLocaleString("en-PK")}`;
};

export default function ProductDetails() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}, [productId]);

  // =====================================================
  // TOUCH / SWIPE
  // =====================================================

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // =====================================================
  // FETCH PRODUCT FROM SUPABASE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const getProduct = async () => {
      setLoading(true);
      setProduct(null);
      setActiveImage(0);
      setQuantity(1);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .eq("status", "active")
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (mounted) {
          setProduct(data || null);
        }
      } catch (error) {
        console.error("Product details error:", error);

        if (mounted) {
          setProduct(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  // =====================================================
  // PRODUCT IMAGE GALLERY
  // =====================================================

  const gallery = [
  product?.image_url,

  ...(Array.isArray(product?.images)
    ? product.images
    : []),

  ...(Array.isArray(product?.image_urls)
    ? product.image_urls
    : []),
].filter(
  (image, index, array) =>
    typeof image === "string" &&
    image.trim() !== "" &&
    array.indexOf(image) === index
);

  // =====================================================
  // KEEP ACTIVE IMAGE VALID
  // =====================================================

  useEffect(() => {
    if (activeImage >= gallery.length && gallery.length > 0) {
      setActiveImage(0);
    }
  }, [gallery.length, activeImage]);

  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const previousImage = () => {
    if (gallery.length === 0) return;

    setActiveImage((current) => {
      if (current === 0) {
        return gallery.length - 1;
      }

      return current - 1;
    });
  };

  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const nextImage = () => {
    if (gallery.length === 0) return;

    setActiveImage((current) => {
      if (current === gallery.length - 1) {
        return 0;
      }

      return current + 1;
    });
  };

  // =====================================================
  // GO TO SPECIFIC IMAGE
  // =====================================================

  const goToImage = (index) => {
    setActiveImage(index);
  };

  // =====================================================
  // KEYBOARD NAVIGATION
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!product || gallery.length <= 1) {
        return;
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, gallery.length]);

  // =====================================================
  // MOBILE SWIPE
  // =====================================================

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      gallery.length <= 1
    ) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = () => {
    if (!product) return;

    try {
      const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(
        (item) =>
          String(item.id) === String(product.id)
      );

      let updatedCart;

      if (existing) {
        updatedCart = cart.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity:
                  (Number(item.quantity) || 1) +
                  quantity,
              }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1800);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // =====================================================
  // WHATSAPP INQUIRY
  // =====================================================

  const whatsappInquiry = () => {
    if (!product) return;

    const message =
      `Hello AR Woodworks!\n\n` +
      `Product: ${product.title}\n` +
      `Category: ${product.category || "N/A"}\n` +
      `Price: ${formatPrice(product.price)}\n` +
      `Quantity: ${quantity}\n\n` +
      `Please share more details about this product.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F9FA] px-4">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-[#079FC0]"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F9FA] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#14283D]">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            This product is unavailable.
          </p>

          <Link
            to="/products"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[#14283D]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#079FC0]
            "
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#F7F9FA] text-[#14283D]">

      <div
        className="
          mx-auto
          max-w-7xl
          px-3
          py-5
          sm:px-6
          sm:py-8
          lg:px-8
        "
      >

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-wrap
            items-center
            gap-2
            text-xs
            text-slate-500
            sm:text-sm
          "
        >
          <Link
            to="/"
            className="transition hover:text-[#079FC0]"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            to="/products"
            className="transition hover:text-[#079FC0]"
          >
            Products
          </Link>

          <ChevronRight size={14} />

          <span
            className="
              max-w-[220px]
              truncate
              font-semibold
              text-[#14283D]
              sm:max-w-none
            "
          >
            {product.title}
          </span>
        </div>

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            items-start
            gap-6
            lg:grid-cols-2
            lg:gap-12
          "
        >

          {/* =================================================
              LEFT IMAGE GALLERY
          ================================================= */}

          <div className="min-w-0">

            {/* MAIN IMAGE BOX */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-2
                sm:p-3
              "
            >

              <div
                className="
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-xl
                  bg-[#F0F2F4]
                  select-none
                  touch-pan-y
                "
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >

                {/* =========================================
                    IMAGE
                ========================================== */}

                {gallery.length > 0 ? (
                  <img
                    key={gallery[activeImage]}
                    src={gallery[activeImage]}
                    alt={`${product.title} - Image ${
                      activeImage + 1
                    }`}
                    draggable="false"
                    className="
                      h-full
                      w-full
                      object-contain
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-sm
                      text-slate-400
                    "
                  >
                    No Image Available
                  </div>
                )}

                {/* =========================================
                    LEFT ARROW
                ========================================== */}

                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous product image"
                    className="
                      absolute
                      left-3
                      top-1/2
                      z-50
                      flex
                      h-11
                      w-11
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-slate-200
                      bg-white
                      text-[#14283D]
                      shadow-[0_4px_16px_rgba(0,0,0,0.22)]
                      transition-all
                      duration-200
                      hover:bg-[#14283D]
                      hover:text-white
                      active:scale-90
                      sm:left-5
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <ArrowLeft
                      size={22}
                      strokeWidth={2.5}
                    />
                  </button>
                )}

                {/* =========================================
                    RIGHT ARROW
                ========================================== */}

                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next product image"
                    className="
                      absolute
                      right-3
                      top-1/2
                      z-50
                      flex
                      h-11
                      w-11
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-slate-200
                      bg-white
                      text-[#14283D]
                      shadow-[0_4px_16px_rgba(0,0,0,0.22)]
                      transition-all
                      duration-200
                      hover:bg-[#14283D]
                      hover:text-white
                      active:scale-90
                      sm:right-5
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <ArrowRight
                      size={22}
                      strokeWidth={2.5}
                    />
                  </button>
                )}

                {/* =========================================
                    IMAGE COUNTER
                ========================================== */}

                {gallery.length > 1 && (
                  <div
                    className="
                      absolute
                      bottom-3
                      left-1/2
                      z-40
                      -translate-x-1/2
                      rounded-full
                      bg-[#14283D]/90
                      px-3
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-white
                      shadow-md
                      sm:bottom-4
                      sm:px-4
                      sm:text-xs
                    "
                  >
                    {activeImage + 1} / {gallery.length}
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                THUMBNAILS
            ================================================= */}

            {gallery.length > 1 && (
              <div className="mt-4">

                <div
                  className="
                    flex
                    gap-2.5
                    overflow-x-auto
                    pb-2
                    sm:gap-3
                  "
                >
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        goToImage(index)
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                      aria-pressed={
                        activeImage === index
                      }
                      className={`
                        h-[68px]
                        w-[68px]
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border-2
                        bg-white
                        p-1
                        transition
                        duration-200
                        sm:h-20
                        sm:w-20
                        ${
                          activeImage === index
                            ? "border-[#079FC0] shadow-md"
                            : "border-slate-200 hover:border-slate-400"
                        }
                      `}
                    >
                      <img
                        src={image}
                        alt={`${product.title} image ${
                          index + 1
                        }`}
                        loading="lazy"
                        draggable="false"
                        className="
                          h-full
                          w-full
                          rounded-lg
                          object-cover
                        "
                      />
                    </button>
                  ))}
                </div>

              </div>
            )}

            {/* MOBILE SWIPE TEXT */}

            {gallery.length > 1 && (
              <p
                className="
                  mt-2
                  text-center
                  text-[11px]
                  text-slate-400
                  sm:hidden
                "
              >
                Swipe or use arrows to view images
              </p>
            )}
          </div>

          {/* =================================================
              RIGHT PRODUCT INFORMATION
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              sm:p-7
              lg:p-9
            "
          >

            {/* CATEGORY */}

            {product.category && (
              <span
                className="
                  inline-flex
                  rounded-lg
                  bg-cyan-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#079FC0]
                "
              >
                {product.category}
              </span>
            )}

            {/* TITLE */}

            <h1
              className="
                mt-4
                text-2xl
                font-bold
                leading-tight
                sm:text-3xl
                lg:text-4xl
              "
            >
              {product.title}
            </h1>

            {/* DIVIDER */}

            <div className="my-6 border-t border-slate-100" />

            {/* PRICE */}

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Price
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-bold
                text-[#14283D]
                sm:text-3xl
              "
            >
              {formatPrice(product.price)}
            </p>

            {/* DESCRIPTION */}

            <div className="mt-7">

              <h2 className="text-sm font-bold">
                Product Description
              </h2>

              <p
                className="
                  mt-3
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-slate-600
                "
              >
                {product.description ||
                  "Beautifully crafted furniture designed to complement your space with comfort and style."}
              </p>

            </div>

            {/* PRODUCT SPECIFICATIONS */}

            {(product.material ||
              product.dimensions ||
              product.color) && (
              <div
                className="
                  mt-6
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                "
              >

                <h3
                  className="
                    border-b
                    border-slate-100
                    bg-[#F7F9FA]
                    px-4
                    py-3
                    text-sm
                    font-bold
                  "
                >
                  Product Specifications
                </h3>

                {[
                  ["Material", product.material],
                  [
                    "Dimensions",
                    product.dimensions,
                  ],
                  ["Color", product.color],
                ]
                  .filter((item) => item[1])
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        border-slate-100
                        px-4
                        py-3
                        last:border-0
                      "
                    >
                      <span className="text-xs text-slate-500">
                        {label}
                      </span>

                      <span
                        className="
                          text-right
                          text-xs
                          font-semibold
                          text-[#14283D]
                        "
                      >
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* QUANTITY */}

            <div className="mt-7">

              <p className="mb-3 text-sm font-semibold">
                Quantity
              </p>

              <div
                className="
                  inline-flex
                  h-11
                  items-center
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  aria-label="Decrease quantity"
                  className="
                    flex
                    h-full
                    w-11
                    items-center
                    justify-center
                    transition
                    hover:bg-slate-100
                    active:bg-slate-200
                  "
                >
                  <Minus size={15} />
                </button>

                <span
                  className="
                    flex
                    h-full
                    min-w-12
                    items-center
                    justify-center
                    border-x
                    border-slate-200
                    text-sm
                    font-semibold
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(99, current + 1)
                    )
                  }
                  aria-label="Increase quantity"
                  className="
                    flex
                    h-full
                    w-11
                    items-center
                    justify-center
                    transition
                    hover:bg-slate-100
                    active:bg-slate-200
                  "
                >
                  <Plus size={15} />
                </button>

              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div
              className="
                mt-6
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={addToCart}
                className={`
                  flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  active:scale-[0.98]
                  ${
                    added
                      ? "bg-emerald-600"
                      : "bg-[#14283D] hover:bg-[#079FC0]"
                  }
                `}
              >
                <ShoppingBag size={18} />

                {added
                  ? "Added to Cart"
                  : "Add to Cart"}
              </button>

              {/* WHATSAPP */}

              <button
                type="button"
                onClick={whatsappInquiry}
                className="
                  flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-green-700
                  transition
                  hover:bg-green-600
                  hover:text-white
                  active:scale-[0.98]
                "
              >
                <MessageCircle size={18} />

                WhatsApp Inquiry
              </button>

            </div>

            {/* SMALL NOTE */}

            <p
              className="
                mt-5
                text-center
                text-xs
                leading-6
                text-slate-400
              "
            >
              Contact our team for custom requirements
              and product details.
            </p>
          </div>
        </section>

        {/* =================================================
            BACK TO PRODUCTS
        ================================================= */}

        <div
          className="
            mt-10
            border-t
            border-slate-200
            pt-6
          "
        >
          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              transition
              hover:text-[#079FC0]
            "
          >
            <ArrowLeft size={17} />
            Back to All Products
          </Link>
        </div>

      </div>
    </main>
  );
}
