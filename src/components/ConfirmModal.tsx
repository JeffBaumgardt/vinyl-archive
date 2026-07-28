"use client"

import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react"

type ConfirmModalProps = {
	open: boolean
	title: string
	description: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	danger?: boolean
	isPending?: boolean
	onConfirm: () => void
	onCancel: () => void
}

export default function ConfirmModal({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	danger = false,
	isPending = false,
	onConfirm,
	onCancel,
}: ConfirmModalProps) {
	const titleId = useId()
	const descriptionId = useId()
	const dialogRef = useRef<HTMLDivElement>(null)
	const cancelRef = useRef<HTMLButtonElement>(null)
	const previouslyFocusedRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		if (!open) {
			return
		}

		previouslyFocusedRef.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null

		const frame = window.requestAnimationFrame(() => {
			cancelRef.current?.focus()
		})

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"

		return () => {
			window.cancelAnimationFrame(frame)
			document.body.style.overflow = previousOverflow
			previouslyFocusedRef.current?.focus()
		}
	}, [open])

	if (!open) {
		return null
	}

	function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
		if (event.target !== event.currentTarget || isPending) {
			return
		}
		onCancel()
	}

	function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		if (event.key === "Escape") {
			event.preventDefault()
			event.stopPropagation()
			if (!isPending) {
				onCancel()
			}
			return
		}

		if (event.key !== "Tab" || !dialogRef.current) {
			return
		}

		const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
			'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
		)
		if (focusable.length === 0) {
			return
		}

		const first = focusable[0]
		const last = focusable[focusable.length - 1]

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault()
			last.focus()
			return
		}

		if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first.focus()
		}
	}

	function handleConfirmClick() {
		if (isPending) {
			return
		}
		onConfirm()
	}

	function handleCancelClick() {
		if (isPending) {
			return
		}
		onCancel()
	}

	return (
		<div className="modal-backdrop" onClick={handleBackdropClick} role="presentation">
			<div
				ref={dialogRef}
				className="modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				tabIndex={-1}
				onKeyDown={handleDialogKeyDown}
				onClick={(event) => event.stopPropagation()}
			>
				<h2 id={titleId} className="modal__title">
					{title}
				</h2>
				<div id={descriptionId} className="modal__body">
					{description}
				</div>
				<div className="modal__actions">
					<button
						ref={cancelRef}
						type="button"
						className="btn btn--ghost"
						onClick={handleCancelClick}
						disabled={isPending}
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						className={`btn ${danger ? "btn--danger-solid" : "btn--primary"}`}
						onClick={handleConfirmClick}
						disabled={isPending}
						aria-busy={isPending}
					>
						{isPending ? "Working…" : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	)
}
