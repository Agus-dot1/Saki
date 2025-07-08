  import { KitItem } from "../types/builder";

  
  // Productos disponibles para el kit
  export const availableItems: KitItem[] = [
    // Limpieza
    {
      id: 101,
      name: 'Limpiador Facial Suave',
      price: 12,
      image: 'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'limpieza',
      description: 'Limpiador suave para todo tipo de piel',
      benefits: ['Elimina impurezas', 'No reseca la piel', '100% natural']
    },
    {
      id: 102,
      name: 'Exfoliante Natural',
      price: 15,
      image: 'https://images.pexels.com/photos/5069605/pexels-photo-5069605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'limpieza',
      description: 'Exfoliante con ingredientes naturales',
      benefits: ['Remueve células muertas', 'Textura suave', 'Ingredientes orgánicos']
    },
    {
      id: 103,
      name: 'Tónico Equilibrante',
      price: 18,
      image: 'https://images.pexels.com/photos/3737605/pexels-photo-3737605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'limpieza',
      description: 'Tónico que equilibra el pH de la piel',
      benefits: ['Equilibra pH', 'Minimiza poros', 'Prepara la piel']
    },

    // Hidratación
    {
      id: 201,
      name: 'Sérum Hidratante',
      price: 25,
      image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'hidratacion',
      description: 'Sérum concentrado con ácido hialurónico',
      benefits: ['Hidratación profunda', 'Ácido hialurónico', 'Absorción rápida']
    },
    {
      id: 202,
      name: 'Crema Hidratante Día',
      price: 20,
      image: 'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'hidratacion',
      description: 'Crema hidratante para uso diario',
      benefits: ['Hidratación 24h', 'Protección UV', 'Textura ligera']
    },
    {
      id: 203,
      name: 'Mascarilla Nutritiva',
      price: 22,
      image: 'https://images.pexels.com/photos/5069606/pexels-photo-5069606.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'hidratacion',
      description: 'Mascarilla intensiva nutritiva',
      benefits: ['Nutrición intensa', 'Uso semanal', 'Ingredientes premium']
    },

    // Tratamiento
    {
      id: 301,
      name: 'Sérum Anti-edad',
      price: 35,
      image: 'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'tratamiento',
      description: 'Sérum concentrado anti-edad',
      benefits: ['Reduce arrugas', 'Firmeza', 'Vitamina C']
    },
    {
      id: 302,
      name: 'Contorno de Ojos',
      price: 28,
      image: 'https://images.pexels.com/photos/5069605/pexels-photo-5069605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'tratamiento',
      description: 'Tratamiento específico para contorno de ojos',
      benefits: ['Reduce ojeras', 'Anti-bolsas', 'Hidratación específica']
    },

    // Accesorios
    {
      id: 401,
      name: 'Gua Sha Facial',
      price: 16,
      image: 'https://images.pexels.com/photos/3737605/pexels-photo-3737605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accesorios',
      description: 'Herramienta de masaje facial Gua Sha',
      benefits: ['Mejora circulación', 'Reduce tensión', 'Cuarzo natural']
    },
    {
      id: 402,
      name: 'Vincha de Spa',
      price: 8,
      image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accesorios',
      description: 'Vincha suave para rutina de cuidado',
      benefits: ['Material suave', 'Mantiene cabello', 'Lavable']
    },
    {
      id: 403,
      name: 'Toalla Facial',
      price: 12,
      image: 'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accesorios',
      description: 'Toalla facial de microfibra',
      benefits: ['Microfibra suave', 'Secado rápido', 'Antibacterial']
    }
  ];