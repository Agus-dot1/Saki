import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Kit de Hidratación Esencial',
    description: 'Rutina completa de cuidado de la piel para tipos de piel seca y normal. Hidrata y nutre con ingredientes naturales argentinos.',
    shortDescription: 'Sistema completo de hidratación para piel seca y normal',
    price: 89.99,
    stock: 15,
    contents: [
      'x1 Limpiador Suave',
      'x2 Tónico Hidratante',
      'x1 Sérum Humectante',
      'x1 Crema Hidratante Diaria 500ml'
    ],
    images: [
      'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5069605/pexels-photo-5069605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3737605/pexels-photo-3737605.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    detailedDescription: 'Nuestro Kit de Hidratación Esencial proporciona todo lo que necesitás para una rutina completa de cuidado de la piel que se enfoca en mantener niveles óptimos de hidratación. Formulado con ingredientes naturales de diferentes regiones de Argentina, incluyendo botánicos patagónicos y hierbas andinas. Este kit es perfecto para aquellos con piel seca a normal que buscan lograr una tez saludable y radiante. Usá mañana y noche para mejores resultados.',
    keyBenefits: [
      'Hidratación profunda y duradera',
      'Ingredientes 100% naturales argentinos',
      'Resultados visibles en 2-3 semanas',
      'Libre de químicos agresivos'
    ],
    featuredIngredients: [
      'Aloe Vera patagónico',
      'Aceite de rosa mosqueta',
      'Extracto de manzanilla',
      'Ácido hialurónico natural'
    ],
    discountPercentage: 17,
    oldPrice: 108.50,
    items: [
      { name: 'Limpiador Suave', quantity: 1 },
      { name: 'Tónico Hidratante', quantity: 2 },
      { name: 'Sérum Humectante', quantity: 1 },
      { 
        name: 'Crema Hidratante Diaria', 
        quantity: 1, 
        colorOptions: ['Rosa', 'Celeste'], 
        sizeOptions: ['500ml', '1000ml'] 
      }
    ]
  },
  {
    id: 2,
    name: 'Set Equilibrio Clarificante',
    description: 'Rutina especializada para piel grasa y mixta. Controla el aceite y clarifica sin resecar en exceso.',
    shortDescription: 'Sistema de control de grasa y clarificación de poros',
    price: 94.99,
    stock: 15,
    contents: [
      'Limpiador Purificante',
      'Tónico Equilibrante',
      'Sérum Control de Grasa',
      'Crema Hidratante Ligera'
    ],
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5069606/pexels-photo-5069606.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    detailedDescription: 'El Set Equilibrio Clarificante está especialmente formulado para aquellos con tipos de piel grasa o mixta. Esta rutina integral ayuda a controlar la producción excesiva de grasa mientras mantiene la hidratación esencial. Nuestros productos contienen arcilla natural de la región de Mendoza y extractos botánicos conocidos por sus propiedades clarificantes. El uso regular ayuda a reducir la apariencia de los poros y previene brotes sin despojar a la piel de la humedad necesaria.',
    keyBenefits: [
      'Controla el exceso de grasa',
      'Reduce la apariencia de poros',
      'Previene brotes',
      'Mantiene la hidratación esencial'
    ],
    featuredIngredients: [
      'Arcilla de Mendoza',
      'Extracto de té verde',
      'Extracto de hamamelis',
      'Niacinamida'
    ],
    discountPercentage: 10,
    oldPrice: 105.50,
    items: [
      { name: 'Limpiador Purificante', quantity: 1 },
      { name: 'Tónico Equilibrante', quantity: 1 },
      { name: 'Sérum Control de Grasa', quantity: 1 },
      { name: 'Crema Hidratante Ligera', quantity: 1 }
    ]
  }
];

export default products;