import Link from "next/link";

export const metadata = {
  title: "Team & Event Shirts — ThreadMint",
  description:
    "Merch your team will actually wear. Custom t-shirts that carry your company or event identity — no minimums, €29/shirt, shipped across Europe in 3-5 days.",
};

const USES = [
  {
    icon: "🚀",
    title: "Startup teams",
    body: "Onboarding kits, team offsites, company retreats. Make everyone feel like they belong.",
  },
  {
    icon: "💻",
    title: "Hackathons & events",
    body: "Staff shirts, volunteer kits, participant swag. We handle big orders and tight timelines.",
  },
  {
    icon: "🎁",
    title: "Client & partner gifts",
    body: "A custom shirt is a gift people actually wear. Great for partnerships and VIP packages.",
  },
  {
    icon: "🏆",
    title: "Conferences",
    body: "Speaker gifts, booth staff uniforms, branded giveaways. We ship to any EU address.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Send us your brief",
    body: "Submit your order form with logo, colors, and quantity. Custom designs welcome.",
  },
  {
    n: "2",
    title: "We confirm & invoice",
    body: "We reply within a few hours with a mockup preview and payment link.",
  },
  {
    n: "3",
    title: "Production & delivery",
    body: "Local Helsinki production starts same day. Shirts ship in 3–5 business days to any EU address.",
  },
];

export default function TeamsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            For teams &amp; events
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Shirts your team<br />will actually wear.
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">
            Merch that carries your company or event identity — not just a shirt
            with a logo. No minimums. €29/shirt. Printed in Helsinki and shipped
            across Europe in 3–5 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="bg-emerald-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-emerald-400 transition-colors text-sm"
            >
              Get a team quote
            </Link>
            <a
              href="mailto:threadmint.com@gmail.com"
              className="border border-gray-600 text-white px-8 py-3.5 rounded-full font-semibold hover:border-gray-400 transition-colors text-sm"
            >
              Email us directly
            </a>
          </div>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="border-b border-gray-100 py-10 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">€29</p>
              <p className="text-sm text-gray-500 mt-1">per shirt (pre-made)</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">10% off</p>
              <p className="text-sm text-gray-500 mt-1">orders of 10+ shirts</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">0</p>
              <p className="text-sm text-gray-500 mt-1">minimum order</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">3–5</p>
              <p className="text-sm text-gray-500 mt-1">days Helsinki → EU</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">Merch that makes your identity real</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {USES.map((u) => (
            <div key={u.title} className="bg-gray-50 rounded-2xl p-6">
              <span className="text-2xl mb-3 block">{u.icon}</span>
              <h3 className="font-bold mb-2 text-sm">{u.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">How team orders work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm mx-auto mb-4">
                  {s.n}
                </span>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to kit out your team?</h2>
        <p className="text-gray-500 mb-8">
          Fill out the order form and we'll get back to you within a few hours
          with a mockup and payment link.
        </p>
        <Link
          href="/order"
          className="bg-emerald-500 text-white px-10 py-4 rounded-full font-semibold text-sm hover:bg-emerald-600 transition-colors"
        >
          Start your team order
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Or email{" "}
          <a href="mailto:threadmint.com@gmail.com" className="text-emerald-600 underline">
            threadmint.com@gmail.com
          </a>{" "}
          for large orders or custom quotes.
        </p>
      </section>
    </div>
  );
}
