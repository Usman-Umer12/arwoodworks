import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Truck,
  Star,
  Image as ImageIcon,
  Eye,
  Filter,
  ChevronDown,
  Boxes,
} from "lucide-react";

import { supabase } from "../lib/supabase";

// ============================================================
// CONSTANTS
// ============================================================

const DELIVERY_TEXT =
  "Delivery all over Pakistan.";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const STORAGE_BUCKET =
  "product-images";

const STORAGE_MARKER =
  "/storage/v1/object/public/product-images/";

const CATEGORIES = [
  {
    label: "Dining Table",
    value: "Dining Table",
  },
  {
    label: "Restaurant Furniture",
    value: "Restaurant Furniture",
  },
  {
    label: "Sofa Set",
    value: "Sofa Set",
  },
  {
    label: "Wooden Sofa",
    value: "Wooden Sofa",
  },
  {
    label: "L.Shape Sofa",
    value: "L.Shape Sofa",
  },
  {
    label: "King Size Bed",
    value: "King Size Bed",
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  category: "Dining Table",
  status: "active",
  featured: false,
  imageFile: null,
  imagePreview: "",
  existingImageUrl: "",
};

// ============================================================
// HELPERS
// ============================================================

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return null;
  }

  const number = Number(price);

  if (Number.isNaN(number)) {
    return null;
  }

  return `PKR ${number.toLocaleString("en-PK")}`;
};

// ============================================================
// ADMIN PRODUCTS
// ============================================================

