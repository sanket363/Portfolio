import { Fira_Code } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

export default function DevOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${firaCode.variable}`} suppressHydrationWarning>
      <head>
        <title>DevOps Dashboard | Sanket Bhalke</title>
        <meta name="description" content="DevOps Dashboard showcasing Infrastructure as Code, CI/CD, and Monitoring" />
      </head>
      <body className="font-mono bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
