import { POST as handleCheckin } from './js/checkin.js';
import { POST as handleLogout }  from './js/logout.js';

export async function onRequest(context, next) {
  const { request, url } = context;

  if (request.method === 'POST' && url.pathname === '/checkin') {
    return handleCheckin(context);
  }

  if (request.method === 'POST' && url.pathname === '/logout') {
    return handleLogout(context);
  }

  return next();
}
