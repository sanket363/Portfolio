import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: 'Sanket Bhalke | DevOps Engineer',
  description: 'Personal portfolio of Sanket Bhalke, a DevOps Engineer showcasing skills and projects.',
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className={`${firaCode.variable}`}>
      <body className="font-mono">
        {children}
      </body>
    </html>
  );
}
