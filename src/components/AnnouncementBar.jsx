import React, { useEffect, useRef, useState } from "react";
import { Megaphone } from "lucide-react";

import { supabase } from "../lib/supabase";

/* ============================================================
   ANNOUNCEMENT BAR
   AR WOODWORKS

   - Fixed height
   - Simple & professional
   - No animations
   - No progress line
   - No close / X button
   - Customer cannot dismiss the bar
   - Admin controls visibility
   - Multiple announcements rotate automatically
   - Navbar dropdown stays ABOVE announcement bar
============================================================ */

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);

  /* ============================================================
     FETCH ANNOUNCEMENTS
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    const fetchAnnouncements = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("announcement_bar")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!mounted) return;

        /* ======================================================
           ADMIN DISABLED
        ====================================================== */

        if (!data || data.enabled !== true) {
          setAnnouncements([]);
          setLoading(false);
          return;
        }

        let items = [];

        /* ======================================================
           MULTIPLE ANNOUNCEMENTS
        ====================================================== */

        if (Array.isArray(data.announcements)) {
          items = data.announcements;
        }

        /* ======================================================
           OLD MESSAGE SUPPORT
        ====================================================== */

        if (
          items.length === 0 &&
          typeof data.message === "string" &&
          data.message.trim() !== ""
        ) {
          items = [
            {
              text: data.message.trim(),
              enabled: true,
              order: 1,
            },
          ];
        }

        /* ======================================================
           ONLY ENABLED ANNOUNCEMENTS
        ====================================================== */

        items = items.filter((item) => {
          if (typeof item === "string") {
            return item.trim() !== "";
          }

          return (
            item &&
            item.enabled !== false &&
            typeof item.text === "string" &&
            item.text.trim() !== ""
          );
        });

        /* ======================================================
           NORMALIZE
        ====================================================== */

        items = items.map((item, index) => {
          if (typeof item === "string") {
            return {
              text: item.trim(),
              enabled: true,
              order: index + 1,
            };
          }

          return {
            ...item,
            text: item.text.trim(),
            enabled: item.enabled !== false,
            order:
              Number.isFinite(Number(item.order))
                ? Number(item.order)
                : index + 1,
          };
        });

        /* ======================================================
           SORT BY ADMIN ORDER
        ====================================================== */

        items.sort((a, b) => a.order - b.order);

        if (mounted) {
          setAnnouncements(items);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Announcement bar error:", error);

        if (mounted) {
          setAnnouncements([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     AUTO ROTATION
     
     Every 4 seconds the announcement changes.
     No animation is applied.
  ============================================================ */

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (announcements.length <= 1) {
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % announcements.length;
      });
    }, 4000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [announcements.length]);

  /* ============================================================
     LOADING / EMPTY
  ============================================================ */

  if (loading || announcements.length === 0) {
    return null;
  }

  /* ============================================================
     CURRENT ANNOUNCEMENT
  ============================================================ */

  const currentAnnouncement = announcements[activeIndex];

  if (!currentAnnouncement) {
    return null;
  }

  /* ============================================================
     MAIN BAR
  ============================================================ */

  return (
    <div
      className="
        relative
        z-[20]
        h-[42px]
        w-full
        overflow-hidden
        border-b
        border-[#B9E7EF]
        bg-[#EAF8FA]
        text-[#14283D]
        fixed
        sm:h-[44px]
      "
    >
      {/* ======================================================
          FIXED HEIGHT CONTENT
      ====================================================== */}

      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-7xl
          items-center
          justify-center
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2.5
            overflow-hidden
            text-center
            sm:gap-3
          "
        >
          {/* ==================================================
              ICON
          ================================================== */}

          <span
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#079FC0]
              text-white
              sm:h-8
              sm:w-8
            "
          >
            <Megaphone
              size={14}
              strokeWidth={2.5}
              className="sm:h-4 sm:w-4"
            />
          </span>

          {/* ==================================================
              TEXT
              
              Text stays on one line.
              Bar height never changes.
          ================================================== */}

          <p
            className="
              min-w-0
              max-w-[calc(100%-42px)]
              truncate
              text-[11px]
              font-semibold
              leading-none
              tracking-wide
              text-[#14283D]
              sm:max-w-none
              sm:text-xs
              md:text-sm
            "
          >
            {currentAnnouncement.text}
          </p>
        </div>
      </div>
    </div>
  );
}
