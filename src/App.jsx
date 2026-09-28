import React from "react";
import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

/* ============================================================
   PUBLIC COMPONENTS
============================================================ */

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CategoriesProduct from "./components/CategoriesProduct";
import Footer from "./components/Footer";

/* ============================================================
   PUBLIC PAGES
============================================================ */

import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Cart from "./pages/Cart";

/* ============================================================
   ADMIN PAGES
============================================================ */

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

/* ============================================================
   ADMIN ROUTE PROTECTION
============================================================ */

import AdminRoute from "./components/AdminRoute";
import AdminHero from "./pages/AdminHero";
import AdminReviews from "./pages/AdminReviews";
import Reviews from "./components/Reviews";

/* ============================================================
   COMMON PUBLIC LAYOUT
============================================================ */

const Layout = () => {
  return (
    <>
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      <Outlet />

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />
    </>
  );
};

/* ============================================================
   HOME PAGE
============================================================ */

const HomePage = () => {
  return (
    <>
      <Home />
      <CategoriesProduct />
          </>
  );
};

/* ============================================================
   MAIN APP
============================================================ */

const App = () => {
  return (
    <Routes>

      {/* ======================================================
          ADMIN LOGIN
          /admin/login
      ====================================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ======================================================
          ADMIN DASHBOARD
          /admin
      ====================================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ======================================================
          ADMIN PRODUCTS
          /admin/products
      ====================================================== */}

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      {/* ======================================================
          PUBLIC WEBSITE LAYOUT
      ====================================================== */}

      <Route element={<Layout />}>

        {/* ====================================================
            HOME
            /
        ==================================================== */}

        <Route
          path="/"
          element={<HomePage />}
        />

        {/* ====================================================
            ABOUT
            /about
        ==================================================== */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* ====================================================
            CONTACT
            /contact
        ==================================================== */}

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ====================================================
            PRODUCTS
            /products
        ==================================================== */}

        <Route
          path="/products"
          element={<Products />}
        />

        {/* ====================================================
            PRODUCT CATEGORY
            /products/dining-table
            /products/restaurant-furniture
            /products/sofa-set
            /products/wooden-sofa
            /products/l-shape-sofa
            /products/king-size-bed
        ==================================================== */}

        <Route
          path="/products/:category"
          element={<Products />}
        />

        {/* ====================================================
            CART
            /cart
        ==================================================== */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
  path="/admin/herr"
  element={
    <AdminRoute>
      <AdminHero />
    </AdminRoute>
  }
/>

<Route
  path="/admin/reviews"
  element={
    <AdminRoute>
      <AdminReviews />
    </AdminRoute>
  }
/>

<Route
  path="/admin/reviews"
  element={
    <AdminRoute>
      <AdminReviews />
    </AdminRoute>
  }
/>


        {/* ====================================================
            404 PAGE
        ==================================================== */}

        <Route
          path="*"
          element={
            <div
              className="
                flex
                min-h-[50vh]
                items-center
                justify-center
                px-4
              "
            >
              <div className="text-center">

                <p
                  className="
                    mb-2
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#079FC0]
                  "
                >
                  AR Woodworks
                </p>

                <h1
                  className="
                    text-3xl
                    font-bold
                    text-[#14283D]
                    sm:text-4xl
                  "
                >
                  404 - Page Not Found
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    text-slate-500
                    sm:text-base
                  "
                >
                  The page you are looking for
                  does not exist.
                </p>

              </div>
            </div>
          }
        />

      </Route>

    </Routes>
  );
};

export default App;