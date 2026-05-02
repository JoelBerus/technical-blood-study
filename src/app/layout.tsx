import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clinical-clarity.com'),
  title: {
    default: 'Clinical Clarity - Blood Lab Report Analyzer',
    template: '%s | Clinical Clarity',
  },
  description: 'AI-powered blood lab report analysis and biomarker classification. Upload your PDF blood test results and get instant AI analysis with reference ranges.',
  keywords: ['blood lab analysis', 'biomarker classification', 'AI health', 'lab report analyzer', 'blood test results'],
  authors: [{ name: 'Clinical Clarity' }],
  creator: 'Clinical Clarity',
  publisher: 'Clinical Clarity',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clinical-clarity.com',
    siteName: 'Clinical Clarity',
    title: 'Clinical Clarity - Blood Lab Report Analyzer',
    description: 'AI-powered blood lab report analysis and biomarker classification',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clinical Clarity - AI Blood Lab Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinical Clarity - Blood Lab Report Analyzer',
    description: 'AI-powered blood lab report analysis and biomarker classification',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        {children}
        <Analytics />
      </body>
    </html>
  );
}