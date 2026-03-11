import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ★ここが最重要！デザインファイルを読み込む命令

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Kenpai",
  description: "Funeral donation system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700;900&family=Noto+Sans+JP:wght@300;400;500&family=Kaisei+Tokumin:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />