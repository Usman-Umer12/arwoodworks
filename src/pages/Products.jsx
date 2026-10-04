import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  ShoppingBag,
  MessageCircle,
  Truck,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../lib/supabase";

const WHATSAPP_NUMBER = "923033939167";

const categories = [
  "All Products",
  "Dining Table",
  "Restaurant Furniture",
  "Sofa Set",
  "Wooden Sofa",
  "L.Shape Sofa",
  "King Size Bed",
];

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Contact for Price";
  }

  return `PKR ${Number(price).toLocaleString("en-PK")}`;
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All Products");

  const [addedId, setAddedId] = useState(null);

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Products error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EXPLORE PRODUCTS
  // ============================================================

  const scrollToProducts = () => {
    const section = document.getElementById("products-list");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ============================================================
  // FILTER PRODUCTS
  // ============================================================

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All Products" ||
      product.category === activeCategory;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      product.title?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  // ============================================================
  // ADD TO CART
  // ============================================================

  const addToCart = (product) => {
    try {
      const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(
        (item) => String(item.id) === String(product.id)
      );

      let updatedCart;

      if (existing) {
        updatedCart = cart.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity: (Number(item.quantity) || 1) + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      setAddedId(product.id);

      setTimeout(() => {
        setAddedId(null);
      }, 1500);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // ============================================================
  // WHATSAPP
  // ============================================================

  const whatsappInquiry = (product) => {
    const message = `Hello AR Woodworks! I am interested in ${product.title}. Please share more details.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F9FA] text-[#14283D]">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="bg-[#14283D] px-4 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[2.5px] text-[#079FC0] sm:text-xs sm:tracking-[3px]">
            AR Woodworks Collection
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl">
            Discover Furniture Designed for Your Space
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Explore premium furniture crafted to bring
            comfort, functionality, and timeless beauty to
            your home.
          </p>

          <button
            type="button"
            onClick={scrollToProducts}
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#079FC0]
              px-5
              py-3
              text-xs
              font-bold
              text-white
              transition
              hover:bg-[#068EAA]
              sm:px-6
              sm:py-3.5
              sm:text-sm
            "
          >
            Explore Products
            <ArrowUpRight size={17} />
          </button>

        </div>
      </section>

      {/* ======================================================
          PRODUCTS SECTION
      ======================================================= */}

      <section
        id="products-list"
        className="
          mx-auto
          max-w-7xl
          scroll-mt-24
          px-3
          py-10
          sm:px-6
          sm:py-14
          lg:px-8
        "
      >

        {/* ====================================================
            SECTION HEADING
        ===================================================== */}

        <div className="mb-7">

          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#079FC0] sm:text-xs sm:tracking-widest">
            Explore Our Collection
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Our Products
          </h2>

        </div>

        {/* ====================================================
            SEARCH
        ===================================================== */}

        <div className="mb-5">

          <div className="relative w-full max-w-md">

            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search furniture..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                py-3
                pl-11
                pr-4
                text-sm
                text-[#14283D]
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#079FC0]
                focus:ring-2
                focus:ring-[#079FC0]/10
              "
            />

          </div>

        </div>

        {/* ====================================================
            STICKY CATEGORY AREA

            IMPORTANT:
            Categories normal position par start hongi.
            Scroll karte hue jab top par reach hongi,
            wahi par stick ho jayengi.

            Page load par fixed nahi hongi.
        ===================================================== */}

        <div
          className="
            sticky
            top-0
            z-40
            -mx-3
            mb-9
            border-b
            border-slate-200
            bg-[#F7F9FA]/95
            px-3
            py-3
            shadow-sm
            backdrop-blur-md
            sm:-mx-6
            sm:px-6
            lg:-mx-8
            lg:px-8
          "
        >

          <div
            className="
              flex
              w-full
              flex-nowrap
              items-center
              gap-2
              overflow-x-auto
              overflow-y-hidden
              whitespace-nowrap
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            {categories.map((category) => {
              const active =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`
                    inline-flex
                    h-10
                    shrink-0
                    items-center
                    justify-center
                    whitespace-nowrap
                    rounded-lg
                    px-4
                    text-xs
                    font-semibold
                    transition-colors
                    sm:text-sm
                    ${
                      active
                        ? "bg-[#14283D] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#079FC0] hover:text-[#079FC0]"
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}

          </div>

        </div>

        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="flex min-h-64 items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={27}
                className="mx-auto animate-spin text-[#079FC0]"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading products...
              </p>

            </div>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* ==================================================
             NO PRODUCTS
          =================================================== */

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <Search
                size={20}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-4 text-lg font-bold">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another category or search for a
              different product.
            </p>

          </div>

        ) : (

          /* ==================================================
             PRODUCT GRID
          =================================================== */

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">

            {filteredProducts.map((product) => (

              <article
                key={product.id}
                className="
                  group
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >

                {/* PRODUCT LINK */}

                <Link
                  to={`/product/${product.id}`}
                  className="flex flex-1 flex-col"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-[#F0F2F4]">

                    {product.image_url ? (

                      <img
                        src={product.image_url}
                        alt={
                          product.title ||
                          "AR Woodworks furniture"
                        }
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-[1.03]
                        "
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No Image
                      </div>

                    )}

                    {/* CATEGORY */}

                    {product.category && (

                      <span
                        className="
                          absolute
                          left-2.5
                          top-2.5
                          max-w-[80%]
                          truncate
                          rounded-md
                          bg-white/95
                          px-2.5
                          py-1.5
                          text-[9px]
                          font-bold
                          text-[#079FC0]
                          shadow-sm
                          backdrop-blur-sm
                          sm:text-[10px]
                        "
                      >
                        {product.category}
                      </span>

                    )}

                    {/* VIEW PRODUCT */}

                    <span
                      className="
                        absolute
                        bottom-2.5
                        right-2.5
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-[#14283D]
                        shadow-md
                        transition
                        group-hover:bg-[#079FC0]
                        group-hover:text-white
                      "
                    >
                      <ArrowUpRight size={16} />
                    </span>

                  </div>

                  {/* PRODUCT INFO */}

                  <div className="flex flex-1 flex-col p-3 sm:p-4">

                    <h3 className="truncate text-xs font-bold text-[#14283D] sm:text-base">
                      {product.title}
                    </h3>

                    <p
                      className="
                        mt-1.5
                        line-clamp-2
                        min-h-[32px]
                        text-[10px]
                        leading-4
                        text-slate-500
                        sm:mt-2
                        sm:min-h-[40px]
                        sm:text-sm
                        sm:leading-5
                      "
                    >
                      {product.description ||
                        "Premium furniture crafted with quality materials and attention to detail."}
                    </p>

                    {/* PRICE */}

                    <p className="mt-3 text-xs font-bold text-[#079FC0] sm:text-base">
                      {formatPrice(product.price)}
                    </p>

                    {/* DELIVERY */}

                    <div
                      className="
                        mt-3
                        flex
                        min-h-[34px]
                        items-center
                        gap-2
                        rounded-lg
                        bg-[#F4F8FA]
                        px-2.5
                        py-2
                        sm:mt-4
                        sm:px-3
                      "
                    >

                      <Truck
                        size={14}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#079FC0]"
                      />

                      <span
                        className="
                          line-clamp-2
                          text-[9px]
                          font-medium
                          leading-3.5
                          text-slate-600
                          sm:text-[11px]
                          sm:leading-4
                        "
                      >
                        {product.delivery ||
                          "Delivery available across Pakistan"}
                      </span>

                    </div>

                  </div>

                </Link>

                {/* ==================================================
                    ACTION BUTTONS
                =================================================== */}

                <div
                  className="
                    grid
                    grid-cols-[1fr_38px]
                    gap-2
                    px-3
                    pb-3
                    sm:grid-cols-[1fr_42px]
                    sm:px-4
                    sm:pb-4
                  "
                >

                  {/* ADD TO CART */}

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className={`
                      flex
                      min-h-9
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      px-2
                      py-2.5
                      text-[10px]
                      font-semibold
                      text-white
                      transition
                      sm:min-h-10
                      sm:text-sm
                      ${
                        addedId === product.id
                          ? "bg-emerald-600"
                          : "bg-[#14283D] hover:bg-[#079FC0]"
                      }
                    `}
                  >

                    {addedId === product.id ? (
                      "Added"
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}

                  </button>

                  {/* WHATSAPP */}

                  <button
                    type="button"
                    onClick={() =>
                      whatsappInquiry(product)
                    }
                    aria-label={`WhatsApp inquiry for ${product.title}`}
                    className="
                      flex
                      min-h-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-green-200
                      bg-green-50
                      text-green-700
                      transition
                      hover:bg-green-600
                      hover:text-white
                      sm:min-h-10
                    "
                  >
                    <MessageCircle size={17} />
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}