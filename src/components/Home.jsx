import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Store,
  Sofa,
  Armchair,
  BedDouble,
  ShieldCheck,
  Sparkles,
  Truck,
  Headset,
} from "lucide-react";

/* ================= IMAGE IMPORTS ================= */

// Hero desktop images
import sofaDesktop from "../assets/des2.webp";
import lShapeDesktop from "../assets/l1.webp";
import bedDesktop from "../assets/des3.webp";

// Hero mobile images
import sofaMobile from "../assets/mob1.webp";
import lShapeMobile from "../assets/mob2.webp";
import bedMobile from "../assets/mob3.webp";

// Collection images
import diningImage from "../assets/dt3.webp";
import restaurantImage from "../assets/res2.webp";
import woodenSofaImage from "../assets/ws1.webp";
import lShapeImage from "../assets/l1.webp";

/* ================= HERO SLIDES ================= */

const slides = [
  {
    category: "TIMELESS COMFORT",
    title: ["Make Comfort", "Part of Your Home"],
    description:
      "Explore premium sofa sets that combine exceptional comfort with elegant designs for modern homes.",
    desktopImage: sofaDesktop,
    mobileImage: sofaMobile,
    link: "/products/sofa-set",
  },
  {
    category: "MODERN LIVING",
    title: ["Make Every", "Corner Count"],
    description:
      "Find contemporary L-shaped sofas designed to make your living space more comfortable and inviting.",
    desktopImage: lShapeDesktop,
    mobileImage: lShapeMobile,
    link: "/products/l-shape-sofa",
  },
  {
    category: "LUXURY BEDROOMS",
    title: ["Your Personal", "Space for Comfort"],
    description:
      "Create a peaceful retreat with elegant king-size beds designed for comfort and restful nights.",
    desktopImage: bedDesktop,
    mobileImage: bedMobile,
    link: "/products/king-size-bed",
  },
];

/* ================= COLLECTIONS ================= */

const categories = [
  {
    name: "Dining Table",
    image: diningImage,
    link: "/products/dining-table",
    icon: Utensils,
  },
  {
    name: "Restaurant Furniture",
    image: restaurantImage,
    link: "/products/restaurant-furniture",
    icon: Store,
  },
  {
    name: "Sofa Set",
    image: sofaDesktop,
    link: "/products/sofa-set",
    icon: Sofa,
  },
  {
    name: "Wooden Sofa",
    image: woodenSofaImage,
    link: "/products/wooden-sofa",
    icon: Armchair,
  },
  {
    name: "L.Shape Sofa",
    image: lShapeImage,
    link: "/products/l-shape-sofa",
    icon: Sofa,
  },
  {
    name: "King Size Bed",
    image: bedDesktop,
    link: "/products/king-size-bed",
    icon: BedDouble,
  },
];

/* ================= FEATURES ================= */

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Finest materials & quality craftsmanship.",
  },
  {
    icon: Sparkles,
    title: "Modern Designs",
    description: "Elegant styles for every home.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Safe & fast delivery across Pakistan.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description: "We're here to help you anytime.",
  },
];

