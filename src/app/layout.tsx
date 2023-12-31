import "~/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "School Wall",
  description: "Papan Pengumuman Digital",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-slate-100 p-4 font-rubik">
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
          <Toaster position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
