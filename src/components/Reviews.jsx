import React, { useEffect, useState } from "react";

import {
  Star,
  Quote,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { supabase } from "../lib/supabase";

/* ============================================================
   REVIEWS SECTION
============================================================ */

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  /* ==========================================================
     FETCH REVIEWS
  ========================================================== */

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            id,
            customer_name,
            rating,
            review,
            customer_image_url,
            sort_order
          `)
          .eq("enabled", true)
          .order("sort_order", {
            ascending: true,
          })
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("Website reviews error:", error);
          return;
        }

        setReviews(data || []);
      } catch (error) {
        console.error("Fetch website reviews error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  /* ==========================================================
     AUTO SLIDER
  ========================================================== */

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev >= reviews.length - 1 ? 0 : prev + 1
      );
    }, 5500);

    return () => clearInterval(interval);
  }, [reviews.length]);

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const previous = () => {
    setCurrent((prev) =>
      prev <= 0 ? reviews.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrent((prev) =>
      prev >= reviews.length - 1 ? 0 : prev + 1
    );
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto flex min-h-[180px] max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={26}
              strokeWidth={1.8}
              className="animate-spin text-[#079FC0]"
            />

            <span className="text-xs font-medium text-slate-400">
              Loading customer reviews...
            </span>
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
     NO REVIEWS
  ========================================================== */

  if (reviews.length === 0) {
    return null;
  }

  const review = reviews[current];

  const rating = Math.min(
    5,
    Math.max(0, Number(review.rating) || 0)
  );

  const initials =
    review.customer_name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "C";

  return (
    <section
      id="reviews"
      className="
        relative
        overflow-hidden
        bg-[#F7F9FA]
        py-14
        sm:py-18
        lg:py-24
      "
    >
      {/* ======================================================
          BACKGROUND DETAILS
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#079FC0]/[0.045] blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#14283D]/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-7 lg:px-12">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="mb-4 flex items-center justify-center gap-3">

            <span className="h-px w-8 bg-[#079FC0]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#078BA8] sm:text-xs">
              Customer Reviews
            </p>

            <span className="h-px w-8 bg-[#079FC0]" />

          </div>

          <h2
            className="
              text-[30px]
              font-bold
              leading-tight
              tracking-tight
              text-[#14283D]
              sm:text-4xl
              lg:text-[46px]
            "
          >
            What Our Customers
            <span className="block text-[#079FC0]">
              Say About Us.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
            Discover what customers say about their experience
            with AR Woodworks and our furniture collections.
          </p>

        </div>


        {/* ====================================================
            REVIEW AREA
        ==================================================== */}

        <div className="mx-auto mt-9 max-w-5xl sm:mt-12">

          {/* ==================================================
              MAIN REVIEW CARD
          ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200/80
              bg-white
              shadow-[0_18px_55px_rgba(20,40,61,0.07)]
              sm:rounded-3xl
            "
          >

            {/* TOP ACCENT */}

            <div className="h-1 w-full bg-gradient-to-r from-[#14283D] via-[#079FC0] to-[#14283D]" />

            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">

              {/* =================================================
                  CUSTOMER SIDE
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  flex-col
                  justify-between
                  bg-[#14283D]
                  px-6
                  py-7
                  sm:px-9
                  sm:py-9
                  lg:px-10
                  lg:py-10
                "
              >

                {/* Decorative Quote */}

                <div className="absolute right-5 top-5 opacity-[0.08]">
                  <Quote
                    size={100}
                    strokeWidth={1}
                  />
                </div>


                {/* Label */}

                <div className="relative">

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">

                    <MessageCircle
                      size={13}
                      className="text-cyan-300"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                      Customer Experience
                    </span>

                  </div>

                </div>


                {/* Customer */}

                <div className="relative mt-10 lg:mt-16">

                  <div className="flex items-center gap-4">

                    {review.customer_image_url ? (
                      <img
                        src={review.customer_image_url}
                        alt={review.customer_name || "Customer"}
                        className="
                          h-14
                          w-14
                          shrink-0
                          rounded-full
                          object-cover
                          ring-2
                          ring-white/20
                          sm:h-16
                          sm:w-16
                        "
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-lg
                          font-bold
                          text-[#14283D]
                          sm:h-16
                          sm:w-16
                        "
                      >
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="truncate text-base font-bold text-white sm:text-lg">
                        {review.customer_name || "Customer"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Verified Customer
                      </p>

                    </div>

                  </div>


                  {/* Rating */}

                  <div className="mt-6 flex items-center gap-3">

                    <div className="flex items-center gap-1">

                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          strokeWidth={1.8}
                          className={
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/20"
                          }
                        />
                      ))}

                    </div>

                    <span className="text-sm font-semibold text-white">
                      {rating.toFixed(1)}
                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  REVIEW CONTENT
              ================================================= */}

              <div className="relative px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">

                {/* Quote Icon */}

                <div
                  className="
                    absolute
                    right-6
                    top-6
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F0F8FA]
                    text-[#079FC0]
                    sm:right-9
                    sm:top-9
                    sm:h-12
                    sm:w-12
                  "
                >
                  <Quote
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>


                {/* Small Label */}

                <p className="pr-14 text-[10px] font-bold uppercase tracking-[0.2em] text-[#079FC0]">
                  Client Feedback
                </p>


                {/* Review */}

                <blockquote
                  className="
                    mt-5
                    max-w-3xl
                    text-[19px]
                    font-medium
                    leading-8
                    tracking-[-0.01em]
                    text-[#263746]
                    sm:text-[22px]
                    sm:leading-9
                    lg:text-[25px]
                    lg:leading-10
                  "
                >
                  “{review.review}”
                </blockquote>


                {/* Bottom Divider */}

                <div className="mt-8 border-t border-slate-100 pt-6 sm:mt-10">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Trust Text */}

                    <div className="flex items-center gap-2.5">

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7FA] text-[#079FC0]">

                        <CheckIcon />

                      </span>

                      <div>

                        <p className="text-xs font-bold text-[#14283D]">
                          Trusted by Our Customers
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Quality furniture & service
                        </p>

                      </div>

                    </div>


                    {/* Review Counter */}

                    {reviews.length > 1 && (
                      <p className="text-xs font-medium text-slate-400">
                        <span className="font-bold text-[#14283D]">
                          {String(current + 1).padStart(2, "0")}
                        </span>

                        <span className="mx-1.5">
                          /
                        </span>

                        {String(reviews.length).padStart(2, "0")}
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              CONTROLS
          ================================================== */}

          {reviews.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">

              {/* Previous */}

              <button
                type="button"
                onClick={previous}
                aria-label="Previous review"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-[#14283D]
                  shadow-sm
                  transition
                  duration-200
                  hover:border-[#079FC0]
                  hover:text-[#079FC0]
                  active:scale-95
                  sm:h-11
                  sm:w-11
                "
              >
                <ChevronLeft size={18} />
              </button>


              {/* Dots */}

              <div className="flex items-center gap-1.5">

                {reviews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to review ${index + 1}`}
                    aria-current={
                      current === index
                        ? "true"
                        : undefined
                    }
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        current === index
                          ? "w-8 bg-[#079FC0]"
                          : "w-1.5 bg-slate-300 hover:bg-slate-400"
                      }
                    `}
                  />
                ))}

              </div>


              {/* Next */}

              <button
                type="button"
                onClick={next}
                aria-label="Next review"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-[#14283D]
                  shadow-sm
                  transition
                  duration-200
                  hover:border-[#079FC0]
                  hover:text-[#079FC0]
                  active:scale-95
                  sm:h-11
                  sm:w-11
                "
              >
                <ChevronRight size={18} />
              </button>

            </div>
          )}

        </div>

      </div>


      {/* ======================================================
          LOCAL ICON
      ====================================================== */}

      <style>{`
        @keyframes reviews-fade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #reviews blockquote {
          animation: reviews-fade 0.45s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          #reviews blockquote {
            animation: none;
          }
        }
      `}</style>

    </section>
  );
}


/* ============================================================
   SMALL CHECK ICON
============================================================ */

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M5 12.5 9.2 17 19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
