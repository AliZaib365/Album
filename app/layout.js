import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar"; // Adjust the path according to your folder structure
import Footer from "./components/Footer"; // Adjust the path according to your folder structure
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HD Wallpapers for Mobile - 4K & Full HD Backgrounds",
  description: "Download stunning HD wallpapers for mobile. Get 4K, Full HD backgrounds for Android & iPhone. Free, high-quality wallpapers updated daily!",
  keywords: "HD wallpapers, mobile backgrounds, 4K wallpapers, Full HD wallpapers, smartphone wallpapers, Android wallpapers, iPhone backgrounds",
  openGraph: {
    title: "HD Wallpapers for Mobile - Free 4K & Full HD Backgrounds",
    description: "Download the best HD wallpapers for mobile. High-quality 4K and Full HD backgrounds for your smartphone.",
    url: "https://latesthdwallpapers.net",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>HD Wallpapers for Mobile - 4K & Full HD Backgrounds</title>
        <meta name="description" content="Download stunning HD wallpapers for mobile. Get 4K, Full HD backgrounds for Android & iPhone. Free, high-quality wallpapers updated daily!" />
        <meta name="keywords" content="HD wallpapers, mobile backgrounds, 4K wallpapers, Full HD wallpapers, smartphone wallpapers, Android wallpapers, iPhone backgrounds" />
        <meta property="og:title" content="HD Wallpapers for Mobile - Free 4K & Full HD Backgrounds" />
        <meta property="og:description" content="Download the best HD wallpapers for mobile. High-quality 4K and Full HD backgrounds for your smartphone." />
        <meta property="og:url" content="https://latesthdwallpapers.net" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}