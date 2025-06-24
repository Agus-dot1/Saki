import { BackendCheckoutData, CartItem } from "../types/backendCheckoutData";


export function buildCheckoutData(
  cartItems: CartItem[],
  customerData: BackendCheckoutData['customer']
): BackendCheckoutData {
  return {
    items: cartItems.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price
      },
      quantity: item.quantity
    })),
    customer: customerData
  };
}
