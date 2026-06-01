import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThreadMint — Custom T-Shirts Printed & Shipped Fast",
  description:
    "Custom t-shirts starting at €29. Pick a design or upload your own. Printed on 180g premium cotton and shipped across Europe in 3-5 days. No minimum order.",
  keywords: "custom t-shirts, print on demand, custom merch, team shirts, personalised t-shirts, Europe shipping, Finland",
  openGraph: {
    title: "ThreadMint — Custom T-Shirts Printed & Shipped Fast",
    description:
      "Custom t-shirts from €29. Pick a design or upload your own. Shipped across Europe in 3-5 days.",
    type: "website",
    url: "https://threadmint.net",
    siteName: "ThreadMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThreadMint — Custom T-Shirts",
    description: "Custom t-shirts from €29. Printed on premium cotton. Ships across Europe in 3-5 days.",
  },
  metadataBase: new URL("https://threadmint.net"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