/* ================= HOME PAGE ================= */

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const slide = slides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  /* AUTO SLIDER */

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [paused]);

  const whatsappMessage =
    "Assalam o Alaikum! I am interested in your furniture collection. Please share more details about your products.";

  return (
    <main className="w-full overflow-hidden bg-white text-[#14283D]">
      {/* ================= HERO SECTION ================= */}

      <section
        className="relative isolate min-h-[540px] w-full overflow-hidden bg-[#10263A] sm:min-h-[600px] lg:h-[70vh] lg:min-h-[560px] lg:max-h-[760px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* BACKGROUND SLIDES */}

        {slides.map((item, index) => (
          <div
            key={item.category}
            className={`absolute inset-0 -z-20 overflow-hidden transition-opacity duration-700 ${activeSlide === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
              }`}
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={item.mobileImage}
              />

              <img
                src={item.desktopImage}
                alt={item.category}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ease-out ${activeSlide === index ? "scale-105" : "scale-100"
                  }`}
              />
            </picture>
          </div>
        ))}

        {/* OVERLAYS */}

        <div className="absolute inset-0 -z-10 bg-[#071523]/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071523]/95 via-[#10263A]/75 to-[#10263A]/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071523]/55 via-transparent to-[#071523]/10" />

        {/* HERO CONTENT */}

        <div className="mx-auto flex min-h-[540px] max-w-7xl items-center px-5 pb-24 pt-12 sm:min-h-[600px] sm:px-10 sm:pb-28 lg:h-full lg:min-h-0 lg:px-12 lg:pb-16 lg:pt-8">
          <div
            key={activeSlide}
            className="w-full max-w-[650px] animate-[fadeIn_0.6s_ease-out]"
          >
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <span className="h-[3px] w-9 shrink-0 rounded-full bg-[#12B4D2]" />

              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#70D9EC] sm:text-xs sm:tracking-[3px]">
                {slide.category}
              </p>
            </div>

            <h1 className="max-w-[580px] text-[clamp(2.15rem,7vw,3.25rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
              {slide.title.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-3 max-w-[440px] text-[13px] leading-[1.7] text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              {slide.description}
            </p>

            {/* CTA BUTTONS */}

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <a
                href={slide.link}
                className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg bg-[#079FC0] px-6 text-[13px] font-semibold text-white shadow-lg shadow-[#079FC0]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#087F9D] sm:min-h-[50px] sm:px-8 sm:text-sm"
              >
                Shop Now
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href="/contact"
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/55 bg-white/5 px-6 text-[13px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#14283D] sm:min-h-[50px] sm:px-8 sm:text-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* DESKTOP ARROWS */}

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:border-[#12B4D2] hover:bg-[#079FC0] lg:flex"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:border-[#12B4D2] hover:bg-[#079FC0] lg:flex"
        >
          <ChevronRight size={22} />
        </button>

        {/* SLIDER CONTROLS */}

        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between sm:bottom-7 sm:left-10 sm:right-10 lg:bottom-8 lg:left-12 lg:right-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <p className="text-[11px] font-medium tabular-nums text-white sm:text-xs">
              {String(activeSlide + 1).padStart(2, "0")}
              <span className="mx-1.5 text-white/40">/</span>
              <span className="text-white/60">
                {String(slides.length).padStart(2, "0")}
              </span>
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.category}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-[3px] rounded-full transition-all duration-500 ${activeSlide === index
                      ? "w-8 bg-[#12B4D2] sm:w-10"
                      : "w-3 bg-white/50 hover:bg-white"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* MOBILE ARROWS */}

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#079FC0] sm:h-10 sm:w-10"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#079FC0] sm:h-10 sm:w-10"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= PREMIUM FEATURES ================= */}

     {/* ================= PREMIUM FEATURES ================= */}

<section className="relative z-10 w-full border-b border-slate-100 bg-white">
  <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-10">
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-8 sm:gap-y-9 lg:grid-cols-4 lg:gap-0">
      {features.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`flex min-w-0 items-start gap-3 sm:gap-4 lg:px-6 ${
              index % 2 === 1
                ? "border-l border-slate-200 pl-4 sm:pl-6"
                : "pr-2 sm:pr-4"
            } ${
              index > 1 ? "lg:border-l lg:border-slate-200" : ""
            } ${
              index === 0 || index === 2 ? "lg:pl-0" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA] text-[#079FC0] sm:h-12 sm:w-12">
              <Icon
                size={21}
                strokeWidth={1.8}
                className="sm:h-6 sm:w-6"
              />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-[12px] font-semibold leading-5 text-[#14283D] sm:text-base sm:leading-6">
                {item.title}
              </h3>

              <p className="mt-1 text-[11px] leading-[1.6] text-slate-500 sm:mt-1.5 sm:text-sm sm:leading-6">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* ================= OUR FURNITURE COLLECTION ================= */}

<section className="relative w-full bg-[#F5F8FA] py-12 sm:py-16 lg:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
    {/* SECTION HEADING */}

    <div className="mb-7 text-left sm:mb-9 lg:mb-10">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-[3px] w-9 shrink-0 rounded-full bg-[#079FC0]" />

        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#079FC0] sm:text-xs sm:tracking-[2.5px]">
          Our Furniture Collection
        </p>
      </div>

      <h2 className="max-w-3xl text-left text-[25px] font-bold leading-[1.2] tracking-tight text-[#14283D] sm:text-3xl lg:text-[42px]">
        Discover furniture designed for your space.
      </h2>

      <p className="mt-2 max-w-xl text-left text-xs leading-5 text-slate-500 sm:mt-2.5 sm:text-sm sm:leading-6 lg:text-base">
        Explore our dining tables, restaurant furniture, sofa sets and
        bedroom collections, thoughtfully crafted for comfort and
        everyday living.
      </p>

      {/* CATEGORY SUBHEADING */}

      <div className="mt-7 text-left sm:mt-8">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#079FC0] sm:text-xs sm:tracking-[2.5px]">
          Shop by collection
        </p>

        <h3 className="mt-1.5 text-left text-xl font-bold leading-tight tracking-[-0.02em] text-[#14283D] sm:text-2xl">
          Explore Categories
        </h3>
      </div>
    </div>

    {/* COLLECTION GRID */}

<div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {categories.map((item) => {
        const Icon = item.icon;

        return (
        <a
  key={item.name}
  href={item.link}
  className="group relative isolate block min-w-0 aspect-[3/4] overflow-hidden rounded-xl bg-[#E9EEF1] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#14283D]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#079FC0] focus-visible:ring-offset-2 sm:aspect-[5/4] lg:aspect-[4/3]"
>
  {/* CATEGORY IMAGE */}
  <img
    src={item.image}
    alt={item.name}
    loading="lazy"
    decoding="async"
    className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
  />

  {/* IMAGE OVERLAY */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071523]/90 via-[#071523]/15 to-transparent" />

  {/* CARD CONTENT */}
  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2.5 sm:p-4 lg:p-5">
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#079FC0] text-white shadow-md sm:h-10 sm:w-10">
        <Icon size={17} strokeWidth={1.8} className="sm:h-5 sm:w-5" />
      </span>

      <h3 className="min-w-0 break-words text-xs font-semibold leading-snug text-white sm:text-base lg:text-lg">
        {item.name}
      </h3>
    </div>

    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition-all duration-300 group-hover:border-[#079FC0] group-hover:bg-[#079FC0] sm:h-9 sm:w-9">
      <ArrowRight size={15} className="sm:h-[17px] sm:w-[17px]" />
    </span>
  </div>
</a>
        );
      })}
    </div>
  </div>
</section>

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}

      <a
        href={`https://wa.me/923033939167?text=${encodeURIComponent(
          whatsappMessage
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center sm:bottom-7 sm:right-7"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />

        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:bg-[#20BA5A] sm:h-16 sm:w-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="h-8 w-8 sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <path d="M16.01 3C8.84 3 3 8.83 3 16c0 2.3.61 4.56 1.77 6.55L3 29l6.61-1.73A12.94 12.94 0 0 0 16 29c7.17 0 13-5.83 13-13S23.18 3 16.01 3Zm0 23.6c-2.02 0-4-.54-5.72-1.57l-.41-.24-3.92 1.03 1.05-3.82-.27-.42A10.58 10.58 0 0 1 5.1 16c0-6.02 4.9-10.91 10.92-10.91S26.93 9.98 26.93 16s-4.9 10.6-10.92 10.6Zm5.99-7.95c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-.33-.17-1.4-.52-2.66-1.65-.98-.87-1.65-1.95-1.84-2.28-.19-.33-.02-.52.15-.69.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.79-1.02-2.45-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.18 3.17 1.35 3.39c.17.22 2.31 3.53 5.6 4.95.78.34 1.39.55 1.86.7.78.25 1.49.21 2.05.13.63-.09 1.95-.8 2.23-1.57.27-.77.19-1.43.19-1.57-.08-.14-.3-.22-.63-.39Z" />
          </svg>
        </span>
      </a>
    </main>
  );
}