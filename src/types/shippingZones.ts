// Shipping zones configuration
export interface ShippingZone {
  postalCodes: string[];
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
}

/** Devuelve un array de CP en string de 4 dígitos, ej. range(1000, 1005) */
const range = (start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    String(start + i).padStart(4, '0')
  );

export const SHIPPING_ZONES: ShippingZone[] = [
  // ------- CABA -------
  {
    postalCodes: [...range(1000, 1099)],     
    name: 'CABA Centro',
    cost: 4500,
    estimatedDelivery: '2-3 días hábiles',
    description: 'Envios por Correo Argentino a zona centro de CABA',

  },
  {
    postalCodes: [...range(1100, 1299)],        
    name: 'CABA Norte',
    cost: 5000,
    estimatedDelivery: '2-3 días hábiles',
    description: 'Envios por Correo Argentino a zona norte de CABA',

  },
  {
    postalCodes: [...range(1300, 1499)],      
    name: 'CABA Sur',
    cost: 5000,
    estimatedDelivery: '2-3 días hábiles',
    description: 'Envios por Correo Argentino a zona sur de CABA',

  },

  // ------- GBA -------
  {
    postalCodes: [...range(1600, 1699)],        
    name: 'GBA Norte',
    cost: 6000,
    estimatedDelivery: '3-4 días hábiles',
    description: 'Envios por Correo Argentino a primer cordón norte',

  },
  {
    postalCodes: [...range(1700, 1799)],      
    name: 'GBA Oeste',
    cost: 3000,
    estimatedDelivery: '1-2 días hábiles',
    description: 'Envios por Correo Argentino a zona local y alrededores',

  },
  {
    postalCodes: [...range(1800, 1999)],     
    name: 'GBA Sur',
    cost: 6000,
    estimatedDelivery: '3-4 días hábiles',
    description: 'Envios por Correo Argentino a primer cordón sur',
  },
    {
    postalCodes: [...range(2000, 2999)],
    name: 'Prueba',
    cost: 10,
    estimatedDelivery: '3-4 días hábiles',
    description: 'Envios por Correo Argentino a primer cordón sur',

  }
];

export const DEFAULT_SHIPPING = {
  name: 'Envío Estándar',
  cost: 6000,
  estimatedDelivery: '3-5 días hábiles',
  description: 'Envío a otras zonas'
};