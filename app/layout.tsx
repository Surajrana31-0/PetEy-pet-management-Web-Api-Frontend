import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petey — Find Your Perfect Companion',
  description: 'Connect with loving pets looking for their forever homes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
