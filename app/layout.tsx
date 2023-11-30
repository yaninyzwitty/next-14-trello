// npm i -D prisma
// npx prisma init
// npx prisma generate
// npx prisma db push
// npm i @prisma/client
// npx prisma migrate reset
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {siteConfig} from "@/config/site";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
