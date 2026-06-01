import Link from "next/link";
import Image from "next/image";

const DESIGNS = [
  {
    id: 1,
    name: "Minimal Wave",
    price: 29,
    tag: "Bestseller",
    desc: "Clean geometric wave print on premium cotton.",
    img: "/designs/minimal-wave.svg",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    name: "Urban Grid",
    price: 29,
    tag: "New",
    desc: "Bold grid pattern inspired by city blueprints.",
    img: "/designs/urban-grid.svg",
    bg: "bg-slate-900",
  },
  {
    id: 3,
    name: "Botanical",
    price: 32,
    tag: "",
    desc: "Delicate leaf illustration, sustainably printed.",
    img: "/designs/botanical.svg",
    bg: "bg-lime-50",
  },
  {
    id: 4,
    name: "Your Design",
    price: null,
    tag: "Popular",
    desc: "Your artwork, your words, your way.",
    img: "/designs/your-design.svg",
    bg: "bg-violet-50",
    cta: "Start Designing",
    href: "/order",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
          Custom T-Shirts · Ships in 3-5 days
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Wear your idea.
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-10">
          Pick a design we love or bring your own. We print it, pack it, and
          ship it — mint condition, every time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-emerald-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-emerald-600 transition-colors text-sm"
          >
            Browse Designs
          </Link>
          <Link
            href="/order"
            className="border border-gray-200 px-8 py-3.5 rounded-full font-semibold hover:border-gray-400 transition-colors text-sm"
          >
            Custom Order
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                step: "1",
                title: "Pick or design",
                body: "Choose from our catalog or upload your own artwork and text.",
              },
              {
                step: "2",
                title: "We print",
                body: "Our team prints your shirt on high-quality cotton using premium inks.",
              },
              {
                step: "3",
                title: "Delivered to you",
                body: "Your order ships within 3-5 business days, straight to your door.",
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                  {s.step}
                </span>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured designs */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Featured designs</h2>
          <Link
            href="/shop"
            className="text-sm text-emerald-600 font-medium hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESIGNS.map((d) => (
            <div
              key={d.id}
              className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className={`${d.bg} h-52 flex items-center justify-center overflow-hidden`}>
                <Image
                  src={d.img}
                  alt={d.name}
                  width={200}
                  height={200}
                  className="object-contain h-48 w-48"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{d.name}</span>
                  {d.tag && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {d.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">{d.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    {d.price ? `€${d.price}` : "From €29"}
                  </span>
                  <Link
                    href={d.href ?? "/order"}
                    className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-emerald-500 transition-colors"
                  >
                    {d.cta ?? "Order"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-10">What people say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: "Got my custom shirt in 4 days. Quality is insane for the price.",
                name: "Mia K.",
              },
              {
                q: "Ordered matching shirts for our startup. Everyone was impressed.",
                name: "Dev T.",
              },
              {
                q: "Super easy process, the design came out exactly how I imagined.",
                name: "Sara L.",
              },
            ].map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-6 text-left shadow-sm"
              >
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  "{r.q}"
                </p>
                <span className="text-xs font-semibold text-gray-900">
                  {r.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Sustainability strip */}
      <section className="border-y border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h3 className="font-bold text-sm">Water-based inks</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We print with eco-friendly water-based inks — gentler on fabric, gentler on the planet.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">📦</span>
              <h3 className="font-bold text-sm">No bulk required</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Order one shirt or a hundred. No minimums, no waste. Pay only for what you need.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🇫🇮</span>
              <h3 className="font-bold text-sm">Printed in Finland</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Fulfilled locally, shipped across Europe. Short supply chain, lower footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to mint your thread?
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          Starting at €29. Ships in 3-5 days. No minimum order.
        </p>
        <Link
          href="/order"
          className="bg-emerald-500 text-white px-10 py-4 rounded-full font-semibold text-sm hover:bg-emerald-600 transition-colors"
        >
          Start your order
        </Link>
      </section>
    </>
  );
}
