import Link from "next/link";

export const metadata = {
  title: "FAQ — ThreadMint",
};

const FAQS = [
  {
    q: "How long does it take to get my order?",
    a: "Production takes 1-3 business days. Shipping within the EU takes 2-5 business days. You'll receive a tracking number once your order ships.",
  },
  {
    q: "Can I submit my own design?",
    a: "Yes! Select 'Custom Order' and describe your design or upload your artwork. We'll confirm the details before printing.",
  },
  {
    q: "What file formats do you accept for custom designs?",
    a: "We accept PNG, JPG, SVG, and PDF. For best results, use a high-resolution file (300dpi or higher) or a vector format (SVG/PDF).",
  },
  {
    q: "What sizes are available?",
    a: "We stock XS through XXL. Exact availability depends on the design — check the product page or ask us.",
  },
  {
    q: "What is the shirt material?",
    a: "All shirts are printed on 180g 100% cotton unless otherwise noted. Comfortable, durable, and machine washable.",
  },
  {
    q: "How do I pay?",
    a: "After you submit your order form, we'll email you a payment link. We accept all major cards and PayPal.",
  },
  {
    q: "Can I order in bulk?",
    a: "Yes. Orders of 10+ shirts get 10% off automatically. For larger quantities, contact us at threadmint.com@gmail.com for a custom quote.",
  },
  {
    q: "What is your return policy?",
    a: "Because each shirt is made to order, we don't accept general returns. If your item arrives damaged or incorrect, email us within 7 days and we'll reprint or refund at no cost.",
  },
  {
    q: "Do you ship outside the EU?",
    a: "Currently we ship within the EU. International shipping is coming soon — email us if you're outside the EU and we'll see what we can do.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-2">FAQ</h1>
      <p className="text-gray-500 mb-12">
        Can't find your answer?{" "}
        <a href="mailto:threadmint.com@gmail.com" className="text-emerald-600 underline">
          Email us
        </a>
        .
      </p>

      <div className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-gray-100 pb-6">
            <h2 className="font-semibold text-gray-900 mb-2">{item.q}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-emerald-50 rounded-2xl p-8 text-center">
        <h2 className="font-bold text-lg mb-2">Ready to order?</h2>
        <p className="text-sm text-gray-500 mb-4">Starting at €29. Ships in 3-5 days.</p>
        <Link
          href="/order"
          className="bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          Place an order
        </Link>
      </div>
    </div>
  );
}
