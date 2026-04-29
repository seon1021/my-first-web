import type { Metadata } from "next";
import "./globals.css";
import Nav from './components/Nav'
import Footer from './components/Footer'
import AuthProvider from './components/AuthProvider'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "내 블로그",
  description: "웹 개발을 배우며 기록하는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="bg-white min-h-screen flex flex-col">
        <AuthProvider>
          <Nav />
          <main className="flex-1 max-w-4xl mx-auto w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
