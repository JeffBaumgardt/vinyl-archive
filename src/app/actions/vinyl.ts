"use server";

import { isValidSessionId } from "@/lib/session";
import {
  createVinyl,
  deleteVinyl,
  getVinyl,
  listVinyls,
  updateVinyl,
} from "@/lib/store";
import { parseVinylInput } from "@/lib/validation";
import type { ActionResult, Vinyl } from "@/types/vinyl";

function invalidSessionResult<T>(): ActionResult<T> {
  return {
    success: false,
    error: "Missing or invalid session id",
  };
}

export async function getVinylsAction(
  sessionId: string,
): Promise<ActionResult<Vinyl[]>> {
  if (!isValidSessionId(sessionId)) {
    return invalidSessionResult();
  }

  return { success: true, data: listVinyls(sessionId) };
}

export async function getVinylAction(
  sessionId: string,
  id: string,
): Promise<ActionResult<Vinyl>> {
  if (!isValidSessionId(sessionId)) {
    return invalidSessionResult();
  }

  const vinyl = getVinyl(sessionId, id);

  if (!vinyl) {
    return { success: false, error: `Vinyl not found: ${id}` };
  }

  return { success: true, data: vinyl };
}

export async function createVinylAction(
  sessionId: string,
  input: unknown,
): Promise<ActionResult<Vinyl>> {
  if (!isValidSessionId(sessionId)) {
    return invalidSessionResult();
  }

  const parsed = parseVinylInput(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error,
      fieldErrors: parsed.fieldErrors,
    };
  }

  return { success: true, data: createVinyl(sessionId, parsed.data) };
}

export async function updateVinylAction(
  sessionId: string,
  id: string,
  input: unknown,
): Promise<ActionResult<Vinyl>> {
  if (!isValidSessionId(sessionId)) {
    return invalidSessionResult();
  }

  const parsed = parseVinylInput(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error,
      fieldErrors: parsed.fieldErrors,
    };
  }

  const vinyl = updateVinyl(sessionId, id, parsed.data);

  if (!vinyl) {
    return { success: false, error: `Vinyl not found: ${id}` };
  }

  return { success: true, data: vinyl };
}

export async function deleteVinylAction(
  sessionId: string,
  id: string,
): Promise<ActionResult<{ id: string }>> {
  if (!isValidSessionId(sessionId)) {
    return invalidSessionResult();
  }

  const deleted = deleteVinyl(sessionId, id);

  if (!deleted) {
    return { success: false, error: `Vinyl not found: ${id}` };
  }

  return { success: true, data: { id } };
}
