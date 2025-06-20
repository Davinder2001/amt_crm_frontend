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
      <body>
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
