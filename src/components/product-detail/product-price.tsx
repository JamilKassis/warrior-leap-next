import { Tag, Truck } from 'lucide-react';

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
  depositAmount,
  status = 'active',
  availableQuantity,
  preorderInfo,
}: ProductPriceProps) {
  const isOutOfStock = status === 'out_of_stock' || (availableQuantity !== undefined && availableQuantity <= 0);
  const isPreorder = status === 'preorder';

  const displayPrice = isPreorder && preorderPrice && preorderPrice > 0 ? preorderPrice : price;
  const showOriginalPrice = isPreorder && preorderPrice && preorderPrice > 0 ? price : originalPrice || 0;

  const discountPercentage =
    showOriginalPrice && showOriginalPrice > displayPrice
      ? Math.round(((showOriginalPrice - displayPrice) / showOriginalPrice) * 100)
      : 0;

  const formatPrice = (num: number): string => num.toLocaleString('en-US');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-brand-primary" />
          <h3 className="text-base font-semibold text-gray-900">Pricing</h3>
        </div>
        {showOriginalPrice > 0 && showOriginalPrice > displayPrice && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-md">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-gray-900">${formatPrice(displayPrice)}</span>
          {showOriginalPrice > 0 && showOriginalPrice > displayPrice && (
            <span className="text-lg text-gray-400 line-through">${formatPrice(showOriginalPrice)}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Truck className="h-4 w-4 text-brand-primary mr-1" />
            <span className="text-xs font-medium text-gray-700">Shipping</span>
          </div>
          <div className="text-sm font-bold text-brand-primary">Free</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <span className="text-xs font-medium text-gray-700">Availability</span>
          </div>
          <div
            className={`text-sm font-bold ${
              isPreorder ? 'text-orange-600' : isOutOfStock ? 'text-brand-primary' : 'text-green-600'
            }`}
          >
            {isPreorder ? 'Preorder' : isOutOfStock ? 'Preorder Available' : 'In Stock'}
          </div>
        </div>
      </div>

      {isOutOfStock && !isPreorder && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-brand-primary mb-1">Preorder Available</p>
            <p className="text-xs text-brand-dark/70">Contact us on WhatsApp to place your preorder</p>
          </div>
        </div>
      )}

      {isPreorder && preorderInfo && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Preorder Payment Details:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit Required:</span>
              <span className="font-medium">${formatPrice(depositAmount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining Balance:</span>
              <span className="font-medium">${formatPrice(displayPrice - (depositAmount || 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated delivery:</span>
              <span className="font-medium">{preorderInfo.estimatedDelivery}</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-gray-600 text-xs">Send deposit via Wish Money to: </span>
              <span className="font-mono font-medium text-xs">{preorderInfo.wishMoneyNumber}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
