"use client"

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactNode,
} from "react"

type ToastContextValue = {
	showSuccess: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DISMISS_MS = 3000

export function useToast(): ToastContextValue {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error("useToast must be used within ToastProvider")
	}
	return context
}

type ToastProviderProps = {
	children: ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
	const [message, setMessage] = useState<string | null>(null)
	const [visible, setVisible] = useState(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const toastId = useId()

	const clearTimer = useCallback(function clearTimer() {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
			timerRef.current = null
		}
	}, [])

	const dismiss = useCallback(
		function dismiss() {
			clearTimer()
			setVisible(false)
			setMessage(null)
		},
		[clearTimer],
	)

	const showSuccess = useCallback(
		function showSuccess(nextMessage: string) {
			clearTimer()
			setMessage(nextMessage)
			setVisible(true)
			timerRef.current = setTimeout(() => {
				setVisible(false)
				setMessage(null)
				timerRef.current = null
			}, DISMISS_MS)
		},
		[clearTimer],
	)

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && message) {
				dismiss()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [message, dismiss])

	useEffect(() => {
		return () => {
			clearTimer()
		}
	}, [clearTimer])

	return (
		<ToastContext.Provider value={{ showSuccess }}>
			{children}
			<div
				id={toastId}
				className={`toast ${visible && message ? "toast--visible" : ""}`}
				role="status"
				aria-live="polite"
				aria-atomic="true"
			>
				{message ? (
					<div className="toast__inner">
						<p className="toast__message">{message}</p>
						<button
							type="button"
							className="toast__dismiss"
							onClick={dismiss}
							aria-label="Dismiss notification"
						>
							Dismiss
						</button>
					</div>
				) : null}
			</div>
		</ToastContext.Provider>
	)
}
