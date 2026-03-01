import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CreditIQ — AI-Powered Credit Optimization",
  description: "Maximize your credit score with personalized AI agent insights, behavioral simulations, and strategic card optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#f4f4f5",
                border: "1px solid #27272a",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
