import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "./main.css";
import "./main copy.css";
import StoreProvider from "./components/StoreProvider";
import ToastLayout from "./components/ToastLayout";

export const metadata: Metadata = {
  title: "Financial App",
  description: "Fintech - Financial App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <StoreProvider>
        <body>
          {children}
          <ToastLayout />
        </body>
      </StoreProvider>
    </html>
  );
}
