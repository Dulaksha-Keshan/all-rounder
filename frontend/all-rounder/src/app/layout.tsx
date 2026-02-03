import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "All-Rounder",
  description: "All-Rounder - Celebrate.Connect.Contribute.",
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
        {children}
        {/* Added the structured data script here */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
      </body>
    </html>
  );
}

