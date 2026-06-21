"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { APPNAME, EARLY_ACCESS } from "@/lib/constant";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/discover", label: "Discover" },
  { href: "/wardrobes", label: "Wardrobes" },
  { href: "/profile", label: "Profile" },
];

const Header = () => {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`${path === "/" ? "flex" : "hidden md:flex"} px-4 lg:px-6 my-2 md:my-6 h-16 items-center justify-between max-w-7xl mx-auto w-full`}
        suppressHydrationWarning
      >
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-12 h-12 min-w-12 rounded-lg flex items-center justify-center shrink-0">
            <Image
              src="/images/oneclq-logo.png"
              alt="OneCLQ Logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xl lg:text-2xl truncate">
              {APPNAME}
            </h1>
            {/* <p className="text-[8px] sm:text-xs text-gray-600 truncate">
              {LOGO_TAGLINE}
            </p> */}
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-gray-700 font-medium hover:text-purple-600 transition-colors ${
                path === link.href && "text-purple-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={EARLY_ACCESS} className="hidden lg:block shrink-0">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-green-800 text-white font-semibold text-xs lg:text-sm"
            >
              Early Access
            </Button>
          </Link>

          {/* Mobile only */}
          {/* <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button> */}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="w-12 h-12 min-w-12 rounded-lg flex items-center justify-center shrink-0">
            <Image
              src="/images/oneclq-logo.png"
              alt="OneCLQ Logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                path === link.href
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA at Bottom */}
        <div className="px-6 py-6 border-t border-gray-100">
          <Link href={EARLY_ACCESS} onClick={() => setMenuOpen(false)}>
            <Button
              size="lg"
              className="w-full bg-gray-900 hover:bg-green-800 text-white font-semibold"
            >
              Early Access
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
