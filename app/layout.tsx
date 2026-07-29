import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PetEy — Find Your Perfect Pet Companion',
    template: '%s | PetEy',
  },
  description:
    'PetEy is a modern pet adoption platform with AI-powered pet matching, adoption workflows, and a seamless browsing experience.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ToastContainer position="top-right" autoClose={4000} />
      </body>
    </html>
  );
}
