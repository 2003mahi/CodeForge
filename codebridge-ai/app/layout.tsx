import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeBridge AI – From Academic Knowledge to Industry-Ready Skills",
  description: "An AI-powered learning platform that bridges the gap between academic education and industry expectations. Practice coding, debug real bugs, simulate industry workflows, and get AI-powered mentorship.",
  keywords: ["coding platform", "AI mentor", "interview preparation", "coding practice", "software engineering", "EdTech"],
  authors: [{ name: "CodeBridge AI" }],
  openGraph: {
    title: "CodeBridge AI",
    description: "Transform students into industry-ready software engineers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
