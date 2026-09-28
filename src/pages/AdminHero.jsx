import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Eye,
  EyeOff,
  ImagePlus,
  Monitor,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Smartphone,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_BUCKET = "product-images";

const emptyForm = {
  category: "",
  title_line1: "",
  title_line2: "",
  description: "",

  desktop_image_url: "",
  mobile_image_url: "",

  button_text: "Shop Now",
  button_url: "/products",

  sort_order: 0,
  enabled: true,

  // Database column
  animation_duration: 4500,
};

// ============================================================
// ADMIN HERO
// ============================================================

const AdminHero = () => {
  const [slides, setSlides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);

  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobilePreview, setMobilePreview] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH SLIDES
  // ==========================================================

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: supabaseError } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        });

      if (supabaseError) {
        throw supabaseError;
      }

      setSlides(data || []);
    } catch (err) {
      console.error("Hero slides fetch error:", err);

      setError(
        err?.message ||
          "Unable to load hero slides."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = useCallback(() => {
    const nextOrder =
      slides.length > 0
        ? Math.max(
            ...slides.map(
              (slide) =>
                Number(slide.sort_order) || 0
            )
          ) + 1
        : 0;

    setForm({
      ...emptyForm,
      sort_order: nextOrder,
    });

    setDesktopFile(null);
    setMobileFile(null);

    setDesktopPreview("");
    setMobilePreview("");

    setEditingSlide(null);
  }, [slides]);

  // ==========================================================
  // ADD
  // ==========================================================

  const handleAdd = () => {
    setMessage("");
    setError("");

    resetForm();
    setShowForm(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (slide) => {
    setMessage("");
    setError("");

    setEditingSlide(slide);

    setForm({
      category: slide.category || "",

      title_line1:
        slide.title_line1 || "",

      title_line2:
        slide.title_line2 || "",

      description:
        slide.description || "",

      desktop_image_url:
        slide.desktop_image_url || "",

      mobile_image_url:
        slide.mobile_image_url || "",

      button_text:
        slide.button_text || "Shop Now",

      button_url:
        slide.button_url || "/products",

      sort_order:
        Number(slide.sort_order) || 0,

      enabled:
        slide.enabled ?? true,

      animation_duration:
        Number(slide.animation_duration) ||
        4500,
    });

    setDesktopFile(null);
    setMobileFile(null);

    setDesktopPreview(
      slide.desktop_image_url || ""
    );

    setMobilePreview(
      slide.mobile_image_url || ""
    );

    setShowForm(true);
  };

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const handleCloseForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
    setError("");
  };

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================================
  // IMAGE VALIDATION
  // ==========================================================

  const validateImage = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      return false;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(
        "Image size must be less than 8MB."
      );

      return false;
    }

    return true;
  };

  // ==========================================================
  // DESKTOP IMAGE
  // ==========================================================

  const handleDesktopImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    setError("");

    if (
      desktopPreview &&
      desktopPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        desktopPreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setDesktopFile(file);
    setDesktopPreview(previewUrl);
  };

  // ==========================================================
  // MOBILE IMAGE
  // ==========================================================

  const handleMobileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    setError("");

    if (
      mobilePreview &&
      mobilePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        mobilePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setMobileFile(file);
    setMobilePreview(previewUrl);
  };

  // ==========================================================
  // CLEAN PREVIEWS
  // ==========================================================

  useEffect(() => {
    return () => {
      if (
        desktopPreview &&
        desktopPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          desktopPreview
        );
      }

      if (
        mobilePreview &&
        mobilePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          mobilePreview
        );
      }
    };
  }, [desktopPreview, mobilePreview]);

  // ==========================================================
  // UPLOAD IMAGE
  // ==========================================================

  const uploadImage = async (
    file,
    folder
  ) => {
    if (!file) return null;

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(
        fileName,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type || "image/jpeg",
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data,
      error: publicUrlError,
    } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    if (
      publicUrlError ||
      !data?.publicUrl
    ) {
      throw new Error(
        "Unable to generate public image URL."
      );
    }

    return {
      url: data.publicUrl,
      path: fileName,
    };
  };

  // ==========================================================
  // GET STORAGE PATH
  // ==========================================================

  const getStoragePathFromUrl = (
    url
  ) => {
    if (!url) return null;

    const marker =
      `/storage/v1/object/public/${STORAGE_BUCKET}/`;

    const index =
      url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      url.slice(
        index + marker.length
      )
    );
  };

  // ==========================================================
  // DELETE STORAGE IMAGE
  // ==========================================================

  const deleteStorageImage = async (
    url
  ) => {
    const path =
      getStoragePathFromUrl(url);

    if (!path) return;

    const {
      error: storageError,
    } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (storageError) {
      console.warn(
        "Storage delete warning:",
        storageError
      );
    }
  };

  // ==========================================================
  // DELETE STORAGE PATH
  // ==========================================================

  const deleteStoragePath = async (
    path
  ) => {
    if (!path) return;

    const {
      error: storageError,
    } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (storageError) {
      console.warn(
        "Rollback storage delete warning:",
        storageError
      );
    }
  };

  // ==========================================================
  // SAVE SLIDE
  // ==========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!form.category.trim()) {
      setError(
        "Please enter a category label."
      );
      return;
    }

    if (
      !form.title_line1.trim() ||
      !form.title_line2.trim()
    ) {
      setError(
        "Please enter both heading lines."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Please enter a slide description."
      );
      return;
    }

    if (
      !editingSlide &&
      !desktopFile
    ) {
      setError(
        "Please select a desktop image."
      );
      return;
    }

    if (
      editingSlide &&
      !desktopFile &&
      !form.desktop_image_url
    ) {
      setError(
        "Please provide a desktop image."
      );
      return;
    }

    const duration = Number(
      form.animation_duration
    );

    if (
      !Number.isFinite(duration) ||
      duration < 2000
    ) {
      setError(
        "Display time must be at least 2 seconds."
      );
      return;
    }

    try {
      setSaving(true);

      let desktopImageUrl =
        form.desktop_image_url || "";

      let mobileImageUrl =
        form.mobile_image_url || "";

      const oldDesktopImage =
        editingSlide?.desktop_image_url ||
        "";

      const oldMobileImage =
        editingSlide?.mobile_image_url ||
        "";

      const uploadedFiles = [];

      // ------------------------------------------------------
      // DESKTOP UPLOAD
      // ------------------------------------------------------

      if (desktopFile) {
        const uploadedDesktop =
          await uploadImage(
            desktopFile,
            "hero/desktop"
          );

        desktopImageUrl =
          uploadedDesktop.url;

        uploadedFiles.push(
          uploadedDesktop.path
        );
      }

      // ------------------------------------------------------
      // MOBILE UPLOAD
      // ------------------------------------------------------

      if (mobileFile) {
        const uploadedMobile =
          await uploadImage(
            mobileFile,
            "hero/mobile"
          );

        mobileImageUrl =
          uploadedMobile.url;

        uploadedFiles.push(
          uploadedMobile.path
        );
      }

      // ------------------------------------------------------
      // MOBILE FALLBACK
      // ------------------------------------------------------

      if (!mobileImageUrl) {
        mobileImageUrl =
          desktopImageUrl;
      }

      // ------------------------------------------------------
      // DATABASE PAYLOAD
      // ------------------------------------------------------

      const payload = {
        category:
          form.category.trim(),

        title_line1:
          form.title_line1.trim(),

        title_line2:
          form.title_line2.trim(),

        description:
          form.description.trim(),

        desktop_image_url:
          desktopImageUrl,

        mobile_image_url:
          mobileImageUrl,

        button_text:
          form.button_text.trim() ||
          "Shop Now",

        button_url:
          form.button_url.trim() ||
          "/products",

        sort_order:
          Math.max(
            0,
            Number(form.sort_order) || 0
          ),

        enabled:
          Boolean(form.enabled),

        animation_duration:
          Math.max(
            2000,
            duration
          ),

        updated_at:
          new Date().toISOString(),
      };

      // ======================================================
      // UPDATE
      // ======================================================

      if (editingSlide) {
        const {
          data,
          error: updateError,
        } = await supabase
          .from("hero_slides")
          .update(payload)
          .eq(
            "id",
            editingSlide.id
          )
          .select()
          .single();

        if (updateError) {
          for (const path of uploadedFiles) {
            await deleteStoragePath(path);
          }

          throw updateError;
        }
        

        // ----------------------------------------------------
        // DELETE OLD DESKTOP IMAGE
        // ----------------------------------------------------

        if (
          desktopFile &&
          oldDesktopImage &&
          oldDesktopImage !==
            desktopImageUrl
        ) {
          await deleteStorageImage(
            oldDesktopImage
          );
        }

        // ----------------------------------------------------
        // DELETE OLD MOBILE IMAGE
        // ----------------------------------------------------

        if (
          mobileFile &&
          oldMobileImage &&
          oldMobileImage !==
            mobileImageUrl &&
          oldMobileImage !==
            oldDesktopImage
        ) {
          await deleteStorageImage(
            oldMobileImage
          );
        }

        setSlides((prev) =>
          prev
            .map((slide) =>
              slide.id ===
              editingSlide.id
                ? data
                : slide
            )
            .sort(
              (a, b) =>
                Number(
                  a.sort_order
                ) -
                Number(
                  b.sort_order
                )
            )
        );

        setMessage(
          "Hero slide updated successfully."
        );
      }

      // ======================================================
      // INSERT
      // ======================================================

      else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("hero_slides")
          .insert(payload)
          .select()
          .single();

        if (insertError) {
          for (const path of uploadedFiles) {
            await deleteStoragePath(path);
          }

          throw insertError;
        }

        setSlides((prev) =>
          [
            ...prev,
            data,
          ].sort(
            (a, b) =>
              Number(
                a.sort_order
              ) -
              Number(
                b.sort_order
              )
          )
        );

        setMessage(
          "Hero slide added successfully."
        );
      }

      setShowForm(false);
      resetForm();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Save hero slide error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save hero slide."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE SLIDE
  // ==========================================================

  const handleDelete = async (
    slide
  ) => {
    const title =
      `${slide.title_line1 || ""} ${
        slide.title_line2 || ""
      }`.trim();

    const confirmed =
      window.confirm(
        `Delete "${
          title ||
          "this hero slide"
        }"?`
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const {
        error: deleteError,
      } = await supabase
        .from("hero_slides")
        .delete()
        .eq(
          "id",
          slide.id
        );

      if (deleteError) {
        throw deleteError;
      }

      // Desktop
      if (slide.desktop_image_url) {
        await deleteStorageImage(
          slide.desktop_image_url
        );
      }

      // Mobile only if separate
      if (
        slide.mobile_image_url &&
        slide.mobile_image_url !==
          slide.desktop_image_url
      ) {
        await deleteStorageImage(
          slide.mobile_image_url
        );
      }

      setSlides((prev) =>
        prev.filter(
          (item) =>
            item.id !== slide.id
        )
      );

      setMessage(
        "Hero slide deleted successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete hero error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete hero slide."
      );
    }
  };

  // ==========================================================
  // TOGGLE VISIBILITY
  // ==========================================================

  const handleToggle = async (
    slide
  ) => {
    try {
      setError("");
      setMessage("");

      const newStatus =
        !slide.enabled;

      const {
        data,
        error: updateError,
      } = await supabase
        .from("hero_slides")
        .update({
          enabled: newStatus,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          slide.id
        )
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setSlides((prev) =>
        prev.map((item) =>
          item.id === slide.id
            ? data
            : item
        )
      );

      setMessage(
        newStatus
          ? "Slide is now visible."
          : "Slide has been hidden."
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(
        "Toggle slide error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update slide."
      );
    }
  };

  // ==========================================================
  // MOVE SLIDE
  // ==========================================================

  const moveSlide = async (
    index,
    direction
  ) => {
    const targetIndex =
      index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >=
        slides.length
    ) {
      return;
    }

    const current =
      slides[index];

    const target =
      slides[targetIndex];

    try {
      setError("");
      setMessage("");

      const currentOrder =
        Number(
          current.sort_order
        ) || 0;

      const targetOrder =
        Number(
          target.sort_order
        ) || 0;

      const now =
        new Date().toISOString();

      const [
        currentResult,
        targetResult,
      ] = await Promise.all([
        supabase
          .from("hero_slides")
          .update({
            sort_order:
              targetOrder,
            updated_at: now,
          })
          .eq(
            "id",
            current.id
          ),

        supabase
          .from("hero_slides")
          .update({
            sort_order:
              currentOrder,
            updated_at: now,
          })
          .eq(
            "id",
            target.id
          ),
      ]);

      if (
        currentResult.error ||
        targetResult.error
      ) {
        throw (
          currentResult.error ||
          targetResult.error
        );
      }

      setSlides((prev) => {
        const copy = [...prev];

        [
          copy[index],
          copy[targetIndex],
        ] = [
          copy[targetIndex],
          copy[index],
        ];

        return copy;
      });

      setMessage(
        "Slide order updated."
      );

      setTimeout(() => {
        setMessage("");
      }, 1800);
    } catch (err) {
      console.error(
        "Move slide error:",
        err
      );

      setError(
        err?.message ||
          "Unable to reorder slides."
      );
    }
  };

  // ==========================================================
  // FORMAT DURATION
  // ==========================================================

  const formatDuration = (
    milliseconds
  ) => {
    const seconds =
      Number(milliseconds) / 1000;

    if (!Number.isFinite(seconds)) {
      return "4.5s";
    }

    return `${seconds
      .toFixed(1)
      .replace(".0", "")}s`;
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f9]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">

          <div className="h-7 w-48 animate-pulse bg-slate-200" />

          <div className="mt-7 space-y-4">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse border border-slate-200 bg-white"
                />
              )
            )}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#14283D]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">

        <div className="mx-auto flex min-h-[68px] max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            <Link
              to="/admin"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D]"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="min-w-0">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0789A6]">
                Website Content
              </p>

              <h1 className="mt-0.5 truncate text-base font-bold text-[#14283D] sm:text-lg">
                Hero Slider
              </h1>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-2">

            <button
              type="button"
              onClick={fetchSlides}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50 sm:w-auto sm:gap-2 sm:px-3"
            >
              <RefreshCw
                size={13}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden text-[10px] font-bold sm:inline">
                Refresh
              </span>
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="flex h-9 items-center gap-2 bg-[#0789A6] px-3.5 text-[10px] font-bold text-white transition hover:bg-[#067d96]"
            >
              <Plus size={14} />

              <span>
                Add Slide
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* INTRO */}

        <section className="mb-7">

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0789A6]">
            Homepage
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                Hero Slider
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Manage homepage images,
                content, visibility, order
                and automatic slide timing.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
              <ImagePlus size={13} />

              {slides.length}{" "}
              {slides.length === 1
                ? "Slide"
                : "Slides"}
            </div>

          </div>

        </section>

        {/* ALERTS */}

        {error && (
          <div className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 p-3">

            <AlertCircle
              size={14}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <p className="text-[10px] leading-4 text-red-600">
              {error}
            </p>

          </div>
        )}

        {message && (
          <div className="mb-5 flex items-start gap-2 border border-emerald-200 bg-emerald-50 p-3">

            <CheckCircle2
              size={14}
              className="mt-0.5 shrink-0 text-emerald-500"
            />

            <p className="text-[10px] leading-4 text-emerald-600">
              {message}
            </p>

          </div>
        )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {slides.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
              <ImagePlus size={21} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#14283D]">
              No hero slides yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-slate-400">
              Add your first homepage
              hero slide to control the
              slider from the admin panel.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 inline-flex h-10 items-center gap-2 bg-[#0789A6] px-4 text-[10px] font-bold text-white transition hover:bg-[#067d96]"
            >
              <Plus size={14} />

              Add First Slide
            </button>

          </div>
        ) : (
          <div className="space-y-4">

            {slides.map(
              (slide, index) => (
                <article
                  key={slide.id}
                  className={`overflow-hidden border bg-white transition ${
                    slide.enabled
                      ? "border-slate-200"
                      : "border-slate-200 opacity-70"
                  }`}
                >

                  <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">

                    {/* IMAGE */}

                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[220px]">

                      {slide.desktop_image_url ? (
                        <img
                          src={
                            slide.desktop_image_url
                          }
                          alt={
                            slide.title_line1 ||
                            "Hero slide"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ImagePlus
                            size={30}
                          />
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1.5 text-[9px] font-bold text-white backdrop-blur-sm">

                        <span>
                          #{index + 1}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-white/50" />

                        {slide.enabled
                          ? "Visible"
                          : "Hidden"}

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0">

                      <div className="flex flex-col gap-4 p-4 sm:p-5">

                        {/* TITLE */}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div className="min-w-0">

                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#0789A6]">
                              {slide.category ||
                                "Homepage Slide"}
                            </p>

                            <h3 className="mt-1.5 text-base font-bold leading-6 text-[#14283D] sm:text-lg">
                              {slide.title_line1}

                              <br />

                              {slide.title_line2}
                            </h3>

                            <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                              {slide.description}
                            </p>

                          </div>

                          {/* ORDER */}

                          <div className="flex shrink-0 items-center gap-1.5">

                            <button
                              type="button"
                              onClick={() =>
                                moveSlide(
                                  index,
                                  -1
                                )
                              }
                              disabled={
                                index === 0
                              }
                              title="Move up"
                              className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronUp
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveSlide(
                                  index,
                                  1
                                )
                              }
                              disabled={
                                index ===
                                slides.length -
                                  1
                              }
                              title="Move down"
                              className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronDown
                                size={14}
                              />
                            </button>

                          </div>

                        </div>

                        {/* META */}

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                          <div className="border border-slate-100 bg-slate-50/70 p-3">

                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock3 size={12} />

                              <span className="text-[8px] font-bold uppercase tracking-wider">
                                Duration
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-bold text-[#14283D]">
                              {formatDuration(
                                slide.animation_duration
                              )}
                            </p>

                          </div>

                          <div className="border border-slate-100 bg-slate-50/70 p-3">

                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Monitor size={12} />

                              <span className="text-[8px] font-bold uppercase tracking-wider">
                                Desktop
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-bold text-emerald-600">
                              {slide.desktop_image_url
                                ? "Ready"
                                : "Missing"}
                            </p>

                          </div>

                          <div className="border border-slate-100 bg-slate-50/70 p-3">

                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Smartphone size={12} />

                              <span className="text-[8px] font-bold uppercase tracking-wider">
                                Mobile
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-bold text-emerald-600">
                              {slide.mobile_image_url
                                ? "Ready"
                                : "Fallback"}
                            </p>

                          </div>

                          <div className="border border-slate-100 bg-slate-50/70 p-3">

                            <div className="flex items-center gap-1.5 text-slate-400">

                              {slide.enabled ? (
                                <Eye size={12} />
                              ) : (
                                <EyeOff
                                  size={12}
                                />
                              )}

                              <span className="text-[8px] font-bold uppercase tracking-wider">
                                Status
                              </span>

                            </div>

                            <p
                              className={`mt-1 text-xs font-bold ${
                                slide.enabled
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {slide.enabled
                                ? "Live"
                                : "Hidden"}
                            </p>

                          </div>

                        </div>

                        {/* BUTTON INFO */}

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] text-slate-400">

                          <span>
                            Button:{" "}
                            <strong className="font-bold text-slate-600">
                              {slide.button_text ||
                                "Shop Now"}
                            </strong>
                          </span>

                          <span className="max-w-full truncate">
                            Link:{" "}
                            <strong className="font-bold text-slate-600">
                              {slide.button_url ||
                                "/products"}
                            </strong>
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(
                                slide
                              )
                            }
                            className={`flex h-9 items-center justify-center gap-2 border px-3 text-[10px] font-bold transition ${
                              slide.enabled
                                ? "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600"
                                : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {slide.enabled ? (
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

                          <div className="grid grid-cols-2 gap-2 sm:flex">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  slide
                                )
                              }
                              className="flex h-9 items-center justify-center gap-2 border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D]"
                            >
                              <Pencil
                                size={13}
                              />

                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  slide
                                )
                              }
                              className="flex h-9 items-center justify-center gap-2 border border-red-100 bg-red-50 px-3 text-[10px] font-bold text-red-500 transition hover:border-red-200 hover:bg-red-100"
                            >
                              <Trash2
                                size={13}
                              />

                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </main>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#071523]/65 p-3 backdrop-blur-sm sm:p-5">

          <div className="flex min-h-full items-center justify-center">

            <div className="my-3 w-full max-w-[880px] overflow-hidden border border-slate-200 bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#0789A6]">
                    Homepage Content
                  </p>

                  <h2 className="mt-1 truncate text-base font-bold text-[#14283D]">
                    {editingSlide
                      ? "Edit Hero Slide"
                      : "Add Hero Slide"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseForm
                  }
                  disabled={saving}
                  className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-40"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

              </div>

              {/* FORM */}

              <form onSubmit={handleSave}>

                <div className="max-h-[calc(100vh-145px)] overflow-y-auto p-4 sm:p-5">

                  {/* FORM ERROR */}

                  {error && (
                    <div className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 p-3">

                      <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <p className="text-[10px] leading-4 text-red-600">
                        {error}
                      </p>

                    </div>
                  )}

                  {/* ==================================================
                      CONTENT
                  ================================================== */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* CATEGORY */}

                    <div className="sm:col-span-2">

                      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Category Label
                      </label>

                      <input
                        name="category"
                        value={
                          form.category
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="TIMELESS COMFORT"
                        maxLength={80}
                        className="h-11 w-full border border-slate-200 bg-white px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                      />

                    </div>

                    {/* TITLE 1 */}

                    <div>

                      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Heading Line 1
                      </label>

                      <input
                        name="title_line1"
                        value={
                          form.title_line1
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Make Comfort"
                        maxLength={80}
                        className="h-11 w-full border border-slate-200 px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                      />

                    </div>

                    {/* TITLE 2 */}

                    <div>

                      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Heading Line 2
                      </label>

                      <input
                        name="title_line2"
                        value={
                          form.title_line2
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Part of Your Home"
                        maxLength={80}
                        className="h-11 w-full border border-slate-200 px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                      />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="sm:col-span-2">

                      <div className="mb-2 flex items-center justify-between">

                        <label className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          Description
                        </label>

                        <span className="text-[8px] text-slate-400">
                          {
                            form.description
                              .length
                          }
                          /220
                        </span>

                      </div>

                      <textarea
                        name="description"
                        value={
                          form.description
                        }
                        onChange={
                          handleChange
                        }
                        maxLength={220}
                        rows={3}
                        placeholder="Describe this collection or product..."
                        className="w-full resize-none border border-slate-200 px-3 py-3 text-xs font-medium leading-5 text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      IMAGES
                  ================================================== */}

                  <div className="mt-6">

                    <div className="mb-3">

                      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Hero Images
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-slate-400">
                        Desktop image is required.
                        Mobile image is optional
                        and falls back to desktop.
                      </p>

                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                      {/* DESKTOP */}

                      <div>

                        <div className="mb-2 flex items-center justify-between gap-2">

                          <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            <Monitor size={12} />

                            Desktop Image
                          </label>

                          <span className="hidden text-[8px] text-slate-400 sm:block">
                            1920×900+
                          </span>

                        </div>

                        <label className="group relative block aspect-[16/8] cursor-pointer overflow-hidden border border-dashed border-slate-300 bg-slate-50 transition hover:border-[#0789A6]">

                          {desktopPreview ? (
                            <img
                              src={
                                desktopPreview
                              }
                              alt="Desktop preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center px-4 text-center">

                              <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-300">
                                <Upload
                                  size={18}
                                />
                              </div>

                              <p className="mt-2 text-[10px] font-bold text-slate-500">
                                Upload Desktop Image
                              </p>

                              <p className="mt-1 text-[8px] text-slate-400">
                                JPG, PNG, WEBP • Max 8MB
                              </p>

                            </div>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">

                            <div className="scale-90 rounded-full bg-white px-3 py-2 text-[9px] font-bold text-[#14283D] opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                              Change Image
                            </div>

                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleDesktopImage
                            }
                            className="hidden"
                          />

                        </label>

                      </div>

                      {/* MOBILE */}

                      <div>

                        <div className="mb-2 flex items-center justify-between gap-2">

                          <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            <Smartphone size={12} />

                            Mobile Image
                          </label>

                          <span className="hidden text-[8px] text-slate-400 sm:block">
                            Portrait recommended
                          </span>

                        </div>

                        <label className="group relative block aspect-[16/8] cursor-pointer overflow-hidden border border-dashed border-slate-300 bg-slate-50 transition hover:border-[#0789A6]">

                          {mobilePreview ? (
                            <img
                              src={
                                mobilePreview
                              }
                              alt="Mobile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center px-4 text-center">

                              <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-300">
                                <Smartphone
                                  size={18}
                                />
                              </div>

                              <p className="mt-2 text-[10px] font-bold text-slate-500">
                                Upload Mobile Image
                              </p>

                              <p className="mt-1 text-[8px] text-slate-400">
                                Optional • Desktop fallback
                              </p>

                            </div>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">

                            <div className="scale-90 rounded-full bg-white px-3 py-2 text-[9px] font-bold text-[#14283D] opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                              Change Image
                            </div>

                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleMobileImage
                            }
                            className="hidden"
                          />

                        </label>

                      </div>

                    </div>

                  </div>

                  {/* ==================================================
                      CTA
                  ================================================== */}

                  <div className="mt-6">

                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                      Call To Action
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          Button Text
                        </label>

                        <input
                          name="button_text"
                          value={
                            form.button_text
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Shop Now"
                          maxLength={40}
                          className="h-11 w-full border border-slate-200 px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          Button URL
                        </label>

                        <input
                          name="button_url"
                          value={
                            form.button_url
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="/products/sofa-set"
                          maxLength={300}
                          className="h-11 w-full border border-slate-200 px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-300 focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                        />

                      </div>

                    </div>

                  </div>

                  {/* ==================================================
                      SETTINGS
                  ================================================== */}

                  <div className="mt-6">

                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                      Slider Settings
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">

                      {/* ORDER */}

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          Slide Order
                        </label>

                        <input
                          name="sort_order"
                          type="number"
                          min="0"
                          value={
                            form.sort_order
                          }
                          onChange={
                            handleChange
                          }
                          className="h-11 w-full border border-slate-200 px-3 text-xs font-medium text-[#14283D] outline-none focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                        />

                        <p className="mt-1 text-[8px] text-slate-400">
                          Lower number appears
                          first.
                        </p>

                      </div>

                      {/* DURATION */}

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          Display Time
                        </label>

                        <div className="relative">

                          <input
                            name="animation_duration"
                            type="number"
                            min="2000"
                            step="500"
                            value={
                              form.animation_duration
                            }
                            onChange={
                              handleChange
                            }
                            className="h-11 w-full border border-slate-200 px-3 pr-12 text-xs font-medium text-[#14283D] outline-none focus:border-[#0789A6] focus:ring-2 focus:ring-[#0789A6]/10"
                          />

                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">
                            ms
                          </span>

                        </div>

                        <p className="mt-1 text-[8px] text-slate-400">
                          4500 = 4.5 seconds
                        </p>

                      </div>

                      {/* VISIBILITY */}

                      <div>

                        <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          Visibility
                        </label>

                        <label className="flex h-11 cursor-pointer items-center justify-between border border-slate-200 px-3">

                          <span className="text-[10px] font-semibold text-slate-600">
                            Show slide
                          </span>

                          <input
                            name="enabled"
                            type="checkbox"
                            checked={
                              form.enabled
                            }
                            onChange={
                              handleChange
                            }
                            className="h-4 w-4 accent-[#0789A6]"
                          />

                        </label>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      handleCloseForm
                    }
                    disabled={saving}
                    className="h-10 border border-slate-200 bg-white px-4 text-[10px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-10 items-center justify-center gap-2 bg-[#0789A6] px-5 text-[10px] font-bold text-white transition hover:bg-[#067d96] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
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

                        {editingSlide
                          ? "Update Slide"
                          : "Add Slide"}
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminHero;