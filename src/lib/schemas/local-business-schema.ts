export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Warrior Leap',
    description: 'Ice baths, chillers, and cold plunge systems delivered across Lebanon. Free delivery and installation.',
    url: 'https://warriorleap.com',
    logo: 'https://warriorleap.com/assets/images/logo.png',
    image: 'https://warriorleap.com/assets/images/logo.png',
    telephone: '+961 71 457 820',
    email: 'info@warriorleap.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Beirut',
      addressCountry: 'LB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.8938',
      longitude: '35.5018',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.instagram.com/warrior.leap',
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Warrior Leap',
    url: 'https://warriorleap.com',
    logo: 'https://warriorleap.com/assets/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+961 71 457 820',
      contactType: 'customer service',
      email: 'info@warriorleap.com',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [
      'https://www.instagram.com/warrior.leap',
    ],
  };
}
