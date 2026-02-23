export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Warrior Leap',
    url: 'https://warriorleap.com',
    description:
      'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment.',
    publisher: {
      '@type': 'Organization',
      name: 'Warrior Leap',
      url: 'https://warriorleap.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://warriorleap.com/products?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en',
  };
}
