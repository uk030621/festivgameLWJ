import "./globals.css";

export const metadata = {
  title: "Festive Quiz Game",
  description: "A fun, interactive festive quiz game for families.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-festiveGreen to-festiveGold text-gray-900">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
