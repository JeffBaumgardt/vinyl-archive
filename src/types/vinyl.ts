export const GENRES = ["Jazz", "Rock", "Electronic", "Classical", "Hip-Hop", "Folk", "Soul", "Punk"] as const

export type Genre = (typeof GENRES)[number]

export const CONDITIONS = ["Mint", "Near Mint", "Very Good", "Good", "Fair"] as const

export type Condition = (typeof CONDITIONS)[number]

export interface Vinyl {
	id: string
	title: string
	artist: string
	year: number
	genre: Genre
	condition: Condition
	isColoredVinyl: boolean
	pricePaid: number
	catalogNumber: string
	notes: string
	acquiredAt: string
}

export type VinylInput = Omit<Vinyl, "id">

export type ActionResult<T> =
	{ success: true; data: T } | { success: false; error: string; fieldErrors?: Record<string, string[]> }
