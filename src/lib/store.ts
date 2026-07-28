import { nanoid } from "nanoid"

import { SEED_VINYLS } from "@/lib/seed"
import type { Vinyl, VinylInput } from "@/types/vinyl"

type SessionStore = Map<string, Vinyl>
type RootStore = Map<string, SessionStore>

const globalForStore = globalThis as typeof globalThis & {
	__vinylArchiveStore?: RootStore
}

function getRootStore(): RootStore {
	if (!globalForStore.__vinylArchiveStore) {
		globalForStore.__vinylArchiveStore = new Map()
	}

	return globalForStore.__vinylArchiveStore
}

function seedSession(): SessionStore {
	const session = new Map<string, Vinyl>()

	for (const vinyl of SEED_VINYLS) {
		session.set(vinyl.id, structuredClone(vinyl))
	}

	return session
}

export function getSessionStore(sessionId: string): SessionStore {
	const root = getRootStore()
	const existing = root.get(sessionId)

	if (existing) {
		return existing
	}

	const seeded = seedSession()
	root.set(sessionId, seeded)
	return seeded
}

export function listVinyls(sessionId: string): Vinyl[] {
	return Array.from(getSessionStore(sessionId).values())
}

export function getVinyl(sessionId: string, id: string): Vinyl | undefined {
	return getSessionStore(sessionId).get(id)
}

export function createVinyl(sessionId: string, input: VinylInput): Vinyl {
	const session = getSessionStore(sessionId)
	const vinyl: Vinyl = {
		...input,
		id: `vnl_${nanoid(10)}`,
	}

	session.set(vinyl.id, vinyl)
	return vinyl
}

export function updateVinyl(sessionId: string, id: string, input: VinylInput): Vinyl | undefined {
	const session = getSessionStore(sessionId)
	const existing = session.get(id)

	if (!existing) {
		return undefined
	}

	const updated: Vinyl = { ...input, id }
	session.set(id, updated)
	return updated
}

export function deleteVinyl(sessionId: string, id: string): boolean {
	return getSessionStore(sessionId).delete(id)
}
