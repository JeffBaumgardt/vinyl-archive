"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import type { Vinyl, VinylInput, Genre, Condition } from "@/types/vinyl"
import { GENRES, CONDITIONS } from "@/types/vinyl"

type VinylFormProps = {
	initial?: Partial<Vinyl> | Partial<VinylInput>
	errors?: Record<string, string[]>
	onSubmit: (data: VinylInput) => void
	onCancel: () => void
	submitLabel: string
	isPending: boolean
}

const DEFAULT_VALUES: VinylInput = {
	title: "",
	artist: "",
	year: new Date().getFullYear(),
	genre: "Jazz",
	condition: "Near Mint",
	isColoredVinyl: false,
	pricePaid: 0,
	catalogNumber: "",
	notes: "",
	acquiredAt: new Date().toISOString().slice(0, 10),
}

function fieldErrorId(name: keyof VinylInput): string {
	return `vinyl-${name}-error`
}

function firstError(
	errors: Record<string, string[]> | undefined,
	name: keyof VinylInput,
): string | undefined {
	const list = errors?.[name]
	if (!list || list.length === 0) {
		return undefined
	}
	return list[0]
}

export default function VinylForm({
	initial,
	errors,
	onSubmit,
	onCancel,
	submitLabel,
	isPending,
}: VinylFormProps) {
	const [values, setValues] = useState<VinylInput>({
		...DEFAULT_VALUES,
		...initial,
	})

	function handleTextChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = event.target
		setValues((prev) => ({ ...prev, [name]: value }))
	}

	function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target
		const parsed = value === "" ? 0 : Number(value)
		setValues((prev) => ({ ...prev, [name]: parsed }))
	}

	function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const { name, value } = event.target
		setValues((prev) => ({ ...prev, [name]: value }))
	}

	function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, checked } = event.target
		setValues((prev) => ({ ...prev, [name]: checked }))
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (isPending) {
			return
		}
		onSubmit(values)
	}

	function handleCancelClick() {
		if (isPending) {
			return
		}
		onCancel()
	}

	const titleError = firstError(errors, "title")
	const artistError = firstError(errors, "artist")
	const yearError = firstError(errors, "year")
	const genreError = firstError(errors, "genre")
	const conditionError = firstError(errors, "condition")
	const pricePaidError = firstError(errors, "pricePaid")
	const catalogNumberError = firstError(errors, "catalogNumber")
	const notesError = firstError(errors, "notes")
	const acquiredAtError = firstError(errors, "acquiredAt")
	const isColoredVinylError = firstError(errors, "isColoredVinyl")

	return (
		<form className="vinyl-form" onSubmit={handleSubmit} noValidate>
			<div className="form-grid">
				<div className="form-field">
					<label htmlFor="vinyl-title">Title</label>
					<input
						id="vinyl-title"
						name="title"
						type="text"
						value={values.title}
						onChange={handleTextChange}
						aria-invalid={titleError ? true : undefined}
						aria-describedby={titleError ? fieldErrorId("title") : undefined}
						autoComplete="off"
						required
						disabled={isPending}
					/>
					{titleError ? (
						<p id={fieldErrorId("title")} className="field-error" role="alert">
							{titleError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-artist">Artist</label>
					<input
						id="vinyl-artist"
						name="artist"
						type="text"
						value={values.artist}
						onChange={handleTextChange}
						aria-invalid={artistError ? true : undefined}
						aria-describedby={artistError ? fieldErrorId("artist") : undefined}
						autoComplete="off"
						required
						disabled={isPending}
					/>
					{artistError ? (
						<p id={fieldErrorId("artist")} className="field-error" role="alert">
							{artistError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-catalogNumber">Catalog number</label>
					<input
						id="vinyl-catalogNumber"
						name="catalogNumber"
						type="text"
						value={values.catalogNumber}
						onChange={handleTextChange}
						aria-invalid={catalogNumberError ? true : undefined}
						aria-describedby={catalogNumberError ? fieldErrorId("catalogNumber") : undefined}
						autoComplete="off"
						required
						disabled={isPending}
					/>
					{catalogNumberError ? (
						<p id={fieldErrorId("catalogNumber")} className="field-error" role="alert">
							{catalogNumberError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-year">Year</label>
					<input
						id="vinyl-year"
						name="year"
						type="number"
						inputMode="numeric"
						value={values.year}
						onChange={handleNumberChange}
						aria-invalid={yearError ? true : undefined}
						aria-describedby={yearError ? fieldErrorId("year") : undefined}
						min={1900}
						max={new Date().getFullYear() + 1}
						required
						disabled={isPending}
					/>
					{yearError ? (
						<p id={fieldErrorId("year")} className="field-error" role="alert">
							{yearError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-pricePaid">Price paid</label>
					<input
						id="vinyl-pricePaid"
						name="pricePaid"
						type="number"
						inputMode="decimal"
						step="0.01"
						min={0}
						value={values.pricePaid}
						onChange={handleNumberChange}
						aria-invalid={pricePaidError ? true : undefined}
						aria-describedby={pricePaidError ? fieldErrorId("pricePaid") : undefined}
						required
						disabled={isPending}
					/>
					{pricePaidError ? (
						<p id={fieldErrorId("pricePaid")} className="field-error" role="alert">
							{pricePaidError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-genre">Genre</label>
					<select
						id="vinyl-genre"
						name="genre"
						value={values.genre}
						onChange={handleSelectChange}
						aria-invalid={genreError ? true : undefined}
						aria-describedby={genreError ? fieldErrorId("genre") : undefined}
						required
						disabled={isPending}
					>
						{GENRES.map((genre: Genre) => (
							<option key={genre} value={genre}>
								{genre}
							</option>
						))}
					</select>
					{genreError ? (
						<p id={fieldErrorId("genre")} className="field-error" role="alert">
							{genreError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-condition">Condition</label>
					<select
						id="vinyl-condition"
						name="condition"
						value={values.condition}
						onChange={handleSelectChange}
						aria-invalid={conditionError ? true : undefined}
						aria-describedby={conditionError ? fieldErrorId("condition") : undefined}
						required
						disabled={isPending}
					>
						{CONDITIONS.map((condition: Condition) => (
							<option key={condition} value={condition}>
								{condition}
							</option>
						))}
					</select>
					{conditionError ? (
						<p id={fieldErrorId("condition")} className="field-error" role="alert">
							{conditionError}
						</p>
					) : null}
				</div>

				<div className="form-field">
					<label htmlFor="vinyl-acquiredAt">Acquired</label>
					<input
						id="vinyl-acquiredAt"
						name="acquiredAt"
						type="date"
						value={values.acquiredAt}
						onChange={handleTextChange}
						aria-invalid={acquiredAtError ? true : undefined}
						aria-describedby={acquiredAtError ? fieldErrorId("acquiredAt") : undefined}
						required
						disabled={isPending}
					/>
					{acquiredAtError ? (
						<p id={fieldErrorId("acquiredAt")} className="field-error" role="alert">
							{acquiredAtError}
						</p>
					) : null}
				</div>

				<div className="form-field form-field--checkbox">
					<label htmlFor="vinyl-isColoredVinyl" className="checkbox-label">
						<input
							id="vinyl-isColoredVinyl"
							name="isColoredVinyl"
							type="checkbox"
							checked={values.isColoredVinyl}
							onChange={handleCheckboxChange}
							aria-invalid={isColoredVinylError ? true : undefined}
							aria-describedby={isColoredVinylError ? fieldErrorId("isColoredVinyl") : undefined}
							disabled={isPending}
						/>
						<span>Colored vinyl</span>
					</label>
					{isColoredVinylError ? (
						<p id={fieldErrorId("isColoredVinyl")} className="field-error" role="alert">
							{isColoredVinylError}
						</p>
					) : null}
				</div>

				<div className="form-field form-field--full">
					<label htmlFor="vinyl-notes">Notes</label>
					<textarea
						id="vinyl-notes"
						name="notes"
						rows={4}
						value={values.notes}
						onChange={handleTextChange}
						aria-invalid={notesError ? true : undefined}
						aria-describedby={notesError ? fieldErrorId("notes") : undefined}
						disabled={isPending}
					/>
					{notesError ? (
						<p id={fieldErrorId("notes")} className="field-error" role="alert">
							{notesError}
						</p>
					) : null}
				</div>
			</div>

			<div className="form-actions">
				<button type="submit" className="btn btn--primary" disabled={isPending} aria-busy={isPending}>
					{isPending ? "Saving…" : submitLabel}
				</button>
				<button type="button" className="btn btn--ghost" onClick={handleCancelClick} disabled={isPending}>
					Cancel
				</button>
			</div>
		</form>
	)
}
