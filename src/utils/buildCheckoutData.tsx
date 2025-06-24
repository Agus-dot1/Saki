import { CartItem } from "../types/backendCheckoutData";


interface CustomerData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    postalCode?: string;
}

interface CheckoutItem {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    description: string;
    category_id: string;
}

interface Payer {
    email: string;
    name: string;
    surname: string;
    phone: {
        area_code: string;
        number: string;
    };
    identification: {
        type: string;
        number: string;
    };
    address: {
        street_name: string;
        street_number: number;
        zip_code: string;
    };
}

interface PaymentMethods {
    excluded_payment_types: { id: string }[];
    excluded_payment_methods: { id: string }[];
    installments: number;
    default_payment_method_id: string;
}

interface CheckoutData {
    auto_return: string;
    back_urls: {
        success: string;
        failure: string;
        pending: string;
    };
    statement_descriptor: string;
    binary_mode: boolean;
    external_reference: string;
    items: CheckoutItem[];
    payer: Payer;
    payment_methods: PaymentMethods;
    notification_url: string;
    expires: boolean;
    expiration_date_from: string;
    expiration_date_to: string;
}

export const buildCheckoutData = (
    cartItems: CartItem[],
    customerData: CustomerData
): CheckoutData => {
    const items: CheckoutItem[] = cartItems.map(item => ({
        id: String(item.product.id),
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        description: item.product.description || item.product.name,
        category_id: 'retail',
    }));

    const payer: Payer = {
        email: customerData.email,
        name: customerData.firstName,
        surname: customerData.lastName,
        phone: {
            area_code: customerData.phone.slice(0, 2),
            number: customerData.phone.slice(2),
        },
        identification: {
            type: 'DNI',
            number: '00000000'
        },
        address: {
            street_name: customerData.address,
            street_number: Number(customerData.address.match(/\d+$/)?.[0] || 0),
            zip_code: customerData.postalCode || '',
        }
    };

    return {
        auto_return: 'approved',
        back_urls: {
            success: 'https://saki-tau.vercel.app/success',
            failure: 'https://saki-tau.vercel.app/failure',
            pending: 'https://saki-tau.vercel.app/pending',
        },
        statement_descriptor: 'Saki Skincare',
        binary_mode: false,
        external_reference: `orden${Date.now()}`,
        items,
        payer,
        payment_methods: {
            excluded_payment_types: [],
            excluded_payment_methods: [],
            installments: 12,
            default_payment_method_id: 'account_money',
        },
        notification_url: 'https://jvrvhoyepfcznosljvjw.supabase.co/functions/v1/mercado-pago-webhook',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    };
};
