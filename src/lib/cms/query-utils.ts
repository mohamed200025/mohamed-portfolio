type QueryError = { message: string; code?: string } | null;

export interface SupabaseQueryResult<T> {
  data: T | null;
  error: QueryError;
  status?: number;
}

export function isAuthQueryError(error: QueryError): boolean {
  if (!error) return false;
  const message = error.message.toLowerCase();
  return (
    error.code === "PGRST303" ||
    message.includes("jwt") ||
    message.includes("unauthorized") ||
    message.includes("401")
  );
}

export function unwrapQuery<T>(
  result: SupabaseQueryResult<T>,
  fallback: T,
  label: string,
  log: (context: string, details: Record<string, unknown>) => void
): T {
  if (result.error) {
    log(`${label} query failed`, {
      message: result.error.message,
      code: result.error.code ?? null,
      status: result.status ?? null,
      authRelated: isAuthQueryError(result.error),
    });
    return fallback;
  }
  return result.data ?? fallback;
}

export function unwrapList<T>(
  result: SupabaseQueryResult<T[]>,
  fallback: T[],
  label: string,
  log: (context: string, details: Record<string, unknown>) => void,
  /** When true, an empty successful result still returns fallback. */
  useFallbackWhenEmpty = true
): T[] {
  if (result.error) {
    log(`${label} query failed`, {
      message: result.error.message,
      code: result.error.code ?? null,
      status: result.status ?? null,
      authRelated: isAuthQueryError(result.error),
    });
    return fallback;
  }
  const rows = result.data ?? [];
  if (useFallbackWhenEmpty && rows.length === 0) {
    return fallback;
  }
  return rows;
}
