import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SIH26080 — Rainfall Forecast Visualization',
  description: 'Operational meteorological console for rainfall forecasting, ML bias calibration, and monsoon telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F8FB] text-slate-800">
        {children}
      </body>
    </html>
  );
}
