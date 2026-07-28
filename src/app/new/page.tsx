"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { VinylInput } from "@/types/vinyl"
import { createVinylAction } from "@/app/actions/vinyl"
import { getClientSessionId } from "@/lib/client-session"
import VinylForm from "@/components/VinylForm"
import { useToast } from "@/components/ToastProvider"

export default function NewVinylPage() {
	const router = useRouter()
	const { showSuccess } = useToast()
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined)
	const [formError, setFormError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	function handleCancel() {
		router.push("/")
	}

	function handleSubmit(data: VinylInput) {
		startTransition(async () => {
			setFormError(null)
			setFieldErrors(undefined)
			const sessionId = getClientSessionId()
			const result = await createVinylAction(sessionId, data)
			if (!result.success) {
				setFormError(result.error)
				setFieldErrors(result.fieldErrors)
				return
			}
			showSuccess(`Added “${result.data.title}”.`)
			router.push(`/details/${result.data.id}`)
		})
	}

	return (
		<div className="page-shell">
			<header className="page-header">
				<Link href="/" className="back-link">
					Back to collection
				</Link>
				<p className="eyebrow">New entry</p>
				<h1 className="display-title">Add vinyl</h1>
				<p className="lede">Catalog a record for this browser tab&apos;s archive.</p>
			</header>

			{formError ? (
				<p className="banner banner--error" role="alert">
					{formError}
				</p>
			) : null}

			<VinylForm
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				submitLabel="Save"
				isPending={isPending}
				errors={fieldErrors}
			/>
		</div>
	)
}
