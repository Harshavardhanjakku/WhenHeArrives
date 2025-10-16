import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_SITE_NAME || 'When He Arrives',
	description: 'Record and view arrival times',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
            <body className="min-h-screen antialiased bg-gradient-to-b from-black via-gray-900 to-gray-800 text-gray-100">
				{children}
			</body>
		</html>
	);
}
