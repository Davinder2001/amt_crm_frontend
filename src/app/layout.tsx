import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
import Header from "./_common/header/header";
import Sidebar from "./_common/sidebar/sidebar";
import Footer from "./_common/footer/footer";


export const metadata: Metadata = {
  title: "AMT CRM",
  description: "By Spark web Solutions",
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
          <div className="main">
            <div className="sidebar">
              <Sidebar />
            </div>
            <div className="main-content">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
