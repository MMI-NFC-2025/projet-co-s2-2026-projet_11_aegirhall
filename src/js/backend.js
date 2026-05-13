const PB_URL = 'https://pbaegirhall.ines-sittler.fr';

export async function getCollection(collection, options = {}) {
  const params = new URLSearchParams();
  if (options.sort)    params.set('sort', options.sort);
  if (options.filter)  params.set('filter', options.filter);
  if (options.expand)  params.set('expand', options.expand);
  if (options.fields)  params.set('fields', options.fields);
  if (options.perPage) params.set('perPage', String(options.perPage));
  if (options.page)    params.set('page', String(options.page));

  const headers = {};
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`;

  try {
    const res = await fetch(`${PB_URL}/api/collections/${collection}/records?${params}`, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getRecord(collection, id, options = {}) {
  const params = new URLSearchParams();
  if (options.expand) params.set('expand', options.expand);
  if (options.fields) params.set('fields', options.fields);

  const headers = {};
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`;

  try {
    const res = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}?${params}`, { headers });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function authWithPassword(identity, password) {
  try {
    const res = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, password })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function createUser(data) {
  try {
    const res = await fetch(`${PB_URL}/api/collections/users/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) return { error: json };
    return json;
  } catch {
    return { error: { message: 'Erreur réseau' } };
  }
}

export async function getMe(userId, token) {
  return getRecord('users', userId, { token });
}

export async function getVisitesByUser(userId, token) {
  return getCollection('visites', {
    filter: `user="${userId}"`,
    expand: 'bar',
    token
  });
}

export function getPbImageUrl(record, filename, options = {}) {
  if (!record || !filename) return null;
  const params = new URLSearchParams();
  if (options.thumb) params.set('thumb', options.thumb);
  const query = params.toString();
  return `${PB_URL}/api/files/${record.collectionId}/${record.id}/${filename}${query ? '?' + query : ''}`;
}

export async function getImageUrl(record, filename) {
  if (!record || !filename) return null;
  return `${PB_URL}/api/files/${record.collectionId}/${record.id}/${filename}`;
}

export async function updateUser(userId, data, token) {
  try {
    const res = await fetch(`${PB_URL}/api/collections/users/records/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json };
    return json;
  } catch {
    return { error: { message: 'Erreur réseau' } };
  }
}

export async function createSession(data, token) {
  try {
    const res = await fetch(`${PB_URL}/api/collections/session_barathon/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json };
    return json;
  } catch {
    return { error: { message: 'Erreur réseau' } };
  }
}

export async function patchSession(id, data, token) {
  try {
    const res = await fetch(`${PB_URL}/api/collections/session_barathon/records/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json };
    return json;
  } catch {
    return { error: { message: 'Erreur réseau' } };
  }
}

// Crée une visite pour un user+bar (nécessite règles PB permissives sur visites)
export async function createVisite(barId, userId, token) {
  const existing = await getCollection('visites', {
    filter: `user="${userId}"&&bar="${barId}"&&valide=true`,
    fields: 'id',
    token,
  });
  if (existing.length > 0) return { ok: true };
  try {
    const res = await fetch(`${PB_URL}/api/collections/visites/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ user: userId, bar: barId, valide: true }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json };
    return json;
  } catch {
    return { error: { message: 'Erreur réseau' } };
  }
}

export const PB_BASE_URL = PB_URL;
