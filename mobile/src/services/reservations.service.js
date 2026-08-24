import client from '../api/client';

export async function createReservation(packageId, quantity = 1) {
  const { data } = await client.post('/reservations', { package_id: packageId, quantity });
  return data.data; // reservation
}

export async function getMyReservations() {
  const { data } = await client.get('/reservations');
  return data.data; // { active: [...], history: [...] }
}

export async function cancelReservation(id) {
  const { data } = await client.patch(`/reservations/${id}/cancel`);
  return data.data;
}

export async function getEstablishmentReservations() {
  const { data } = await client.get('/establishment/reservations');
  return data.data; // { pending: [...], history: [...] }
}

export async function updateReservationStatus(id, status) {
  const { data } = await client.patch(`/establishment/reservations/${id}/status`, { status });
  return data.data;
}
