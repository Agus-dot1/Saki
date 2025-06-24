import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';

const CheckoutFailure: React.FC = () => {
  const navigate = useNavigate();

  const handleWhatsAppContact = () => {
    const message = 'Hola, tuve un problema con mi pago en la tienda online. ¿Podrían ayudarme?';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/541126720095?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-secondary/30">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg">
        <div className="mb-6">
          <XCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-medium text-primary">
            Pago No Completado
          </h1>
          <p className="text-content">
            Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cargo.
          </p>
        </div>

        <div className="p-4 mb-6 rounded-lg bg-yellow-50">
          <h3 className="mb-2 font-medium text-yellow-800">¿Qué puedes hacer?</h3>
          <ul className="text-sm text-left text-yellow-700">
            <li>• Verificar los datos de tu tarjeta</li>
            <li>• Intentar con otro método de pago</li>
            <li>• Contactarnos por WhatsApp</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-full px-6 py-3 text-white transition-colors rounded-md bg-accent hover:bg-supporting"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a la Tienda
          </button>
          
          <button
            onClick={handleWhatsAppContact}
            className="flex items-center justify-center w-full px-6 py-3 transition-colors border rounded-md border-accent text-accent hover:bg-accent/10"
          >
            <MessageCircle size={20} className="mr-2" />
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailure;