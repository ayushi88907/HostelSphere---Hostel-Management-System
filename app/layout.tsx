import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "./pages/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>{children}</NextAuthProvider>
          <Toaster
            toastOptions={{
              duration: 3000,
              className: "dark:bg-gray-800 dark:text-white bg-white text-black border border-gray-300 dark:border-gray-700 shadow-md",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
