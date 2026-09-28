import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Info,
  Megaphone,
  X,
} from "lucide-react";

import { supabase } from "../lib/supabase";

/* ============================================================
   VARIANT STYLES
============================================================ */

const variantStyles = {
  dark: {
    wrapper: "bg-[#14283D] text-white",
    icon: "bg-white/10 text-[#58D5EA]",
    message: "text-white",
    button:
      "bg-[#079FC0] text-white hover:bg-[#087F99]",
    close:
      "text-white/60 hover:bg-white/10 hover:text-white",
    border: "border-white/10",
  },

  cyan: {
    wrapper: "bg-[#079FC0] text-white",
    icon: "bg-white/15 text-white",
    message: "text-white",
    button:
      "bg-white text-[#087F99] hover:bg-slate-50",
    close:
      "text-white/70 hover:bg-white/10 hover:text-white",
    border: "border-white/15",
  },

  light: {
    wrapper: "bg-[#F5FBFC] text-[#14283D]",
    icon:
      "bg-[#079FC0]/10 text-[#079FC0]",
    message: "text-[#14283D]",
    button:
      "bg-[#14283D] text-white hover:bg-[#079FC0]",
    close:
      "text-slate-400 hover:bg-slate-200 hover:text-[#14283D]",
    border: "border-[#DDEFF3]",
  },
};

/* ============================================================
   ANNOUNCEMENT ICON
============================================================ */

const AnnouncementIcon = ({ variant }) => {
  if (variant === "light") {
    return (
      <Info
        size={15}
        strokeWidth={2.2}
      />
    );
  }

  return (
    <Megaphone
      size={15}
      strokeWidth={2.2}
    />
  );
};

/* ============================================================
   COMPONENT
============================================================ */

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] =
    useState(null);

  const [visible, setVisible] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [dismissed, setDismissed] =
    useState(false);

  /* ==========================================================
     FETCH ANNOUNCEMENT
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const loadAnnouncement = async () => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("announcement_bar")
          .select(
            `
              id,
              enabled,
              message,
              button_text,
              button_url,
              variant,
              dismissible,
              updated_at
            `
          )
          .eq("id", 1)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error(
            "AnnouncementBar fetch error:",
            error
          );

          setAnnouncement(null);
          setVisible(false);
          setLoading(false);

          return;
        }

        if (!data) {
          setAnnouncement(null);
          setVisible(false);
          setLoading(false);

          return;
        }

        /* ====================================================
           ENABLED CHECK
        ==================================================== */

        if (
          data.enabled === false ||
          data.enabled === "false"
        ) {
          setAnnouncement(null);
          setVisible(false);
          setLoading(false);

          return;
        }

        /* ====================================================
           CLEAN DATA
        ==================================================== */

        const cleanData = {
          ...data,

          message: String(
            data.message || ""
          ).trim(),

          button_text: String(
            data.button_text || ""
          ).trim(),

          button_url: String(
            data.button_url || ""
          ).trim(),

          variant:
            data.variant || "dark",

          dismissible:
            data.dismissible !== false,
        };

        /* ====================================================
           EMPTY MESSAGE CHECK
        ==================================================== */

        if (!cleanData.message) {
          setAnnouncement(null);
          setVisible(false);
          setLoading(false);

          return;
        }

        setAnnouncement(cleanData);
        setDismissed(false);
        setVisible(true);
        setLoading(false);

      } catch (error) {
        console.error(
          "AnnouncementBar unexpected error:",
          error
        );

        if (!mounted) return;

        setAnnouncement(null);
        setVisible(false);
        setLoading(false);
      }
    };

    loadAnnouncement();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     HIDDEN
  ========================================================== */

  if (
    loading ||
    !announcement ||
    !visible ||
    dismissed
  ) {
    return null;
  }

  /* ==========================================================
     VARIANT
  ========================================================== */

  const variant =
    variantStyles[
      announcement.variant
    ] || variantStyles.dark;

  /* ==========================================================
     BUTTON CHECK
  ========================================================== */

  const hasButton =
    Boolean(
      announcement.button_text &&
        announcement.button_url
    );

  /* ==========================================================
     BUTTON CLICK
  ========================================================== */

  const handleButtonClick = () => {
    const url =
      announcement.button_url?.trim();

    if (!url) return;

    if (
      url.startsWith("/") ||
      url.startsWith("#")
    ) {
      window.location.href = url;
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ==========================================================
     DISMISS
  ========================================================== */

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <aside
      role="region"
      aria-label="Website announcement"
      className={`
        relative
        z-50
        w-full
        border-b
        ${variant.border}
        ${variant.wrapper}
      `}
    >
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[42px]
          w-full
          max-w-[1440px]
          items-center
          justify-center
          px-12
          py-2
          sm:min-h-[44px]
          sm:px-16
          lg:px-20
        "
      >

        {/* ==================================================
            CENTER CONTENT
        ================================================== */}

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2.5
            text-center
            sm:gap-3
          "
        >

          {/* ==================================================
              ICON
          ================================================== */}

          <span
            className={`
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              ${variant.icon}
            `}
          >
            <AnnouncementIcon
              variant={
                announcement.variant
              }
            />
          </span>

          {/* ==================================================
              MESSAGE
          ================================================== */}

          <p
            className={`
              m-0
              max-w-[calc(100%-120px)]
              text-center
              text-[11px]
              font-medium
              leading-5
              tracking-[0.01em]
              sm:max-w-none
              sm:text-xs
              md:text-[13px]
              ${variant.message}
            `}
          >
            {announcement.message}
          </p>

          {/* ==================================================
              DESKTOP BUTTON
          ================================================== */}

          {hasButton && (
            <button
              type="button"
              onClick={
                handleButtonClick
              }
              className={`
                group
                hidden
                shrink-0
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1.5
                text-[10px]
                font-semibold
                tracking-wide
                transition-all
                duration-200
                hover:-translate-y-px
                sm:inline-flex
                sm:text-[11px]
                ${variant.button}
              `}
            >
              {announcement.button_text}

              <ArrowRight
                size={13}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
              />
            </button>
          )}
        </div>

        {/* ==================================================
            MOBILE BUTTON
        ================================================== */}

        {hasButton && (
          <button
            type="button"
            onClick={
              handleButtonClick
            }
            className={`
              absolute
              right-11
              flex
              h-7
              items-center
              gap-1
              rounded-full
              px-2.5
              text-[9px]
              font-semibold
              transition
              sm:hidden
              ${variant.button}
            `}
          >
            {announcement.button_text}

            <ArrowRight
              size={11}
              strokeWidth={2}
            />
          </button>
        )}

        {/* ==================================================
            CLOSE BUTTON
        ================================================== */}

        {announcement.dismissible && (
          <button
            type="button"
            onClick={
              handleDismiss
            }
            aria-label="Close announcement"
            className={`
              absolute
              right-3
              top-1/2
              flex
              h-7
              w-7
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              transition-all
              duration-200
              sm:right-5
              ${variant.close}
            `}
          >
            <X
              size={15}
              strokeWidth={2}
            />
          </button>
        )}
      </div>
    </aside>
  );
}
