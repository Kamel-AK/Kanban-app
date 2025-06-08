// app/layout.js
import "./globals.css";
import Providers from "./components/Providers"; // or "./components/Providers" depending on your folder structure

export const metadata = {
  title: "Kanban Board",
  description: "A minimal kanban interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        1) On the server, this <html> has no “class”. 
        2) On first client render, React sees the exact same HTML. 
        3) Only after hydration does next-themes’s useEffect add “.dark” if needed.
      */}
      <body className="bg-white text-gray-900 dark:bg-[#1e1e2d] dark:text-white font-jakarta">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
