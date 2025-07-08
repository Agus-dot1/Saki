
export interface KitItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'limpieza' | 'hidratacion' | 'tratamiento' | 'accesorios';
  description: string;
  benefits: string[];
}

export interface SelectedKitItem extends KitItem {
  quantity: number;
}

export interface KitBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}