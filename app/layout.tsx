import type React from "react";
import "./globals.css";

import { Mulish } from "next/font/google";

import { Header } from "@/components/header";
import { OrgProvider } from "@/contexts/org-context";
import { Stepper } from "@/components/stepper";

const mulish = Mulish({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <OrgProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-y-auto bg-background-main p-4">
              <Stepper />

              {children}
            </main>
          </div>
        </OrgProvider>
      </body>
    </html>
  );
}
