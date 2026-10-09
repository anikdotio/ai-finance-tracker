import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Ledger — Personal Finance, Precisely",
  description: "A calm, highly calibrated financial workstation. Order, not noise.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark scroll-smooth">
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body
          className={`${inter.variable} ${newsreader.variable} bg-[#0C0D0E] text-[#F4F0E6] font-sans antialiased min-h-screen selection:bg-[#EAE0D5] selection:text-[#0C0D0E]`}
        >
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#131417",
                border: "1px solid #212226",
                color: "#F4F0E6",
              },
            }}
            richColors
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
