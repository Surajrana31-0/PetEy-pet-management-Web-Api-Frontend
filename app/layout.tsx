import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/contexts/theme-context';
import { Toaster } from '@/components/ui/sonner';

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
  keywords: ['pet adoption', 'adopt a pet', 'AI pet matcher', 'PetEy', 'dog adoption', 'cat adoption'],
  openGraph: {
    title: 'PetEy — Find Your Perfect Pet Companion',
    description: 'AI-powered pet adoption platform. Find your perfect companion.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
