const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new Error(`Network error calling ${API_BASE_URL}${path}: ${error.message}`);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text ? text : null;
  }

  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
}

export function getLineups() {
  return request('/lineups');
}

export function saveLineup(payload) {
  return request('/lineups', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateLineup(id, payload) {
  return request(`/lineups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteLineup(id, contestMode) {
  const mode = String(contestMode || 'CLASSIC').toUpperCase();
  return request(`/lineups/${id}?contestMode=${encodeURIComponent(mode)}`, {
    method: 'DELETE'
  });
}
