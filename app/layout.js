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
  // --- Primary ---
  title: "Akhmad Ikbal · Full-Stack Web Developer & Creative Designer",
  description:
    "Akhmad Ikbal Khoir, Full-Stack Web Developer di Pekalongan. Juara 1 LKS Web Technology Kab. Pekalongan 2024. Mencari posisi Junior Web Developer/magang.",
  keywords: [
    "Akhmad Ikbal Khoir",
    "Akhmad Ikbal",
    "Full-Stack Web Developer",
    "Junior Web Developer",
    "Magang Web Developer",
    "Juara 1 LKS Web Technology",
    "Ketua Umum UKM Pengembangan Komputer",
    "Web Developer Pekalongan",
    "Laravel Next.js Developer",
    "Mahasiswa Sistem Informasi",
    "Pemateri Web Programming",
    "UKM PK Institut Widya Pratama",
  ],
  authors: [{ name: "Akhmad Ikbal Khoir", url: "https://www.akhmadikbal.web.id" }],
  metadataBase: new URL("https://www.akhmadikbal.web.id"),
  alternates: {
    canonical: "https://www.akhmadikbal.web.id",
  },
  openGraph: {
    title: "Akhmad Ikbal · Full-Stack Web Developer & Creative Designer",
    description:
      "Portfolio of Akhmad Ikbal Khoir, Full-Stack Web Developer in Pekalongan. 1st Place LKS Web Technology (Pekalongan Regency, 2024). Seeking Junior Web Developer or internship.",
    type: "website",
    url: "https://www.akhmadikbal.web.id",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    siteName: "Akhmad Ikbal · Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhmad Ikbal · Full-Stack Web Developer & Creative Designer",
    description:
      "Portfolio of Akhmad Ikbal Khoir, Full-Stack Web Developer in Pekalongan. 1st Place LKS Web Technology (Pekalongan Regency, 2024).",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        {/* Scroll restoration */}
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
        {/* JSON-LD: Person schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Akhmad Ikbal Khoir",
              alternateName: "Akhmad Ikbal",
              url: "https://www.akhmadikbal.web.id",
              jobTitle: "Full-Stack Web Developer",
              description:
                "Akhmad Ikbal Khoir adalah mahasiswa Sistem Informasi dan Full-Stack Web Developer asal Pekalongan dengan stack harian Laravel dan Next.js. Ia meraih Juara 1 LKS Web Technology Tingkat Kabupaten Pekalongan serta Juara 1 Lomba Desain Poster di STMIK Widya Pratama pada tahun 2024. Sebagai Ketua Umum UKM Pengembangan Komputer periode 2025/2026, ia mengoordinasikan program pembinaan teknologi seperti study club dan program Goes to School. Ia juga memiliki pengalaman sebagai pemateri pelatihan web programming dan dasar Python, serta saat ini mencari posisi Junior Web Developer atau magang.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pekalongan",
                addressCountry: "ID",
              },
              affiliation: {
                "@type": "EducationalOrganization",
                name: "Institut Widya Pratama",
              },
              award: [
                "Juara 1 LKS Web Technology Tingkat Kabupaten Pekalongan (2024)",
                "Juara 1 Lomba Desain Poster, PK FEST - STMIK Widya Pratama (2024)",
                "Siswa Terbaik RPL SMK Muhammadiyah Pencongan",
              ],
              knowsAbout: [
                "Laravel",
                "Next.js",
                "React",
                "MySQL",
                "Tailwind CSS",
                "Midtrans Gateway",
                "GSAP",
                "Python",
                "Web Programming",
              ],
              sameAs: [
                "https://github.com/ikballbae",
                "https://linkedin.com/in/akhmad-ikbal-khoir",
                "https://instagram.com/ahmdikball",
              ],
            }),
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
