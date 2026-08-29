import client from '../api/client';

export async function getEstablishments(filters = {}) {
  const { data } = await client.get('/establishments', { params: filters });
  return data.data;
}

export async function getEstablishment(id) {
  const { data } = await client.get(`/establishments/${id}`);
  return data.data;
}

// Autoservicio: el propio establecimiento del dueño autenticado (sin params).
export async function getMyProfile() {
  const { data } = await client.get('/establishment/profile');
  return data.data;
}

export async function createEstablishment(payload) {
  const { data } = await client.post('/establishments', payload);
  return data.data;
}

export async function updateEstablishment(id, payload) {
  const { data } = await client.put(`/establishments/${id}`, payload);
  return data.data;
}

export async function updateEstablishmentStatus(id, status) {
  const { data } = await client.patch(`/establishments/${id}/status`, { status });
  return data.data;
}

export default {
  getEstablishments,
  getEstablishment,
  getMyProfile,
  createEstablishment,
  updateEstablishment,
  updateEstablishmentStatus,
};
