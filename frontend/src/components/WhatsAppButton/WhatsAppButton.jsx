import './WhatsAppButton.css'; 

const WhatsAppButton = () => {
  const phoneNumber = "212702672651";

  const message = encodeURIComponent(
    "Bonjour Stay Living Luxe, je souhaite en savoir plus sur vos logements."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="whatsapp-icon">
        <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.461 3.42 1.268 4.877L2 22l5.247-1.378A9.957 9.957 0 0 0 12.004 22c5.524 0 10.004-4.48 10.004-10.004C22.008 6.48 17.528 2 12.004 2zm5.72 14.125c-.252.712-1.252 1.306-1.722 1.39-.427.076-.983.136-2.905-.623-2.457-.967-4.04-3.46-4.163-3.623-.122-.163-1.002-1.332-1.002-2.542 0-1.21.631-1.807.855-2.052.224-.244.49-.305.652-.305.163 0 .326.002.468.008.148.006.347-.057.545.418.204.488.694 1.692.754 1.814.061.122.102.265.02.428-.082.163-.122.265-.244.407-.122.143-.257.32-.367.428-.122.122-.25.255-.107.502.143.245.637 1.05 1.366 1.701.94.84 1.733 1.1 1.978 1.223.245.122.387.102.53-.061.143-.163.611-.713.774-.957.163-.244.326-.204.55-.122.224.082 1.427.673 1.672.795.245.122.407.183.468.285.062.103.062.59-.19 1.303z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;