import { ProductWithInventory } from '@/types/inventory';

export function generateProductSchema(product: ProductWithInventory) {
  const urlFriendlyName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    url: `https://warriorleap.com/products/${urlFriendlyName}`,
    brand: {
      '@type': 'Brand',
      name: 'Warrior Leap',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability:
        product.computed_status === 'active'
          ? 'https://schema.org/InStock'
          : product.computed_status === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/Discontinued',
      seller: {
        '@type': 'Organization',
        name: 'Warrior Leap',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'LB',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'LB',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
      },
    },
  };
}
