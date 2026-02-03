interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
}

export function generateAggregateRatingSchema(testimonials: Testimonial[]) {
  if (!testimonials.length) return null;

  const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Warrior Leap',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: testimonials.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.slice(0, 5).map((t) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: t.comment,
      datePublished: t.created_at,
    })),
  };
}
