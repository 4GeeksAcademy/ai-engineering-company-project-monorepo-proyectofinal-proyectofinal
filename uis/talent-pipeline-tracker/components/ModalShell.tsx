"use client";

import { useEffect, useRef } from "react";

interface ModalShellProps {
	labelledBy: string;
	onClose: () => void;
	children: React.ReactNode;
}

export function ModalShell({ labelledBy, onClose, children }: ModalShellProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		function handleCancel(event: Event) {
			event.preventDefault();
			onCloseRef.current();
		}

		dialog.addEventListener("cancel", handleCancel);
		dialog.showModal();
		return () => {
			dialog.removeEventListener("cancel", handleCancel);
			if (dialog.open) dialog.close();
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby={labelledBy}
			onClick={(event) => {
				if (event.target === event.currentTarget) onCloseRef.current();
			}}
		>
			{children}
		</dialog>
	);
}