import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ reservationId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8085/api/reservations/${reservationId}/create-payment-intent`, {
        method: 'POST',
      });
      const data = await res.json();

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // 3. Valider auprès du backend
        await fetch(`http://localhost:8085/api/reservations/${reservationId}/confirm-payment`, {
          method: 'POST',
        });
        onSuccess();
      }
    } catch (err) {
      setError("Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Payer {amount} DH</h3>
      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <CardElement />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={!stripe || loading} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {loading ? 'Paiement en cours...' : `Payer ${amount} DH`}
      </button>
    </form>
  );
};

export default CheckoutForm;