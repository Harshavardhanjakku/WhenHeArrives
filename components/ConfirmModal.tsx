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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-lg shadow w-full max-w-sm p-4">
				<h3 className="text-base font-semibold mb-2">{title}</h3>
				<p className="text-sm text-gray-600 mb-4">{message}</p>
				<div className="flex justify-end gap-2">
					<button onClick={onCancel} className="px-3 py-1.5 rounded border">Cancel</button>
					<button onClick={onConfirm} className="px-3 py-1.5 rounded bg-red-600 text-white">Delete</button>
				</div>
			</div>
		</div>
	);
}
