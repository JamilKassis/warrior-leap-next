interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  preorderPrice?: number;
  depositAmount?: number;
  status?: string;
  availableQuantity?: number;
  preorderInfo?: {
    depositPercentage: number;
    wishMoneyNumber: string;
    discountPercentage: number;
    estimatedDelivery: string;
  };
}

export default function ProductPrice({
  price,
  originalPrice,
  preorderPrice,
  status = 'active',
}: ProductPriceProps) {
  const isPreorder = status === 'preorder';

  const displayPrice = isPreorder && preorderPrice && preorderPrice > 0 ? preorderPrice : price;
  const showOriginalPrice = isPreorder && preorderPrice && preorderPrice > 0 ? price : originalPrice || 0;

  const discountPercentage =
    showOriginalPrice && showOriginalPrice > displayPrice
      ? Math.round(((showOriginalPrice - displayPrice) / showOriginalPrice) * 100)
      : 0;

  const formatPrice = (num: number): string => num.toLocaleString('en-US');

  return (
    <div className="flex items-baseline gap-3 mb-2">
      <span className="text-3xl text-gray-900">${formatPrice(displayPrice)}</span>
      {showOriginalPrice > 0 && showOriginalPrice > displayPrice && (
        <>
          <span className="text-lg text-gray-400 line-through">${formatPrice(showOriginalPrice)}</span>
          <span className="text-sm font-semibold text-red-500">{discountPercentage}% OFF</span>
        </>
      )}
    </div>
  );
}
