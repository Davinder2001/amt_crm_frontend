import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
import UserLayout from "./UserLayout";

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
          <UserLayout>{children}</UserLayout>
        </Provider>
      </body>
    </html>
  );
}
