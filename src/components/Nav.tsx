"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Thread<span className="text-emerald-500">Mint</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/shop" className="hover:text-emerald-500 transition-colors">
            Shop
          </Link>
          <Link href="/teams" className="hover:text-emerald-500 transition-colors">
            For Teams
          </Link>
          <Link href="/order" className="hover:text-emerald-500 transition-colors">
            Custom Order
          </Link>
          <Link
            href="/order"
            className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors"
          >
            Order Now
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-gray-900 mb-1" />
          <span className="block w-5 h-0.5 bg-gray-900 mb-1" />
          <span className="block w-5 h-0.5 bg-gray-900" />
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4 text-sm font-medium border-t border-gray-100 pt-4">
          <Link href="/shop" onClick={() => setOpen(false)}>
            Shop
          </Link>
          <Link href="/teams" onClick={() => setOpen(false)}>
            For Teams
          </Link>
          <Link href="/order" onClick={() => setOpen(false)}>
            Custom Order
          </Link>
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-full text-center"
          >
            Order Now
          </Link>
        </div>
      )}
    </header>
  );
}
