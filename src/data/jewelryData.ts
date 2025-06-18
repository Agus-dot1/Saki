import { JewelryItem, RingSize, SizeGuideStep } from '../types/jewelry';

export const jewelryItems: JewelryItem[] = [
  {
    id: 1,
    name: 'Anillo Minimalista Plata 925',
    category: 'anillo',
    price: 59.99,
    oldPrice: 69.99,
    discountPercentage: 14,
    coverImage: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Anillo elegante y minimalista de plata 925, perfecto para uso diario.',
    detailedDescription: 'Nuestro anillo minimalista está crafteado en plata 925 de la más alta calidad. Su diseño atemporal lo convierte en la pieza perfecta para cualquier ocasión, desde el uso diario hasta eventos especiales. La superficie pulida refleja la luz de manera hermosa, mientras que el diseño ergonómico asegura comodidad durante todo el día.',
    material: 'Plata 925 (92.5% plata pura)',
    weight: '3.2g',
    dimensions: 'Ancho: 2mm, Grosor: 1.5mm',
    availableSizes: ['5', '6', '7', '8', '9', '10'],
    stock: 25,
    careInstructions: [
      'Limpiar con paño suave y seco',
      'Evitar contacto con perfumes y químicos',
      'Guardar en lugar seco',
      'Usar limpiador de plata ocasionalmente'
    ],
    features: [
      'Plata 925 certificada',
      'Diseño minimalista atemporal',
      'Superficie pulida brillante',
      'Cómodo para uso diario',
      'Hipoalergénico'
    ],
    isCustomizable: true,
    warranty: '1 año contra defectos de fabricación'
  },
  {
    id: 2,
    name: 'Pulsera Eslabones Plata',
    category: 'pulsera',
    price: 74.99,
    oldPrice: 84.99,
    discountPercentage: 12,
    coverImage: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Pulsera de eslabones en plata 925 con diseño moderno y sofisticado.',
    detailedDescription: 'Pulsera de eslabones crafteada en plata 925 pura. Cada eslabón está cuidadosamente pulido para crear un efecto de luz único. El diseño moderno combina perfectamente con cualquier estilo, desde casual hasta formal.',
    material: 'Plata 925',
    weight: '12.5g',
    dimensions: 'Largo: 18-20cm (ajustable), Ancho: 8mm',
    stock: 12,
    careInstructions: [
      'Limpiar regularmente con paño de plata',
      'Evitar exposición a químicos',
      'Guardar en bolsa anti-empañamiento',
      'Secar completamente después del contacto con agua'
    ],
    features: [
      'Eslabones pulidos individualmente',
      'Cierre de seguridad',
      'Diseño unisex',
      'Ajustable',
      'Acabado brillante'
    ],
    warranty: '1 año contra defectos de fabricación'
  },
];

export const ringSizes: RingSize[] = [
  { us: '4', uk: 'H', eu: '47', circumference: '46.8mm', diameter: '14.9mm' },
  { us: '4.5', uk: 'I', eu: '48', circumference: '48.0mm', diameter: '15.3mm' },
  { us: '5', uk: 'J', eu: '49', circumference: '49.3mm', diameter: '15.7mm' },
  { us: '5.5', uk: 'K', eu: '50', circumference: '50.6mm', diameter: '16.1mm' },
  { us: '6', uk: 'L', eu: '51', circumference: '51.9mm', diameter: '16.5mm' },
  { us: '6.5', uk: 'M', eu: '52', circumference: '53.1mm', diameter: '16.9mm' },
  { us: '7', uk: 'N', eu: '54', circumference: '54.4mm', diameter: '17.3mm' },
  { us: '7.5', uk: 'O', eu: '55', circumference: '55.7mm', diameter: '17.7mm' },
  { us: '8', uk: 'P', eu: '56', circumference: '57.0mm', diameter: '18.1mm' },
  { us: '8.5', uk: 'Q', eu: '57', circumference: '58.3mm', diameter: '18.5mm' },
  { us: '9', uk: 'R', eu: '58', circumference: '59.5mm', diameter: '18.9mm' },
  { us: '9.5', uk: 'S', eu: '60', circumference: '60.8mm', diameter: '19.4mm' },
  { us: '10', uk: 'T', eu: '61', circumference: '62.1mm', diameter: '19.8mm' },
  { us: '10.5', uk: 'U', eu: '62', circumference: '63.4mm', diameter: '20.2mm' },
  { us: '11', uk: 'V', eu: '63', circumference: '64.6mm', diameter: '20.6mm' }
];

export const sizeGuideSteps: SizeGuideStep[] = [
  {
    id: 1,
    title: 'Método 1: Medir un anillo existente',
    description: 'Tomá un anillo que te quede bien y medí su diámetro interno con una regla.',
    image: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=400',
    tip: 'Asegurate de medir el diámetro interno, no el externo.'
  },
  {
    id: 2,
    title: 'Método 2: Medir tu dedo',
    description: 'Envolvé una tira de papel alrededor de tu dedo y marcá donde se superpone.',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
    tip: 'Medí al final del día cuando tus dedos están más hinchados.'
  },
  {
    id: 3,
    title: 'Método 3: Usar hilo o cinta',
    description: 'Usá un hilo fino alrededor del dedo, marcá la medida y luego medí con regla.',
    image: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=400',
    tip: 'El hilo debe estar ajustado pero cómodo, no muy apretado.'
  },
  {
    id: 4,
    title: 'Consejos importantes',
    description: 'Medí varias veces para asegurar precisión. Los dedos cambian de tamaño durante el día.',
    tip: 'Si estás entre dos tallas, elegí la más grande para mayor comodidad.'
  }
];