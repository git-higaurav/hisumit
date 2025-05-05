import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";

const helvetica = localFont({
  src: "../public/font/Helvetica.otf",
  variable: "--font-helvetica",
});

const roboto = localFont({
  src: "../public/font/Roboto.ttf",
  variable: "--font-roboto",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Sumit Walia",
  description: "Created by higaurav.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helvetica.variable} ${roboto.variable} antialiased`}
      >
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#065f46',
              },
            },
            error: {
              style: {
                background: '#991b1b',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
