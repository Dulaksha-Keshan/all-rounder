import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://all-rounder.lk/sitemap.xml",
    host: "https://all-rounder.lk",
  };
}
