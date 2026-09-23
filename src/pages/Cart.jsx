
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  MapPin,
  User,
  Phone,
  Truck,
  ShieldCheck,
  PackageCheck,
  X,
  ShoppingCart,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "923033939167";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#172B3A] outline-none transition placeholder:text-slate-400 focus:border-[#079FC0] focus:ring-4 focus:ring-cyan-50";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#172B3A]";

const Cart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // Storage may be unavailable.
    }
  }, [cart]);

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
      ),
    [cart]
  );

  const updateQuantity = (index, change) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.max(
                1,
                (Number(item.quantity) || 1) + change
              ),
            }
          : item
      )
    );
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomer = (event) => {
    const { name, value } = event.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    }

    if (!customer.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!customer.address.trim()) {
      newErrors.address = "Please enter your complete address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = (event) => {
    event.preventDefault();

    if (!cart.length || !validateForm()) return;

    const productLines = cart
      .map((item, index) => {
        const name =
          item.name || item.title || "Furniture Product";

        const category =
          item.category || "Furniture Collection";

        return (
          `${index + 1}. ${name}\n` +
          `Category: ${category}\n` +
          `Quantity: ${Number(item.quantity) || 1}`
        );
      })
      .join("\n\n");

    const message = `Hello Style Nest! I would like to place an order.

*MY SHOPPING BAG*
Total Items: ${totalItems}

${productLines}

*CUSTOMER DETAILS*
Name: ${customer.name.trim()}
Phone: ${customer.phone.trim()}
City: ${customer.city.trim()}
Delivery Address: ${customer.address.trim()}
Additional Notes: ${customer.notes.trim() || "None"}

Please confirm product availability, final prices, and delivery charges. Thank you!`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const ErrorText = ({ name }) =>
    errors[name] ? (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {errors[name]}
      </p>
    ) : null;

  return (
    <main className="min-h-screen bg-[#F7F9FA] pb-12 text-[#172B3A]">

      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10">

          <Link
            to="/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#079FC0]"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#079FC0]">
                <span className="h-px w-7 bg-[#079FC0]" />
                Shopping Bag
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Review your selected furniture and enter your
                delivery details to place your order.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F7F9FA] px-4 py-3">
              <ShoppingBag
                size={18}
                className="text-[#079FC0]"
              />

              <span className="text-sm font-semibold">
                {totalItems}{" "}
                {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

        {cart.length === 0 ? (

          /* EMPTY CART */
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-12">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF7FA]">
              <ShoppingBag
                size={34}
                className="text-[#079FC0]"
              />
            </div>

            <h2 className="text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              You haven't added any furniture yet.
              Explore our collections and find something
              perfect for your space.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#14283D] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#079FC0]"
            >
              Explore Products
              <ArrowUpRight size={17} />
            </Link>
          </div>

        ) : (

          <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">

            {/* SELECTED PRODUCTS */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-5 sm:px-6">

                <div>
                  <h2 className="text-lg font-bold sm:text-xl">
                    Selected Products
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Review your items before placing your order.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-slate-100 px-4 sm:px-6">

                {cart.map((item, index) => {
                  const image = item.image || item.img;
                  const title =
                    item.name || item.title || "Furniture Product";

                  return (
                    <article
                      key={item.id || title + index}
                      className="flex gap-3 py-5 sm:gap-5"
                    >

                      {/* PRODUCT IMAGE */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F3F6F7] sm:h-32 sm:w-32">
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag
                              size={28}
                              className="text-slate-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* PRODUCT DETAILS */}
                      <div className="flex min-w-0 flex-1 flex-col">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#079FC0] sm:text-xs">
                              {item.category || "Furniture Collection"}
                            </span>

                            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 sm:text-base">
                              {title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              Premium Furniture
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            aria-label={`Remove ${title}`}
                            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">

                          <div>
                            <span className="mb-1.5 block text-[10px] font-medium text-slate-400 sm:text-xs">
                              Quantity
                            </span>

                            <div className="inline-flex items-center rounded-lg border border-slate-200">

                              <button
                                type="button"
                                onClick={() => updateQuantity(index, -1)}
                                disabled={(Number(item.quantity) || 1) <= 1}
                                aria-label="Decrease quantity"
                                className="p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="min-w-8 text-center text-sm font-semibold">
                                {Number(item.quantity) || 1}
                              </span>

                              <button
                                type="button"
                                onClick={() => updateQuantity(index, 1)}
                                aria-label="Increase quantity"
                                className="p-2 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Plus size={14} />
                              </button>

                            </div>
                          </div>

                          <span className="text-[10px] font-medium text-slate-400 sm:text-xs">
                            Item {index + 1}
                          </span>

                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 px-4 py-5 sm:px-6">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#079FC0] transition hover:text-[#087F99]"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
              </div>
            </section>

            {/* CUSTOMER DETAILS */}
            <section className="min-w-0 space-y-5">

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#079FC0]">
                    <MessageCircle size={15} />
                    Order Checkout
                  </div>

                  <h2 className="text-xl font-bold sm:text-2xl">
                    Delivery Details
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Fill in your information to send your order
                    directly to our WhatsApp.
                  </p>
                </div>

                <form
                  onSubmit={placeOrder}
                  className="space-y-5"
                >

                  {/* NAME */}
                  <div>
                    <label className={labelClass}>
                      <User
                        size={15}
                        className="mr-2 inline text-[#079FC0]"
                      />
                      Full Name
                    </label>

                    <input
                      name="name"
                      value={customer.name}
                      onChange={updateCustomer}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={inputClass}
                    />

                    <ErrorText name="name" />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className={labelClass}>
                      <Phone
                        size={15}
                        className="mr-2 inline text-[#079FC0]"
                      />
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      type="tel"
                      value={customer.phone}
                      onChange={updateCustomer}
                      placeholder="03XX XXXXXXX"
                      autoComplete="tel"
                      className={inputClass}
                    />

                    <ErrorText name="phone" />
                  </div>

                  {/* CITY */}
                  <div>
                    <label className={labelClass}>
                      <MapPin
                        size={15}
                        className="mr-2 inline text-[#079FC0]"
                      />
                      City
                    </label>

                    <input
                      name="city"
                      value={customer.city}
                      onChange={updateCustomer}
                      placeholder="Enter your city"
                      autoComplete="address-level2"
                      className={inputClass}
                    />

                    <ErrorText name="city" />
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <label className={labelClass}>
                      Complete Delivery Address
                    </label>

                    <textarea
                      name="address"
                      rows={3}
                      value={customer.address}
                      onChange={updateCustomer}
                      placeholder="House number, street, area..."
                      autoComplete="street-address"
                      className={`${inputClass} resize-y`}
                    />

                    <ErrorText name="address" />
                  </div>

                  {/* NOTES */}
                  <div>
                    <label className={labelClass}>
                      Additional Notes{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      name="notes"
                      rows={2}
                      value={customer.notes}
                      onChange={updateCustomer}
                      placeholder="Any special delivery instructions?"
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  {/* ORDER SUMMARY */}
                  <div className="rounded-xl border border-[#D8EDF2] bg-[#F5FBFC] p-4">

                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <ShoppingCart
                          size={17}
                          className="text-[#079FC0]"
                        />
                        Order Summary
                      </span>

                      <span className="text-sm font-bold">
                        {totalItems}{" "}
                        {totalItems === 1 ? "Item" : "Items"}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-[#D8EDF2] pt-3">
                      <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                        <PackageCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-[#079FC0]"
                        />

                        Final product prices and delivery charges
                        will be confirmed on WhatsApp.
                      </div>
                    </div>
                  </div>

                  {/* WHATSAPP ORDER BUTTON */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#14283D] px-5 py-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-[#079FC0] active:scale-[0.99]"
                  >
                    <MessageCircle size={19} />
                    Place Order on WhatsApp
                  </button>

                  <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-400">
                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-[#079FC0]"
                    />

                    Your order and delivery details will be
                    prepared in a WhatsApp message.
                  </p>

                </form>
              </div>

              {/* DELIVERY INFO */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA]">
                    <Truck
                      size={19}
                      className="text-[#079FC0]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">
                      Delivery Across Pakistan
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Delivery availability and charges will be
                      confirmed according to your location.
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-slate-100" />

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA]">
                    <CheckCircle2
                      size={19}
                      className="text-[#079FC0]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">
                      Order Confirmation
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Our team will confirm your order, product
                      availability, and final amount.
                    </p>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;