"use client";
import { PropsWithChildren } from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
	open: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl w-full max-w-sm p-5 text-white">
				<h3 className="text-base font-semibold mb-2">{title}</h3>
				<p className="text-sm text-white/80 mb-4">{message}</p>
				<div className="flex justify-end gap-2">
					<button onClick={onCancel} className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white">Cancel</button>
					<button onClick={onConfirm} className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white">Delete</button>
				</div>
			</div>
		</div>
	);
}
