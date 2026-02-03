import { ProductWithInventory } from '@/types/inventory';

export function generateCollectionSchema(products: ProductWithInventory[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Warrior Leap Products - Ice Baths & Cold Therapy Equipment',
    description: 'Browse our collection of premium ice baths, cold plunge tubs, and cold therapy equipment in Lebanon.',
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
