import './Testimonials.css';

const TestimonialCard = ({ text, rating = 5 }) => {
  const stars = Array(rating).fill(0);

  return (
    <div className="testimonial-card">
      <div className="quote-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12M15.017 12V12M15.017 12V12M15.017 12H13.017V9C13.017 7.34315 14.3601 6 16.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91238 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12M4.017 12V12M4.017 12V12M4.017 12H2.017V9C2.017 7.34315 3.36015 6 5.017 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" />
        </svg>
      </div>

      <p className="testimonial-text">{text}</p>

      <div className="testimonial-stars">
        {stars.map((_, index) => (
          <span key={index} className="star">★</span>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;