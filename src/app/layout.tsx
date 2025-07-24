'use client';

import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Navigation from '@/components/Navigation';

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

// This is a workaround for the metadata in a client component
// In a real app, you might want to move this to a separate metadata file
const metadata = {
  title: 'Sanket Bhalke | DevOps Engineer',
  description: 'Personal portfolio of Sanket Bhalke, a DevOps Engineer showcasing skills and projects.',
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className={`${firaCode.variable}`} suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
