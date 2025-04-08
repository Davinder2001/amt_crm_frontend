import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
import LayoutWrapper from "../layouts/LayoutWrapper";
import { UserProvider } from "@/provider/UserContext";
import { BreadcrumbProvider } from "@/provider/BreadcrumbContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head'


export const metadata: Metadata = {
  title: "AMT CRM",
  description: "By Spark Web Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#009693" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <body>
      <ToastContainer autoClose={1500} />
        <Provider>
          <BreadcrumbProvider>
            <UserProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </UserProvider>
          </BreadcrumbProvider>
        </Provider>
      </body>
    </html>
  );
}
