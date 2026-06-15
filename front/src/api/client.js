const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

function buildUrl(path) {
  if (path.startsWith('http')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Respuesta no JSON del backend:', text, error);
    return text;
  }
}

function normalizePayload(payload) {
  if (payload && typeof payload === 'object' && 'success' in payload) {
    return {
      success: payload.success,
      data: payload.data ?? payload,
      message: payload.message
    };
  }

  if (payload && typeof payload === 'object' && 'ok' in payload) {
    return {
      success: payload.ok,
      data: payload.data ?? [],
      message: payload.message,
      consulta: payload.consulta,
      error: payload.error
    };
  }

  return {
    success: true,
    data: payload,
    message: ''
  };
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = normalizePayload(await parseResponse(response));

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || `Solicitud fallida (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const apiClient = {
  baseUrl: API_BASE_URL,
  get(path) {
    return request(path, { method: 'GET' });
  },
  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  put(path, body) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },
  delete(path) {
    return request(path, { method: 'DELETE' });
  }
};
