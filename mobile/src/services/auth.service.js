import client from '../api/client';

export async function register(payload) {
  const { data } = await client.post('/auth/register', payload);
  return data.data;
}

export async function login(email, password) {
  const { data } = await client.post('/auth/login', { email, password });
  return data.data;
}

export async function logout() {
  const { data } = await client.post('/auth/logout');
  return data;
}

export async function me() {
  const { data } = await client.get('/auth/me');
  return data.data;
}

export async function updateProfile(payload) {
  const { data } = await client.put('/auth/profile', payload);
  return data.data;
}
