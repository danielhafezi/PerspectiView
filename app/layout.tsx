import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'PerspectiView',
  description: 'Transform narratives into perspectives',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
} 