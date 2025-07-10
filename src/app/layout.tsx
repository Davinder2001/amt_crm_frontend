import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
import LayoutWrapper from "../layouts/LayoutWrapper";
import { UserProvider } from "@/provider/UserContext";
import { BreadcrumbProvider } from "@/provider/BreadcrumbContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from '@/provider/themeContext';
import NetworkStatusBanner from "@/components/common/NetworkStatusBanner";
import SplashScreen from "./SplashScreen";

export const metadata: Metadata = {
  title: "AMT CRM",
  description: "By Spark Web Solutions",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/download.png",
    apple: "/icons/download.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#384b70" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/download.png" />
      </head>
      <body>
        <SplashScreen />
        <ToastContainer autoClose={1500} style={{ zIndex: '999999999999999' }} />
        <Provider>
          <ThemeProvider>
            <BreadcrumbProvider>
              <UserProvider>
                <LayoutWrapper>
                  {children}
                  <NetworkStatusBanner />
                </LayoutWrapper>
              </UserProvider>
            </BreadcrumbProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
