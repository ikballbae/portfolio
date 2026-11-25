import { Space_Grotesk, Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import CustomCursor from "./components/CustomCursor";
import AnimatedBackground from "./components/AnimatedBackground";
import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import { LoadingProvider } from "./context/LoadingContext";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Akhmad Ikbal · Full-Stack Web Developer",
  description:
    "Portfolio of Akhmad Ikbal: Information Systems student, Full-Stack Developer, and Chairperson of UKM Pengembangan Komputer.",
  keywords: ["developer", "portfolio", "full-stack", "Next.js", "React", "Laravel", "Indonesia"],
  openGraph: {
    title: "Akhmad Ikbal · Full-Stack Web Developer",
    description: "I don't just write code; I build solutions that merge engineering logic with full-stack architecture.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${grotesk.variable} ${jakarta.variable} ${inter.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/mascots/ikbal-directions.webp"
          media="(min-width: 1024px)"
          type="image/webp"
        />
      </head>
      <body className="font-sans bg-bg text-text antialiased noise-overlay">
        <ThemeProvider>
          <LoadingProvider>
            <SmoothScroll>
              <Preloader />
              <AnimatedBackground />
              <CustomCursor />
              {children}
            </SmoothScroll>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
