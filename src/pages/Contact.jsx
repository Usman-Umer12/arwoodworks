
import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Armchair,
  MessageCircle,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

const categories = [
  { name: "Dining Table", slug: "dining-table" },
  { name: "Restaurant Furniture", slug: "restaurant-furniture" },
  { name: "Sofa Set", slug: "sofa-set" },
  { name: "Wooden Sofa", slug: "wooden-sofa" },
  { name: "L.Shape Sofa", slug: "l-shape-sofa" },
  { name: "King Size Bed", slug: "king-size-bed" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    category: "",
    message: "",
  });

  // Replace with your business WhatsApp number
  const WHATSAPP_NUMBER = "923001234567";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
Hello! I would like to make a furniture inquiry.

Name: ${formData.name}
Phone: ${formData.phone}
Delivery Address: ${formData.address}
Category: ${formData.category}

Additional Requirements:
${formData.message || "No additional requirements."}

Please share more details. Thank you!
    `.trim();

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm text-[#142333] outline-none transition-all placeholder:text-slate-400 focus:border-[#12B8D3] focus:bg-white focus:ring-4 focus:ring-[#12B8D3]/10";

  return (
    <section
      id="contact"
      className="w-full bg-[#F7F9FC] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="inline-flex items-center rounded-full border border-[#12B8D3]/20 bg-[#12B8D3]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#078BA8]">
            Get In Touch
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#142333] sm:text-4xl lg:text-5xl">
            Tell Us What You{" "}
            <span className="text-[#079CB8]">Need</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Fill out the form below with your details and furniture
            requirements. Your inquiry will be sent directly to our WhatsApp.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">

          {/* Left Category Panel */}
          <div className="overflow-hidden rounded-2xl bg-[#101D2B] p-5 text-white shadow-lg sm:rounded-3xl sm:p-7 lg:p-8">

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#12B8D3]/15 text-[#18C6DF]">
                <Armchair size={25} />
              </div>

              <div>
                <h3 className="text-xl font-bold sm:text-2xl">
                  Let's Find Your Perfect Furniture
                </h3>
              </div>
            </div>

            <p className="mb-7 text-sm leading-7 text-slate-300">
              From dining tables to luxury sofas, share your requirements
              and let us help you make the right choice.
            </p>

            {/* Categories */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={`/products/${category.slug}`}
                  className="group flex min-h-[50px] items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-all duration-300 hover:border-[#12B8D3]/50 hover:bg-[#12B8D3]/10"
                >
                  <span className="text-sm font-medium text-slate-200 transition group-hover:text-white">
                    {category.name}
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-[#18C6DF] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ))}
            </div>

            {/* Custom Requirements */}
            <div className="mt-6 rounded-xl border border-[#12B8D3]/20 bg-[#12B8D3]/10 p-4 sm:p-5">
              <h4 className="text-sm font-bold text-[#55D4E8]">
                Need something custom?
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Mention your preferred design, size, or other requirements
                in the message field.
              </p>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_45px_rgba(16,29,43,0.05)] sm:rounded-3xl sm:p-7 lg:p-9">

            <div className="mb-7 border-b border-slate-100 pb-5">
              <h3 className="text-xl font-bold text-[#142333] sm:text-2xl">
                Customer Inquiry Form
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Please provide your contact details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name & Phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#263747]"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-[#263747]"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-[#263747]"
                >
                  Delivery Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your city, area, and complete address"
                    autoComplete="street-address"
                    rows={3}
                    maxLength={500}
                    required
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-[#263747]"
                >
                  Furniture Category{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Armchair
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                      <option key={category.slug} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-[#263747]"
                >
                  Additional Requirements{" "}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your preferred design, size, quantity, or any other requirements..."
                  rows={4}
                  maxLength={1500}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#142333] outline-none transition-all placeholder:text-slate-400 focus:border-[#12B8D3] focus:bg-white focus:ring-4 focus:ring-[#12B8D3]/10"
                />
              </div>

              {/* WhatsApp Button */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#101D2B] px-5 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#079CB8] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#12B8D3]/20"
              >
                <MessageCircle
                  size={21}
                  className="text-[#28D66F] transition group-hover:text-white"
                />

                Send Inquiry on WhatsApp

                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Your inquiry will open in WhatsApp for you to review and send.
              </p>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;