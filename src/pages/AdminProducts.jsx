import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { NavLink } from "react-router-dom";

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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { supabase } from "../lib/supabase";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_DELIVERY = "Delivery all over Pakistan.";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const STORAGE_BUCKET = "product-images";

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
  delivery: DEFAULT_DELIVERY,
  price: "",
  category: "Dining Table",
  status: "active",
  featured: false,

  imageFiles: [],
  imagePreviews: [],
  existingImages: [],
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
// GET ALL PRODUCT IMAGES
// ============================================================

const getProductImages = (product) => {
  const images = [
    product?.image_url,

    ...(Array.isArray(product?.images)
      ? product.images
      : []),

    ...(Array.isArray(product?.image_urls)
      ? product.image_urls
      : []),
  ];

  return images.filter(
    (image, index, array) =>
      typeof image === "string" &&
      image.trim() &&
      array.indexOf(image) === index
  );
};

// ============================================================
// CHECK SUPABASE STORAGE IMAGE
// ============================================================

const isStorageImage = (imageUrl) => {
  return (
    typeof imageUrl === "string" &&
    imageUrl.includes(STORAGE_MARKER)
  );
};

// ============================================================
// ADMIN PRODUCTS
// ============================================================

const AdminProducts = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [previewProduct, setPreviewProduct] =
    useState(null);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [previewImageIndex, setPreviewImageIndex] =
    useState(0);

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
  // AUTO HIDE SUCCESS
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
  // CLEANUP PREVIEW URLS
  // ==========================================================

  const cleanupPreviewUrls = (urls = []) => {
    urls.forEach((url) => {
      if (
        typeof url === "string" &&
        url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(url);
      }
    });
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      imageFiles: [],
      imagePreviews: [],
      existingImages: [],
    });
  };

  // ==========================================================
  // OPEN ADD FORM
  // ==========================================================

  const openAddForm = () => {
    setEditingProduct(null);

    setForm({
      ...EMPTY_FORM,
      imageFiles: [],
      imagePreviews: [],
      existingImages: [],
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
    const existingImages =
      getProductImages(product);

    setEditingProduct(product);

    setForm({
      title: product.title || "",

      description:
        product.description || "",

      // IMPORTANT:
      // Every product gets its own delivery text.
      delivery:
        product.delivery &&
        product.delivery.trim()
          ? product.delivery
          : DEFAULT_DELIVERY,

      price:
        product.price !== null &&
        product.price !== undefined
          ? product.price
          : "",

      category:
        product.category ||
        "Dining Table",

      status:
        product.status ||
        "active",

      featured:
        product.featured === true,

      imageFiles: [],
      imagePreviews: [],
      existingImages,
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

    cleanupPreviewUrls(
      form.imagePreviews
    );

    setShowForm(false);
    setEditingProduct(null);

    resetForm();
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
    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    event.target.value = "";

    if (!selectedFiles.length) {
      return;
    }

    const validFiles = [];
    const rejectedFiles = [];

    for (const file of selectedFiles) {
      // ------------------------------------------------------
      // INVALID TYPE
      // ------------------------------------------------------

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        rejectedFiles.push(
          `"${file.name}" is not a valid image file.`
        );

        continue;
      }

      // ------------------------------------------------------
      // FILE SIZE
      // ------------------------------------------------------

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        const fileSizeMB = (
          file.size /
          (1024 * 1024)
        ).toFixed(2);

        rejectedFiles.push(
          `"${file.name}" is ${fileSizeMB}MB. Maximum allowed size is ${MAX_IMAGE_SIZE_MB}MB per image.`
        );

        continue;
      }

      validFiles.push(file);
    }

    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    if (rejectedFiles.length > 0) {
      setErrorMessage(
        rejectedFiles.length === 1
          ? rejectedFiles[0]
          : `${rejectedFiles.length} images could not be added. ${rejectedFiles.join(
              " "
            )}`
      );
    } else {
      setErrorMessage("");
    }

    // --------------------------------------------------------
    // ADD VALID FILES
    // --------------------------------------------------------

    if (!validFiles.length) {
      return;
    }

    const newPreviewUrls =
      validFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setForm((previous) => ({
      ...previous,

      imageFiles: [
        ...previous.imageFiles,
        ...validFiles,
      ],

      imagePreviews: [
        ...previous.imagePreviews,
        ...newPreviewUrls,
      ],
    }));
  };

  // ==========================================================
  // REMOVE NEW IMAGE
  // ==========================================================

  const removeNewImage = (
    index
  ) => {
    setForm((previous) => {
      const preview =
        previous.imagePreviews[index];

      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          preview
        );
      }

      return {
        ...previous,

        imageFiles:
          previous.imageFiles.filter(
            (_, imageIndex) =>
              imageIndex !== index
          ),

        imagePreviews:
          previous.imagePreviews.filter(
            (_, imageIndex) =>
              imageIndex !== index
          ),
      };
    });
  };

  // ==========================================================
  // REMOVE EXISTING IMAGE
  // ==========================================================

  const removeExistingImage = (
    index
  ) => {
    setForm((previous) => ({
      ...previous,

      existingImages:
        previous.existingImages.filter(
          (_, imageIndex) =>
            imageIndex !== index
        ),
    }));

    setErrorMessage("");
  };

  // ==========================================================
  // VALIDATE FORM
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

    const totalImages =
      form.existingImages.length +
      form.imageFiles.length;

    if (totalImages === 0) {
      return "Please add at least one product image.";
    }

    return "";
  };

  // ==========================================================
  // FRIENDLY UPLOAD ERROR
  // ==========================================================

  const getFriendlyUploadError = (
    error
  ) => {
    const message =
      error?.message?.toLowerCase() ||
      "";

    if (
      message.includes("size") ||
      message.includes("payload") ||
      message.includes("too large") ||
      message.includes("413") ||
      message.includes("maximum")
    ) {
      return `Image upload failed because the file is too large. Maximum allowed size is ${MAX_IMAGE_SIZE_MB}MB per image.`;
    }

    return (
      error?.message ||
      "Unable to upload product image."
    );
  };

  // ==========================================================
  // UPLOAD SINGLE IMAGE
  // ==========================================================

  const uploadImage = async (
    file
  ) => {
    if (!file) {
      return null;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(
        `"${file.name}" is too large. Maximum allowed size is ${MAX_IMAGE_SIZE_MB}MB per image.`
      );
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

    return (
      publicData?.publicUrl ||
      null
    );
  };

  // ==========================================================
  // UPLOAD MULTIPLE IMAGES
  // ==========================================================

  const uploadImages = async (
    files
  ) => {
    if (!files?.length) {
      return [];
    }

    const uploadedUrls = [];

    try {
      for (const file of files) {
        const imageUrl =
          await uploadImage(file);

        if (imageUrl) {
          uploadedUrls.push(
            imageUrl
          );
        }
      }

      return uploadedUrls;
    } catch (error) {
      for (const imageUrl of uploadedUrls) {
        await deleteStorageImage(
          imageUrl
        );
      }

      throw error;
    }
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
        !isStorageImage(
          imageUrl
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
  // DELETE MULTIPLE STORAGE IMAGES
  // ==========================================================

  const deleteStorageImages =
    async (imageUrls = []) => {
      const uniqueImages = [
        ...new Set(
          imageUrls.filter(Boolean)
        ),
      ];

      for (const imageUrl of uniqueImages) {
        await deleteStorageImage(
          imageUrl
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

      let newlyUploadedImages = [];

      try {
        // ----------------------------------------------------
        // UPLOAD NEW IMAGES
        // ----------------------------------------------------

        newlyUploadedImages =
          await uploadImages(
            form.imageFiles
          );

        // ----------------------------------------------------
        // FINAL IMAGE ARRAY
        // ----------------------------------------------------

        const finalImages = [
          ...form.existingImages,
          ...newlyUploadedImages,
        ].filter(
          (image, index, array) =>
            typeof image === "string" &&
            image.trim() &&
            array.indexOf(image) ===
              index
        );

        if (!finalImages.length) {
          throw new Error(
            "At least one product image is required."
          );
        }

        // ----------------------------------------------------
        // PRIMARY IMAGE
        // ----------------------------------------------------

        const primaryImage =
          finalImages[0] || null;

        // ----------------------------------------------------
        // DELIVERY VALUE
        //
        // Every product gets its own delivery text.
        // If empty, use default.
        // ----------------------------------------------------

        const deliveryValue =
          form.delivery?.trim() ||
          DEFAULT_DELIVERY;

        // ----------------------------------------------------
        // ADD PRODUCT
        // ----------------------------------------------------

        if (!editingProduct) {
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

                delivery:
                  deliveryValue,

                price:
                  form.price === ""
                    ? null
                    : Number(
                        form.price
                      ),

                category:
                  form.category,

                image_url:
                  primaryImage,

                images:
                  finalImages,

                status:
                  form.status,

                featured:
                  form.featured,

                updated_at:
                  new Date().toISOString(),
              },
            ]);

          if (error) {
            await deleteStorageImages(
              newlyUploadedImages
            );

            throw error;
          }

          setSuccessMessage(
            "Product added successfully with delivery information."
          );
        }

        // ----------------------------------------------------
        // UPDATE PRODUCT
        // ----------------------------------------------------

        else {
          const oldImages =
            getProductImages(
              editingProduct
            );

          const removedImages =
            oldImages.filter(
              (oldImage) =>
                !form.existingImages.includes(
                  oldImage
                )
            );

          const {
            error,
          } = await supabase
            .from("products")
            .update({
              title:
                form.title.trim(),

              description:
                form.description.trim(),

              delivery:
                deliveryValue,

              price:
                form.price === ""
                  ? null
                  : Number(
                      form.price
                    ),

              category:
                form.category,

              image_url:
                primaryImage,

              images:
                finalImages,

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
            await deleteStorageImages(
              newlyUploadedImages
            );

            throw error;
          }

          // --------------------------------------------------
          // DELETE REMOVED OLD IMAGES
          // --------------------------------------------------

          if (
            removedImages.length
          ) {
            await deleteStorageImages(
              removedImages
            );
          }

          setSuccessMessage(
            "Product updated successfully."
          );
        }

        // ----------------------------------------------------
        // REFRESH PRODUCTS
        // ----------------------------------------------------

        await fetchProducts(true);

        // ----------------------------------------------------
        // CLEANUP
        // ----------------------------------------------------

        cleanupPreviewUrls(
          form.imagePreviews
        );

        setShowForm(false);
        setEditingProduct(null);

        resetForm();
      } catch (error) {
        console.error(
          "Save product error:",
          error
        );

        setErrorMessage(
          getFriendlyUploadError(
            error
          )
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
          `Delete "${product.title}"?\n\nAll product images will also be deleted from storage.\n\nThis action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          product.id
        );

        setErrorMessage("");
        setSuccessMessage("");

        const productImages =
          getProductImages(
            product
          );

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

        if (productImages.length) {
          await deleteStorageImages(
            productImages
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
          "Product and all its images deleted successfully."
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
              ) ||
            product.delivery
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
  // PREVIEW MODAL
  // ==========================================================

  const openPreview = (
    product
  ) => {
    setPreviewProduct(
      product
    );

    setPreviewImageIndex(0);
  };

  const closePreview = () => {
    setPreviewProduct(null);
    setPreviewImageIndex(0);
  };

  const previewImages =
    previewProduct
      ? getProductImages(
          previewProduct
        )
      : [];

  const previousPreviewImage =
    () => {
      if (
        previewImages.length <=
        1
      ) {
        return;
      }

      setPreviewImageIndex(
        (current) =>
          current === 0
            ? previewImages.length - 1
            : current - 1
      );
    };

  const nextPreviewImage = () => {
    if (
      previewImages.length <=
      1
    ) {
      return;
    }

    setPreviewImageIndex(
      (current) =>
        (current + 1) %
        previewImages.length
    );
  };

  // ==========================================================
  // SIDEBAR
  // ==========================================================

  const Sidebar = () => {
    return (
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex w-[250px] flex-col
          border-r border-white/10
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
            type="button"
            onClick={() =>
              setMobileSidebar(false)
            }
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
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
                flex items-center gap-3 rounded-lg
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
                flex items-center gap-3 rounded-lg
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
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
          <div className="mb-2 rounded-lg px-3 py-3">
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
            type="button"
            onClick={
              handleLogout
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
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
              <div className="h-5 w-32 animate-pulse rounded-lg bg-white/10" />

              <div className="mt-2 h-2 w-20 animate-pulse rounded bg-white/5" />
            </div>
          </div>

          <div className="flex-1">
            <div className="h-[70px] border-b border-slate-200 bg-white" />

            <main className="p-5 sm:p-7 lg:p-8">
              <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200" />

              <div className="mt-3 h-3 w-72 animate-pulse rounded bg-slate-100" />

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
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
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
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
      <Sidebar />

      {/* MOBILE OVERLAY */}

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

      {/* MAIN */}

      <div className="min-h-screen lg:pl-[250px]">
        {/* TOP BAR */}

        <header className="sticky top-0 z-50 h-[70px] border-b border-slate-200 bg-white">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileSidebar(true)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] lg:hidden"
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

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  fetchProducts(true)
                }
                disabled={refreshing}
                className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] sm:flex"
              >
                <ExternalLink
                  size={13}
                />

                Website
              </a>

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="flex h-9 items-center gap-2 rounded-lg bg-[#0789A6] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#067d96]"
              >
                <Plus size={14} />

                <span className="hidden sm:inline">
                  Add Product
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* PAGE HEADER */}

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
                <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
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

          {/* SUCCESS */}

          {successMessage && (
            <div className="mb-5 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
              <div className="flex items-start gap-3 px-4 py-3">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
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

          {/* ERROR */}

          {errorMessage && (
            <div className="mb-5 overflow-hidden rounded-xl border border-red-200 bg-red-50">
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle
                    size={16}
                    className="text-red-600"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 break-words text-[11px] leading-5 text-red-600">
                    {errorMessage}
                  </p>

                  <p className="mt-1.5 text-[9px] font-semibold text-red-500">
                    Maximum image size:{" "}
                    {MAX_IMAGE_SIZE_MB}MB
                    per image.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATISTICS */}

          <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white lg:grid-cols-4">
            <div className="border-b border-r border-slate-200 p-4 sm:p-5 lg:border-b-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Total Products
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-bold text-[#14283D] sm:text-3xl">
                  {stats.total}
                </p>

                <Package
                  size={15}
                  className="mb-1 text-slate-300"
                />
              </div>
            </div>

            <div className="border-b border-slate-200 p-4 sm:p-5 lg:border-b-0 lg:border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Active Products
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-bold text-[#14283D] sm:text-3xl">
                  {stats.active}
                </p>

                <span className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
            </div>

            <div className="border-r border-slate-200 p-4 sm:p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Categories
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-bold text-[#14283D] sm:text-3xl">
                  {stats.categories}
                </p>

                <span className="mb-1 text-[9px] font-medium text-slate-400">
                  Groups
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Featured
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-bold text-[#14283D] sm:text-3xl">
                  {stats.featured}
                </p>

                <Star
                  size={15}
                  className="mb-1 text-slate-300"
                />
              </div>
            </div>
          </section>

          {/* FILTER */}

          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
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
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-[11px] font-medium text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6] focus:bg-white"
                />
              </div>

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
                    className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-[11px] font-semibold text-slate-600 outline-none focus:border-[#0789A6]"
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

                <div className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 sm:min-w-[145px]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Results
                  </span>

                  <span className="text-xs font-bold text-[#14283D]">
                    {
                      filteredProducts.length
                    }
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCT COLLECTION */}

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
                onClick={
                  openAddForm
                }
                className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0789A6] px-3 text-[10px] font-bold text-white transition hover:bg-[#067d96]"
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            {filteredProducts.length ===
            0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-20 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                  <Package size={20} />
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
                      className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0789A6] px-4 text-[10px] font-bold text-white"
                    >
                      <Plus size={13} />
                      Add First Product
                    </button>
                  )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(
                  (product) => {
                    const productImages =
                      getProductImages(
                        product
                      );

                    return (
                      <article
                        key={
                          product.id
                        }
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          openPreview(
                            product
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {
                            event.preventDefault();

                            openPreview(
                              product
                            );
                          }
                        }}
                        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:border-slate-300 hover:shadow-[0_8px_25px_rgba(20,40,61,0.07)] focus:outline-none focus:ring-2 focus:ring-[#0789A6]/20"
                      >
                        {/* IMAGE */}

                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
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

                          {/* IMAGE COUNT */}

                          {productImages.length >
                            1 && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-[#14283D]/90 px-2 py-1.5 text-white shadow-sm">
                              <ImageIcon
                                size={10}
                              />

                              <span className="text-[8px] font-bold">
                                {
                                  productImages.length
                                }{" "}
                                Images
                              </span>
                            </div>
                          )}

                          {/* CATEGORY */}

                          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                            <span className="rounded-lg bg-white/95 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#14283D] shadow-sm">
                              {product.category ||
                                "Uncategorized"}
                            </span>
                          </div>

                          {/* STATUS */}

                          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                            <span
                              className={`
                                rounded-lg px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] shadow-sm
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
                              <span className="flex items-center gap-1 rounded-lg bg-[#14283D] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">
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
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              openPreview(
                                product
                              );
                            }}
                            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-[#14283D] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#0789A6] hover:text-white"
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
                              {product.description ||
                                "No product description added yet."}
                            </p>
                          </div>

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

                            <div className="flex max-w-[130px] items-center gap-1 text-right">
                              <Truck
                                size={11}
                                className="shrink-0 text-[#0789A6]"
                              />

                              <span className="truncate text-[8px] font-semibold text-slate-400">
                                {product.delivery ||
                                  DEFAULT_DELIVERY}
                              </span>
                            </div>
                          </div>

                          {/* ACTIONS */}

                          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                            <button
                              type="button"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                openEditForm(
                                  product
                                );
                              }}
                              className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold text-slate-600 transition hover:border-[#0789A6] hover:text-[#0789A6]"
                            >
                              <Pencil
                                size={12}
                              />

                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                handleDeleteProduct(
                                  product
                                );
                              }}
                              disabled={
                                deletingId ===
                                product.id
                              }
                              className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 text-[9px] font-bold text-red-500 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* FOOTER INFO */}

          <section className="mt-6 grid overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-3">
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
                Product Delivery
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Truck
                  size={14}
                  className="text-[#0789A6]"
                />

                <p className="text-[10px] font-bold text-[#14283D]">
                  Editable Per Product
                </p>
              </div>

              <p className="mt-1 text-[9px] leading-4 text-slate-400">
                Delivery information can be changed while adding or editing a product.
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
                ©{" "}
                {new Date().getFullYear()}{" "}
                AR Woodworks
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
            onClick={
              closePreview
            }
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
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
                onClick={
                  closePreview
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D]"
              >
                <X size={16} />
              </button>
            </div>

            {/* BODY */}

            <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">
              {/* IMAGE GALLERY */}

              <div className="bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {previewImages.length >
                  0 ? (
                    <>
                      <img
                        src={
                          previewImages[
                            previewImageIndex
                          ]
                        }
                        alt={
                          previewProduct.title ||
                          "Product"
                        }
                        className="h-full w-full object-contain"
                      />

                      {previewImages.length >
                        1 && (
                        <>
                          <button
                            type="button"
                            onClick={
                              previousPreviewImage
                            }
                            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#14283D] shadow-lg transition hover:bg-[#0789A6] hover:text-white"
                            aria-label="Previous image"
                          >
                            <ChevronLeft
                              size={20}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={
                              nextPreviewImage
                            }
                            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#14283D] shadow-lg transition hover:bg-[#0789A6] hover:text-white"
                            aria-label="Next image"
                          >
                            <ChevronRight
                              size={20}
                            />
                          </button>

                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-[#14283D]/90 px-3 py-1.5 text-[9px] font-bold text-white">
                            {previewImageIndex +
                              1}{" "}
                            /{" "}
                            {
                              previewImages.length
                            }
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400">
                      <ImageIcon
                        size={35}
                      />

                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider">
                        No Image
                      </p>
                    </div>
                  )}
                </div>

                {/* THUMBNAILS */}

                {previewImages.length >
                  1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {previewImages.map(
                      (
                        image,
                        index
                      ) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() =>
                            setPreviewImageIndex(
                              index
                            )
                          }
                          className={`
                            relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white
                            ${
                              previewImageIndex ===
                              index
                                ? "border-[#0789A6]"
                                : "border-slate-200"
                            }
                          `}
                        >
                          <img
                            src={image}
                            alt={`Product thumbnail ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />

                          {index ===
                            0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-[#14283D]/80 py-1 text-[7px] font-bold text-white">
                              MAIN
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* INFO */}

              <div className="border-t border-slate-200 p-5 sm:p-7 lg:border-l lg:border-t-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-600">
                    {previewProduct.category ||
                      "Uncategorized"}
                  </span>

                  <span
                    className={
                      previewProduct.status ===
                      "active"
                        ? "rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-emerald-600"
                        : "rounded-lg bg-red-50 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-red-500"
                    }
                  >
                    {previewProduct.status ===
                    "active"
                      ? "Active"
                      : "Inactive"}
                  </span>

                  {previewProduct.featured && (
                    <span className="flex items-center gap-1 rounded-lg bg-[#14283D] px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white">
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

                {/* PRICE */}

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

                {/* IMAGE COUNT */}

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <ImageIcon
                    size={14}
                    className="text-[#0789A6]"
                  />

                  <p className="text-[10px] font-semibold text-slate-500">
                    {previewImages.length}{" "}
                    product{" "}
                    {previewImages.length ===
                    1
                      ? "image"
                      : "images"}
                  </p>
                </div>

                {/* DESCRIPTION */}

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {previewProduct.description ||
                      "No description has been added for this product."}
                  </p>
                </div>

                {/* DELIVERY */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0789A6]">
                      <Truck
                        size={15}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#14283D]">
                        Delivery Information
                      </p>

                      <p className="mt-1 whitespace-pre-line break-words text-[10px] leading-5 text-slate-400">
                        {previewProduct.delivery &&
                        previewProduct.delivery.trim()
                          ? previewProduct.delivery
                          : DEFAULT_DELIVERY}
                      </p>
                    </div>
                  </div>
                </div>

                {/* EDIT */}

                <button
                  type="button"
                  onClick={() => {
                    const product =
                      previewProduct;

                    closePreview();

                    openEditForm(
                      product
                    );
                  }}
                  className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0789A6] text-[10px] font-bold text-white transition hover:bg-[#067d96]"
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
            onClick={
              closeForm
            }
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 flex max-h-[96vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
            {/* HEADER */}

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
                    ? "Update product information and product gallery."
                    : "Create a new product with multiple images."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={saving}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSaveProduct
              }
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="grid lg:grid-cols-[370px_minmax(0,1fr)]">
                {/* IMAGE PANEL */}

                <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Product Gallery
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-400">
                      Upload JPG, PNG or WEBP images. Maximum{" "}
                      <span className="font-bold text-slate-600">
                        {MAX_IMAGE_SIZE_MB}MB
                      </span>{" "}
                      per image.
                    </p>
                  </div>

                  {/* EXISTING + NEW IMAGES */}

                  {form.existingImages.length +
                    form.imagePreviews.length >
                  0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                      {/* EXISTING */}

                      {form.existingImages.map(
                        (
                          image,
                          index
                        ) => (
                          <div
                            key={`existing-${image}-${index}`}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
                          >
                            <img
                              src={image}
                              alt={`Product image ${
                                index + 1
                              }`}
                              className="h-full w-full object-cover"
                            />

                            {index ===
                              0 && (
                              <span className="absolute left-2 top-2 rounded-lg bg-[#14283D]/90 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-white">
                                Main
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                removeExistingImage(
                                  index
                                )
                              }
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                              aria-label={`Remove image ${
                                index + 1
                              }`}
                            >
                              <X
                                size={13}
                              />
                            </button>
                          </div>
                        )
                      )}

                      {/* NEW */}

                      {form.imagePreviews.map(
                        (
                          image,
                          index
                        ) => {
                          const mainIndex =
                            form.existingImages.length +
                            index;

                          return (
                            <div
                              key={`new-${image}-${index}`}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-[#0789A6]/40 bg-white"
                            >
                              <img
                                src={image}
                                alt={`New product image ${
                                  index + 1
                                }`}
                                className="h-full w-full object-cover"
                              />

                              {mainIndex ===
                                0 && (
                                <span className="absolute left-2 top-2 rounded-lg bg-[#14283D]/90 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-white">
                                  Main
                                </span>
                              )}

                              <span className="absolute bottom-2 left-2 rounded-lg bg-[#0789A6] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-white">
                                New
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeNewImage(
                                    index
                                  )
                                }
                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                                aria-label={`Remove new image ${
                                  index + 1
                                }`}
                              >
                                <X
                                  size={13}
                                />
                              </button>
                            </div>
                          );
                        }
                      )}

                      {/* ADD MORE */}

                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-[#0789A6] hover:text-[#0789A6]">
                        <Plus
                          size={22}
                        />

                        <span className="mt-2 text-[8px] font-bold uppercase tracking-wider">
                          Add More
                        </span>

                        <span className="mt-1 text-[7px] text-slate-400">
                          Max {MAX_IMAGE_SIZE_MB}MB
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={
                            handleImageChange
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-[#0789A6] hover:text-[#0789A6]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <Upload
                          size={20}
                        />
                      </div>

                      <p className="mt-3 text-[10px] font-bold text-slate-600">
                        Upload Product Images
                      </p>

                      <p className="mt-1 text-center text-[8px] text-slate-400">
                        Select one or multiple images
                      </p>

                      <p className="mt-2 text-[8px] font-semibold text-slate-400">
                        Maximum {MAX_IMAGE_SIZE_MB}MB per image
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* ADD MORE BUTTON */}

                  {form.existingImages.length +
                    form.imagePreviews.length >
                    0 && (
                    <label className="mt-3 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 transition hover:border-[#0789A6] hover:text-[#0789A6]">
                      <Upload
                        size={13}
                      />

                      Add More Images

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* IMAGE INFO */}

                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Total Images
                      </span>

                      <span className="text-sm font-bold text-[#14283D]">
                        {form.existingImages.length +
                          form.imagePreviews.length}
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] leading-4 text-slate-400">
                      The first image will automatically be used as the main product image.
                    </p>
                  </div>

                  {/* DELIVERY INFO */}

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-2.5">
                      <Truck
                        size={14}
                        className="mt-0.5 shrink-0 text-[#0789A6]"
                      />

                      <div>
                        <p className="text-[10px] font-bold text-[#14283D]">
                          Product Delivery
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-400">
                          Delivery information is now editable for every product.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM FIELDS */}

                <div className="p-4 sm:p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* TITLE */}

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Product Title
                      </label>

                      <input
                        type="text"
                        value={
                          form.title
                        }
                        onChange={(event) =>
                          updateForm(
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="Enter product title"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6]"
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
                          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-[#14283D] outline-none focus:border-[#0789A6]"
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
                        value={
                          form.price
                        }
                        onChange={(event) =>
                          updateForm(
                            "price",
                            event.target.value
                          )
                        }
                        placeholder="e.g. 25000"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#14283D] outline-none focus:border-[#0789A6]"
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
                        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs font-medium leading-5 text-[#14283D] outline-none focus:border-[#0789A6]"
                      />
                    </div>

                    {/* ==================================================
                        DELIVERY INFORMATION - EDITABLE
                    ================================================== */}

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
                        Delivery Information
                      </label>

                      <div className="relative">
                        <Truck
                          size={14}
                          className="pointer-events-none absolute left-3 top-3 text-[#0789A6]"
                        />

                        <textarea
                          value={
                            form.delivery
                          }
                          onChange={(event) =>
                            updateForm(
                              "delivery",
                              event.target.value
                            )
                          }
                          placeholder="e.g. Delivery all over Pakistan."
                          rows={3}
                          className="w-full resize-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium leading-5 text-[#14283D] outline-none transition placeholder:text-slate-400 focus:border-[#0789A6]"
                        />
                      </div>

                      <div className="mt-1.5 flex items-start justify-between gap-3">
                        <p className="text-[9px] leading-4 text-slate-400">
                          Write custom delivery information for this product.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            updateForm(
                              "delivery",
                              DEFAULT_DELIVERY
                            )
                          }
                          className="shrink-0 text-[9px] font-bold text-[#0789A6] hover:underline"
                        >
                          Use Default
                        </button>
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
                          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-[#14283D] outline-none focus:border-[#0789A6]"
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
                          flex h-10 w-full items-center justify-between rounded-lg border px-3 transition
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

              {/* FORM FOOTER */}

              <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[9px] text-slate-400">
                    {editingProduct
                      ? "Changes will update the existing product, gallery and delivery information."
                      : "Product will be added with its own delivery information."}
                  </p>

                  <div className="flex w-full gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={
                        closeForm
                      }
                      disabled={saving}
                      className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 px-5 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-[#14283D] disabled:opacity-50 sm:flex-none"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0789A6] px-5 text-[10px] font-bold text-white transition hover:bg-[#067d96] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
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