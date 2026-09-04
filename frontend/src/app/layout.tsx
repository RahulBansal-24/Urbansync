import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UrbanSync — AI-Powered Smart City Digital Twin (Delhi)',
  description: 'Observe, understand, predict, simulate, optimize, and explain real-world Delhi city intelligence.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-text antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
