import type { Metadata } from "next";
import "@/styles/global.scss";
import Provider from "@/provider/Provider";
// import Header from "./_common/header/header";
import Header from "./[slug]/_common/header/header";
import Sidebar from "./[slug]/_common/sidebar/sidebar";
import Footer from "./[slug]/_common/footer/footer";

// ✅ Import React Toastify
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
          <ToastContainer autoClose={2000} />
        </Provider>
      </body>
    </html>
  );
}
