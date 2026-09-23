// About.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Armchair,
  Sofa,
  BedDouble,
  Utensils,
  MessageCircle,
  MoveRight,
} from "lucide-react";

/* ================= PRODUCT IMAGES ================= */

import bedImage from "../assets/bed1.webp";
import restaurantImage from "../assets/res1.webp";
import diningImage from "../assets/dt1.webp";
import lShapeImage from "../assets/l1.webp";
import woodenSofaImage from "../assets/ws1.webp";
import sofaImage from "../assets/sofa1.webp";

/* ================= CATEGORIES ================= */

const categories = [
  {
    title: "Dining Table",
    subtitle: "Gather Around in Style",
    link: "/products/dining-table",
    icon: Utensils,
    number: "01",
    image: diningImage,
  },
  {
    title: "Restaurant Furniture",
    subtitle: "Designed for Welcoming Spaces",
    link: "/products/restaurant-furniture",
    icon: Armchair,
    number: "02",
    image: restaurantImage,
  },
  {
    title: "Sofa Set",
    subtitle: "Comfort for Everyday Living",
    link: "/products/sofa-set",
    icon: Sofa,
    number: "03",
    image: sofaImage,
  },
  {
    title: "Wooden Sofa",
    subtitle: "Classic Craftsmanship",
    link: "/products/wooden-sofa",
    icon: Armchair,
    number: "04",
    image: woodenSofaImage,
  },
  {
    title: "L.Shape Sofa",
    subtitle: "Made for Modern Living",
    link: "/products/l-shape-sofa",
    icon: Sofa,
    number: "05",
    image: lShapeImage,
  },
  {
    title: "King Size Bed",
    subtitle: "Comfort Starts Here",
    link: "/products/king-size-bed",
    icon: BedDouble,
    number: "06",
    image: bedImage,
  },
];

/* ================= ABOUT PAGE ================= */

