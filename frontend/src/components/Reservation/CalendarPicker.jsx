import { useState } from 'react';
import './CalendarPicker.css'; 

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const pad = (n) => String(n).padStart(2, '0');
const toStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const getToday = () => {
  const n = new Date();
  return toStr(n.getFullYear(), n.getMonth(), n.getDate());
};


const CalendarPicker = ({
  mode = 'arrival',
  selectedDate = '',
  arrivalDate = '',
  minDate = '',
  blockedReservations = [],
  apartmentUnavailable = false,
  onSelect
}) => {
  const today = getToday();
  const effectiveMin = minDate && minDate > today ? minDate : today;

  const startRef = selectedDate || (mode === 'departure' && arrivalDate) || effectiveMin;
  const [viewYear, setViewYear] = useState(Number(startRef.slice(0, 4)));
  const [viewMonth, setViewMonth] = useState(Number(startRef.slice(5, 7)) - 1);

  const ranges = (blockedReservations || [])
    .map((r) => ({
      debut: r.dateDebut || r.date_debut,
      fin: r.dateFin || r.date_fin
    }))
    .filter((r) => r.debut && r.fin);

  const isNightBlocked = (dateStr) =>
    ranges.some((r) => dateStr >= r.debut && dateStr < r.fin);

  let maxDeparture = null;
  if (mode === 'departure' && arrivalDate) {
    ranges.forEach((r) => {
      if (r.debut > arrivalDate && (maxDeparture === null || r.debut < maxDeparture)) {
        maxDeparture = r.debut;
      }
    });
  }

  const getDayState = (dateStr) => {
    const isPast = dateStr < today;
    const blocked = isNightBlocked(dateStr);

    if (apartmentUnavailable) return { disabled: true, blocked: true, isPast };

    if (mode === 'departure') {
      const minDeparture = arrivalDate && arrivalDate >= today ? arrivalDate : today;
      const tooEarly = dateStr <= minDeparture;
      const tooLate = maxDeparture !== null && dateStr > maxDeparture;
      const struck = blocked && dateStr !== maxDeparture;
      return { disabled: tooEarly || tooLate || struck, blocked: struck, isPast };
    }

    return { disabled: isPast || blocked, blocked, isPast };
  };

  const minYear = Number(today.slice(0, 4));
  const minMonth = Number(today.slice(5, 7)) - 1;
  const canGoPrev = viewYear > minYear || (viewYear === minYear && viewMonth > minMonth);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  const navStyle = {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '1.5rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0 8px'
  };

  return (
    <div className="calendar-picker">
      <div
        className="calendar-header"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <button
          type="button"
          style={{ ...navStyle, opacity: canGoPrev ? 1 : 0.25, cursor: canGoPrev ? 'pointer' : 'not-allowed' }}
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <span className="month-title">
          {MOIS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          style={navStyle}
          onClick={goNext}
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {JOURS.map((dayName, idx) => (
          <div key={idx} className="day-name">
            {dayName}
          </div>
        ))}

        {daysArray.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="calendar-day empty" />;
          }

          const dateStr = toStr(viewYear, viewMonth, day);
          const { disabled, blocked } = getDayState(dateStr);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect && onSelect(dateStr)}
              className={`calendar-day ${isSelected ? 'selected' : ''} ${
                disabled ? 'disabled' : ''
              } ${blocked ? 'blocked' : ''}`}
            >
              <span className="day-number">{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPicker;
