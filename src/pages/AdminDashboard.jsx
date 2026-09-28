import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Plus,
  RefreshCw,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Megaphone,
  Pencil,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  MessageCircle,
  Star,
  Trash2,
  User,
  Quote,
} from "lucide-react";

import { supabase } from "../lib/supabase";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  // ==========================================================
  // ANNOUNCEMENT STATE
  // ==========================================================

  const [announcement, setAnnouncement] =
    useState(null);

  const [announcementMessage, setAnnouncementMessage] =
    useState("");

  const [announcementActive, setAnnouncementActive] =
    useState(true);

  const [announcementLoading, setAnnouncementLoading] =
    useState(true);

  const [announcementSaving, setAnnouncementSaving] =
    useState(false);

  const [announcementEditing, setAnnouncementEditing] =
    useState(false);

  const [announcementError, setAnnouncementError] =
    useState("");

  const [announcementSuccess, setAnnouncementSuccess] =
    useState("");

  // ==========================================================
  // REVIEWS STATE
  // ==========================================================

  const [reviews, setReviews] = useState([]);

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  const [reviewSaving, setReviewSaving] =
    useState(false);

  const [reviewDeleting, setReviewDeleting] =
    useState(null);

  const [reviewError, setReviewError] =
    useState("");

  const [reviewSuccess, setReviewSuccess] =
    useState("");

  const [reviewEditing, setReviewEditing] =
    useState(false);

  const [editingReviewId, setEditingReviewId] =
    useState(null);

  const [reviewForm, setReviewForm] = useState({
    customer_name: "",
    rating: 5,
    review: "",
    customer_image_url: "",
    sort_order: 0,
    enabled: true,
  });

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const {
          data,
          error: supabaseError,
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
            created_at,
            updated_at
          `)
          .order("created_at", {
            ascending: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        setProducts(data || []);
      } catch (err) {
        console.error(
          "Dashboard products error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ==========================================================
  // FETCH ANNOUNCEMENT
  // ==========================================================

  const fetchAnnouncement = useCallback(
    async () => {
      try {
        setAnnouncementLoading(true);
        setAnnouncementError("");

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("announcement_bar")
          .select(`
            id,
            enabled,
            message,
            button_text,
            button_url,
            variant,
            dismissible,
            updated_at
          `)
          .eq("id", 1)
          .maybeSingle();

        if (supabaseError) {
          throw supabaseError;
        }

        if (!data) {
          setAnnouncement(null);
          setAnnouncementMessage("");
          setAnnouncementActive(false);
          return;
        }

        setAnnouncement(data);

        setAnnouncementMessage(
          data.message || ""
        );

        setAnnouncementActive(
          data.enabled ?? true
        );
      } catch (err) {
        console.error(
          "Announcement error:",
          err
        );

        setAnnouncementError(
          err?.message ||
            "Unable to load announcement."
        );
      } finally {
        setAnnouncementLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // FETCH REVIEWS
  // ==========================================================

  const fetchReviews = useCallback(
    async () => {
      try {
        setReviewsLoading(true);
        setReviewError("");

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("reviews")
          .select(`
            id,
            customer_name,
            rating,
            review,
            customer_image_url,
            sort_order,
            enabled,
            created_at,
            updated_at
          `)
          .order("sort_order", {
            ascending: true,
          })
          .order("created_at", {
            ascending: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        setReviews(data || []);
      } catch (err) {
        console.error(
          "Reviews error:",
          err
        );

        setReviewError(
          err?.message ||
            "Unable to load reviews."
        );
      } finally {
        setReviewsLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchProducts();
    fetchAnnouncement();
    fetchReviews();
  }, [
    fetchProducts,
    fetchAnnouncement,
    fetchReviews,
  ]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href =
      "/admin/login";
  };

  // ==========================================================
  // CLOSE MOBILE SIDEBAR ON RESIZE
  // ==========================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebar(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // ==========================================================
  // PRICE FORMAT
  // ==========================================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Not set";
    }

    return `PKR ${Number(
      price
    ).toLocaleString("en-PK")}`;
  };

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    return new Date(
      date
    ).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================================
  // SAVE ANNOUNCEMENT
  // ==========================================================

  const handleSaveAnnouncement = async () => {
    const message =
      announcementMessage.trim();

    if (!message) {
      setAnnouncementError(
        "Please enter announcement text."
      );
      return;
    }

    try {
      setAnnouncementSaving(true);
      setAnnouncementError("");
      setAnnouncementSuccess("");

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("announcement_bar")
        .upsert(
          {
            id: 1,
            message,
            enabled:
              announcementActive,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        )
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setAnnouncement(data);

      setAnnouncementMessage(
        data.message || ""
      );

      setAnnouncementActive(
        data.enabled ?? true
      );

      setAnnouncementEditing(false);

      setAnnouncementSuccess(
        "Announcement updated successfully."
      );

      setTimeout(() => {
        setAnnouncementSuccess("");
      }, 3500);
    } catch (err) {
      console.error(
        "Save announcement error:",
        err
      );

      setAnnouncementError(
        err?.message ||
          "Unable to save announcement."
      );
    } finally {
      setAnnouncementSaving(false);
    }
  };

  // ==========================================================
  // TOGGLE ANNOUNCEMENT
  // ==========================================================

  const handleToggleAnnouncement =
    async () => {
      if (!announcement?.id) {
        setAnnouncementEditing(true);
        return;
      }

      try {
        setAnnouncementSaving(true);
        setAnnouncementError("");
        setAnnouncementSuccess("");

        const newStatus =
          !announcementActive;

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("announcement_bar")
          .update({
            enabled: newStatus,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", 1)
          .select()
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setAnnouncement(data);

        setAnnouncementMessage(
          data.message || ""
        );

        setAnnouncementActive(
          data.enabled ?? newStatus
        );

        setAnnouncementSuccess(
          newStatus
            ? "Announcement is now visible."
            : "Announcement has been hidden."
        );

        setTimeout(() => {
          setAnnouncementSuccess("");
        }, 3000);
      } catch (err) {
        console.error(
          "Toggle announcement error:",
          err
        );

        setAnnouncementError(
          err?.message ||
            "Unable to update announcement status."
        );
      } finally {
        setAnnouncementSaving(false);
      }
    };

  // ==========================================================
  // RESET REVIEW FORM
  // ==========================================================

  const resetReviewForm = () => {
    setReviewForm({
      customer_name: "",
      rating: 5,
      review: "",
      customer_image_url: "",
      sort_order: 0,
      enabled: true,
    });

    setReviewEditing(false);
    setEditingReviewId(null);
    setReviewError("");
  };

  // ==========================================================
  // START ADD REVIEW
  // ==========================================================

  const startAddReview = () => {
    setReviewForm({
      customer_name: "",
      rating: 5,
      review: "",
      customer_image_url: "",
      sort_order: reviews.length,
      enabled: true,
    });

    setEditingReviewId(null);
    setReviewEditing(true);
    setReviewError("");
    setReviewSuccess("");
  };

  // ==========================================================
  // START EDIT REVIEW
  // ==========================================================

  const startEditReview = (review) => {
    setReviewForm({
      customer_name:
        review.customer_name || "",
      rating:
        Number(review.rating) || 5,
      review:
        review.review || "",
      customer_image_url:
        review.customer_image_url || "",
      sort_order:
        Number(review.sort_order) || 0,
      enabled:
        review.enabled ?? true,
    });

    setEditingReviewId(review.id);
    setReviewEditing(true);
    setReviewError("");
    setReviewSuccess("");
  };

  // ==========================================================
  // SAVE REVIEW
  // ==========================================================

  const handleSaveReview = async () => {
    const customerName =
      reviewForm.customer_name.trim();

    const reviewText =
      reviewForm.review.trim();

    const rating = Math.min(
      5,
      Math.max(
        1,
        Number(reviewForm.rating) || 5
      )
    );

    if (!customerName) {
      setReviewError(
        "Please enter customer name."
      );
      return;
    }

    if (!reviewText) {
      setReviewError(
        "Please enter the customer review."
      );
      return;
    }

    try {
      setReviewSaving(true);
      setReviewError("");
      setReviewSuccess("");

      const payload = {
        customer_name: customerName,
        rating,
        review: reviewText,
        customer_image_url:
          reviewForm.customer_image_url.trim() ||
          null,
        sort_order:
          Number(reviewForm.sort_order) || 0,
        enabled:
          reviewForm.enabled,
        updated_at:
          new Date().toISOString(),
      };

      let data;
      let supabaseError;

      if (editingReviewId) {
        const response = await supabase
          .from("reviews")
          .update(payload)
          .eq("id", editingReviewId)
          .select()
          .single();

        data = response.data;
        supabaseError =
          response.error;
      } else {
        const response = await supabase
          .from("reviews")
          .insert({
            ...payload,
            created_at:
              new Date().toISOString(),
          })
          .select()
          .single();

        data = response.data;
        supabaseError =
          response.error;
      }

      if (supabaseError) {
        throw supabaseError;
      }

      if (editingReviewId) {
        setReviews((current) =>
          current.map((item) =>
            item.id === editingReviewId
              ? data
              : item
          )
        );

        setReviewSuccess(
          "Review updated successfully."
        );
      } else {
        setReviews((current) => [
          data,
          ...current,
        ]);

        setReviewSuccess(
          "Review added successfully."
        );
      }

      setReviewEditing(false);
      setEditingReviewId(null);

      setReviewForm({
        customer_name: "",
        rating: 5,
        review: "",
        customer_image_url: "",
        sort_order: 0,
        enabled: true,
      });

      setTimeout(() => {
        setReviewSuccess("");
      }, 3500);
    } catch (err) {
      console.error(
        "Save review error:",
        err
      );

      setReviewError(
        err?.message ||
          "Unable to save review."
      );
    } finally {
      setReviewSaving(false);
    }
  };

  // ==========================================================
  // DELETE REVIEW
  // ==========================================================

  const handleDeleteReview = async (
    review
  ) => {
    const confirmed =
      window.confirm(
        `Delete review from ${
          review.customer_name ||
          "this customer"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setReviewDeleting(review.id);
      setReviewError("");
      setReviewSuccess("");

      const {
        error: supabaseError,
      } = await supabase
        .from("reviews")
        .delete()
        .eq("id", review.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setReviews((current) =>
        current.filter(
          (item) =>
            item.id !== review.id
        )
      );

      if (
        editingReviewId === review.id
      ) {
        resetReviewForm();
      }

      setReviewSuccess(
        "Review deleted successfully."
      );

      setTimeout(() => {
        setReviewSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      setReviewError(
        err?.message ||
          "Unable to delete review."
      );
    } finally {
      setReviewDeleting(null);
    }
  };

  // ==========================================================
  // TOGGLE REVIEW VISIBILITY
  // ==========================================================

  const handleToggleReview = async (
    review
  ) => {
    try {
      setReviewError("");

      const newStatus =
        !review.enabled;

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("reviews")
        .update({
          enabled: newStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", review.id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setReviews((current) =>
        current.map((item) =>
          item.id === review.id
            ? data
            : item
        )
      );

      setReviewSuccess(
        newStatus
          ? "Review is now visible on the website."
          : "Review has been hidden from the website."
      );

      setTimeout(() => {
        setReviewSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Toggle review error:",
        err
      );

      setReviewError(
        err?.message ||
          "Unable to update review status."
      );
    }
  };

  // ==========================================================
  // STATS
  // ==========================================================

  const stats = useMemo(() => {
    const totalProducts =
      products.length;

    const activeProducts =
      products.filter(
        (product) =>
          product.status ===
          "active"
      ).length;

    const inactiveProducts =
      products.filter(
        (product) =>
          product.status !==
          "active"
      ).length;

    const featuredProducts =
      products.filter(
        (product) =>
          product.featured === true
      ).length;

    const categories = new Set(
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean)
    );

    const totalValue =
      products.reduce(
        (total, product) => {
          const price = Number(
            product.price
          );

          if (
            Number.isNaN(price)
          ) {
            return total;
          }

          return total + price;
        },
        0
      );

    const totalReviews =
      reviews.length;

    const publishedReviews =
      reviews.filter(
        (review) =>
          review.enabled === true
      ).length;

    const hiddenReviews =
      reviews.filter(
        (review) =>
          review.enabled !== true
      ).length;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      categories:
        categories.size,
      totalValue,
      totalReviews,
      publishedReviews,
      hiddenReviews,
    };
  }, [products, reviews]);

  // ==========================================================
  // RECENT PRODUCTS
  // ==========================================================

  const recentProducts =
    useMemo(() => {
      return products.slice(0, 6);
    }, [products]);

  // ==========================================================
  // RECENT REVIEWS
  // ==========================================================

  const recentReviews =
    useMemo(() => {
      return reviews.slice(0, 5);
    }, [reviews]);

  // ==========================================================
  // CATEGORY DATA
  // ==========================================================

  const categoryStats =
    useMemo(() => {
      const categoryMap = {};

      products.forEach(
        (product) => {
          const category =
            product.category ||
            "Uncategorized";

          if (
            !categoryMap[
              category
            ]
          ) {
            categoryMap[
              category
            ] = 0;
          }

          categoryMap[
            category
          ] += 1;
        }
      );

      return Object.entries(
        categoryMap
      )
        .map(
          ([name, count]) => ({
            name,
            count,
          })
        )
        .sort(
          (a, b) =>
            b.count -
            a.count
        )
        .slice(0, 6);
    }, [products]);

  // ==========================================================
  // SIDEBAR
  // ==========================================================

  const Sidebar = () => {
    return (
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex w-[250px] flex-col
          border-r border-slate-200
          bg-[#102438]
          text-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileSidebar
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-[76px] items-center border-b border-white/10 px-5">
          <div className="min-w-0">
            <h1 className="text-[16px] font-bold tracking-tight">
              AR Woodworks
            </h1>

            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
              Administration
            </p>
          </div>

          <button
            onClick={() =>
              setMobileSidebar(false)
            }
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">

          <div className="mb-7">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Overview
            </p>

            <Link
              to="/admin"
              onClick={() =>
                setMobileSidebar(false)
              }
              className="flex items-center gap-3 rounded-md bg-white/[0.09] px-3 py-2.5 text-[12px] font-semibold text-white"
            >
              <LayoutDashboard
                size={16}
                strokeWidth={1.8}
              />

              Dashboard
            </Link>
          </div>

          <div className="mb-7">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Catalog
            </p>

            <Link
              to="/admin/products"
              onClick={() =>
                setMobileSidebar(false)
              }
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Package
                size={16}
                strokeWidth={1.8}
              />

              Products
            </Link>

            {/* REVIEWS NOW INSIDE DASHBOARD */}
            <a
              href="#reviews-management"
              onClick={() =>
                setMobileSidebar(false)
              }
              className="mt-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              <MessageCircle
                size={16}
                strokeWidth={1.8}
              />

              Reviews
            </a>
          </div>

          <div className="mb-7">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Website
            </p>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                setMobileSidebar(false)
              }
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ExternalLink
                size={16}
                strokeWidth={1.8}
              />

              View Website
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 p-3">

          <div className="mb-2 px-3 py-3">
            <p className="text-[10px] font-semibold text-white/50">
              Store Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[10px] font-medium text-emerald-300">
                Website Live
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[12px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut
              size={16}
              strokeWidth={1.8}
            />

            Logout
          </button>
        </div>
      </aside>
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f9]">

        <div className="flex min-h-screen">

          <div className="hidden w-[250px] shrink-0 bg-[#102438] lg:block">
            <div className="h-[76px] border-b border-white/10 p-5">
              <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-2 w-20 animate-pulse rounded bg-white/5" />
            </div>
          </div>

          <div className="flex-1">

            <div className="h-[76px] border-b border-slate-200 bg-white" />

            <main className="p-5 sm:p-7 lg:p-9">

              <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-3 w-72 animate-pulse rounded bg-slate-100" />

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200 lg:grid-cols-4">

                {Array.from({
                  length: 4,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-32 animate-pulse bg-white"
                    />
                  )
                )}

              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">

                <div className="h-[440px] animate-pulse bg-white" />

                <div className="h-[440px] animate-pulse bg-white" />

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN DASHBOARD
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#14283D]">

      <Sidebar />

      {mobileSidebar && (
        <button
          aria-label="Close menu"
          onClick={() =>
            setMobileSidebar(false)
          }
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
        />
      )}

      <div className="min-h-screen lg:pl-[250px]">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-50 h-[70px] border-b border-slate-200 bg-white">

          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setMobileSidebar(true)
                }
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Admin Panel
                </p>

                <h2 className="mt-0.5 text-sm font-bold text-[#14283D]">
                  Overview
                </h2>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => {
                  fetchProducts(true);
                  fetchAnnouncement();
                  fetchReviews();
                }}
                disabled={
                  refreshing ||
                  announcementSaving ||
                  reviewsLoading
                }
                className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] sm:flex"
              >
                <ExternalLink size={13} />
                Website
              </a>

              <Link
                to="/admin/products"
                className="flex h-9 items-center gap-2 rounded-md bg-[#0789A6] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#067d96]"
              >
                <Plus size={14} />

                <span>
                  Add Product
                </span>
              </Link>

            </div>
          </div>
        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* PAGE HEADER */}

          <section className="mb-7">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0789A6]">
              Dashboard
            </p>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  Overview
                </h1>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                  Manage your products, reviews and website content from one place.
                </p>

              </div>

              <p className="text-[10px] text-slate-400">
                Connected to Supabase
              </p>

            </div>
          </section>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold text-red-700">
                    Dashboard data unavailable
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-red-600">
                    {error}
                  </p>

                </div>

                <button
                  onClick={() =>
                    fetchProducts(true)
                  }
                  className="w-fit bg-red-600 px-3 py-2 text-[10px] font-semibold text-white"
                >
                  Try Again
                </button>

              </div>
            </div>
          )}

          {/* ==================================================
              ANNOUNCEMENT MANAGEMENT
          ================================================== */}

          <section className="mb-6 border border-slate-200 bg-white">

            <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#0789A6]/15 bg-[#0789A6]/5 text-[#0789A6]">
                  <Megaphone
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#14283D]">
                    Announcement Bar
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    Manage the message displayed at the top of your website.
                  </p>
                </div>

              </div>

              {!announcementLoading && (
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                    announcementActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      announcementActive
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {announcementActive
                    ? "Visible"
                    : "Hidden"}
                </span>
              )}

            </div>

            <div className="p-4 sm:p-5">

              {announcementLoading ? (
                <div className="animate-pulse">
                  <div className="h-3 w-32 rounded bg-slate-100" />
                  <div className="mt-3 h-11 w-full rounded bg-slate-100" />
                </div>
              ) : (
                <>

                  {announcementError && (
                    <div className="mb-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3">

                      <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <p className="text-[10px] leading-4 text-red-600">
                        {announcementError}
                      </p>

                    </div>
                  )}

                  {announcementSuccess && (
                    <div className="mb-4 flex items-start gap-2 border border-emerald-200 bg-emerald-50 p-3">

                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />

                      <p className="text-[10px] leading-4 text-emerald-600">
                        {announcementSuccess}
                      </p>

                    </div>
                  )}

                  {!announcementEditing ? (
                    <div>

                      <div className="border border-slate-200 bg-slate-50/60 p-4">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          <div className="min-w-0">

                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                              Current Message
                            </p>

                            <p className="text-xs font-semibold leading-5 text-[#14283D] sm:text-sm">
                              {announcementMessage ||
                                "No announcement configured."}
                            </p>

                          </div>

                          <div className="flex shrink-0 items-center gap-2">

                            <button
                              onClick={() =>
                                setAnnouncementEditing(
                                  true
                                )
                              }
                              className="flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D]"
                            >
                              <Pencil
                                size={13}
                              />
                              Edit
                            </button>

                            <button
                              onClick={
                                handleToggleAnnouncement
                              }
                              disabled={
                                announcementSaving
                              }
                              className={`flex h-9 items-center gap-2 px-3 text-[10px] font-bold transition disabled:opacity-50 ${
                                announcementActive
                                  ? "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600"
                                  : "bg-[#0789A6] text-white hover:bg-[#067d96]"
                              }`}
                            >
                              {announcementActive ? (
                                <>
                                  <EyeOff
                                    size={13}
                                  />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye
                                    size={13}
                                  />
                                  Show
                                </>
                              )}
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  ) : (
                    <div>

                      <div>

                        <div className="mb-2 flex items-center justify-between gap-3">

                          <label
                            htmlFor="announcement-message"
                            className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                          >
                            Announcement Message
                          </label>

                          <span className="text-[9px] text-slate-400">
                            {
                              announcementMessage.length
                            }
                            /160
                          </span>

                        </div>

                        <textarea
                          id="announcement-message"
                          value={
                            announcementMessage
                          }
                          onChange={(e) => {
                            if (
                              e.target.value
                                .length <=
                              160
                            ) {
                              setAnnouncementMessage(
                                e.target.value
                              );
                            }
                          }}
                          rows={3}
                          maxLength={160}
                          placeholder="Example: Delivery all over Pakistan."
                          className="w-full resize-none border border-slate-200 bg-white px-3 py-3 text-xs font-medium leading-5 text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                        />

                      </div>

                      <div className="mt-4">

                        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Preview
                        </p>

                        <div className="overflow-hidden border border-slate-200">

                          <div className="flex min-h-[42px] items-center justify-center bg-[#14283D] px-4 py-2 text-center">

                            <div className="flex items-center justify-center gap-2">

                              <Megaphone
                                size={13}
                                className="shrink-0 text-white/70"
                              />

                              <p className="text-[10px] font-semibold leading-4 text-white sm:text-[11px]">
                                {announcementMessage ||
                                  "Your announcement will appear here."}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                      <div className="mt-4 flex flex-col gap-4 border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <p className="text-[11px] font-bold text-[#14283D]">
                            Display announcement
                          </p>

                          <p className="mt-1 text-[9px] leading-4 text-slate-400">
                            Turn this off if you temporarily don't want the bar visible.
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setAnnouncementActive(
                              (value) =>
                                !value
                            )
                          }
                          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                            announcementActive
                              ? "bg-[#0789A6]"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                              announcementActive
                                ? "left-6"
                                : "left-1"
                            }`}
                          />
                        </button>

                      </div>

                      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                        <button
                          type="button"
                          onClick={() => {
                            setAnnouncementMessage(
                              announcement?.message ||
                                ""
                            );

                            setAnnouncementActive(
                              announcement?.enabled ??
                                true
                            );

                            setAnnouncementEditing(
                              false
                            );

                            setAnnouncementError(
                              ""
                            );

                            setAnnouncementSuccess(
                              ""
                            );
                          }}
                          disabled={
                            announcementSaving
                          }
                          className="h-10 border border-slate-200 bg-white px-4 text-[10px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-[#14283D]"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleSaveAnnouncement
                          }
                          disabled={
                            announcementSaving
                          }
                          className="flex h-10 items-center justify-center gap-2 bg-[#0789A6] px-5 text-[10px] font-bold text-white transition hover:bg-[#067d96] disabled:opacity-50"
                        >
                          {announcementSaving ? (
                            <>
                              <RefreshCw
                                size={13}
                                className="animate-spin"
                              />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={13} />
                              Save Announcement
                            </>
                          )}
                        </button>

                      </div>

                    </div>
                  )}

                </>
              )}

            </div>
          </section>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section className="grid grid-cols-2 border border-slate-200 bg-white lg:grid-cols-4">

            <div className="border-b border-r border-slate-200 p-4 sm:p-5 lg:border-b-0">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Total Products
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.totalProducts}
                </p>

                <span className="text-[10px] font-medium text-slate-400">
                  Catalogue
                </span>

              </div>
            </div>

            <div className="border-b border-slate-200 p-4 sm:p-5 lg:border-b-0 lg:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Active Products
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.activeProducts}
                </p>

                <span className="text-[10px] font-medium text-emerald-600">
                  Live
                </span>

              </div>
            </div>

            <div className="border-r border-slate-200 p-4 sm:p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Reviews
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.totalReviews}
                </p>

                <span className="text-[10px] font-medium text-[#0789A6]">
                  Customer
                </span>

              </div>
            </div>

            <div className="p-4 sm:p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Published Reviews
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.publishedReviews}
                </p>

                <span className="text-[10px] font-medium text-emerald-600">
                  Visible
                </span>

              </div>
            </div>

          </section>

          {/* ==================================================
              REVIEWS MANAGEMENT
          ================================================== */}

          <section
            id="reviews-management"
            className="mt-6 scroll-mt-24 border border-slate-200 bg-white"
          >

            {/* HEADER */}

            <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#0789A6]/15 bg-[#0789A6]/5 text-[#0789A6]">
                  <MessageCircle
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-sm font-bold text-[#14283D] sm:text-base">
                      Customer Reviews
                    </h3>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                      {stats.totalReviews} Total
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    Add, edit, publish or hide customer reviews displayed on your website.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={startAddReview}
                className="flex h-10 items-center justify-center gap-2 bg-[#0789A6] px-4 text-[10px] font-bold text-white transition hover:bg-[#067d96]"
              >
                <Plus size={14} />
                Add Review
              </button>

            </div>

            {/* REVIEW ALERTS */}

            {(reviewError ||
              reviewSuccess) && (
              <div className="px-4 pt-4 sm:px-5">

                {reviewError && (
                  <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-3">

                    <AlertCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-red-500"
                    />

                    <p className="text-[10px] leading-4 text-red-600">
                      {reviewError}
                    </p>

                  </div>
                )}

                {reviewSuccess && (
                  <div className="flex items-start gap-2 border border-emerald-200 bg-emerald-50 p-3">

                    <CheckCircle2
                      size={14}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />

                    <p className="text-[10px] leading-4 text-emerald-600">
                      {reviewSuccess}
                    </p>

                  </div>
                )}

              </div>
            )}

            {/* ADD / EDIT FORM */}

            {reviewEditing && (
              <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-5">

                <div className="mb-5 flex items-center justify-between gap-3">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#0789A6]">
                      {editingReviewId
                        ? "Edit Review"
                        : "New Review"}
                    </p>

                    <h4 className="mt-1 text-sm font-bold text-[#14283D]">
                      {editingReviewId
                        ? "Update customer feedback"
                        : "Add customer feedback"}
                    </h4>

                  </div>

                  <button
                    type="button"
                    onClick={resetReviewForm}
                    className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-400 transition hover:text-[#14283D]"
                  >
                    <X size={15} />
                  </button>

                </div>

                <div className="grid gap-4 lg:grid-cols-2">

                  {/* CUSTOMER NAME */}

                  <div>

                    <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Customer Name
                    </label>

                    <div className="relative">

                      <User
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                      />

                      <input
                        type="text"
                        value={
                          reviewForm.customer_name
                        }
                        onChange={(e) =>
                          setReviewForm(
                            (current) => ({
                              ...current,
                              customer_name:
                                e.target.value,
                            })
                          )
                        }
                        placeholder="e.g. Ahmed Khan"
                        className="h-11 w-full border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                      />

                    </div>

                  </div>

                  {/* RATING */}

                  <div>

                    <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Rating
                    </label>

                    <div className="flex h-11 items-center gap-3 border border-slate-200 bg-white px-3">

                      <div className="flex items-center gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    rating:
                                      star,
                                  })
                                )
                              }
                              className="transition hover:scale-110"
                              aria-label={`${star} star`}
                            >
                              <Star
                                size={17}
                                className={
                                  star <=
                                  Number(
                                    reviewForm.rating
                                  )
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }
                              />
                            </button>
                          )
                        )}

                      </div>

                      <span className="border-l border-slate-200 pl-3 text-[10px] font-bold text-slate-500">
                        {
                          reviewForm.rating
                        }.0 / 5
                      </span>

                    </div>

                  </div>

                  {/* IMAGE URL */}

                  <div className="lg:col-span-2">

                    <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Customer Image URL
                      <span className="ml-1 font-normal normal-case tracking-normal text-slate-400">
                        optional
                      </span>
                    </label>

                    <input
                      type="url"
                      value={
                        reviewForm.customer_image_url
                      }
                      onChange={(e) =>
                        setReviewForm(
                          (current) => ({
                            ...current,
                            customer_image_url:
                              e.target.value,
                          })
                        )
                      }
                      placeholder="https://example.com/customer.jpg"
                      className="h-11 w-full border border-slate-200 bg-white px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                    />

                  </div>

                  {/* REVIEW */}

                  <div className="lg:col-span-2">

                    <div className="mb-2 flex items-center justify-between gap-3">

                      <label className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Customer Review
                      </label>

                      <span className="text-[9px] text-slate-400">
                        {
                          reviewForm.review.length
                        }
                        /500
                      </span>

                    </div>

                    <textarea
                      value={
                        reviewForm.review
                      }
                      onChange={(e) => {
                        if (
                          e.target.value
                            .length <=
                          500
                        ) {
                          setReviewForm(
                            (current) => ({
                              ...current,
                              review:
                                e.target.value,
                            })
                          );
                        }
                      }}
                      maxLength={500}
                      rows={5}
                      placeholder="Write the customer's feedback here..."
                      className="w-full resize-none border border-slate-200 bg-white px-3 py-3 text-xs font-medium leading-6 text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                    />

                  </div>

                </div>

                {/* SETTINGS */}

                <div className="mt-4 flex flex-col gap-4 border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-[11px] font-bold text-[#14283D]">
                      Display on website
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-slate-400">
                      Enable this review to make it visible in the website review section.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setReviewForm(
                        (current) => ({
                          ...current,
                          enabled:
                            !current.enabled,
                        })
                      )
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      reviewForm.enabled
                        ? "bg-[#0789A6]"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                        reviewForm.enabled
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>

                </div>

                {/* ACTIONS */}

                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      resetReviewForm
                    }
                    disabled={
                      reviewSaving
                    }
                    className="h-10 border border-slate-200 bg-white px-5 text-[10px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-[#14283D]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveReview
                    }
                    disabled={
                      reviewSaving
                    }
                    className="flex h-10 items-center justify-center gap-2 bg-[#0789A6] px-5 text-[10px] font-bold text-white transition hover:bg-[#067d96] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewSaving ? (
                      <>
                        <RefreshCw
                          size={13}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={13} />
                        {editingReviewId
                          ? "Update Review"
                          : "Add Review"}
                      </>
                    )}
                  </button>

                </div>

              </div>
            )}

            {/* REVIEWS LIST */}

            <div className="p-4 sm:p-5">

              {reviewsLoading ? (
                <div className="space-y-3">

                  {[1, 2, 3].map(
                    (item) => (
                      <div
                        key={item}
                        className="animate-pulse border border-slate-100 p-4"
                      >

                        <div className="flex gap-3">

                          <div className="h-12 w-12 rounded-full bg-slate-100" />

                          <div className="flex-1">

                            <div className="h-3 w-32 rounded bg-slate-100" />

                            <div className="mt-2 h-2 w-20 rounded bg-slate-100" />

                            <div className="mt-4 h-10 w-full rounded bg-slate-100" />

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              ) : reviews.length === 0 ? (
                <div className="border border-dashed border-slate-200 px-5 py-16 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <MessageCircle
                      size={22}
                    />
                  </div>

                  <h4 className="mt-4 text-sm font-bold text-[#14283D]">
                    No reviews yet
                  </h4>

                  <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-slate-400">
                    Add your first customer review and it will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={
                      startAddReview
                    }
                    className="mt-5 inline-flex h-9 items-center gap-2 bg-[#0789A6] px-4 text-[10px] font-bold text-white hover:bg-[#067d96]"
                  >
                    <Plus size={13} />
                    Add First Review
                  </button>

                </div>
              ) : (
                <div className="space-y-3">

                  {reviews.map(
                    (review) => {

                      const rating =
                        Math.min(
                          5,
                          Math.max(
                            0,
                            Number(
                              review.rating
                            ) || 0
                          )
                        );

                      const initials =
                        review.customer_name
                          ?.trim()
                          ?.charAt(
                            0
                          )
                          ?.toUpperCase() ||
                        "C";

                      return (
                        <div
                          key={
                            review.id
                          }
                          className="group border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(20,40,61,0.05)]"
                        >

                          <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start">

                            {/* CUSTOMER */}

                            <div className="flex min-w-0 flex-1 gap-3">

                              {review.customer_image_url ? (
                                <img
                                  src={
                                    review.customer_image_url
                                  }
                                  alt={
                                    review.customer_name ||
                                    "Customer"
                                  }
                                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
                                  onError={(
                                    e
                                  ) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#14283D] text-sm font-bold text-white">
                                  {
                                    initials
                                  }
                                </div>
                              )}

                              <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                  <p className="text-xs font-bold text-[#14283D]">
                                    {review.customer_name ||
                                      "Customer"}
                                  </p>

                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold ${
                                      review.enabled
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        review.enabled
                                          ? "bg-emerald-500"
                                          : "bg-slate-400"
                                      }`}
                                    />

                                    {review.enabled
                                      ? "Published"
                                      : "Hidden"}
                                  </span>

                                </div>

                                <div className="mt-1.5 flex flex-wrap items-center gap-2">

                                  <div className="flex items-center gap-0.5">

                                    {[1, 2, 3, 4, 5].map(
                                      (
                                        star
                                      ) => (
                                        <Star
                                          key={
                                            star
                                          }
                                          size={
                                            13
                                          }
                                          className={
                                            star <=
                                            rating
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-slate-200"
                                          }
                                        />
                                      )
                                    )}

                                  </div>

                                  <span className="text-[9px] font-bold text-slate-400">
                                    {rating.toFixed(
                                      1
                                    )}
                                  </span>

                                  <span className="text-[9px] text-slate-300">
                                    •
                                  </span>

                                  <span className="text-[9px] text-slate-400">
                                    {formatDate(
                                      review.created_at
                                    )}
                                  </span>

                                </div>

                                <div className="relative mt-4 border-l-2 border-[#079FC0]/20 pl-3">

                                  <Quote
                                    size={
                                      14
                                    }
                                    className="absolute -left-1.5 -top-2 bg-white text-[#079FC0]"
                                  />

                                  <p className="text-[11px] leading-6 text-slate-600">
                                    {review.review}
                                  </p>

                                </div>

                              </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 lg:border-0 lg:pt-0">

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleReview(
                                    review
                                  )
                                }
                                title={
                                  review.enabled
                                    ? "Hide review"
                                    : "Publish review"
                                }
                                className={`flex h-9 items-center gap-2 border px-3 text-[9px] font-bold transition ${
                                  review.enabled
                                    ? "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-red-500"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                }`}
                              >
                                {review.enabled ? (
                                  <>
                                    <EyeOff
                                      size={
                                        13
                                      }
                                    />

                                    <span className="hidden sm:inline">
                                      Hide
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Eye
                                      size={
                                        13
                                      }
                                    />

                                    <span className="hidden sm:inline">
                                      Publish
                                    </span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  startEditReview(
                                    review
                                  )
                                }
                                className="flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-[9px] font-bold text-slate-600 transition hover:border-[#079FC0]/30 hover:text-[#0789A6]"
                              >
                                <Pencil
                                  size={
                                    13
                                  }
                                />

                                <span className="hidden sm:inline">
                                  Edit
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteReview(
                                    review
                                  )
                                }
                                disabled={
                                  reviewDeleting ===
                                  review.id
                                }
                                className="flex h-9 items-center gap-2 border border-red-100 bg-white px-3 text-[9px] font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {reviewDeleting ===
                                review.id ? (
                                  <RefreshCw
                                    size={
                                      13
                                    }
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={
                                      13
                                    }
                                  />
                                )}

                                <span className="hidden sm:inline">
                                  Delete
                                </span>
                              </button>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* REVIEW FOOTER */}

            {reviews.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                <div className="flex items-center gap-4">

                  <span className="text-[9px] text-slate-400">
                    <strong className="text-[#14283D]">
                      {
                        stats.publishedReviews
                      }
                    </strong>{" "}
                    published
                  </span>

                  <span className="text-[9px] text-slate-400">
                    <strong className="text-[#14283D]">
                      {
                        stats.hiddenReviews
                      }
                    </strong>{" "}
                    hidden
                  </span>

                </div>

                <span className="text-[9px] text-slate-400">
                  Published reviews appear automatically on the website.
                </span>

              </div>
            )}

          </section>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">

            {/* PRODUCTS TABLE */}

            <div className="min-w-0 border border-slate-200 bg-white">

              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">

                <div>

                  <h3 className="text-sm font-bold text-[#14283D]">
                    Recent Products
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Latest items added to your catalogue
                  </p>

                </div>

                <Link
                  to="/admin/products"
                  className="flex items-center gap-1 text-[10px] font-bold text-[#0789A6] transition hover:text-[#056f86]"
                >
                  View all
                  <ChevronRight size={12} />
                </Link>

              </div>

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[650px]">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50/70">

                      <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Product
                      </th>

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Category
                      </th>

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Price
                      </th>

                      <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Status
                      </th>

                      <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Added
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentProducts.length === 0 ? (
                      <tr>

                        <td
                          colSpan="5"
                          className="px-5 py-20 text-center"
                        >

                          <p className="text-sm font-semibold text-[#14283D]">
                            No products yet
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Add your first product from Product Management.
                          </p>

                        </td>

                      </tr>
                    ) : (
                      recentProducts.map(
                        (product) => (
                          <tr
                            key={
                              product.id
                            }
                            className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/60"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="h-11 w-11 shrink-0 overflow-hidden border border-slate-100 bg-slate-100">

                                  {product.image_url ? (
                                    <img
                                      src={
                                        product.image_url
                                      }
                                      alt={
                                        product.title ||
                                        "Product"
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[8px] font-bold uppercase text-slate-400">
                                      No Image
                                    </div>
                                  )}

                                </div>

                                <div className="min-w-0">

                                  <p className="max-w-[220px] truncate text-xs font-bold text-[#14283D]">
                                    {product.title ||
                                      "Untitled Product"}
                                  </p>

                                  {product.featured && (
                                    <p className="mt-1 text-[9px] font-semibold text-[#0789A6]">
                                      Featured Product
                                    </p>
                                  )}

                                </div>

                              </div>

                            </td>

                            <td className="px-4 py-4">

                              <span className="text-[11px] font-medium text-slate-500">
                                {product.category ||
                                  "Uncategorized"}
                              </span>

                            </td>

                            <td className="px-4 py-4">

                              <span className="text-[11px] font-bold text-[#14283D]">
                                {formatPrice(
                                  product.price
                                )}
                              </span>

                            </td>

                            <td className="px-4 py-4">

                              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold">

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    product.status ===
                                    "active"
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  }`}
                                />

                                <span
                                  className={
                                    product.status ===
                                    "active"
                                      ? "text-emerald-600"
                                      : "text-red-500"
                                  }
                                >
                                  {product.status ===
                                  "active"
                                    ? "Active"
                                    : "Inactive"}
                                </span>

                              </span>

                            </td>

                            <td className="px-4 py-4 text-right">

                              <span className="text-[10px] text-slate-400">
                                {formatDate(
                                  product.created_at
                                )}
                              </span>

                            </td>

                          </tr>
                        )
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* MOBILE PRODUCTS */}

              <div className="divide-y divide-slate-100 md:hidden">

                {recentProducts.length === 0 ? (
                  <div className="px-5 py-16 text-center">

                    <p className="text-sm font-semibold text-[#14283D]">
                      No products yet
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Add your first product.
                    </p>

                  </div>
                ) : (
                  recentProducts.map(
                    (product) => (
                      <div
                        key={
                          product.id
                        }
                        className="flex gap-3 px-4 py-4"
                      >

                        <div className="h-14 w-14 shrink-0 overflow-hidden border border-slate-100 bg-slate-100">

                          {product.image_url ? (
                            <img
                              src={
                                product.image_url
                              }
                              alt={
                                product.title ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-slate-400">
                              NO IMAGE
                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <p className="truncate text-xs font-bold text-[#14283D]">
                              {product.title ||
                                "Untitled Product"}
                            </p>

                            <MoreHorizontal
                              size={15}
                              className="shrink-0 text-slate-300"
                            />

                          </div>

                          <p className="mt-1 truncate text-[10px] text-slate-400">
                            {product.category ||
                              "Uncategorized"}
                          </p>

                          <div className="mt-2 flex items-center justify-between">

                            <span className="text-[10px] font-bold text-[#14283D]">
                              {formatPrice(
                                product.price
                              )}
                            </span>

                            <span className="flex items-center gap-1.5 text-[9px] font-semibold">

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  product.status ===
                                  "active"
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />

                              <span
                                className={
                                  product.status ===
                                  "active"
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                }
                              >
                                {product.status ===
                                "active"
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

              <div className="border-t border-slate-100 px-4 py-3 sm:px-5">

                <Link
                  to="/admin/products"
                  className="text-[10px] font-bold text-[#0789A6] hover:text-[#056f86]"
                >
                  Open Product Management →
                </Link>

              </div>

            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-6">

              {/* QUICK ACTIONS */}

              <div className="border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-5 py-4">

                  <h3 className="text-sm font-bold text-[#14283D]">
                    Quick Actions
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Common administration tasks
                  </p>

                </div>

                <div className="divide-y divide-slate-100">

                  <Link
                    to="/admin/products"
                    className="group flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-[#0789A6]">
                        <Plus size={14} />
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-[#14283D]">
                          Add Product
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Create a new catalogue item
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={14}
                      className="text-slate-300"
                    />

                  </Link>

                  <Link
                    to="/admin/products"
                    className="group flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-[#14283D]">
                        <Package size={14} />
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-[#14283D]">
                          Manage Products
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Edit or remove products
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={14}
                      className="text-slate-300"
                    />

                  </Link>

                  <a
                    href="#reviews-management"
                    className="group flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-[#0789A6]">
                        <MessageCircle size={14} />
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-[#14283D]">
                          Manage Reviews
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Add, edit or hide reviews
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={14}
                      className="text-slate-300"
                    />

                  </a>

                  <button
                    onClick={() =>
                      setAnnouncementEditing(
                        true
                      )
                    }
                    className="group flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-[#14283D]">
                        <Megaphone
                          size={14}
                        />
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-[#14283D]">
                          Announcement
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Update website announcement
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={14}
                      className="text-slate-300"
                    />

                  </button>

                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-[#14283D]">
                        <ExternalLink size={14} />
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-[#14283D]">
                          View Website
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Open live storefront
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={14}
                      className="text-slate-300"
                    />

                  </a>

                </div>
              </div>

              {/* REVIEW SUMMARY */}

              <div className="border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-5 py-4">

                  <h3 className="text-sm font-bold text-[#14283D]">
                    Review Overview
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Customer feedback status
                  </p>

                </div>

                <div className="p-5">

                  <div className="grid grid-cols-2 gap-3">

                    <div className="border border-slate-100 bg-slate-50/60 p-4">

                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Total
                      </p>

                      <p className="mt-2 text-2xl font-bold text-[#14283D]">
                        {
                          stats.totalReviews
                        }
                      </p>

                    </div>

                    <div className="border border-emerald-100 bg-emerald-50/50 p-4">

                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-500">
                        Published
                      </p>

                      <p className="mt-2 text-2xl font-bold text-emerald-700">
                        {
                          stats.publishedReviews
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={startAddReview}
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 border border-[#0789A6]/20 bg-[#0789A6]/5 text-[10px] font-bold text-[#0789A6] transition hover:bg-[#0789A6]/10"
                  >
                    <Plus size={13} />
                    Add Customer Review
                  </button>

                </div>

              </div>

              {/* CATEGORY OVERVIEW */}

              <div className="border border-slate-200 bg-white">

                <div className="border-b border-slate-200 px-5 py-4">

                  <h3 className="text-sm font-bold text-[#14283D]">
                    Category Overview
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Product distribution
                  </p>

                </div>

                <div className="p-5">

                  {categoryStats.length === 0 ? (
                    <p className="py-8 text-center text-[10px] text-slate-400">
                      No category data available.
                    </p>
                  ) : (
                    <div className="space-y-5">

                      {categoryStats.map(
                        (category) => {

                          const percentage =
                            stats.totalProducts >
                            0
                              ? Math.round(
                                  (category.count /
                                    stats.totalProducts) *
                                    100
                                )
                              : 0;

                          return (
                            <div
                              key={
                                category.name
                              }
                            >

                              <div className="mb-2 flex items-center justify-between gap-3">

                                <span className="min-w-0 truncate text-[10px] font-semibold text-slate-600">
                                  {
                                    category.name
                                  }
                                </span>

                                <span className="text-[10px] font-bold text-[#14283D]">
                                  {
                                    category.count
                                  }
                                </span>

                              </div>

                              <div className="h-1 bg-slate-100">

                                <div
                                  className="h-full bg-[#0789A6] transition-all duration-700"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />

                              </div>

                              <p className="mt-1 text-right text-[8px] text-slate-400">
                                {
                                  percentage
                                }
                                %
                              </p>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>
              </div>

              {/* STORE STATUS */}

              <div className="border border-slate-200 bg-white p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-100 bg-emerald-50 text-emerald-600">
                    <CheckCircle2
                      size={17}
                    />
                  </div>

                  <div>

                    <p className="text-[11px] font-bold text-[#14283D]">
                      Website Status
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      <span className="text-[10px] font-semibold text-emerald-600">
                        Live & Online
                      </span>

                    </div>

                    <p className="mt-2 text-[9px] leading-4 text-slate-400">
                      Your storefront is currently connected to the administration system.
                    </p>

                  </div>

                </div>
              </div>

            </div>

          </section>

          {/* ==================================================
              BOTTOM INFORMATION
          ================================================== */}

          <section className="mt-6 grid border border-slate-200 bg-white sm:grid-cols-3">

            <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Active Products
              </p>

              <p className="mt-2 text-sm font-bold text-[#14283D]">
                {
                  stats.activeProducts
                }
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                Currently visible on website
              </p>

            </div>

            <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Catalogue Value
              </p>

              <p className="mt-2 truncate text-sm font-bold text-[#14283D]">
                {stats.totalValue > 0
                  ? `PKR ${stats.totalValue.toLocaleString(
                      "en-PK"
                    )}`
                  : "No prices added"}
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                Combined product prices
              </p>

            </div>

            <div className="p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                System
              </p>

              <div className="mt-2 flex items-center gap-2">

                <Clock3
                  size={13}
                  className="text-slate-400"
                />

                <p className="text-[10px] font-semibold text-slate-500">
                  Supabase Connected
                </p>

              </div>

              <p className="mt-1 text-[9px] text-slate-400">
                Products, reviews and website content are synced automatically.
              </p>

            </div>

          </section>

          {/* FOOTER */}

          <footer className="mt-8 border-t border-slate-200 py-5">

            <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">

              <p className="text-[9px] font-medium text-slate-400">
                © {new Date().getFullYear()} AR Woodworks
              </p>

              <p className="text-[9px] text-slate-400">
                Administration Panel
              </p>

            </div>

          </footer>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;