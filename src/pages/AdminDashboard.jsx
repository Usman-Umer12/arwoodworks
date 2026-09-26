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
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data, error: supabaseError } = await supabase
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
      console.error("Dashboard error:", err);

      setError(
        err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/admin/login";
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

    window.addEventListener("resize", handleResize);

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

    return `PKR ${Number(price).toLocaleString("en-PK")}`;
  };

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // STATS
  // ==========================================================

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const activeProducts = products.filter(
      (product) =>
        product.status === "active"
    ).length;

    const inactiveProducts =
      products.filter(
        (product) =>
          product.status !== "active"
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

          if (Number.isNaN(price)) {
            return total;
          }

          return total + price;
        },
        0
      );

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      categories: categories.size,
      totalValue,
    };
  }, [products]);

  // ==========================================================
  // RECENT PRODUCTS
  // ==========================================================

  const recentProducts = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  // ==========================================================
  // CATEGORY DATA
  // ==========================================================

  const categoryStats = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const category =
        product.category ||
        "Uncategorized";

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += 1;
    });

    return Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (a, b) =>
          b.count - a.count
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

          {/* CATALOG */}

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
  // LOADING
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

            <div className="h-[76px] border-b border-slate-200 bg-white" />

            <main className="p-5 sm:p-7 lg:p-9">

              <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-3 w-72 animate-pulse rounded bg-slate-100" />

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200 lg:grid-cols-4">

                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse bg-white"
                  />
                ))}
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

      {/* SIDEBAR */}

      <Sidebar />

      {/* MOBILE OVERLAY */}

      {mobileSidebar && (
        <button
          aria-label="Close menu"
          onClick={() =>
            setMobileSidebar(false)
          }
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
        />
      )}

      {/* MAIN AREA */}

      <div className="min-h-screen lg:pl-[250px]">

        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <header className="sticky top-0 z-50 h-[70px] border-b border-slate-200 bg-white">

          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LEFT */}

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

            {/* RIGHT */}

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  fetchProducts(true)
                }
                disabled={refreshing}
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

                <span className="hidden xs:inline sm:inline">
                  Add Product
                </span>
              </Link>

            </div>
          </div>
        </header>

        {/* ====================================================
            CONTENT
        ==================================================== */}

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
                  Monitor your product catalogue and website content.
                </p>

              </div>

              <p className="text-[10px] text-slate-400">
                Last synced with Supabase
              </p>

            </div>
          </section>

          {/* ERROR */}

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
              STATISTICS
          ================================================== */}

          <section className="grid grid-cols-2 border border-slate-200 bg-white lg:grid-cols-4">

            {/* TOTAL */}

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

            {/* ACTIVE */}

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

            {/* CATEGORIES */}

            <div className="border-r border-slate-200 p-4 sm:p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Categories
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.categories}
                </p>

                <span className="text-[10px] font-medium text-slate-400">
                  Groups
                </span>

              </div>
            </div>

            {/* FEATURED */}

            <div className="p-4 sm:p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Featured
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold tracking-tight text-[#14283D] sm:text-3xl">
                  {stats.featuredProducts}
                </p>

                <span className="text-[10px] font-medium text-slate-400">
                  Highlighted
                </span>

              </div>
            </div>

          </section>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">

            {/* =================================================
                PRODUCTS TABLE
            ================================================= */}

            <div className="min-w-0 border border-slate-200 bg-white">

              {/* HEADER */}

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

              {/* DESKTOP TABLE */}

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
                            key={product.id}
                            className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/60"
                          >

                            {/* PRODUCT */}

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

                            {/* CATEGORY */}

                            <td className="px-4 py-4">

                              <span className="text-[11px] font-medium text-slate-500">
                                {product.category ||
                                  "Uncategorized"}
                              </span>

                            </td>

                            {/* PRICE */}

                            <td className="px-4 py-4">

                              <span className="text-[11px] font-bold text-[#14283D]">
                                {formatPrice(
                                  product.price
                                )}
                              </span>

                            </td>

                            {/* STATUS */}

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

                            {/* DATE */}

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
                        key={product.id}
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

              {/* FOOTER */}

              <div className="border-t border-slate-100 px-4 py-3 sm:px-5">

                <Link
                  to="/admin/products"
                  className="text-[10px] font-bold text-[#0789A6] hover:text-[#056f86]"
                >
                  Open Product Management →
                </Link>

              </div>

            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

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
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0789A6]"
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
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0789A6]"
                    />

                  </Link>

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
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0789A6]"
                    />

                  </a>

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
                {stats.activeProducts}
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
                Product data is synced automatically
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
