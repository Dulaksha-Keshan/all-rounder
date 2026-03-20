import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootAppShell from "@/components/RootAppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// changed this accordingly :) -(the browsing icon and title)
export const metadata: Metadata = {
  metadataBase: new URL("https://all-rounder.lk"),
  title: "All-Rounder",
  description: "All-Rounder - Celebrate.Connect.Contribute.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "All-Rounder",
    description: "All-Rounder - Celebrate.Connect.Contribute.",
    url: "https://all-rounder.lk",
    siteName: "All-Rounder",
    type: "website",
    images: [
      {
        url: "/icons/browserImage.png",
        width: 512,
        height: 512,
        alt: "All-Rounder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All-Rounder",
    description: "All-Rounder - Celebrate.Connect.Contribute.",
    images: ["/icons/browserImage.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icons/browserImage.png",
  },
  verification: {
    google: "6Sy5tGPoqN5DRsspMUfX48blbozuRAVmymjMRupawc8",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const websiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "All-Rounder",
    "alternateName": "All Rounder",
    "url": "https://all-rounder.lk"
  });






  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootAppShell>{children}</RootAppShell>
        {/* Added the structured data script here */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
      </body>
    </html>
  );
}

