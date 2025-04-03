import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
import LayoutWrapper from "../layouts/LayoutWrapper";
import { UserProvider } from "@/provider/UserContext";
import { BreadcrumbProvider } from "@/provider/BreadcrumbContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <body>
      <ToastContainer autoClose={20000000000000} />
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
