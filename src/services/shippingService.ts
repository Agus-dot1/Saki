import { SHIPPING_ZONES, DEFAULT_SHIPPING, STORE_PICKUP } from '../types/shippingZones';

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
  zone?: string;
}

export interface ShippingMethod {
  id: 'shipping' | 'pickup';
  name: string;
  description: string;
}

export class ShippingService {
  static getShippingMethods(): ShippingMethod[] {
    return [
      { 
        id: 'shipping', 
        name: 'Envío a domicilio', 
        description: 'Recibí tu pedido en tu domicilio' 
      },
      { 
        id: 'pickup', 
        name: 'Retirar en tienda', 
        description: 'Retirá gratis en nuestro local' 
      }
    ];
  }

  static calculateShipping(postalCode: string): ShippingOption | null {
    if (!postalCode || !this.validatePostalCode(postalCode)) {
      return null;
    }

    const cleanCode = postalCode.trim().toUpperCase();

    // Search in predefined zones
    for (const zone of SHIPPING_ZONES) {
      if (zone.postalCodes.includes(cleanCode)) {
        return {
          id: `zone_${cleanCode}`,
          name: zone.name,
          cost: zone.cost,
          estimatedDelivery: zone.estimatedDelivery,
          description: zone.description,
          zone: zone.name
        };
      }
    }

    // Return default shipping if not found
    return {
      id: `default_${cleanCode}`,
      name: DEFAULT_SHIPPING.name,
      cost: DEFAULT_SHIPPING.cost,
      estimatedDelivery: DEFAULT_SHIPPING.estimatedDelivery,
      description: DEFAULT_SHIPPING.description,
      zone: 'Otras zonas'
    };
  }

  static getPickupInfo() {
    return {
      id: 'pickup',
      name: STORE_PICKUP.name,
      cost: STORE_PICKUP.cost,
      estimatedDelivery: STORE_PICKUP.estimatedDelivery,
      description: STORE_PICKUP.description,
      address: STORE_PICKUP.address,
      hours: STORE_PICKUP.hours,
      preparation: STORE_PICKUP.preparation
    };
  }

  static validatePostalCode(postalCode: string): boolean {
    if (!postalCode) return false;
    
    const cleanCode = postalCode.trim();
    
    // Argentina postal code validation
    // 4-5 digits (old format) or 8 characters with letter (new format)
    return /^(\d{4,5}|[A-Z]\d{4}[A-Z]{3})$/i.test(cleanCode);
  }

  static formatShippingCost(cost: number): string {
    return cost === 0 
      ? 'Gratis' 
      : `$${cost.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  static getAllZones() {
    return SHIPPING_ZONES.map(zone => ({
      name: zone.name,
      cost: zone.cost,
      estimatedDelivery: zone.estimatedDelivery,
      description: zone.description,
      postalCodes: zone.postalCodes
    }));
  }

  static getFreeShippingZones() {
    return SHIPPING_ZONES.filter(zone => zone.cost === 0);
  }
}