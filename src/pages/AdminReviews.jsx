import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Edit3,
  MessageSquareQuote,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  User,
  X,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";


// ============================================================
// CONSTANTS
// ============================================================

const emptyForm = {
  customer_name: "",
  rating: 5,
  review: "",
  customer_image_url: "",
  enabled: true,
  sort_order: 0,
};


// ============================================================
// STAR COMPONENT
// ============================================================

function Stars({ rating = 5, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Number(rating);

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={
              interactive
                ? "rounded p-0.5 transition hover:scale-110"
                : "p-0"
            }
          >
            <Star
              size={size}
              className={
                active
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}


// ============================================================
// ADMIN REVIEWS
// ============================================================

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH REVIEWS
  // ==========================================================

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: supabaseError } = await supabase
        .from("reviews")
        .select(`
          id,
          customer_name,
          rating,
          review,
          customer_image_url,
          enabled,
          sort_order,
          created_at,
          updated_at
        `)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("SUPABASE REVIEWS ERROR:", supabaseError);
        throw supabaseError;
      }

      setReviews(data || []);
    } catch (err) {
      console.error("Fetch reviews error:", err);

      setError(
        err?.message || "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);


  // ==========================================================
  // STATS
  // ==========================================================

  const stats = useMemo(() => {
    const total = reviews.length;

    const active = reviews.filter(
      (item) => item.enabled
    ).length;

    const inactive = reviews.filter(
      (item) => !item.enabled
    ).length;

    const average =
      total > 0
        ? reviews.reduce(
            (sum, item) => sum + Number(item.rating || 0),
            0
          ) / total
        : 0;

    return {
      total,
      active,
      inactive,
      average: average.toFixed(1),
    };
  }, [reviews]);


  // ==========================================================
  // FORM RESET
  // ==========================================================

  const resetForm = () => {
    const nextOrder =
      reviews.length > 0
        ? Math.max(
            ...reviews.map((item) =>
              Number(item.sort_order || 0)
            )
          ) + 1
        : 0;

    setForm({
      ...emptyForm,
      sort_order: nextOrder,
    });

    setEditingReview(null);
    setShowForm(false);

    setMessage("");
    setError("");
  };


  // ==========================================================
  // OPEN ADD
  // ==========================================================

  const handleAdd = () => {
    const nextOrder =
      reviews.length > 0
        ? Math.max(
            ...reviews.map((item) =>
              Number(item.sort_order || 0)
            )
          ) + 1
        : 0;

    setForm({
      ...emptyForm,
      sort_order: nextOrder,
    });

    setEditingReview(null);
    setShowForm(true);

    setMessage("");
    setError("");
  };


  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const handleEdit = (item) => {
    setEditingReview(item);

    setForm({
      customer_name: item.customer_name || "",
      rating: Number(item.rating || 5),
      review: item.review || "",
      customer_image_url: item.customer_image_url || "",
      enabled: item.enabled ?? true,
      sort_order: Number(item.sort_order || 0),
    });

    setShowForm(true);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  // ==========================================================
  // SAVE REVIEW
  // ==========================================================

  const handleSave = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.customer_name.trim()) {
      setError("Please enter customer name.");
      return;
    }

    if (!form.review.trim()) {
      setError("Please enter review text.");
      return;
    }

    if (
      Number(form.rating) < 1 ||
      Number(form.rating) > 5
    ) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        customer_name: form.customer_name.trim(),
        rating: Number(form.rating),
        review: form.review.trim(),
        customer_image_url:
          form.customer_image_url.trim() || null,
        enabled: Boolean(form.enabled),
        sort_order: Number(form.sort_order || 0),
        updated_at: new Date().toISOString(),
      };


      // UPDATE
      if (editingReview) {
        const { error: updateError } = await supabase
          .from("reviews")
          .update(payload)
          .eq("id", editingReview.id);

        if (updateError) {
          throw updateError;
        }

        setMessage("Review updated successfully.");
      }

      // INSERT
      else {
        const { error: insertError } = await supabase
          .from("reviews")
          .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setMessage("Review added successfully.");
      }

      await fetchReviews();

      setShowForm(false);
      setEditingReview(null);
      setForm(emptyForm);

    } catch (err) {
      console.error("Save review error:", err);

      setError(
        err?.message || "Unable to save review."
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { error: deleteError } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      setReviews((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setMessage("Review deleted successfully.");

    } catch (err) {
      console.error("Delete review error:", err);

      setError(
        err?.message || "Unable to delete review."
      );
    }
  };


  // ==========================================================
  // ENABLE / DISABLE
  // ==========================================================

  const toggleReview = async (item) => {
    try {
      setError("");

      const newValue = !item.enabled;

      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          enabled: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updateError) {
        throw updateError;
      }

      setReviews((prev) =>
        prev.map((review) =>
          review.id === item.id
            ? {
                ...review,
                enabled: newValue,
              }
            : review
        )
      );

      setMessage(
        newValue
          ? "Review is now visible on website."
          : "Review hidden from website."
      );

    } catch (err) {
      console.error("Toggle review error:", err);

      setError(
        err?.message || "Unable to update review."
      );
    }
  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="mt-6 h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">

      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">

            <Link
              to="/admin"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
                Customer Reviews
              </h1>

              <p className="truncate text-xs text-slate-500 sm:text-sm">
                Manage reviews displayed on your website
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#14283D] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d1d2e] active:scale-[0.98] sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">
              Add Review
            </span>
            <span className="sm:hidden">
              Add
            </span>
          </button>
        </div>
      </header>


      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span className="break-words">
              {error}
            </span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}


        {/* ====================================================
            STATS
        ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<MessageSquareQuote size={19} />}
            label="Total Reviews"
            value={stats.total}
          />

          <StatCard
            icon={<Eye size={19} />}
            label="Visible"
            value={stats.active}
          />

          <StatCard
            icon={<EyeOff size={19} />}
            label="Hidden"
            value={stats.inactive}
          />

          <StatCard
            icon={
              <Star
                size={19}
                className="fill-amber-400 text-amber-400"
              />
            }
            label="Average Rating"
            value={stats.average}
          />

        </div>


        {/* ====================================================
            FORM
        ==================================================== */}

        {showForm && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

              <div>
                <h2 className="font-bold text-slate-900">
                  {editingReview
                    ? "Edit Review"
                    : "Add New Review"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  This review can be displayed on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={handleSave}
              className="p-5 sm:p-6"
            >

              <div className="grid gap-5 lg:grid-cols-2">

                {/* CUSTOMER NAME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(e) =>
                        updateForm(
                          "customer_name",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Ahmed Khan"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14283D] focus:ring-2 focus:ring-[#14283D]/10"
                    />
                  </div>
                </div>


                {/* RATING */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Rating
                  </label>

                  <div className="flex h-[46px] items-center rounded-xl border border-slate-200 px-3">
                    <Stars
                      rating={form.rating}
                      size={22}
                      interactive
                      onChange={(value) =>
                        updateForm("rating", value)
                      }
                    />

                    <span className="ml-3 text-sm font-semibold text-slate-600">
                      {form.rating}/5
                    </span>
                  </div>
                </div>


                {/* REVIEW */}

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Review
                  </label>

                  <textarea
                    rows={5}
                    value={form.review}
                    onChange={(e) =>
                      updateForm(
                        "review",
                        e.target.value
                      )
                    }
                    placeholder="Write customer's review..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14283D] focus:ring-2 focus:ring-[#14283D]/10"
                  />

                  <div className="mt-1 text-right text-xs text-slate-400">
                    {form.review.length} characters
                  </div>
                </div>


                {/* IMAGE URL */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Image URL
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="url"
                    value={form.customer_image_url}
                    onChange={(e) =>
                      updateForm(
                        "customer_image_url",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14283D] focus:ring-2 focus:ring-[#14283D]/10"
                  />
                </div>


                {/* SORT ORDER */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) =>
                      updateForm(
                        "sort_order",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#14283D] focus:ring-2 focus:ring-[#14283D]/10"
                  />
                </div>


                {/* ENABLED */}

                <div className="lg:col-span-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Show on Website
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Disabled reviews will remain in the
                        admin panel but won't appear publicly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateForm(
                          "enabled",
                          !form.enabled
                        )
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        form.enabled
                          ? "bg-[#14283D]"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          form.enabled
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>

                  </label>
                </div>

              </div>


              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#14283D] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d1d2e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      {editingReview
                        ? "Update Review"
                        : "Save Review"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        )}


        {/* ====================================================
            REVIEWS LIST
        ==================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <h2 className="font-bold text-slate-900">
                All Reviews
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Manage what customers see on your website.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchReviews}
              className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

          </div>


          {reviews.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <MessageSquareQuote size={25} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No reviews yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Add your first customer review and it will
                appear here.
              </p>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#14283D] px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={17} />
                Add First Review
              </button>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {reviews.map((item) => (
                <div
                  key={item.id}
                  className="p-5 transition hover:bg-slate-50/60 sm:p-6"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* LEFT */}

                    <div className="flex min-w-0 gap-4">

                      {/* IMAGE / INITIAL */}

                      <div className="shrink-0">

                        {item.customer_image_url ? (
                          <img
                            src={item.customer_image_url}
                            alt={item.customer_name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14283D] text-sm font-bold text-white">
                            {item.customer_name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>
                        )}

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

                          <h3 className="font-bold text-slate-900">
                            {item.customer_name}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              item.enabled
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.enabled
                              ? "Visible"
                              : "Hidden"}
                          </span>

                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <Stars
                            rating={item.rating}
                            size={15}
                          />

                          <span className="text-xs font-semibold text-slate-500">
                            {item.rating}/5
                          </span>
                        </div>

                        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">
                          “{item.review}”
                        </p>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-4 lg:border-0 lg:pt-0">

                      <button
                        type="button"
                        onClick={() =>
                          toggleReview(item)
                        }
                        title={
                          item.enabled
                            ? "Hide review"
                            : "Show review"
                        }
                        className={`flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition ${
                          item.enabled
                            ? "border border-slate-200 text-slate-600 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {item.enabled ? (
                          <>
                            <EyeOff size={16} />
                            <span className="hidden sm:inline">
                              Hide
                            </span>
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            <span className="hidden sm:inline">
                              Show
                            </span>
                          </>
                        )}
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        <Edit3 size={16} />
                        <span className="hidden sm:inline">
                          Edit
                        </span>
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="flex h-10 items-center gap-2 rounded-xl border border-red-100 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">
                          Delete
                        </span>
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>

        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

    </div>
  );
}