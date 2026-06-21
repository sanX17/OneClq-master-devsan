import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { APPNAME, HERO_TAGLINE } from "@/lib/constant";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APPNAME}`,
    default: `${APPNAME}`,
  },
  description: HERO_TAGLINE,
  metadataBase: new URL("https://oneclq.com"),
  openGraph: {
    title: `OneClq`,
    description: `${HERO_TAGLINE}`,
    url: "https://oneclq.com",
    siteName: "OneClq",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "OneClq",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Script */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '973237671596059');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=973237671596059&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body
        className={`${poppins.className} antialiased scrollbar`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
