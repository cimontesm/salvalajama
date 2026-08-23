import client from '../api/client';

export async function getPackages(filters = {}) {
  const { data } = await client.get('/packages', { params: filters });
  return data.data; // array de paquetes (paginado)
}

export async function getPackage(id) {
  const { data } = await client.get(`/packages/${id}`);
  return data.data;
}
