
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  House,
  Sofa,
  Utensils,
  BedDouble,
  Armchair,
  Store,
  Info,
  Phone,
  ArrowUpRight,
} from "lucide-react";

/* ================= PRODUCT CATEGORIES ================= */

const productCategories = [
  { name: "Dining Table", href: "/products/dining-table", icon: Utensils },
  {
    name: "Restaurant Furniture",
    href: "/products/restaurant-furniture",
    icon: Store,
  },
  { name: "Sofa Set", href: "/products/sofa-set", icon: Sofa },
  { name: "Wooden Sofa", href: "/products/wooden-sofa", icon: Armchair },
  { name: "L.Shape Sofa", href: "/products/l-shape-sofa", icon: Sofa },
  { name: "King Size Bed", href: "/products/king-size-bed", icon: BedDouble },
];

/* ================= CART STORAGE ================= */

const CART_KEY = "cart";

const getCartCount = () => {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    if (!Array.isArray(cart)) return 0;

    return cart.reduce(
      (total, item) => total + (Number(item.quantity) || 1),
      0
    );
  } catch {
    return 0;
  }
};

/* ================= NAVBAR ================= */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const [cartCount, setCartCount] = useState(getCartCount);
  const [cartPulse, setCartPulse] = useState(false);

  const pulseTimerRef = useRef(null);

  /* ================= LIVE CART COUNT ================= */

  useEffect(() => {
    const updateCart = () => {
      setCartCount(getCartCount());
      setCartPulse(true);

      clearTimeout(pulseTimerRef.current);

      pulseTimerRef.current = setTimeout(() => {
        setCartPulse(false);
      }, 650);
    };

    const handleStorage = () => {
      setCartCount(getCartCount());
      setCartPulse(true);

      clearTimeout(pulseTimerRef.current);

      pulseTimerRef.current = setTimeout(() => {
        setCartPulse(false);
      }, 650);
    };

    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", handleStorage);

      clearTimeout(pulseTimerRef.current);
    };
  }, []);

  /* ================= MENU FUNCTIONS ================= */

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileProductsOpen(false);
  };

  const linkClass =
    "group relative flex h-full items-center whitespace-nowrap text-[15px] font-semibold text-[#14283D] transition-colors duration-200 hover:text-[#079FC0] xl:text-base";

  const underlineClass =
    "absolute bottom-[22px] left-0 h-[2px] w-0 rounded-full bg-[#079FC0] transition-all duration-300 group-hover:w-full";

  return (
    <>
      <style>{`
        @keyframes cartBadgePop {
          0% { transform: scale(1); }
          35% { transform: scale(1.35); }
          65% { transform: scale(.9); }
          100% { transform: scale(1); }
        }

        @keyframes cartIconBounce {
          0%, 100% { transform: translateY(0); }
          35% { transform: translateY(-5px); }
          65% { transform: translateY(2px); }
        }

        .cart-badge-pop {
          animation: cartBadgePop .55s ease-out;
        }

        .cart-icon-bounce {
          animation: cartIconBounce .55s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .cart-badge-pop,
          .cart-icon-bounce {
            animation: none !important;
          }
        }
      `}</style>

      {/* ================= MAIN NAVBAR ================= */}

      <header className="relative z-50 w-full border-b border-slate-200/80 bg-white">
        <nav className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[82px] sm:px-6 lg:h-[90px] lg:gap-5 lg:px-8 xl:px-10">

          {/* LOGO */}

          <Link
            to="/"
            aria-label="Custom Furniture Design - Home"
            className="flex h-full shrink-0 items-center sm:mt-0 lg:-mt-3"
          >
            <img
              src="/logo.webp"
              alt="Custom Furniture Design"
              className="h-[73px] w-auto object-contain sm:h-[66px] lg:h-[95px]"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden h-full flex-1 items-center justify-center gap-5 lg:flex xl:gap-8">

            {/* HOME */}

            <Link to="/" className={linkClass}>
              Home
              <span className={underlineClass} />
            </Link>

            {/* PRODUCTS DROPDOWN */}

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                to="/products"
                onClick={() => setProductsOpen((prev) => !prev)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setProductsOpen(false);
                  }
                }}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                className={`group relative flex h-full items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold transition-colors duration-200 xl:text-base ${productsOpen
                    ? "text-[#079FC0]"
                    : "text-[#14283D] hover:text-[#079FC0]"
                  }`}
              >
                Products

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""
                    }`}
                />

                <span
                  className={`absolute bottom-[22px] left-0 h-[2px] rounded-full bg-[#079FC0] transition-all duration-300 ${productsOpen ? "w-full" : "w-0"
                    }`}
                />
              </Link>

              {/* DESKTOP DROPDOWN */}

              <div
                className={`absolute left-1/2 top-[calc(100%-11px)] z-50 w-[440px] -translate-x-1/2 pt-3 transition-all duration-200 ${productsOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                  }`}
              >
                <div className="overflow-hidden border border-slate-200/80 bg-white shadow-[0_20px_55px_rgba(20,40,61,0.15)]">

                  {/* DROPDOWN HEADER */}

                  <div className="border-b border-slate-100 bg-[#F5F9FA] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E4F5F8] text-[#079FC0]">
                        <Sofa size={21} strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#079FC0]">
                          Our Collections
                        </p>

                        <h3 className="mt-1 text-[15px] font-bold text-[#14283D]">
                          Explore Our Furniture
                        </h3>
                      </div>
                    </div>

                    <p className="mt-2.5 text-[12px] leading-5 text-slate-500">
                      Discover thoughtfully designed furniture for your home
                      and workspace.
                    </p>
                  </div>

                  {/* CATEGORY GRID */}

                  <div className="grid grid-cols-2 gap-1 p-2.5">
                    {productCategories.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setProductsOpen(false)}
                          className="group flex min-h-[62px] items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F0F9FB]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF5F7] text-[#14283D] transition-colors group-hover:bg-[#079FC0] group-hover:text-white">
                            <Icon size={18} strokeWidth={1.8} />
                          </span>

                          <span className="min-w-0 flex-1 text-[12px] font-semibold leading-5 text-[#34485A] transition-colors group-hover:text-[#079FC0]">
                            {item.name}
                          </span>

                          <ChevronRight
                            size={14}
                            className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#079FC0]"
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* VIEW ALL */}

                  <Link
                    to="/products"
                    onClick={() => setProductsOpen(false)}
                    className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-[12px] font-bold text-[#079FC0] transition-colors hover:bg-[#F5F9FA]"
                  >
                    Explore All Products
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ABOUT */}

            <Link to="/about" className={linkClass}>
              About
              <span className={underlineClass} />
            </Link>

            {/* CONTACT */}

            <Link to="/contact" className={linkClass}>
              Contact
              <span className={underlineClass} />
            </Link>
          </div>

          {/* ================= RIGHT ACTIONS ================= */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* DESKTOP CART */}

            <Link
              to="/cart"
              data-cart-target
              aria-label={`View shopping cart, ${cartCount} items`}
              className="group hidden h-10 items-center gap-2 rounded-lg bg-[#079FC0] px-4 text-white transition-all duration-300 hover:bg-[#14283D] hover:shadow-md lg:inline-flex xl:h-11 xl:px-5"
            >
              <ShoppingCart
                size={19}
                strokeWidth={1.9}
                className={`transition-transform duration-300 group-hover:scale-105 ${cartPulse ? "cart-icon-bounce" : ""
                  }`}
              />

              <span className="whitespace-nowrap text-[13px] font-semibold xl:text-[14px]">
                Add to Cart
              </span>

              <span
                key={cartCount}
                className={`flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-[#079FC0] ${cartPulse ? "cart-badge-pop" : ""
                  }`}
              >
                {cartCount}
              </span>
            </Link>

            {/* MOBILE / TABLET CART */}

            <Link
              to="/cart"
              aria-label={`View shopping cart, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#14283D] transition-colors hover:bg-[#E4F5F8] hover:text-[#079FC0] sm:h-11 sm:w-11 lg:hidden"
            >
              <ShoppingCart
                size={22}
                strokeWidth={1.9}
                className={cartPulse ? "cart-icon-bounce" : ""}
              />

              <span
                key={cartCount}
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#079FC0] px-1 text-[10px] font-bold text-white ${cartPulse ? "cart-badge-pop" : ""
                  }`}
              >
                {cartCount}
              </span>
            </Link>

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14283D] text-white transition-colors hover:bg-[#079FC0] sm:h-11 sm:w-11 lg:hidden"
            >
              <Menu size={22} strokeWidth={1.9} />
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE BACKDROP ================= */}

      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={closeMenu}
        tabIndex={menuOpen ? 0 : -1}
        className={`fixed inset-0 z-[60] bg-[#071523]/55 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
          }`}
      />

      {/* ================= MOBILE SIDE DRAWER ================= */}

      <aside
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-[min(88vw,390px)] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* DRAWER HEADER */}

        <div className="flex h-[86px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Home"
            tabIndex={menuOpen ? 0 : -1}
            className="flex items-center"
          >
            <img
              src="/logo.webp"
              alt="Custom Furniture Design"
              className="h-[68px] w-auto object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            tabIndex={menuOpen ? 0 : -1}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F5F7] text-[#14283D] transition-colors hover:bg-[#079FC0] hover:text-white"
          >
            <X size={21} strokeWidth={2} />
          </button>
        </div>

        {/* DRAWER CONTENT */}

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
            Navigation
          </p>

          {/* HOME */}

          <Link
            to="/"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-[14px] font-semibold text-[#14283D] transition-colors hover:bg-[#F0F9FB] hover:text-[#079FC0]"
          >
            <House size={19} strokeWidth={1.8} />
            Home
          </Link>

          {/* PRODUCTS ACCORDION */}

          <div className="mt-1">
            <button
              type="button"
              onClick={() =>
                setMobileProductsOpen((prev) => !prev)
              }
              aria-expanded={mobileProductsOpen}
              tabIndex={menuOpen ? 0 : -1}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[14px] font-semibold transition-colors ${mobileProductsOpen
                  ? "bg-[#F0F9FB] text-[#079FC0]"
                  : "text-[#14283D] hover:bg-[#F0F9FB]"
                }`}
            >
              <span className="flex items-center gap-4">
                <Sofa size={19} strokeWidth={1.8} />
                Products
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* MOBILE CATEGORY LIST */}

            <div
              className={`grid transition-[grid-template-rows] duration-300 ${mobileProductsOpen
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
                }`}
            >
              <div className="overflow-hidden">
                <div className="ml-5 mt-2 border-l border-slate-200 pl-3">
                  {productCategories.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMenu}
                        tabIndex={
                          menuOpen && mobileProductsOpen ? 0 : -1
                        }
                        className="group flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-[12px] font-medium text-slate-600 transition-colors hover:bg-[#F0F9FB] hover:text-[#079FC0] sm:text-[13px]"
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                            className="shrink-0 text-slate-400 transition-colors group-hover:text-[#079FC0]"
                          />
                          {item.name}
                        </span>

                        <ChevronRight
                          size={15}
                          className="shrink-0 text-slate-300 transition-colors group-hover:text-[#079FC0]"
                        />
                      </Link>
                    );
                  })}

                  <Link
                    to="/products"
                    onClick={closeMenu}
                    tabIndex={
                      menuOpen && mobileProductsOpen ? 0 : -1
                    }
                    className="mt-1 flex items-center justify-between rounded-lg px-3 py-3 text-[12px] font-bold text-[#079FC0] transition-colors hover:bg-[#F0F9FB] sm:text-[13px]"
                  >
                    Explore All Products
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT */}

          <Link
            to="/about"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className="mt-1 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[14px] font-semibold text-[#14283D] transition-colors hover:bg-[#F0F9FB] hover:text-[#079FC0]"
          >
            <Info size={19} strokeWidth={1.8} />
            About
          </Link>

          {/* CONTACT */}

          <Link
            to="/contact"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className="mt-1 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[14px] font-semibold text-[#14283D] transition-colors hover:bg-[#F0F9FB] hover:text-[#079FC0]"
          >
            <Phone size={19} strokeWidth={1.8} />
            Contact
          </Link>

          {/* MOBILE CART BUTTON */}

          <Link
            to="/cart"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className="group mt-5 flex items-center justify-between rounded-xl bg-[#079FC0] px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#14283D]"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={20} strokeWidth={1.9} />
              Add to Cart

              <span
                key={cartCount}
                className={`flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-[#079FC0] ${cartPulse ? "cart-badge-pop" : ""
                  }`}
              >
                {cartCount}
              </span>
            </span>

            <ArrowUpRight
              size={18}
              className="text-white/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            />
          </Link>
        </div>

        {/* DRAWER FOOTER */}

        <div className="shrink-0 border-t border-slate-100 bg-[#F5F9FA] px-5 py-4">
          <p className="text-center text-xs font-semibold text-[#14283D]">
            Custom Furniture Design
          </p>

          <p className="mt-1 text-center text-[10px] text-slate-400">
            Furniture for every space.
          </p>
        </div>
      </aside>
    </>
  );
}