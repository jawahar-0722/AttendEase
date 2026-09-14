import React from 'react';
import { Users, UserCheck, UserX, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCards({ stats }) {
  const data = stats || {
    totalStudents: 1248,
    presentToday: 1106,
    absentToday: 142,
    attendanceRate: 88.6
  };

  const cards = [
    {
      id: 'total',
      title: 'Total Students',
      value: data.totalStudents?.toLocaleString() || '1,248',
      subtitle: 'Enrolled across 5 departments',
      badge: '+3.2%',
      badgePositive: true,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-indigo-50/70',
      textColor: 'text-brand-indigo',
      borderAccent: 'border-l-4 border-l-brand-indigo'
    },
    {
      id: 'present',
      title: 'Present Today',
      value: data.presentToday?.toLocaleString() || '1,106',
      subtitle: 'Recorded via RFID & QR',
      badge: 'Peak 91.2%',
      badgePositive: true,
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/70',
      textColor: 'text-emerald-600',
      borderAccent: 'border-l-4 border-l-emerald-500'
    },
    {
      id: 'absent',
      title: 'Absent Today',
      value: data.absentToday?.toLocaleString() || '142',
      subtitle: '24 with approved OD/leave',
      badge: '-1.4%',
      badgePositive: true, // fewer absents is positive!
      icon: UserX,
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50/70',
      textColor: 'text-rose-600',
      borderAccent: 'border-l-4 border-l-rose-500'
    },
    {
      id: 'rate',
      title: 'Attendance Rate',
      value: `${data.attendanceRate || 88.6}%`,
      subtitle: 'University target: 75.0%',
      badge: '+3.6% vs target',
      badgePositive: true,
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50/70',
      textColor: 'text-brand-cyan',
      borderAccent: 'border-l-4 border-l-brand-cyan'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-200 ${card.borderAccent}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bgLight}`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {card.value}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                  card.badgePositive
                    ? 'bg-emerald-100/70 text-emerald-700'
                    : 'bg-rose-100/70 text-rose-700'
                }`}
              >
                {card.badgePositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {card.badge}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400 font-medium">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
