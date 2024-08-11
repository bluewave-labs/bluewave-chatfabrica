import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import ProgressProviders from "@/providers/progress-provider";
import { siteConfig } from "@/config/site";

import "./globals.css";
import AffiliateProvider from "@/providers/affiliate-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  ...siteConfig,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ProgressProviders>{children}</ProgressProviders>
      </body>
      <AffiliateProvider />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}
