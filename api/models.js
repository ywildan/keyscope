export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'JSON body tidak valid.' });
  }

  const apiKey = (body.apiKey || '').trim();
  const baseUrl = (body.baseUrl || '').trim().replace(/\/+$/, ''); // strip trailing slash

  if (!apiKey || !baseUrl) {
    return res.status(400).json({ error: 'apiKey dan baseUrl wajib diisi.' });
  }

  // Tail the base URL with /models unless it already ends there
  const target = /\/models$/i.test(baseUrl) || baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/models`;

  try {
    const upstream = await fetch(target, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const raw = await upstream.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    // Some providers wrap models differently; extract array of ids if present
    let models = null;
    if (Array.isArray(data)) {
      models = data.map(idOrObj => typeof idOrObj === 'string' ? { id: idOrObj } : idOrObj);
    } else if (data && Array.isArray(data.data)) {
      models = data.data;
    } else if (data && Array.isArray(data.models)) {
      models = data.models;
    }

    const ids = (models || [])
      .map(m => (typeof m === 'string' ? m : m?.id))
      .filter(Boolean)
      .sort();

    if (upstream.ok && ids.length) {
      return res.status(200).json({ models: ids, count: ids.length });
    }

    // Build a readable error for common status codes
    const status = upstream.status;
    const detail = (typeof data === 'string' ? data : (data?.error?.message || data?.message || JSON.stringify(data).slice(0, 500))) || '';

    const friendly = {
      401: 'API key tidak valid atau sudah kedaluwarsa.',
      403: 'API key tidak punya izin untuk listing model.',
      404: 'Endpoint /models tidak ditemukan. Periksa Base URL provider.',
      429: 'Terlalu banyak permintaan (rate limit).',
    }[status];

    return res.status(200).json({ error: friendly || (`HTTP ${status}: ${detail}`) });
  } catch (e) {
    return res.status(200).json({ error: 'Gagal terhubung ke provider: ' + (e.message || e) });
  }
}
