import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Posodobljeno ime in opis
export const metadata = {
  title: "TD Generator",
  description: "Orodje za izdelavo tedenskih delovišč",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <head>
        {/* ✅ Dodan favicon (naj bo favicon.ico v public mapi) */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
