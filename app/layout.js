import { Space_Grotesk, Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import CustomCursor from "./components/CustomCursor";
import AnimatedBackground from "./components/AnimatedBackground";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Akhmad Ikbal — Full-Stack Web Developer & Creative Designer",
  description:
    "Portfolio of Akhmad Ikbal — Information Systems student, Full-Stack Developer, Creative Designer, and Chairperson of UKM Pengembangan Komputer.",
  keywords: ["developer", "portfolio", "full-stack", "UI/UX", "creative design", "Next.js", "React", "Laravel", "Indonesia"],
  openGraph: {
    title: "Akhmad Ikbal — Full-Stack Web Developer & Creative Designer",
    description: "I don't just write code — I build solutions that merge engineering logic with creative design.",
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
      <body className="font-inter bg-bg text-text antialiased noise-overlay">
        <ThemeProvider>
          <AnimatedBackground />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
