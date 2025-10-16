"use client";
import { useEffect, useState } from 'react';

export function useToast() {
	const [msg, setMsg] = useState<string | null>(null);
	useEffect(() => {
		if (!msg) return;
		const t = setTimeout(() => setMsg(null), 2500);
		return () => clearTimeout(t);
	}, [msg]);
	return {
		msg,
		show: (m: string) => setMsg(m)
	};
}

export default function Toast({ message }: { message: string | null }) {
	if (!message) return null;
	return (
		<div className="fixed bottom-4 inset-x-0 flex justify-center z-50">
			<div className="bg-gray-900/95 text-white text-sm px-4 py-2 rounded-lg shadow-lg border border-black/10">
				{message}
			</div>
		</div>
	);
}
