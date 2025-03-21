import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
import LayoutWrapper from "../layouts/LayoutWrapper";
import { UserProvider } from "@/provider/UserContext";
import { BreadcrumbProvider } from "@/provider/BreadcrumbContext";

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
