import { NextResponse } from "next/server"

import { getSessionIdFromRequest, SESSION_HEADER } from "@/lib/session"
import { deleteVinyl, getVinyl, updateVinyl } from "@/lib/store"
import { parseVinylInput } from "@/lib/validation"

type RouteContext = {
	params: Promise<{ id: string }>
}

function missingSessionResponse() {
	return NextResponse.json(
		{
			error: `Missing or invalid ${SESSION_HEADER} header`,
		},
		{ status: 400 },
	)
}

function notFoundResponse(id: string) {
	return NextResponse.json({ error: `Vinyl not found: ${id}` }, { status: 404 })
}

export async function GET(request: Request, context: RouteContext) {
	const sessionId = getSessionIdFromRequest(request)

	if (!sessionId) {
		return missingSessionResponse()
	}

	const { id } = await context.params
	const vinyl = getVinyl(sessionId, id)

	if (!vinyl) {
		return notFoundResponse(id)
	}

	return NextResponse.json(vinyl)
}

export async function PUT(request: Request, context: RouteContext) {
	const sessionId = getSessionIdFromRequest(request)

	if (!sessionId) {
		return missingSessionResponse()
	}

	const { id } = await context.params
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

	const vinyl = updateVinyl(sessionId, id, parsed.data)

	if (!vinyl) {
		return notFoundResponse(id)
	}

	return NextResponse.json(vinyl)
}

export async function DELETE(request: Request, context: RouteContext) {
	const sessionId = getSessionIdFromRequest(request)

	if (!sessionId) {
		return missingSessionResponse()
	}

	const { id } = await context.params
	const deleted = deleteVinyl(sessionId, id)

	if (!deleted) {
		return notFoundResponse(id)
	}

	return NextResponse.json({ id })
}
