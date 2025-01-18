import "@fontsource/open-sauce-two/300.css";
import "@fontsource/open-sauce-two/400.css";
import "@fontsource/open-sauce-two/500.css";
import "@fontsource/open-sauce-two/600.css";
import "@fontsource/open-sauce-two/700.css";
import "./globals.css";
import { cnm } from "@/utils/style";
import { Open_Sans, Urbanist } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-urbanist",
});


/**
 * @type {import("next").Metadata}
 */
export const metadata = {
  title: "Propex - On Chain Real Estate Trade & Loans",
  description:
    "Turn your property into a tradeable digital asset, buy, sell and get instant loans on the world biggest capital market.",
  keywords: ["web3", "property", "crypto", "real estate", "bitcoin", "assets"],
  creator: "Propex",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/assets/logo/propex-logo-only.svg"
          type="image/svg"
        />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propex.app" />
        <meta property="og:title" content="Propex" />
        <meta property="og:description" content="Propex - Turn your property into a tradeable digital asset, buy, sell and get instant loans on the world biggest capital market." />
        <meta property="og:image" content="/assets/images/propex-banner.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://propex.app" />
        <meta property="twitter:title" content="Propex" />
        <meta property="twitter:description" content="Propex - Turn your property into a tradeable digital asset, buy, sell and get instant loans on the world biggest capital market." />
        <meta property="twitter:image" content="/assets/images/propex-banner.png" />

      </head>
      <body
        suppressHydrationWarning
        className={cnm("font-open-sauce", openSans.variable, urbanist.variable)}
      >
        {children}
      </body>
    </html>
  );
}
