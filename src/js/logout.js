export async function POST({ cookies }) {
  cookies.delete('pb_token',     { path: '/' });
  cookies.delete('pb_user_id',   { path: '/' });
  cookies.delete('pb_user_name', { path: '/' });
  return new Response(null, { status: 303, headers: { Location: '/LandingPage' } });
}
