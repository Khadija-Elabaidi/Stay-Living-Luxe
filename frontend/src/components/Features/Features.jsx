import FeatureCard from './FeatureCard';
import './Features.css';

const Features = () => {
  const featuresData = [
    {
      id: 1,
      title: "SÉJOURS",
      description: "COURTE ET MOYENNE DURÉE",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <circle cx="8" cy="14" r="1"></circle>
          <circle cx="12" cy="14" r="1"></circle>
          <circle cx="16" cy="14" r="1"></circle>
          <circle cx="8" cy="18" r="1"></circle>
          <circle cx="12" cy="18" r="1"></circle>
          <circle cx="16" cy="18" r="1"></circle>
        </svg>
      )
    },
    {
      id: 2,
      title: "APPARTEMENTS",
      description: "HAUT DE GAMME",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 3h12l4 6-10 12L2 9z"></path>
          <path d="M11 3 8 9l4 12 4-12-3-6"></path>
          <path d="M2 9h20"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "EMPLACEMENTS",
      description: "PRIVILÉGIÉS",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      )
    },
    {
      id: 4,
      title: "ASSISTANCE",
      description: "VOYAGEURS 7J/7",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="features-container">
      <div className="features-wrapper">
        {featuresData.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;