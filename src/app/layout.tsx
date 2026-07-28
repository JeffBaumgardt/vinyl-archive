import type { Metadata } from "next"
import { Fraunces, Figtree } from "next/font/google"
import ToastProvider from "@/components/ToastProvider"
import "./globals.css"

const fraunces = Fraunces({
	variable: "--font-display",
	subsets: ["latin"],
	display: "swap",
})

const figtree = Figtree({
	variable: "--font-body",
	subsets: ["latin"],
	display: "swap",
})

export const metadata: Metadata = {
	title: "Vinyl Archive",
	description:
		"Portfolio CRUD demo for a session-scoped vinyl record collection — list, create, edit, and delete.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}>
			<body className="min-h-full">
				<a href="#main-content" className="skip-link">
					Skip to content
				</a>
				<ToastProvider>
					<main id="main-content" className="site-main">
						{children}
					</main>
				</ToastProvider>
			</body>
		</html>
	)
}
