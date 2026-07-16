import type { Metadata } from "next";
import { Montserrat, Lexend } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monthly Finances",
  description: "Gestiona tus finanzas personales de forma sencilla y segura",
  icons: {
    icon: [
      { url: "/images/logo-icon.svg", media: "(prefers-color-scheme: light)" },
      { url: "/images/logo-icon-blanco.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${lexend.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light')}catch(e){}`}
        </Script>
        <ThemeProvider defaultTheme="system">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
