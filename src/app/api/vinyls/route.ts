import { NextResponse } from "next/server"

import { getSessionIdFromRequest, SESSION_HEADER } from "@/lib/session"
import { createVinyl, listVinyls } from "@/lib/store"
import { parseVinylInput } from "@/lib/validation"

function missingSessionResponse() {
	return NextResponse.json(
		{
			error: `Missing or invalid ${SESSION_HEADER} header`,
		},
		{ status: 400 },
	)
}

export async function GET(request: Request) {
	const sessionId = getSessionIdFromRequest(request)

	if (!sessionId) {
		return missingSessionResponse()
	}

	return NextResponse.json(listVinyls(sessionId))
}

export async function POST(request: Request) {
	const sessionId = getSessionIdFromRequest(request)

	if (!sessionId) {
		return missingSessionResponse()
	}

	let body: unknown

	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
	}

	const parsed = parseVinylInput(body)

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error, fieldErrors: parsed.fieldErrors }, { status: 400 })
	}

	const vinyl = createVinyl(sessionId, parsed.data)
	return NextResponse.json(vinyl, { status: 201 })
}
