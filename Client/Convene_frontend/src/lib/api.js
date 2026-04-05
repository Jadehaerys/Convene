const API_BASE = import.meta.env.VITE_API_URL ?? '';
const AUTH_USER_FETCHED_AT_KEY = 'auth_user_fetched_at';
const USER_CACHE_TTL_MS = 60 * 1000;
const GET_RESPONSE_CACHE_TTL_MS = 2 * 1000;

let inFlightUserRequest = null;
const inFlightGetRequests = new Map();
const getResponseCache = new Map();

function getToken() {
  return localStorage.getItem('auth_token');
}

function buildHeaders(extraHeaders = {}, authenticated = true) {
  const headers = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  if (authenticated) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function request(path, options = {}, authenticated = true) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = buildHeaders(options.headers, authenticated);
  const url = `${API_BASE}${path}`;
  const requestKey = method === 'GET' ? `${url}::${JSON.stringify(headers)}` : null;

  if (requestKey) {
    const cached = getResponseCache.get(requestKey);
    const isFresh = cached && (Date.now() - cached.timestamp < GET_RESPONSE_CACHE_TTL_MS);
    if (isFresh) {
      return cached.data;
    }
  }

  if (requestKey && inFlightGetRequests.has(requestKey)) {
    return inFlightGetRequests.get(requestKey);
  }

  const runRequest = (async () => {
    const response = await fetch(url, {
      ...options,
      method,
      headers,
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const error = new Error(data?.message || 'Request failed');
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    if (requestKey) {
      getResponseCache.set(requestKey, { data, timestamp: Date.now() });
    }

    return data;
  })();

  if (requestKey) {
    inFlightGetRequests.set(requestKey, runRequest);
  }

  try {
    return await runRequest;
  } finally {
    if (requestKey) {
      inFlightGetRequests.delete(requestKey);
    }
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('auth_user') || 'null');
  } catch {
    return null;
  }
}

export function storeAuthSession({ user, access_token: accessToken, token }) {
  const resolvedToken = accessToken || token || '';

  if (resolvedToken) {
    localStorage.setItem('auth_token', resolvedToken);
  }

  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem(AUTH_USER_FETCHED_AT_KEY, String(Date.now()));
  }
}

export function clearAuthSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem(AUTH_USER_FETCHED_AT_KEY);
  inFlightUserRequest = null;
  inFlightGetRequests.clear();
  getResponseCache.clear();
}

export async function getCurrentUser({ force = false } = {}) {
  const token = getToken();
  if (!token) {
    return null;
  }

  const storedUser = getStoredUser();
  const fetchedAt = Number(localStorage.getItem(AUTH_USER_FETCHED_AT_KEY) || 0);
  const isCacheFresh = storedUser && fetchedAt && (Date.now() - fetchedAt < USER_CACHE_TTL_MS);

  if (!force && isCacheFresh) {
    return storedUser;
  }

  if (!force && inFlightUserRequest) {
    return inFlightUserRequest;
  }

  inFlightUserRequest = request('/api/user')
    .then((user) => {
      storeAuthSession({ user });
      return user;
    })
    .finally(() => {
      inFlightUserRequest = null;
    });

  return inFlightUserRequest;
}

export function login(payload) {
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, false);
}

export function register(payload) {
  return request('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, false);
}

export function logout() {
  return request('/api/logout', { method: 'POST' });
}

export function getDashboardOverview() {
  return request('/api/dashboard/overview');
}

export function getTutors(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== 'All') {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request(`/api/tutors${suffix}`);
}

export function requestConsultation(tutorId) {
  return request('/api/consultation-sessions/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tutor_id: tutorId }),
  });
}

export function getConsultationSessions(status) {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/api/consultation-sessions${suffix}`);
}

export function updatePreparedState(sessionId) {
  return request(`/api/consultation-sessions/${sessionId}/prepared`, {
    method: 'PATCH',
  });
}

export function rotateConsultationSlot(sessionId) {
  return request(`/api/consultation-sessions/${sessionId}/rotate-slot`, {
    method: 'PATCH',
  });
}

export function getConsultationSession(sessionId) {
  return request(`/api/consultation-sessions/${sessionId}`);
}

export function joinConsultationSession(sessionId) {
  return request(`/api/consultation-sessions/${sessionId}/join`, {
    method: 'POST',
  });
}

export function saveConsultationNotes(sessionId, notes) {
  return request(`/api/consultation-sessions/${sessionId}/notes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
}

export function getLearningSummaries(search = '') {
  const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/api/learning-summaries${suffix}`);
}

export function getSupportFaqs(search = '') {
  const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/api/support/faqs${suffix}`);
}

export function submitSupportTicket(payload) {
  return request('/api/support/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
