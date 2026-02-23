import { ProductWithInventory } from '@/types/inventory';

export function generateCollectionSchema(products: ProductWithInventory[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Buy Ice Bath & Cold Plunge Equipment in Lebanon - Warrior Leap',
    description: 'Shop ice baths, ice tubs, water chillers, and cold plunge systems in Lebanon. Free delivery and installation. Starting at $600.',
    url: 'https://warriorleap.com/products',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => {
        const urlFriendlyName = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: `https://warriorleap.com/products/${urlFriendlyName}`,
          name: product.name,
        };
      }),
    },
  };
}
