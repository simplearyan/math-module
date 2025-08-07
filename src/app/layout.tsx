import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import './katex.min.css'; // For KaTeX CSS
import "katex/dist/katex.min.css";
import "./github.css"; // For Highlight.js GitHub theme (or your chosen theme)
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Module",
  description: "Discover detailed lessons, interactive content, and expertly explained topics across various branches such as algebra, calculus, probability, data analysis, and more. Our resources are designed to help students, professionals, and enthusiasts alike achieve success in academics, competitive exams, and real-world problem solving. Start your learning journey with us and unlock the power of mathematical and statistical understanding today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
