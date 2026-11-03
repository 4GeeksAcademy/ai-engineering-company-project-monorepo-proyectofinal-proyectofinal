import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Candidaturas | TrackFlow People & Talent",
	description: "Seguimiento del proceso de selección de TrackFlow en Zaragoza.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es">
			<body>{children}</body>
		</html>
	);
}