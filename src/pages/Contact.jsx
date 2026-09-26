import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Armchair,
  MessageCircle,
  ArrowUpRight,
  ChevronDown,
  Mail,
  Factory,
  Store,
  Clock3,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  { name: "Dining Table", slug: "dining-table" },
  { name: "Restaurant Furniture", slug: "restaurant-furniture" },
  { name: "Sofa Set", slug: "sofa-set" },
  { name: "Wooden Sofa", slug: "wooden-sofa" },
  { name: "L.Shape Sofa", slug: "l-shape-sofa" },
  { name: "King Size Bed", slug: "king-size-bed" },
];

/* =========================================================
   BUSINESS INFORMATION
========================================================= */

const BUSINESS = {
  name: "Ali Raza",

  shopAddress:
    "Shop # R-73, Block-A, Near Ibrar Masjid, Gulshan-e-Iqbal 13-D, Karachi.",

  factoryAddress:
    "Zeenat Square, FC Area, Liaquatabad No.10, Karachi.",

  email: "a.r.woodworks01@gmail.com",

  whatsapp: "923033939167",
  whatsappDisplay: "+92 303 3939167",

  phone: "923100009167",
  phoneDisplay: "+92 310 0009167",
};

/* =========================================================
   COMPONENT
========================================================= */

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    category: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  /* =======================================================
     HANDLE CHANGE
  ======================================================= */

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  /* =======================================================
     WHATSAPP SUBMIT
  ======================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSending(true);

    const message = `
Hello! I would like to make a furniture inquiry.

Name: ${formData.name}
Phone: ${formData.phone}
Delivery Address: ${formData.address}
Furniture Category: ${formData.category}

Additional Requirements:
${formData.message || "No additional requirements."}

Please share more details, pricing and availability.

Thank you!
    `.trim();

    const whatsappURL = `https://wa.me/${
      BUSINESS.whatsapp
    }?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    setTimeout(() => {
      setIsSending(false);
    }, 1000);
  };

  /* =======================================================
     INPUT STYLE
  ======================================================= */

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-3 pl-11 pr-4 text-[13px] text-[#142333] outline-none transition-all placeholder:text-slate-400 focus:border-[#079FC0] focus:bg-white focus:ring-4 focus:ring-[#079FC0]/10 sm:py-3.5 sm:text-sm";

  return (
    <section
      id="contact"
      className="w-full overflow-hidden bg-[#F7F9FC] px-3 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1380px]">

        {/* =================================================
            SECTION HEADING
        ================================================= */}

        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-9">

          <div className="mb-2.5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-6 bg-[#079FC0] sm:w-8" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#078BA8] sm:text-[11px]">
              Get In Touch
            </span>

            <span className="h-[2px] w-6 bg-[#079FC0] sm:w-8" />
          </div>

          <h2 className="text-[27px] font-bold leading-[1.15] tracking-tight text-[#142333] sm:text-4xl lg:text-[44px]">
            Let's Talk About Your{" "}
            <span className="text-[#079CB8]">
              Furniture
            </span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-2xl text-[11px] leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
            Looking for dining tables, sofas, bedroom furniture
            or a custom design? Share your requirements and our
            team will help you with the right furniture solution.
          </p>
        </div>

        {/* =================================================
            BUSINESS INFORMATION
            MOBILE = 2 COLUMNS
            DESKTOP = 4 COLUMNS
        ================================================= */}

        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">

          {/* SHOP */}

          <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#079FC0]/30 hover:shadow-md sm:rounded-2xl sm:p-5">

            <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3.5 sm:gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF8FA] text-[#079CB8] sm:h-10 sm:w-10 sm:rounded-xl">
                <Store size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                  Visit Us
                </p>

                <h3 className="truncate text-[11px] font-bold text-[#142333] sm:text-sm">
                  Furniture Outlet
                </h3>
              </div>
            </div>

            <p className="text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
              {BUSINESS.shopAddress}
            </p>
          </div>

          {/* FACTORY */}

          <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#079FC0]/30 hover:shadow-md sm:rounded-2xl sm:p-5">

            <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3.5 sm:gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF8FA] text-[#079CB8] sm:h-10 sm:w-10 sm:rounded-xl">
                <Factory size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                  Our Factory
                </p>

                <h3 className="truncate text-[11px] font-bold text-[#142333] sm:text-sm">
                  Manufacturing
                </h3>
              </div>
            </div>

            <p className="text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
              {BUSINESS.factoryAddress}
            </p>
          </div>

          {/* PHONE */}

          <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#079FC0]/30 hover:shadow-md sm:rounded-2xl sm:p-5">

            <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3.5 sm:gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF8FA] text-[#079CB8] sm:h-10 sm:w-10 sm:rounded-xl">
                <Phone size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                  Call / WhatsApp
                </p>

                <h3 className="truncate text-[11px] font-bold text-[#142333] sm:text-sm">
                  {BUSINESS.name}
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <a
                href={`tel:+${BUSINESS.whatsapp}`}
                className="block truncate text-[10px] font-semibold text-[#079CB8] hover:text-[#142333] sm:text-xs"
              >
                {BUSINESS.whatsappDisplay}
              </a>

              <a
                href={`tel:+${BUSINESS.phone}`}
                className="block truncate text-[10px] font-semibold text-slate-600 hover:text-[#079CB8] sm:text-xs"
              >
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>

          {/* EMAIL */}

          <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#079FC0]/30 hover:shadow-md sm:rounded-2xl sm:p-5">

            <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3.5 sm:gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF8FA] text-[#079CB8] sm:h-10 sm:w-10 sm:rounded-xl">
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                  Email Us
                </p>

                <h3 className="truncate text-[11px] font-bold text-[#142333] sm:text-sm">
                  Email
                </h3>
              </div>
            </div>

            <a
              href={`mailto:${BUSINESS.email}`}
              className="block break-all text-[10px] font-semibold leading-4 text-slate-600 hover:text-[#079CB8] sm:text-xs sm:leading-5"
            >
              {BUSINESS.email}
            </a>
          </div>
        </div>

        {/* =================================================
            MAIN CONTACT AREA
        ================================================= */}

        <div className="grid items-start gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:gap-6">

          {/* =================================================
              LEFT PANEL
          ================================================= */}

          <div className="overflow-hidden rounded-2xl bg-[#101D2B] text-white shadow-xl sm:rounded-3xl">

            {/* INTRO */}

            <div className="p-4 sm:p-6 lg:p-7">

              <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#079FC0]/15 text-[#18C6DF] sm:h-12 sm:w-12">
                  <Armchair size={23} />
                </div>

                <div className="min-w-0">

                  <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#18C6DF] sm:text-[9px]">
                    AR Furniture Outlet
                  </p>

                  <h3 className="text-lg font-bold leading-tight sm:text-2xl">
                    Find Your Perfect Furniture
                  </h3>

                </div>
              </div>

              <p className="text-[11px] leading-5 text-slate-300 sm:text-sm sm:leading-6">
                We have all kinds of furniture including bedroom
                furniture, dining tables and all types of sofa sets.
                Share your requirements and our team will help you
                with details, pricing and availability.
              </p>

              {/* CONTACT PERSON */}

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 sm:mt-5 sm:p-4">

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:text-[9px]">
                  Contact Person
                </p>

                <p className="mt-1 text-sm font-bold text-white sm:text-base">
                  {BUSINESS.name}
                </p>

              </div>

              {/* ADDRESSES */}

              <div className="mt-2.5 grid gap-2.5 sm:mt-3">

                {/* SHOP ADDRESS */}

                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4">

                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#18C6DF]"
                  />

                  <div className="min-w-0">

                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                      Shop Address
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-200 sm:text-xs sm:leading-5">
                      {BUSINESS.shopAddress}
                    </p>

                  </div>
                </div>

                {/* FACTORY ADDRESS */}

                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4">

                  <Factory
                    size={18}
                    className="mt-0.5 shrink-0 text-[#18C6DF]"
                  />

                  <div className="min-w-0">

                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                      Factory Address
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-200 sm:text-xs sm:leading-5">
                      {BUSINESS.factoryAddress}
                    </p>

                  </div>
                </div>

              </div>

              {/* QUICK CONTACT */}

              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">

                {/* WHATSAPP */}

                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 p-3.5 transition hover:bg-[#25D366]/15 sm:p-4"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#42E57D]">
                    <MessageCircle size={18} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                      WhatsApp
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-white sm:text-sm">
                      {BUSINESS.whatsappDisplay}
                    </p>

                  </div>

                  <ArrowUpRight
                    size={16}
                    className="ml-auto shrink-0 text-[#42E57D]"
                  />

                </a>

                {/* EMAIL */}

                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition hover:bg-white/[0.07] sm:p-4"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#079FC0]/15 text-[#18C6DF]">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                      Email
                    </p>

                    <p className="mt-0.5 truncate text-[10px] font-semibold text-white sm:text-xs">
                      {BUSINESS.email}
                    </p>

                  </div>

                  <ArrowUpRight
                    size={16}
                    className="ml-auto shrink-0 text-slate-400"
                  />

                </a>

              </div>

            </div>

            {/* =================================================
                CATEGORIES
            ================================================= */}

            <div className="border-t border-white/10 bg-white/[0.025] p-4 sm:p-6 lg:p-7">

              <div className="mb-3.5 flex items-end justify-between gap-3">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#18C6DF] sm:text-[9px]">
                    Furniture Collection
                  </p>

                  <h4 className="mt-0.5 text-sm font-bold text-white sm:text-lg">
                    Explore Categories
                  </h4>
                </div>

                <span className="shrink-0 rounded-md bg-white/10 px-2 py-1.5 text-[8px] font-bold text-slate-300 sm:px-2.5 sm:text-[9px]">
                  {categories.length} Collections
                </span>

              </div>

              {/* MOBILE = 2 COLUMNS */}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-1 lg:gap-2.5">

                {categories.map((category) => (
                  <a
                    key={category.slug}
                    href={`/products/${category.slug}`}
                    className="group flex min-h-[46px] items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2.5 transition-all duration-300 hover:border-[#12B8D3]/40 hover:bg-[#12B8D3]/10 sm:min-h-[48px] sm:rounded-xl sm:px-4 sm:py-3"
                  >

                    <span className="text-[9px] font-medium leading-4 text-slate-300 transition group-hover:text-white sm:text-xs lg:text-sm">
                      {category.name}
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-[#18C6DF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />

                  </a>
                ))}

              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT FORM
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_45px_rgba(16,29,43,0.055)] sm:rounded-3xl sm:p-6 lg:p-7">

            {/* FORM HEADER */}

            <div className="mb-5 border-b border-slate-100 pb-4 sm:mb-6 sm:pb-5">

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#079CB8] sm:text-[9px]">
                    Send An Inquiry
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#142333] sm:text-2xl">
                    Customer Inquiry Form
                  </h3>

                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF8FA] text-[#079CB8] sm:h-11 sm:w-11">
                  <MessageCircle size={20} />
                </div>

              </div>

              <p className="mt-2 text-[10px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Enter your details and requirements. Your inquiry
                will open directly in WhatsApp.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >

              {/* NAME + PHONE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-[11px] font-semibold text-[#263747] sm:text-xs"
                  >
                    Full Name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength={100}
                      required
                      className={inputClass}
                    />

                  </div>
                </div>

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-[11px] font-semibold text-[#263747] sm:text-xs"
                  >
                    Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <Phone
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={20}
                      pattern="[0-9+() -]{7,20}"
                      title="Please enter a valid phone number"
                      required
                      className={inputClass}
                    />

                  </div>
                </div>

              </div>

              {/* ADDRESS */}

              <div>

                <label
                  htmlFor="address"
                  className="mb-1.5 block text-[11px] font-semibold text-[#263747] sm:text-xs"
                >
                  Delivery Address{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <MapPin
                    size={17}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="City, area and complete delivery address"
                    autoComplete="street-address"
                    rows={2}
                    maxLength={500}
                    required
                    className={`${inputClass} resize-none`}
                  />

                </div>

              </div>

              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="category"
                  className="mb-1.5 block text-[11px] font-semibold text-[#263747] sm:text-xs"
                >
                  Furniture Category{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <Armchair
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >

                    <option value="" disabled>
                      Select furniture category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.slug}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}

                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

              </div>

              {/* MESSAGE */}

              <div>

                <div className="mb-1.5 flex items-center justify-between gap-2">

                  <label
                    htmlFor="message"
                    className="text-[11px] font-semibold text-[#263747] sm:text-xs"
                  >
                    Additional Requirements
                  </label>

                  <span className="text-[9px] text-slate-400">
                    Optional
                  </span>

                </div>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Design, size, quantity, color or any other requirements..."
                  rows={3}
                  maxLength={1500}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3 text-[13px] text-[#142333] outline-none transition-all placeholder:text-slate-400 focus:border-[#079FC0] focus:bg-white focus:ring-4 focus:ring-[#079FC0]/10 sm:text-sm"
                />

              </div>

              {/* QUICK BENEFITS */}

              <div className="grid grid-cols-2 gap-2">

                <div className="flex items-center gap-2 rounded-lg bg-[#F7FAFB] px-3 py-2.5">

                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-[#079FC0]"
                  />

                  <span className="text-[9px] font-semibold text-slate-600 sm:text-[10px]">
                    Quality Furniture
                  </span>

                </div>

                <div className="flex items-center gap-2 rounded-lg bg-[#F7FAFB] px-3 py-2.5">

                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-[#079FC0]"
                  />

                  <span className="text-[9px] font-semibold text-slate-600 sm:text-[10px]">
                    Delivery Across Pakistan
                  </span>

                </div>

              </div>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={isSending}
                className="group flex min-h-[51px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#101D2B] px-4 py-3 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#079CB8] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#079FC0]/20 disabled:cursor-not-allowed disabled:opacity-80 sm:min-h-[54px] sm:text-sm"
              >

                <MessageCircle
                  size={19}
                  className="text-[#28D66F] transition group-hover:text-white"
                />

                <span>
                  {isSending
                    ? "Opening WhatsApp..."
                    : "Send Inquiry on WhatsApp"}
                </span>

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />

              </button>

              {/* NOTE */}

              <div className="flex items-start justify-center gap-1.5 text-center">

                <Clock3
                  size={13}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <p className="text-[9px] leading-4 text-slate-400 sm:text-[10px]">
                  WhatsApp will open with your inquiry details.
                  Review the message before sending.
                </p>

              </div>

            </form>
          </div>
        </div>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <div className="mt-5 overflow-hidden rounded-2xl bg-[#101D2B] shadow-lg sm:mt-6 sm:rounded-3xl">

          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:px-7">

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#18C6DF] sm:text-[9px]">
                Ready To Order?
              </p>

              <h3 className="mt-0.5 text-base font-bold text-white sm:text-xl">
                Talk to Ali Raza today.
              </h3>

              <p className="mt-1 text-[10px] leading-4 text-slate-400 sm:text-xs sm:leading-5">
                Call or message us for furniture details,
                pricing and availability.
              </p>

            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">

              {/* CALL */}

              <a
                href={`tel:+${BUSINESS.phone}`}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-[10px] font-bold text-white transition hover:bg-white/10 sm:min-h-11 sm:rounded-xl sm:px-5 sm:text-xs"
              >

                <Phone size={15} />

                Call Us

              </a>

              {/* WHATSAPP */}

              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-[10px] font-bold text-white transition hover:bg-[#1fbd59] sm:min-h-11 sm:rounded-xl sm:px-5 sm:text-xs"
              >

                <MessageCircle size={16} />

                WhatsApp

                <ArrowUpRight size={14} />

              </a>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;