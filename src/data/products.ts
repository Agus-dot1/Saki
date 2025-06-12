import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Kit de Hidratación Esencial',
    description: 'Rutina completa de cuidado de la piel para tipos de piel seca y normal. Hidrata y nutre con ingredientes naturales argentinos.',
    shortDescription: 'Sistema completo de hidratación para piel seca y normal',
    price: 89.99,
    stock: 15,
    contents: ['Limpiador Suave', 'Tónico Hidratante', 'Sérum Humectante', 'Crema Hidratante Diaria'],
    images: [
      'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5069605/pexels-photo-5069605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3737605/pexels-photo-3737605.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    detailedDescription: 'Nuestro Kit de Hidratación Esencial proporciona todo lo que necesitás para una rutina completa de cuidado de la piel que se enfoca en mantener niveles óptimos de hidratación. Formulado con ingredientes naturales de diferentes regiones de Argentina, incluyendo botánicos patagónicos y hierbas andinas. Este kit es perfecto para aquellos con piel seca a normal que buscan lograr una tez saludable y radiante. Usá mañana y noche para mejores resultados.'
  },
  {
    id: 2,
    name: 'Set Equilibrio Clarificante',
    description: 'Rutina especializada para piel grasa y mixta. Controla el aceite y clarifica sin resecar en exceso.',
    shortDescription: 'Sistema de control de grasa y clarificación de poros',
    price: 94.99,
    stock: 8,
    contents: ['Limpiador Purificante', 'Tónico Equilibrante', 'Sérum Control de Grasa', 'Crema Hidratante Ligera'],
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5069606/pexels-photo-5069606.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    detailedDescription: 'El Set Equilibrio Clarificante está especialmente formulado para aquellos con tipos de piel grasa o mixta. Esta rutina integral ayuda a controlar la producción excesiva de grasa mientras mantiene la hidratación esencial. Nuestros productos contienen arcilla natural de la región de Mendoza y extractos botánicos conocidos por sus propiedades clarificantes. El uso regular ayuda a reducir la apariencia de los poros y previene brotes sin despojar a la piel de la humedad necesaria.'
  },
  {
    id: 3,
    name: 'Sistema de Recuperación Anti-Edad',
    description: 'Rutina anti-edad avanzada con activos naturales potentes. Reduce líneas finas y mejora la elasticidad de la piel.',
    shortDescription: 'Fórmula avanzada para reducir signos del envejecimiento',
    price: 119.99,
    stock: 12,
    contents: ['Limpiador Regenerador', 'Tónico Antioxidante', 'Sérum Complejo Péptidos', 'Crema Reafirmante'],
    images: [
      'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7319158/pexels-photo-7319158.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6621353/pexels-photo-6621353.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    detailedDescription: 'Nuestro Sistema de Recuperación Anti-Edad es un enfoque integral para abordar los signos visibles del envejecimiento. Formulado con péptidos avanzados, antioxidantes y botánicos naturales de las Pampas argentinas conocidos por sus propiedades rejuvenecedoras. Este sistema ayuda a reducir la apariencia de líneas finas, mejora la elasticidad de la piel y proporciona hidratación profunda. Los productos trabajan sinérgicamente para promover la renovación celular y proteger contra los factores estresantes ambientales.'
  },
  {
    id: 4,
    name: 'Kit Alivio Piel Sensible',
    description: 'Cuidado suave para piel sensible y reactiva. Calma la irritación y fortalece la barrera cutánea.',
    shortDescription: 'Fórmula suave para piel sensible y reactiva',
    price: 99.99,
    stock: 5,
    contents: ['Limpiador Ultra-Suave', 'Esencia Calmante', 'Sérum Reparador de Barrera', 'Crema Tranquilizante'],
    images: [
      'https://images.pexels.com/photos/6621329/pexels-photo-6621329.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6621444/pexels-photo-6621444.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6621395/pexels-photo-6621395.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    detailedDescription: 'El Kit Alivio Piel Sensible está especialmente desarrollado para aquellos con piel sensible, reactiva o propensa a alergias. Esta rutina suave pero efectiva ayuda a calmar la irritación, reducir el enrojecimiento y fortalecer la barrera natural de la piel. Formulado con aloe vera calmante del norte de Argentina y otros botánicos suaves conocidos por sus propiedades antiinflamatorias. Libre de irritantes comunes, fragancias y químicos agresivos para proporcionar la experiencia de cuidado de la piel más segura.'
  }
];

export default products;