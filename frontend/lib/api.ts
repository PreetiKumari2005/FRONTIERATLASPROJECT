const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson?.detail || errJson?.message || JSON.stringify(errJson);
    } catch {
      try {
        errorDetail = await response.text();
      } catch {}
    }
    const message = `API error: ${response.status} ${response.statusText}${errorDetail ? ` - ${errorDetail}` : ''}`;
    throw new Error(message);
  }

  return response.json();
}
