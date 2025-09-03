import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Just a simple todo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark antialiased`}>
        <QueryProvider>
          <Header />
          {children}
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
