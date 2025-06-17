import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChangelogNotifier } from "@/components/ChangelogNotifier";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Learn Tracker",
	description: "Track your daily learning journey",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<main className="flex-1 px-4 py-8 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl mx-auto w-full">
						{/* Show changelog notification on first visit */}
						<ChangelogNotifier />
						{children}
					</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
