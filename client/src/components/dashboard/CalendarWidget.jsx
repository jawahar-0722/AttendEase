import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarWidget({ onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 12)); // Sep 12, 2024 (matching dataset)
  const [selectedDay, setSelectedDay] = useState(12);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Mock attendance status for calendar days
  const getDayStatus = (day) => {
    const dayOfWeek = (firstDayIndex + day - 1) % 7;
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend'; // Sunday or Saturday
    if (day === 5) return 'holiday'; // Teacher's Day / College event
    if (day > 15) return 'future';
    if (day === 3 || day === 11) return 'good'; // >90%
    if (day === 12) return 'today'; // Today
    return 'normal'; // 85-90%
  };

  const renderDays = () => {
    const days = [];
    // Blank days for start of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`blank-${i}`} className="h-8 text-center" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDayStatus(day);
      const isSelected = selectedDay === day;

      let dotColor = 'bg-emerald-500';
      if (status === 'weekend') dotColor = 'hidden';
      else if (status === 'holiday') dotColor = 'bg-amber-400';
      else if (status === 'future') dotColor = 'bg-slate-300';
      else if (status === 'good') dotColor = 'bg-brand-cyan';

      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDay(day);
            if (onSelectDate) {
              const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              onSelectDate(formattedDate);
            }
          }}
          className={`h-8 w-8 mx-auto rounded-xl flex flex-col items-center justify-center text-xs relative transition-all ${
            isSelected
              ? 'bg-brand-indigo text-white font-bold shadow-md shadow-brand-indigo/30'
              : status === 'today'
              ? 'border-2 border-brand-indigo font-bold text-brand-indigo'
              : status === 'weekend'
              ? 'text-slate-300'
              : 'text-slate-700 hover:bg-slate-100 font-medium'
          }`}
        >
          <span>{day}</span>
          {status !== 'weekend' && (
            <span
              className={`w-1 h-1 rounded-full mt-0.5 ${
                isSelected ? 'bg-white' : dotColor
              }`}
            />
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-brand-indigo" />
            <h3 className="text-sm font-bold text-navy-900">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <span
              key={d}
              className={`text-[11px] font-bold ${
                i === 0 || i === 6 ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {renderDays()}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>&gt;85% Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Event / Alert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
          <span>&gt;90% Peak</span>
        </div>
      </div>
    </div>
  );
}
