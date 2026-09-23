
import React from "react";
import { Phone, MapPin, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const collections = [
    { name: "Dining Table", href: "/products/dining-table" },
    { name: "Restaurant Furniture", href: "/products/restaurant-furniture" },
    { name: "Sofa Set", href: "/products/sofa-set" },
    { name: "Wooden Sofa", href: "/products/wooden-sofa" },
    { name: "L-Shape Sofa", href: "/products/l-shape-sofa" },
    { name: "King Size Bed", href: "/products/king-size-bed" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/18LHpDL8nd/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 21v-8h2.8l.4-3.2h-3.2V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3c-.3 0-1.4-.2-2.7-.2-2.7 0-4.5 1.7-4.5 4.7v2h-3v3.2h3V21z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/a.r.woodworks01?igsi=ZWxmcG9jbGNqb3Rj/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@a.r.woodworks?_r=1&_t=ZS-99J5LBX63Jk/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.6 8.1a7.1 7.1 0 0 1-4.2-1.4v7.1a6.2 6.2 0 1 1-6.2-6.2c.4 0 .8 0 1.2.1v3.5a2.8 2.8 0 1 0 1.5 2.6V2h3.5c.3 2.2 2 4 4.2 4.3z" />
        </svg>
      ),
    },
  ];

  const linkClass =
    "text-sm text-white/65 transition-colors duration-200 hover:text-[#39B9E8]";

  const headingClass =
    "mb-5 border-l-2 border-[#159FD0] pl-3 text-xs font-semibold uppercase tracking-[0.16em]";

  return (
    <footer className="relative overflow-hidden bg-[#0B1B2B] text-white">
      {/* Top Accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#123B59] via-[#159FD0] to-[#123B59]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-8 sm:gap-x-10 sm:gap-y-10 sm:py-10 lg:grid-cols-4 lg:gap-12 lg:py-12">

          {/* Brand */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <a href="/" className="inline-block">
              <img
                src="/logo1.webp"
                alt="Furniture Design"
                className="h-[85px] w-auto max-w-full rounded-xl border border-white/10 bg-white object-contain p-1.5 sm:h-[100px]"
              />
            </a>

            <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">
              Discover thoughtfully designed furniture for your home
              and workspace.
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition-all duration-300 hover:border-[#159FD0] hover:bg-[#159FD0] hover:text-white sm:h-10 sm:w-10"
                >
                  <span className="h-[17px] w-[17px]">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className={headingClass}>Quick Links</h3>

            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={linkClass}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="min-w-0">
            <h3 className={headingClass}>Collections</h3>

            <ul className="space-y-3.5">
              {collections.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`${linkClass} break-words`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <h3 className={headingClass}>Contact</h3>

            <div className="space-y-3">
              <a
                href="tel:+923033939167"
                className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3.5 text-sm text-white/70 transition-colors hover:border-[#159FD0]/50 sm:px-4"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-[#39B9E8]"
                />
                <span className="break-words">+9203033939167</span>
              </a>
               <a
                href="tel:+923173039167"
                className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3.5 text-sm text-white/70 transition-colors hover:border-[#159FD0]/50 sm:px-4"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-[#39B9E8]"
                />
                <span className="break-words">+9203173039167</span>
              </a>

              <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3.5 text-sm text-white/70 sm:px-4">
                <MapPin
                  size={17}
                  className="shrink-0 text-[#39B9E8]"
                />
                <span>Lahore, Pakistan</span>
              </div>
            </div>

            <a
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#39B9E8] transition-colors hover:text-white"
            >
              Get in Touch
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-5 text-white/45">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-wider text-white/50 sm:gap-5">
            <a href="/" className="transition-colors hover:text-[#39B9E8]">
              Home
            </a>
            <a href="/products" className="transition-colors hover:text-[#39B9E8]">
              Products
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-1 transition-colors hover:text-[#39B9E8]"
            >
              Contact <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;