"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const PREMADE = [
  "Minimal Wave",
  "Urban Grid",
  "Botanical",
  "Sunrise Type",
  "Circuit",
  "Wildflower",
];

function OrderForm() {
  const params = useSearchParams();
  const preselect = params.get("design") ?? "";

  const [form, setForm] = useState({
    type: preselect ? "premade" : "custom",
    design: preselect,
    customDesc: "",
    name: "",
    email: "",
    size: "M",
    qty: "1",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center py-20">
        <span className="text-5xl">✓</span>
        <h2 className="text-2xl font-bold mt-6 mb-2">Order received!</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          We'll email you at <strong>{form.email}</strong> with a payment link
          and confirmation within a few hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-lg">
      {/* Order type */}
      <div>
        <label className="block text-sm font-semibold mb-2">Order type</label>
        <div className="flex gap-3">
          {["premade", "custom"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("type", t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                form.type === t
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "border-gray-200 text-gray-600 hover:border-emerald-300"
              }`}
            >
              {t === "premade" ? "Pre-made design" : "Custom design"}
            </button>
          ))}
        </div>
      </div>

      {/* Design selection */}
      {form.type === "premade" ? (
        <div>
          <label className="block text-sm font-semibold mb-2">
            Choose design
          </label>
          <select
            required
            value={form.design}
            onChange={(e) => set("design", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select a design…</option>
            {PREMADE.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold mb-2">
            Describe your design
          </label>
          <textarea
            required
            rows={4}
            value={form.customDesc}
            onChange={(e) => set("customDesc", e.target.value)}
            placeholder="Describe what you want — text, graphic, colors, style…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
        </div>
      )}

      {/* Size & qty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Size</label>
          <select
            value={form.size}
            onChange={(e) => set("size", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Quantity</label>
          <select
            value={form.qty}
            onChange={(e) => set("qty", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {["1", "2", "3", "4", "5", "10", "20", "50"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Your name</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Jane"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="jane@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Notes{" "}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Shipping address, special requests…"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm">
          Something went wrong. Please email us at threadmint.com@gmail.com.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit order request"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        We'll reply within a few hours with a payment link. No charge until you
        confirm.
      </p>
    </form>
  );
}

export default function OrderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold mb-2">Place an order</h1>
        <p className="text-gray-500">
          Fill in your details and we'll get back to you with a payment link
          and estimated delivery date.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        <Suspense fallback={<div>Loading…</div>}>
          <OrderForm />
        </Suspense>

        {/* Info panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Pricing</h3>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li className="flex justify-between">
                <span>Pre-made design</span>
                <span className="font-medium">€29/shirt</span>
              </li>
              <li className="flex justify-between">
                <span>Custom design</span>
                <span className="font-medium">From €29/shirt</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping (EU)</span>
                <span className="font-medium">€5 flat</span>
              </li>
              <li className="flex justify-between">
                <span>Bulk (10+)</span>
                <span className="font-medium text-emerald-600">10% off</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">What happens next</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>We review your order and email a payment link</li>
              <li>You pay — no charge until you confirm</li>
              <li>Production starts same day</li>
              <li>Ships in 3-5 business days</li>
            </ol>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Need a design?</h3>
            <p className="text-sm text-gray-600 mb-3">
              We can help you create something your team will actually wear — not
              just a logo on a shirt.
            </p>
            <a
              href="https://recraft.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Try our free AI design tool →
            </a>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Questions?</h3>
            <p className="text-sm text-gray-600">
              Email us at{" "}
              <a
                href="mailto:threadmint.com@gmail.com"
                className="text-emerald-600 underline"
              >
                threadmint.com@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
