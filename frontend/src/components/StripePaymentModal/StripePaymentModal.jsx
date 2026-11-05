import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_VOTRE_CLE_PUBLIQUE_STRIPE');

const CheckoutForm = ({ reservationId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // 1. Obtenir le clientSecret
    const res = await fetch(`/api/reservations/${reservationId}/create-payment-intent`, { method: 'POST' });
    const { clientSecret } = await res.json();

    // 2. Valider la carte
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (result.error) {
      alert("Échec du paiement : " + result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === 'succeeded') {
      await fetch(`/api/reservations/${reservationId}/payer-succes`, { method: 'POST' });
      alert("Paiement réussi !");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h3>Paiement sécurisé par Stripe</h3>
      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe || loading} style={{ background: '#c5a880', color: '#fff', padding: '10px 20px', border: 'none' }}>
        {loading ? 'Traitement...' : 'Payer maintenant'}
      </button>
    </form>
  );
};

const StripePaymentModal = ({ reservationId, onSuccess }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm reservationId={reservationId} onSuccess={onSuccess} />
  </Elements>
);

export default StripePaymentModal;