import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/sonner"

export const metadata = {
  title: "Mock Mentor",
  description: "Practice interviews with AI",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
        <Toaster/>
        {children}</body>
      </html>
    </ClerkProvider>
  );
}
