import client from '../api/client';

export async function getImpact() {
  const { data } = await client.get('/impact');
  return data.data;
}
export default client;

// Cecilia Montes