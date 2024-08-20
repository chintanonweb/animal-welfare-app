import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "./context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Animal Welfare App",
  description: "From Your Heart to Their Bowl Contribute and Comfort",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
