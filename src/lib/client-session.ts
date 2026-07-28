"use client"

import { nanoid } from "nanoid"

const SESSION_KEY = "vinyl-archive-session"

export function getClientSessionId(): string {
	if (typeof window === "undefined") {
		throw new Error("getClientSessionId must only be called in the browser")
	}

	const existing = window.sessionStorage.getItem(SESSION_KEY)
	if (existing) {
		return existing
	}

	const sessionId = nanoid()
	window.sessionStorage.setItem(SESSION_KEY, sessionId)
	return sessionId
}
