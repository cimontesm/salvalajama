import client from '../api/client';

export async function getEstablishmentReviews(establishmentId) {
  const { data } = await client.get(`/establishments/${establishmentId}/reviews`);
  return data.data;
}

export async function createReview({ reservationId, rating, comment }) {
  const { data } = await client.post('/reviews', {
    reservation_id: reservationId,
    rating,
    comment,
  });
  return data.data;
}

export default { getEstablishmentReviews, createReview };
