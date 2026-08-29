import client from '../api/client';

export async function getMyReports() {
  const { data } = await client.get('/establishment/reports');
  return data.data;
}

export default { getMyReports };
