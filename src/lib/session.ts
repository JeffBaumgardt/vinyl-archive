export const SESSION_HEADER = "x-session-id";

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_SESSION_ID_LENGTH = 64;

export function isValidSessionId(sessionId: string): boolean {
  if (sessionId.length === 0 || sessionId.length > MAX_SESSION_ID_LENGTH) {
    return false;
  }

  return SESSION_ID_PATTERN.test(sessionId);
}

export function getSessionIdFromRequest(request: Request): string | null {
  const sessionId = request.headers.get(SESSION_HEADER);

  if (sessionId === null) {
    return null;
  }

  const trimmed = sessionId.trim();

  if (!isValidSessionId(trimmed)) {
    return null;
  }

  return trimmed;
}
