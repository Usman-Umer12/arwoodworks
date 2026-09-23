
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
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* About & Contact */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* All Products */}
        <Route path="/products" element={<Products />} />

        {/* Category Products */}
        <Route
          path="/products/:category"
          element={<Products />}
        />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* 404 Page */}
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