import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, MessageCircle } from 'lucide-react';

const CheckoutPending: React.FC = () => {
  const navigate = useNavigate();

  const handleWhatsAppContact = () => {
    const message = 'Hola, mi pago está pendiente. ¿Podrían ayudarme con el estado?';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/541126720095?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-secondary/30">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg">
        <div className="mb-6">
          <Clock size={64} className="mx-auto mb-4 text-yellow-500" />
          <h1 className="mb-2 text-2xl font-medium text-primary">
            Pago Pendiente
          </h1>
          <p className="text-content">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>
        </div>

        <div className="p-4 mb-6 rounded-lg bg-blue-50">
          <h3 className="mb-2 font-medium text-blue-800">¿Qué significa esto?</h3>
          <p className="text-sm text-left text-blue-700">
            Algunos métodos de pago (como transferencias bancarias o efectivo) 
            requieren tiempo adicional para procesarse. Recibirás una confirmación 
            por email una vez que se complete.
          </p>
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
            Consultar Estado
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPending;