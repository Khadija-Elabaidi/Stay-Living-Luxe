import './Services.css';

const ServiceItem = ({ icon, label }) => {
  return (
    <div className="service-item">
      <div className="service-icon-wrapper">
        {icon}
      </div>
      <p className="service-label">{label}</p>
    </div>
  );
};

export default ServiceItem;