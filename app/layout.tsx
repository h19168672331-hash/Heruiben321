import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import CursorTrail from './CursorTrail';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ruiben He — 艺术家与设计师',
  description: 'Ruiben He 的插画、交互设计、品牌视觉与空间艺术作品集。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CursorTrail />
        {children}
      </body>
    </html>
  );
}
