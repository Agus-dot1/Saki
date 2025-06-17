import React from "react";

interface ShippingLocationsModalProps {
  open: boolean;
  onClose: () => void;
}

const ShippingLocationsModal: React.FC<ShippingLocationsModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm p-6 bg-white shadow-xl rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-primary">Zonas con envío gratis</h3>
        <ul className="mb-6 space-y-2 text-content">
          <li>• Ituzaingó</li>
          <li>• Morón</li>
          <li>• Castelar</li>
          <li>
          <a href="https://api.whatsapp.com/send?phone=541132170664&text=Hola%2C%20quiero%20consultar%20sobre%20el%20env%C3%ADo%20a%20mi%20zona" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Consultar otras zonas</a>
          </li>
        </ul>
        <button
          className="px-6 py-2 font-medium text-white transition rounded-lg bg-accent hover:bg-supporting"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ShippingLocationsModal;