const AdminProducts = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [previewProduct, setPreviewProduct] =
    useState(null);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

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

        setErrorMessage("");

        const {
          data,
          error,
        } = await supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ==========================================================
  // AUTO HIDE MESSAGES
  // ==========================================================

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  // ==========================================================
  // MOBILE SIDEBAR
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
  // BODY SCROLL LOCK
  // ==========================================================

  useEffect(() => {
    if (
      mobileSidebar ||
      showForm ||
      previewProduct
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    mobileSidebar,
    showForm,
    previewProduct,
  ]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      window.location.href =
        "/admin/login";
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // ==========================================================
  // OPEN ADD FORM
  // ==========================================================

  const openAddForm = () => {
    setEditingProduct(null);

    setForm({
      ...EMPTY_FORM,
    });

    setErrorMessage("");
    setSuccessMessage("");

    setShowForm(true);

    setMobileSidebar(false);
  };

  // ==========================================================
  // OPEN EDIT FORM
  // ==========================================================

  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      description:
        product.description || "",
      price:
        product.price !== null &&
        product.price !== undefined
          ? product.price
          : "",
      category:
        product.category ||
        "Dining Table",
      status:
        product.status || "active",
      featured:
        product.featured === true,
      imageFile: null,
      imagePreview:
        product.image_url || "",
      existingImageUrl:
        product.image_url || "",
    });

    setErrorMessage("");
    setSuccessMessage("");

    setShowForm(true);

    setMobileSidebar(false);
  };

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
    setForm({
      ...EMPTY_FORM,
    });
  };

  // ==========================================================
  // UPDATE FORM
  // ==========================================================

  const updateForm = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================================
  // IMAGE CHANGE
  // ==========================================================

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setForm((previous) => ({
      ...previous,
      imageFile: file,
      imagePreview: previewUrl,
    }));

    setErrorMessage("");
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Product title is required.";
    }

    if (!form.category) {
      return "Please select a category.";
    }

    if (
      form.price !== "" &&
      form.price !== null &&
      form.price !== undefined
    ) {
      const priceNumber =
        Number(form.price);

      if (
        Number.isNaN(priceNumber) ||
        priceNumber < 0
      ) {
        return "Please enter a valid price.";
      }
    }

    if (
      !editingProduct &&
      !form.imageFile
    ) {
      return "Please select a product image.";
    }

    return "";
  };

  // ==========================================================
  // UPLOAD IMAGE
  // ==========================================================

  const uploadImage = async (
    file
  ) => {
    if (!file) {
      return null;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 10);

    const storagePath =
      `products/${Date.now()}-${randomPart}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(
        storagePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type ||
            "image/jpeg",
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicData,
    } =
      supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(
          storagePath
        );

    return publicData?.publicUrl || null;
  };

  // ==========================================================
  // DELETE STORAGE IMAGE
  // ==========================================================

  const deleteStorageImage =
    async (imageUrl) => {
      if (!imageUrl) {
        return;
      }

      if (
        !imageUrl.includes(
          STORAGE_MARKER
        )
      ) {
        return;
      }

      const storagePath =
        imageUrl.split(
          STORAGE_MARKER
        )[1];

      if (!storagePath) {
        return;
      }

      const {
        error,
      } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([
          storagePath,
        ]);

      if (error) {
        console.warn(
          "Storage delete warning:",
          error
        );
      }
    };

  // ==========================================================
  // SAVE PRODUCT
  // ==========================================================

  const handleSaveProduct =
    async (event) => {
      event.preventDefault();

      if (saving) {
        return;
      }

      setErrorMessage("");
      setSuccessMessage("");

      const validationError =
        validateForm();

      if (validationError) {
        setErrorMessage(
          validationError
        );
        return;
      }

      setSaving(true);

      let newImageUrl = null;

      try {
        // ----------------------------------------------------
        // UPLOAD NEW IMAGE
        // ----------------------------------------------------

        if (form.imageFile) {
          newImageUrl =
            await uploadImage(
              form.imageFile
            );
        }

        // ----------------------------------------------------
        // ADD PRODUCT
        // ----------------------------------------------------

        if (!editingProduct) {
          const imageUrl =
            newImageUrl;

          const {
            error,
          } = await supabase
            .from("products")
            .insert([
              {
                title:
                  form.title.trim(),

                description:
                  form.description.trim(),

                price:
                  form.price === ""
                    ? null
                    : Number(
                        form.price
                      ),

                category:
                  form.category,

                image_url:
                  imageUrl,

                status:
                  form.status,

                featured:
                  form.featured,

                updated_at:
                  new Date().toISOString(),
              },
            ]);

          if (error) {
            if (newImageUrl) {
              await deleteStorageImage(
                newImageUrl
              );
            }

            throw error;
          }

          setSuccessMessage(
            "Product added successfully."
          );
        }

        // ----------------------------------------------------
        // UPDATE PRODUCT
        // ----------------------------------------------------

        else {
          const oldImageUrl =
            editingProduct.image_url ||
            "";

          const finalImageUrl =
            newImageUrl ||
            oldImageUrl ||
            null;

          const {
            error,
          } = await supabase
            .from("products")
            .update({
              title:
                form.title.trim(),

              description:
                form.description.trim(),

              price:
                form.price === ""
                  ? null
                  : Number(
                      form.price
                    ),

              category:
                form.category,

              image_url:
                finalImageUrl,

              status:
                form.status,

              featured:
                form.featured,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              editingProduct.id
            );

          if (error) {
            if (newImageUrl) {
              await deleteStorageImage(
                newImageUrl
              );
            }

            throw error;
          }

          // Delete old image only
          // after successful DB update.
          if (
            newImageUrl &&
            oldImageUrl &&
            oldImageUrl !==
              newImageUrl
          ) {
            await deleteStorageImage(
              oldImageUrl
            );
          }

          setSuccessMessage(
            "Product updated successfully."
          );
        }

        await fetchProducts(true);

        setShowForm(false);
        setEditingProduct(null);

        setForm({
          ...EMPTY_FORM,
        });
      } catch (error) {
        console.error(
          "Save product error:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Unable to save product."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDeleteProduct =
    async (product) => {
      if (deletingId) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${product.title}"?\n\nThis action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(product.id);

        setErrorMessage("");
        setSuccessMessage("");

        const {
          error,
        } = await supabase
          .from("products")
          .delete()
          .eq(
            "id",
            product.id
          );

        if (error) {
          throw error;
        }

        if (product.image_url) {
          await deleteStorageImage(
            product.image_url
          );
        }

        setProducts(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                product.id
            )
        );

        setSuccessMessage(
          "Product deleted successfully."
        );
      } catch (error) {
        console.error(
          "Delete product error:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Unable to delete product."
        );
      } finally {
        setDeletingId(null);
      }
    };

  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !searchValue ||
            product.title
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            product.category
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            product.description
              ?.toLowerCase()
              .includes(
                searchValue
              );

          const matchesCategory =
            categoryFilter ===
              "All" ||
            product.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      search,
      categoryFilter,
    ]);

  // ==========================================================
  // STATS
  // ==========================================================

  const stats = useMemo(() => {
    const total =
      products.length;

    const active =
      products.filter(
        (product) =>
          product.status ===
          "active"
      ).length;

    const featured =
      products.filter(
        (product) =>
          product.featured === true
      ).length;

    const categories =
      new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ).size;

    return {
      total,
      active,
      featured,
      categories,
    };
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
        {/* BRAND */}

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

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-3 py-6">

          {/* OVERVIEW */}

          <div className="mb-7">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Overview
            </p>

            <NavLink
              to="/admin"
              end
              onClick={() =>
                setMobileSidebar(false)
              }
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-md
                px-3 py-2.5 text-[12px]
                transition
                ${
                  isActive
                    ? "bg-white/[0.09] font-semibold text-white"
                    : "font-medium text-white/60 hover:bg-white/[0.06] hover:text-white"
                }
                `
              }
            >
              <LayoutDashboard
                size={16}
                strokeWidth={1.8}
              />

              Dashboard
            </NavLink>
          </div>

          {/* CATALOG */}

          <div className="mb-7">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Catalog
            </p>

            <NavLink
              to="/admin/products"
              onClick={() =>
                setMobileSidebar(false)
              }
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-md
                px-3 py-2.5 text-[12px]
                transition
                ${
                  isActive
                    ? "bg-white/[0.09] font-semibold text-white"
                    : "font-medium text-white/60 hover:bg-white/[0.06] hover:text-white"
                }
                `
              }
            >
              <Package
                size={16}
                strokeWidth={1.8}
              />

              Products
            </NavLink>
          </div>

          {/* WEBSITE */}

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

        {/* BOTTOM */}

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
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f9]">

        <div className="flex min-h-screen">

          {/* SIDEBAR */}

          <div className="hidden w-[250px] shrink-0 bg-[#102438] lg:block">

            <div className="h-[76px] border-b border-white/10 p-5">

              <div className="h-5 w-32 animate-pulse rounded bg-white/10" />

              <div className="mt-2 h-2 w-20 animate-pulse rounded bg-white/5" />

            </div>

          </div>

          {/* CONTENT */}

          <div className="flex-1">

            <div className="h-[70px] border-b border-slate-200 bg-white" />

            <main className="p-5 sm:p-7 lg:p-8">

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

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {Array.from({
                  length: 8,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden border border-slate-200 bg-white"
                    >
                      <div className="aspect-[4/3] animate-pulse bg-slate-100" />

                      <div className="p-4">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />

                        <div className="mt-3 h-2 w-full animate-pulse rounded bg-slate-50" />

                        <div className="mt-2 h-2 w-2/3 animate-pulse rounded bg-slate-50" />
                      </div>
                    </div>
                  )
                )}

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#14283D]">

      {/* ====================================================
          SIDEBAR
      ==================================================== */}

      <Sidebar />

      {/* ====================================================
          MOBILE SIDEBAR OVERLAY
      ==================================================== */}

      {mobileSidebar && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setMobileSidebar(false)
          }
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
        />
      )}

      {/* ====================================================
          MAIN AREA
      ==================================================== */}

      <div className="min-h-screen lg:pl-[250px]">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-50 h-[70px] border-b border-slate-200 bg-white">

          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setMobileSidebar(true)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div className="min-w-0">

                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Admin Panel
                </p>

                <h2 className="mt-0.5 truncate text-sm font-bold text-[#14283D]">
                  Products
                </h2>

              </div>
            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  fetchProducts(true)
                }
                disabled={refreshing}
                className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] disabled:cursor-not-allowed disabled:opacity-50"
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
                <ExternalLink
                  size={13}
                />

                Website
              </a>

              <button
                type="button"
                onClick={openAddForm}
                className="flex h-9 items-center gap-2 rounded-md bg-[#0789A6] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#067d96]"
              >
                <Plus size={14} />

                <span className="hidden sm:inline">
                  Add Product
                </span>
              </button>

            </div>
          </div>
        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="mb-7">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0789A6]">
              Catalog
            </p>

            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div className="min-w-0">

                <h1 className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  Product Management
                </h1>

                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                  Add, edit and manage products displayed on your AR Woodworks website.
                </p>

              </div>

              <div className="flex items-center gap-2">

                <div className="flex h-8 items-center gap-2 border border-slate-200 bg-white px-3">

                  <Boxes
                    size={13}
                    className="text-[#0789A6]"
                  />

                  <span className="text-[10px] font-semibold text-slate-500">
                    {products.length} Products
                  </span>

                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {successMessage && (
            <div className="mb-5 border border-emerald-200 bg-emerald-50">

              <div className="flex items-start gap-3 px-4 py-3">

                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div className="min-w-0">

                  <p className="text-xs font-bold text-emerald-700">
                    Success
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-emerald-600">
                    {successMessage}
                  </p>

                </div>

              </div>
            </div>
          )}

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {errorMessage && (
            <div className="mb-5 border border-red-200 bg-red-50">

              <div className="flex items-start gap-3 px-4 py-3">

                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div className="min-w-0">

                  <p className="text-xs font-bold text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 break-words text-[11px] leading-5 text-red-600">
                    {errorMessage}
                  </p>

                </div>

              </div>
            </div>
          )}

          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="grid grid-cols-2 border border-slate-200 bg-white lg:grid-cols-4">

            {/* TOTAL */}

            <div className="border-b border-r border-slate-200 p-4 sm:p-5 lg:border-b-0">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Total Products
              </p>

              <div className="mt-3 flex items-end justify-between gap-2">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.total}
                </p>

                <Package
                  size={15}
                  className="mb-1 text-slate-300"
                />

              </div>

            </div>

            {/* ACTIVE */}

            <div className="border-b border-slate-200 p-4 sm:p-5 lg:border-b-0 lg:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Active Products
              </p>

              <div className="mt-3 flex items-end justify-between gap-2">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.active}
                </p>

                <span className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Live

                </span>

              </div>

            </div>

            {/* CATEGORIES */}

            <div className="border-r border-slate-200 p-4 sm:p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Categories
              </p>

              <div className="mt-3 flex items-end justify-between gap-2">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.categories}
                </p>

                <span className="mb-1 text-[9px] font-medium text-slate-400">
                  Groups
                </span>

              </div>

            </div>

            {/* FEATURED */}

            <div className="p-4 sm:p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Featured
              </p>

              <div className="mt-3 flex items-end justify-between gap-2">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.featured}
                </p>

                <Star
                  size={15}
                  className="mb-1 text-slate-300"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              FILTER PANEL
          ================================================= */}

          <section className="mt-6 border border-slate-200 bg-white">

            <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-[430px]">

                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="h-10 w-full border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-[11px] font-medium text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6] focus:bg-white"
                />

              </div>

              {/* FILTER */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative min-w-0 sm:min-w-[210px]">

                  <Filter
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={
                      categoryFilter
                    }
                    onChange={(event) =>
                      setCategoryFilter(
                        event.target.value
                      )
                    }
                    className="h-10 w-full appearance-none border border-slate-200 bg-white pl-9 pr-9 text-[11px] font-semibold text-slate-600 outline-none transition focus:border-[#0789A6]"
                  >
                    <option value="All">
                      All Categories
                    </option>

                    {CATEGORIES.map(
                      (category) => (
                        <option
                          key={
                            category.value
                          }
                          value={
                            category.value
                          }
                        >
                          {category.label}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

                <div className="flex h-10 items-center justify-between border border-slate-200 bg-slate-50 px-3 sm:min-w-[145px]">

                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Results
                  </span>

                  <span className="text-xs font-bold text-[#14283D]">
                    {filteredProducts.length}
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              PRODUCT COLLECTION HEADER
          ================================================= */}

          <section className="mt-6">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h3 className="text-sm font-bold text-[#14283D]">
                  Product Collection
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Manage your website catalogue.
                </p>

              </div>

              <button
                type="button"
                onClick={openAddForm}
                className="flex h-8 items-center gap-1.5 bg-[#0789A6] px-3 text-[10px] font-bold text-white transition hover:bg-[#067d96]"
              >
                <Plus size={13} />

                Add
              </button>

            </div>

            {/* =================================================
                PRODUCT GRID
            ================================================= */}

            {filteredProducts.length ===
            0 ? (
              <div className="border border-slate-200 bg-white px-5 py-20 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">

                  <Package
                    size={20}
                  />

                </div>

                <h3 className="mt-4 text-sm font-bold text-[#14283D]">
                  No products found
                </h3>

                <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-5 text-slate-400">
                  {search ||
                  categoryFilter !==
                    "All"
                    ? "Try changing your search or category filter."
                    : "Your product catalogue is empty. Add your first product to get started."}
                </p>

                {!search &&
                  categoryFilter ===
                    "All" && (
                    <button
                      type="button"
                      onClick={
                        openAddForm
                      }
                      className="mt-5 inline-flex h-9 items-center gap-2 bg-[#0789A6] px-4 text-[10px] font-bold text-white transition hover:bg-[#067d96]"
                    >
                      <Plus
                        size={13}
                      />

                      Add First Product
                    </button>
                  )}

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {filteredProducts.map(
                  (product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden border border-slate-200 bg-white transition duration-200 hover:border-slate-300 hover:shadow-[0_8px_25px_rgba(20,40,61,0.06)]"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                        {product.image_url ? (
                          <img
                            src={
                              product.image_url
                            }
                            alt={
                              product.title ||
                              "Product"
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">

                            <ImageIcon
                              size={22}
                            />

                            <span className="mt-2 text-[9px] font-bold uppercase tracking-wider">
                              No Image
                            </span>

                          </div>
                        )}

                        {/* TOP LEFT */}

                        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">

                          <span className="bg-white/95 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#14283D] shadow-sm">
                            {product.category ||
                              "Uncategorized"}
                          </span>

                        </div>

                        {/* TOP RIGHT */}

                        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">

                          <span
                            className={`
                              px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] shadow-sm
                              ${
                                product.status ===
                                "active"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-red-500 text-white"
                              }
                            `}
                          >
                            {product.status ===
                            "active"
                              ? "Active"
                              : "Inactive"}
                          </span>

                          {product.featured && (
                            <span className="flex items-center gap-1 bg-[#14283D] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">

                              <Star
                                size={9}
                                fill="currentColor"
                              />

                              Featured

                            </span>
                          )}

                        </div>

                        {/* PREVIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            setPreviewProduct(
                              product
                            )
                          }
                          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-white/95 text-[#14283D] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#0789A6] hover:text-white"
                          aria-label="Preview product"
                        >
                          <Eye
                            size={14}
                          />
                        </button>

                      </div>

                      {/* CONTENT */}

                      <div className="p-4">

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-bold text-[#14283D]">
                            {product.title ||
                              "Untitled Product"}
                          </h3>

                          <p className="mt-1.5 min-h-[32px] text-[10px] leading-4 text-slate-400">
                            {product.description
                              ? product.description
                              : "No product description added yet."}
                          </p>

                        </div>

                        {/* PRICE */}

                        <div className="mt-4 flex items-end justify-between gap-2">

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Price
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#14283D]">
                              {formatPrice(
                                product.price
                              ) ||
                                "Price not set"}
                            </p>

                          </div>

                          <div className="flex items-center gap-1 text-right">

                            <Truck
                              size={11}
                              className="text-[#0789A6]"
                            />

                            <span className="text-[8px] font-semibold text-slate-400">
                              Pakistan
                            </span>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                product
                              )
                            }
                            className="flex h-8 flex-1 items-center justify-center gap-1.5 border border-slate-200 bg-white text-[9px] font-bold text-slate-600 transition hover:border-[#0789A6] hover:text-[#0789A6]"
                          >
                            <Pencil
                              size={12}
                            />

                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(
                                product
                              )
                            }
                            disabled={
                              deletingId ===
                              product.id
                            }
                            className="flex h-8 flex-1 items-center justify-center gap-1.5 border border-red-100 bg-red-50 text-[9px] font-bold text-red-500 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2
                              size={12}
                            />

                            {deletingId ===
                            product.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>
                    </article>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================================
              FOOTER INFO
          ================================================= */}

          <section className="mt-6 grid border border-slate-200 bg-white sm:grid-cols-3">

            <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Active Products
              </p>

              <p className="mt-2 text-sm font-bold text-[#14283D]">
                {stats.active}
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                Currently visible on website
              </p>

            </div>

            <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Delivery
              </p>

              <div className="mt-2 flex items-center gap-2">

                <Truck
                  size={14}
                  className="text-[#0789A6]"
                />

                <p className="text-[10px] font-bold text-[#14283D]">
                  All Pakistan
                </p>

              </div>

              <p className="mt-1 text-[9px] text-slate-400">
                {DELIVERY_TEXT}
              </p>

            </div>

            <div className="p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                System
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-[10px] font-semibold text-emerald-600">
                  Supabase Connected
                </p>

              </div>

              <p className="mt-1 text-[9px] text-slate-400">
                Product data is synced automatically.
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
                Product Management
              </p>

            </div>

          </footer>

        </main>
      </div>

      {/* ====================================================
          PRODUCT PREVIEW MODAL
      ==================================================== */}

      {previewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071523]/70 p-3 sm:p-6">

          <button
            type="button"
            aria-label="Close preview"
            onClick={() =>
              setPreviewProduct(null)
            }
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-[900px] flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#0789A6]">
                  Product Preview
                </p>

                <h3 className="mt-1 truncate text-sm font-bold text-[#14283D]">
                  {previewProduct.title ||
                    "Untitled Product"}
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewProduct(
                    null
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D]"
              >
                <X size={16} />
              </button>

            </div>

            {/* BODY */}

            <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">

              {/* IMAGE */}

              <div className="flex min-h-[280px] items-center justify-center bg-slate-50 p-5 sm:p-8 lg:min-h-[500px]">

                {previewProduct.image_url ? (
                  <img
                    src={
                      previewProduct.image_url
                    }
                    alt={
                      previewProduct.title ||
                      "Product"
                    }
                    className="max-h-[520px] w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">

                    <ImageIcon
                      size={35}
                    />

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider">
                      No Image
                    </p>

                  </div>
                )}

              </div>

              {/* INFO */}

              <div className="border-t border-slate-200 p-5 sm:p-7 lg:border-l lg:border-t-0">

                <div className="flex flex-wrap gap-2">

                  <span className="bg-slate-100 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-600">
                    {previewProduct.category ||
                      "Uncategorized"}
                  </span>

                  <span
                    className={
                      previewProduct.status ===
                      "active"
                        ? "bg-emerald-50 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-emerald-600"
                        : "bg-red-50 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-red-500"
                    }
                  >
                    {previewProduct.status ===
                    "active"
                      ? "Active"
                      : "Inactive"}
                  </span>

                  {previewProduct.featured && (
                    <span className="flex items-center gap-1 bg-[#14283D] px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white">

                      <Star
                        size={9}
                        fill="currentColor"
                      />

                      Featured

                    </span>
                  )}

                </div>

                <h2 className="mt-5 text-xl font-bold tracking-tight text-[#14283D] sm:text-2xl">
                  {previewProduct.title ||
                    "Untitled Product"}
                </h2>

                <div className="mt-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Price
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#0789A6]">
                    {formatPrice(
                      previewProduct.price
                    ) ||
                      "Price not set"}
                  </p>

                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {previewProduct.description ||
                      "No description has been added for this product."}
                  </p>

                </div>

                <div className="mt-6 border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[#0789A6]">

                      <Truck
                        size={15}
                      />

                    </div>

                    <div>

                      <p className="text-[10px] font-bold text-[#14283D]">
                        Delivery Information
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-slate-400">
                        {DELIVERY_TEXT}
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    const product =
                      previewProduct;

                    setPreviewProduct(
                      null
                    );

                    openEditForm(
                      product
                    );
                  }}
                  className="mt-5 flex h-10 w-full items-center justify-center gap-2 bg-[#0789A6] text-[10px] font-bold text-white transition hover:bg-[#067d96]"
                >
                  <Pencil size={13} />

                  Edit Product
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          ADD / EDIT PRODUCT MODAL
      ==================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-[#071523]/70 p-0 sm:items-center sm:p-5">

          <button
            type="button"
            aria-label="Close product form"
            onClick={closeForm}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 flex max-h-[96vh] w-full max-w-[1050px] flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[92vh]">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#0789A6]">
                  Catalog
                </p>

                <h2 className="mt-1 truncate text-base font-bold text-[#14283D] sm:text-lg">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                  {editingProduct
                    ? "Update product information and website content."
                    : "Create a new product for your website catalogue."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50"
              >
                <X size={16} />
              </button>

            </div>

            {/* =================================================
                FORM BODY
            ================================================= */}

            <form
              onSubmit={
                handleSaveProduct
              }
              className="min-h-0 flex-1 overflow-y-auto"
            >

              <div className="grid lg:grid-cols-[330px_minmax(0,1fr)]">

                {/* =================================================
                    IMAGE PANEL
                ================================================= */}

                <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6 lg:border-b-0 lg:border-r">

                  <div className="mb-3">

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Product Image
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-400">
                      JPG, PNG or WEBP. Maximum 5MB.
                    </p>

                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden border border-slate-200 bg-white">

                    {form.imagePreview ? (
                      <img
                        src={
                          form.imagePreview
                        }
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-slate-300">

                        <ImageIcon
                          size={32}
                        />

                        <p className="mt-2 text-[9px] font-bold uppercase tracking-wider">
                          No Image Selected
                        </p>

                      </div>
                    )}

                    {form.imagePreview && (
                      <div className="absolute bottom-3 left-3 bg-[#14283D]/90 px-2.5 py-1.5 text-[8px] font-bold text-white">
                        Preview
                      </div>
                    )}

                  </div>

                  <label className="mt-3 flex h-10 cursor-pointer items-center justify-center gap-2 border border-slate-200 bg-white text-[10px] font-bold text-slate-600 transition hover:border-[#0789A6] hover:text-[#0789A6]">

                    <Upload
                      size={13}
                    />

                    {form.imageFile
                      ? "Change Image"
                      : editingProduct
                      ? "Replace Image"
                      : "Upload Image"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />

                  </label>

                  <div className="mt-4 border border-slate-200 bg-white p-4">

                    <div className="flex items-start gap-2.5">

                      <Truck
                        size={14}
                        className="mt-0.5 shrink-0 text-[#0789A6]"
                      />

                      <div>

                        <p className="text-[10px] font-bold text-[#14283D]">
                          Delivery
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-400">
                          {DELIVERY_TEXT}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    FORM FIELDS
                ================================================= */}

                <div className="p-4 sm:p-6">

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* TITLE */}

                    <div className="sm:col-span-2">

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Product Title
                      </label>

                      <input
                        type="text"
                        value={form.title}
                        onChange={(event) =>
                          updateForm(
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="Enter product title"
                        className="h-10 w-full border border-slate-200 bg-white px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6]"
                      />

                    </div>

                    {/* CATEGORY */}

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Category
                      </label>

                      <div className="relative">

                        <select
                          value={
                            form.category
                          }
                          onChange={(event) =>
                            updateForm(
                              "category",
                              event.target.value
                            )
                          }
                          className="h-10 w-full appearance-none border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-[#14283D] outline-none transition focus:border-[#0789A6]"
                        >
                          {CATEGORIES.map(
                            (
                              category
                            ) => (
                              <option
                                key={
                                  category.value
                                }
                                value={
                                  category.value
                                }
                              >
                                {
                                  category.label
                                }
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown
                          size={13}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                      </div>

                    </div>

                    {/* PRICE */}

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) =>
                          updateForm(
                            "price",
                            event.target.value
                          )
                        }
                        placeholder="e.g. 25000"
                        className="h-10 w-full border border-slate-200 bg-white px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6]"
                      />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="sm:col-span-2">

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Product Description
                      </label>

                      <textarea
                        value={
                          form.description
                        }
                        onChange={(event) =>
                          updateForm(
                            "description",
                            event.target.value
                          )
                        }
                        placeholder="Write a short professional description..."
                        rows={5}
                        className="w-full resize-none border border-slate-200 bg-white px-3 py-3 text-xs font-medium leading-5 text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6]"
                      />

                    </div>

                    {/* DELIVERY */}

                    <div className="sm:col-span-2">

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Delivery Information
                      </label>

                      <div className="flex min-h-[42px] items-center gap-3 border border-slate-200 bg-slate-50 px-3">

                        <Truck
                          size={14}
                          className="shrink-0 text-[#0789A6]"
                        />

                        <p className="text-[10px] font-semibold text-slate-500">
                          {DELIVERY_TEXT}
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Status
                      </label>

                      <div className="relative">

                        <select
                          value={
                            form.status
                          }
                          onChange={(event) =>
                            updateForm(
                              "status",
                              event.target.value
                            )
                          }
                          className="h-10 w-full appearance-none border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-[#14283D] outline-none transition focus:border-[#0789A6]"
                        >
                          <option value="active">
                            Active
                          </option>

                          <option value="inactive">
                            Inactive
                          </option>
                        </select>

                        <ChevronDown
                          size={13}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                      </div>

                    </div>

                    {/* FEATURED */}

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Featured Product
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          updateForm(
                            "featured",
                            !form.featured
                          )
                        }
                        className={`
                          flex h-10 w-full items-center justify-between border px-3 transition
                          ${
                            form.featured
                              ? "border-[#0789A6] bg-[#0789A6]/5"
                              : "border-slate-200 bg-white"
                          }
                        `}
                      >

                        <span className="flex items-center gap-2">

                          <Star
                            size={13}
                            className={
                              form.featured
                                ? "text-[#0789A6]"
                                : "text-slate-400"
                            }
                            fill={
                              form.featured
                                ? "currentColor"
                                : "none"
                            }
                          />

                          <span
                            className={
                              form.featured
                                ? "text-[10px] font-bold text-[#0789A6]"
                                : "text-[10px] font-semibold text-slate-500"
                            }
                          >
                            {form.featured
                              ? "Featured"
                              : "Standard"}
                          </span>

                        </span>

                        <span
                          className={`
                            relative h-4 w-7 rounded-full transition
                            ${
                              form.featured
                                ? "bg-[#0789A6]"
                                : "bg-slate-200"
                            }
                          `}
                        >
                          <span
                            className={`
                              absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition
                              ${
                                form.featured
                                  ? "left-3.5"
                                  : "left-0.5"
                              }
                            `}
                          />
                        </span>

                      </button>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  FORM FOOTER
              ================================================= */}

              <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-[9px] text-slate-400">
                    {editingProduct
                      ? "Changes will update the existing product."
                      : "Product will be added to your live catalogue."}
                  </p>

                  <div className="flex w-full gap-2 sm:w-auto">

                    <button
                      type="button"
                      onClick={
                        closeForm
                      }
                      disabled={saving}
                      className="flex h-10 flex-1 items-center justify-center border border-slate-200 px-5 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50 sm:flex-none"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-10 flex-1 items-center justify-center gap-2 bg-[#0789A6] px-5 text-[10px] font-bold text-white transition hover:bg-[#067d96] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
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
                          {editingProduct ? (
                            <Pencil
                              size={13}
                            />
                          ) : (
                            <Plus
                              size={13}
                            />
                          )}

                          {editingProduct
                            ? "Update Product"
                            : "Add Product"}
                        </>
                      )}

                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;