const PB_URL = 'http://127.0.0.1:8090';

export async function POST({ request, cookies }) {
  const token  = cookies.get('pb_token')?.value;
  const userId = cookies.get('pb_user_id')?.value;

  if (!token || !userId) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let barId;
  try {
    ({ barId } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Corps invalide' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!barId) {
    return new Response(JSON.stringify({ error: 'barId manquant' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const checkRes = await fetch(
    `${PB_URL}/api/collections/visites/records?filter=user="${userId}"%26%26bar="${barId}"`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const checkData = await checkRes.json();
  if (checkData?.items?.length > 0) {
    return new Response(JSON.stringify({ ok: true, alreadyVisited: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const res = await fetch(`${PB_URL}/api/collections/visites/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ user: userId, bar: barId, valide: true })
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Erreur PocketBase' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
