import * as React from "react";

interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  mode?: 'single' | 'multiple';
}

const Calendar = ({ className = '', selected, onSelect, disabled, mode = 'single' }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (disabled && disabled(clickedDate)) return;
    if (onSelect) onSelect(clickedDate);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return dayDate.toDateString() === selected.toDateString();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className={`p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-accent rounded"
        >
          ←
        </button>
        <h2 className="font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-accent rounded"
        >
          →
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className={`p-2 text-center text-sm rounded hover:bg-accent ${
              isSelected(day) ? 'bg-primary text-primary-foreground' : ''
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export { Calendar };