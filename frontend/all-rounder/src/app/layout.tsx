import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/layout/navbar2";
import Footer from "@/layout/Footer";
import GoToTopButton from "@/components/GoToTopButton";

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
  isAuthenticated = false,
  userType,
}: Readonly<{
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userType?: "student" | "teacher" | "school" | "organization";
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
        <Navbar isAuthenticated={isAuthenticated} userType={userType} />
        <main className="pt-20 md:pt-0">
          {children}
        </main>
        {/* Added the structured data script here */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
        <Footer />
        <GoToTopButton />
      </body>
    </html>
  );
}

