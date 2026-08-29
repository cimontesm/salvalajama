import client from '../api/client';

export async function getUsers(filters = {}) {
  const { data } = await client.get('/admin/users', { params: filters });
  return data.data;
}

export async function createUser(payload) {
  const { data } = await client.post('/admin/users', payload);
  return data.data;
}

export async function updateUser(id, payload) {
  const { data } = await client.put(`/admin/users/${id}`, payload);
  return data.data;
}

export async function updateUserStatus(id, status) {
  const { data } = await client.patch(`/admin/users/${id}/status`, { status });
  return data.data;
}

export async function deleteUser(id) {
  const { data } = await client.delete(`/admin/users/${id}`);
  return data;
}

export async function getAdminEstablishments(filters = {}) {
  const { data } = await client.get('/admin/establishments', { params: filters });
  return data.data;
}

export async function createEstablishment(payload) {
  const { data } = await client.post('/admin/establishments', payload);
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

export async function deleteEstablishment(id) {
  const { data } = await client.delete(`/admin/establishments/${id}`);
  return data;
}

export async function getAdminPackages(filters = {}) {
  const { data } = await client.get('/admin/packages', { params: filters });
  return data.data;
}

export async function getMonitoring() {
  const { data } = await client.get('/admin/monitoring');
  return data.data;
}

export default {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  getAdminEstablishments,
  createEstablishment,
  updateEstablishment,
  updateEstablishmentStatus,
  deleteEstablishment,
  getAdminPackages,
  getMonitoring,
};
