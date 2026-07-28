"use client"

import { useEffect, useState, useTransition, type KeyboardEvent, type MouseEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Vinyl } from "@/types/vinyl"
import { getVinylsAction, deleteVinylAction } from "@/app/actions/vinyl"
import { getClientSessionId } from "@/lib/client-session"
import ConfirmModal from "@/components/ConfirmModal"
import { useToast } from "@/components/ToastProvider"

const DELETE_ANIMATION_MS = 220

export default function VinylList() {
	const router = useRouter()
	const { showSuccess } = useToast()
	const [vinyls, setVinyls] = useState<Vinyl[]>([])
	const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())
	const [pendingDelete, setPendingDelete] = useState<Vinyl | null>(null)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		let cancelled = false

		async function loadVinyls() {
			setIsLoading(true)
			setLoadError(null)
			const sessionId = getClientSessionId()
			const result = await getVinylsAction(sessionId)
			if (cancelled) {
				return
			}
			if (!result.success) {
				setLoadError(result.error)
				setVinyls([])
				setIsLoading(false)
				return
			}
			setVinyls(result.data)
			setIsLoading(false)
		}

		void loadVinyls()

		return () => {
			cancelled = true
		}
	}, [])

	function handleRowClick(id: string) {
		router.push(`/details/${id}`)
	}

	function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, id: string) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault()
			handleRowClick(id)
		}
	}

	function handleDeleteClick(event: MouseEvent<HTMLButtonElement>, vinyl: Vinyl) {
		event.stopPropagation()
		event.preventDefault()
		setPendingDelete(vinyl)
	}

	function handleCancelDelete() {
		setPendingDelete(null)
	}

	function handleConfirmDelete() {
		if (!pendingDelete) {
			return
		}

		const vinyl = pendingDelete
		setPendingDelete(null)
		setExitingIds((prev) => new Set(prev).add(vinyl.id))

		window.setTimeout(() => {
			startTransition(async () => {
				const sessionId = getClientSessionId()
				const result = await deleteVinylAction(sessionId, vinyl.id)
				if (!result.success) {
					setExitingIds((prev) => {
						const next = new Set(prev)
						next.delete(vinyl.id)
						return next
					})
					setLoadError(result.error)
					return
				}
				setVinyls((prev) => prev.filter((item) => item.id !== vinyl.id))
				setExitingIds((prev) => {
					const next = new Set(prev)
					next.delete(vinyl.id)
					return next
				})
				showSuccess(`Deleted “${vinyl.title}”.`)
			})
		}, DELETE_ANIMATION_MS)
	}

	if (isLoading) {
		return (
			<section className="list-panel" aria-busy="true" aria-live="polite">
				<p className="muted">Loading collection…</p>
			</section>
		)
	}

	return (
		<section className="list-panel">
			<div className="list-toolbar">
				<p className="list-count muted">
					{vinyls.length === 0
						? "No records yet"
						: `${vinyls.length} record${vinyls.length === 1 ? "" : "s"}`}
				</p>
				<Link href="/new" className="btn btn--primary">
					Add vinyl
				</Link>
			</div>

			{loadError ? (
				<p className="banner banner--error" role="alert">
					{loadError}
				</p>
			) : null}

			{vinyls.length === 0 ? (
				<div className="empty-state">
					<h2 className="empty-state__title">Your shelf is empty</h2>
					<p className="muted">Start the archive by adding the first record in this tab&apos;s collection.</p>
					<Link href="/new" className="btn btn--primary">
						Add vinyl
					</Link>
				</div>
			) : (
				<div className="table-wrap">
					<table className="vinyl-table" aria-label="Vinyl collection">
						<caption className="sr-only">Vinyl collection</caption>
						<thead>
							<tr>
								<th scope="col">Title</th>
								<th scope="col">Artist</th>
								<th scope="col">Year</th>
								<th scope="col">Genre</th>
								<th scope="col">Condition</th>
								<th scope="col">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{vinyls.map((vinyl) => {
								const isExiting = exitingIds.has(vinyl.id)
								return (
									<tr
										key={vinyl.id}
										className={`vinyl-row ${isExiting ? "vinyl-row--exiting" : ""}`}
										tabIndex={0}
										onClick={() => handleRowClick(vinyl.id)}
										onKeyDown={(event) => handleRowKeyDown(event, vinyl.id)}
										aria-label={`${vinyl.title} by ${vinyl.artist}. Activate to view details.`}
									>
										<td>{vinyl.title}</td>
										<td>{vinyl.artist}</td>
										<td>{vinyl.year}</td>
										<td>{vinyl.genre}</td>
										<td>{vinyl.condition}</td>
										<td className="vinyl-row__actions">
											<button
												type="button"
												className="btn btn--danger btn--small"
												onClick={(event) => handleDeleteClick(event, vinyl)}
												disabled={isPending || isExiting}
												aria-label={`Delete ${vinyl.title}`}
											>
												Delete
											</button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}

			<ConfirmModal
				open={pendingDelete !== null}
				title="Delete record?"
				description={
					pendingDelete ? (
						<p className="modal__copy">
							Delete “{pendingDelete.title}” by {pendingDelete.artist}? This cannot be undone.
						</p>
					) : null
				}
				confirmLabel="Delete"
				cancelLabel="Cancel"
				danger
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		</section>
	)
}
