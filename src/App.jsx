import React from "react";
import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CategoriesProduct from "./components/CategoriesProduct";
import Footer from "./components/Footer";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";

// Common Layout
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// Home Page
const HomePage = () => (
  <>
    <Home />
    <CategoriesProduct />
  </>
);

// Main App
const App = () => {
  return (
    <Routes>

      {/* Admin */}
<Route path="/admin/login" element={<AdminLogin />} />

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  }
/>
      {/* Public Website */}
      <Route element={<Layout />}>

        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:category"
          element={<Products />}
        />

        <Route path="/cart" element={<Cart />} />
        

        <Route
          path="*"
          element={
            <div className="flex min-h-[50vh] items-center justify-center px-4">
              <h1 className="text-3xl font-bold text-[#14283D] text-center">
                404 - Page Not Found
              </h1>
            </div>
          }
        />

      </Route>

    </Routes>
  );
};

export default App;