export default function About() {
  const whatsappNumber = "923033939167";

  const whatsappMessage = encodeURIComponent(
    "Hello! I would like to know more about your furniture collections."
  );

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#14283D]">
      {/* ================= HERO ================= */}

      <section className="bg-[#F4F7F9]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-9 sm:px-7 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-16">
          {/* Content */}

          <div className="order-2 lg:order-1">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#079FC0]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#078BA8] sm:text-xs">
                About Us
              </p>
            </div>

            <h1 className="max-w-2xl text-[34px] font-bold leading-[1.13] tracking-tight sm:text-5xl lg:text-[56px]">
              Discover Furniture
              <span className="mt-1 block text-[#079FC0]">
                Designed for Your Space.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Discover thoughtfully designed furniture for modern homes
              and workspaces. From elegant dining tables to comfortable
              sofas and bedroom furniture, find pieces that bring style
              and comfort together.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#14283D] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#079FC0]"
              >
                Explore Our Collection
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#14283D] transition hover:border-[#079FC0] hover:text-[#079FC0]"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                <CheckCircle2 size={16} className="text-[#079FC0]" />
                Thoughtfully Selected
              </span>

              <span className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                <CheckCircle2 size={16} className="text-[#079FC0]" />
                Delivery Across Pakistan
              </span>
            </div>
          </div>

          {/* Hero Image */}

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-xl">
              <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#079FC0]/10 blur-2xl sm:h-40 sm:w-40" />

              <div className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-slate-300/30 sm:p-3">
                <img
                  src={bedImage}
                  alt="Furniture collection"
                  className="h-[230px] w-full rounded-xl object-cover sm:h-[340px] lg:h-[410px]"
                />

                <div className="absolute inset-x-2 bottom-2 rounded-b-xl bg-gradient-to-t from-[#14283D]/95 via-[#14283D]/55 to-transparent px-5 pb-5 pt-16 sm:inset-x-3 sm:bottom-3 sm:px-7 sm:pb-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
                    Furniture Collection
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    Comfort Meets Style.
                  </h2>

                  <p className="mt-1 text-xs text-slate-200 sm:text-sm">
                    Furniture for the spaces you love.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-3 left-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg sm:bottom-5 sm:-left-5 sm:px-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F7FA] text-[#079FC0]">
                  <Armchair size={22} />
                </span>

                <div>
                  <p className="text-sm font-bold text-[#14283D]">
                    Thoughtful Living
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Style for every space
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BRAND STORY ================= */}

      <section className="px-4 py-12 sm:px-7 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#079FC0] sm:text-xs">
              <span className="h-[2px] w-7 bg-[#079FC0]" />
              Our Story
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
              Designed Around
              <span className="block text-[#079FC0]">
                the Way You Live.
              </span>
            </h2>
          </div>

          <div className="lg:pt-2">
            <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Your home is more than a place. It is where everyday
              moments become lasting memories. We believe furniture
              should complement your lifestyle while bringing comfort,
              character, and warmth to your space.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Our collection brings together dining tables, sofas,
              wooden furniture, and bedroom essentials for different
              spaces and needs. We aim to make finding furniture
              simple, convenient, and enjoyable.
            </p>

            <Link
              to="/products"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#078BA8] transition hover:text-[#14283D]"
            >
              Discover Our Furniture
              <MoveRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= COLLECTIONS MARQUEE ================= */}

      <section className="overflow-hidden bg-[#F0F8FA] py-10 sm:py-12">
        <div className="mx-auto mb-7 max-w-[1280px] px-4 text-center sm:mb-9 sm:px-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#078BA8] sm:text-xs">
            Our Products
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Beautiful Furniture for
            <span className="text-[#079FC0]"> Every Space.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Explore furniture designed to bring comfort, style,
            and character to your home and workspace.
          </p>
        </div>

        <div className="relative">
          {/* First Marquee Row */}

          <div className="marquee-track flex w-max gap-4 px-2">
            {[...categories, ...categories].map((category, index) => (
              <Link
                key={`${category.number}-${index}`}
                to={category.link}
                className="group relative h-[150px] w-[230px] shrink-0 overflow-hidden rounded-xl bg-[#14283D] shadow-sm sm:h-[180px] sm:w-[280px]"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#14283D]/95 via-[#14283D]/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {category.title}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:border-[#079FC0] group-hover:bg-[#079FC0]">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Marquee Divider */}

          <div className="my-6 flex items-center gap-4 px-4 sm:my-7">
            <span className="h-px flex-1 bg-[#079FC0]/30" />
            <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#078BA8] sm:text-xs">
              <MoveRight size={17} />
              Explore More
              <MoveRight size={17} />
            </span>
            <span className="h-px flex-1 bg-[#079FC0]/30" />
          </div>

          {/* Second Marquee Row */}

          <div className="marquee-track-reverse flex w-max gap-4 px-2">
            {[...categories, ...categories].map((category, index) => (
              <Link
                key={`reverse-${category.number}-${index}`}
                to={category.link}
                className="group relative h-[150px] w-[230px] shrink-0 overflow-hidden rounded-xl bg-[#14283D] shadow-sm sm:h-[180px] sm:w-[280px]"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#14283D]/95 via-[#14283D]/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {category.title}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:border-[#079FC0] group-hover:bg-[#079FC0]">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR VISION ================= */}

      <section className="bg-[#14283D] px-4 py-12 text-white sm:px-7 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] items-center gap-7 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
              <span className="h-[2px] w-7 bg-[#079FC0]" />
              Our Vision
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
              Timeless Comfort.
              <span className="block text-cyan-300">
                Lasting Impressions.
              </span>
            </h2>
          </div>

          <div>
            <p className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Our vision is to help customers create spaces that
              reflect their style and everyday needs through
              thoughtfully designed furniture, carefully considered
              quality, and a service experience they can trust.
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-cyan-300">
                <Armchair size={21} />
              </span>

              <p className="text-sm font-medium text-slate-200">
                Furniture that feels right for your space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="px-4 py-10 sm:px-7 sm:py-14 lg:px-12 lg:py-16">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-2xl bg-[#F1F8FA] px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#079FC0]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#078BA8] sm:text-xs">
                Find Your Style
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                The Right Furniture
                <span className="block text-[#079FC0]">
                  for Your Space.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Explore our furniture collections and speak with
                our team to find pieces that suit your space.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#14283D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#079FC0]"
              >
                Explore Furniture
                <ArrowUpRight size={17} />
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#079FC0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#087F99]"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ANIMATION ================= */}

      <style>{`
        .marquee-track {
          animation: furniture-marquee 38s linear infinite;
        }

        .marquee-track-reverse {
          animation: furniture-marquee-reverse 42s linear infinite;
        }

        .marquee-track:hover,
        .marquee-track-reverse:hover {
          animation-play-state: paused;
        }

        @keyframes furniture-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes furniture-marquee-reverse {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .marquee-track-reverse {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}