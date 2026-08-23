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
