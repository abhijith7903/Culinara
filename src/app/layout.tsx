import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Culinara | AI Recipe Finder",
  description: "Find recipes using AI based on the ingredients you have.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is needed for next-themes to prevent flickering
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          {/* This wrapper ensures the background fills the screen correctly */}
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}