import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-navy-900 text-white p-2.5 rounded-xl shadow-elevated border border-navy-700 text-xs">
        <span className="font-bold text-slate-200 block">{data.name}</span>
        <span className="text-slate-400">Count: </span>
        <span className="font-bold text-white">{data.value} students</span>
      </div>
    );
  }
  return null;
};

export default function AttendanceDonut({ distribution }) {
  const data = distribution && distribution.length > 0 ? distribution : [
    { name: "Present", value: 1106, color: "#4f46e5" },     // Indigo
    { name: "Absent Unexcused", value: 104, color: "#f43f5e" }, // Rose
    { name: "Approved Leave", value: 24, color: "#06b6d4" }, // Cyan
    { name: "Late Entry", value: 14, color: "#f59e0b" }       // Amber
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const presentCount = data.find(d => d.name === 'Present')?.value || 1106;
  const presentRate = ((presentCount / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-navy-900">
          Attendance Distribution
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Present vs. Absent ratio today
        </p>
      </div>

      {/* Donut Chart with center metric */}
      <div className="relative h-56 w-full my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={68}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text in Donut Hole */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-navy-900 leading-none">
            {presentRate}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Present
          </span>
        </div>
      </div>

      {/* Breakdown Legend */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
        {data.map((item, idx) => {
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 truncate">
                <p className="text-[11px] text-slate-600 truncate font-medium">{item.name}</p>
                <p className="text-xs font-bold text-navy-900">
                  {item.value} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
