import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import Providers from "./Providers";

const helvetica = localFont({
  src: "../public/font/Helvetica.otf",
  variable: "--font-helvetica",
});

const roboto = localFont({
  src: "../public/font/Roboto.ttf",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Sumit Walia",
  description: "Created by higaurav.com",
};

export default function RootLayout(
  { children }: Readonly<{children: React.ReactNode;}>
) {
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
