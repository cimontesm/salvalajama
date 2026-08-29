import client from '../api/client';

export async function getPackages(filters = {}) {
  const { data } = await client.get('/packages', { params: filters });
  return data.data;
}

export async function getPackage(id) {
  const { data } = await client.get(`/packages/${id}`);
  return data.data;
}

export async function getMyPackages() {
  const { data } = await client.get('/establishment/packages');
  return data.data;
}

export async function createPackage(payload) {
  const { data } = await client.post('/establishment/packages', payload);
  return data.data;
}

export async function updatePackage(id, payload) {
  const { data } = await client.put(`/establishment/packages/${id}`, payload);
  return data.data;
}

export async function deletePackage(id) {
  const { data } = await client.delete(`/establishment/packages/${id}`);
  return data;
}

// Cecilia Montes