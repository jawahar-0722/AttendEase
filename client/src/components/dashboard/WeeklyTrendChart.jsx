import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-navy-900 text-white p-3 rounded-xl shadow-elevated border border-navy-700 text-xs">
        <p className="font-bold text-slate-200 mb-1">{data.day} ({data.date})</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Attendance Rate:</span>
            <span className="font-bold text-brand-cyan">{data.rate}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Present Students:</span>
            <span className="font-bold text-emerald-400">{data.present}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Absent:</span>
            <span className="font-bold text-rose-400">{data.absent}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function WeeklyTrendChart({ weeklyData }) {
  const data = weeklyData && weeklyData.length > 0 ? weeklyData : [
    { day: "Mon", date: "Sep 08", present: 1078, absent: 170, rate: 86.4 },
    { day: "Tue", date: "Sep 09", present: 1113, absent: 135, rate: 89.2 },
    { day: "Wed", date: "Sep 10", present: 1096, absent: 152, rate: 87.8 },
    { day: "Thu", date: "Sep 11", present: 1137, absent: 111, rate: 91.1 },
    { day: "Fri", date: "Sep 12", present: 1106, absent: 142, rate: 88.6 }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
            Weekly Attendance Analytics
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-brand-indigo">
              Mon – Fri
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            5-day campus-wide physical presence trajectory
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Current Week</span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              domain={[70, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#rateGradient)"
              activeDot={{ r: 6, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo inline-block"></span>
          <span>Overall Attendance Rate (%)</span>
        </div>
        <span className="font-semibold text-navy-900">
          Weekly Avg: 88.6%
        </span>
      </div>
    </div>
  );
}
