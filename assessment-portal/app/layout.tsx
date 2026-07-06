import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../lib/context";
import DashboardLayout from "../components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Xebia LMS - Assessment Portal",
  description: "Assessment Portal for Instructors and Learners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">
        <AppProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </AppProvider>
      </body>
    </html>
  );
}
