export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': 'https://warriorleap.com/#store',
    name: 'Warrior Leap',
    description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment. Free delivery and installation across Lebanon.',
    url: 'https://warriorleap.com',
    logo: 'https://warriorleap.com/assets/images/logo.png',
    image: 'https://warriorleap.com/assets/images/logo.png',
    telephone: '+961 71 457 820',
    email: 'info@warriorleap.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Beirut',
      addressRegion: 'Beirut',
      addressCountry: 'LB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.8938',
      longitude: '35.5018',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Lebanon',
        sameAs: 'https://en.wikipedia.org/wiki/Lebanon',
      },
      {
        '@type': 'City',
        name: 'Beirut',
      },
      {
        '@type': 'City',
        name: 'Tripoli',
      },
      {
        '@type': 'City',
        name: 'Sidon',
      },
      {
        '@type': 'City',
        name: 'Jounieh',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ice Bath & Cold Plunge Equipment',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Ice Bath Tubs',
          description: 'Portable ice bath tubs for cold therapy and recovery',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Water Chillers',
          description: 'Water chillers to keep your ice bath at the perfect temperature',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Complete Ice Bath Systems',
          description: 'All-in-one ice bath systems with tub and chiller included',
        },
      ],
    },
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card',
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
    '@id': 'https://warriorleap.com/#organization',
    name: 'Warrior Leap',
    url: 'https://warriorleap.com',
    logo: 'https://warriorleap.com/assets/images/logo.png',
    description: 'Lebanon\'s leading provider of ice baths, water chillers, and cold plunge systems.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+961 71 457 820',
      contactType: 'customer service',
      email: 'info@warriorleap.com',
      availableLanguage: ['English', 'Arabic'],
      areaServed: 'LB',
    },
    sameAs: [
      'https://www.instagram.com/warrior.leap',
    ],
  };
}
