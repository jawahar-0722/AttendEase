import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, User, Plus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function TimetablePage() {
  const { addToast } = useToast();
  const [selectedClass, setSelectedClass] = useState('CSE-4A');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day: 'Monday',
    time: '09:00 - 10:00',
    subject: '',
    faculty: '',
    room: 'Lab-301'
  });

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/academics/timetable?class=${selectedClass}`);
      const data = await res.json();
      if (data.success) {
        setTimetable(data.timetable || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedClass]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/academics/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEntry,
          class: selectedClass
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('Timetable lecture slot added!', 'success');
        setShowAddModal(false);
        fetchTimetable();
      }
    } catch (err) {
      addToast('Failed to add slot', 'error');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100 uppercase tracking-wide">
            Master Academic Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
            Weekly Class Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View and manage classroom period allocations, faculties, and lecture laboratories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-navy-900 focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="CSE-4A">CSE-4A (Sem 7)</option>
            <option value="CSE-4B">CSE-4B (Sem 7)</option>
            <option value="ECE-3A">ECE-3A (Sem 5)</option>
            <option value="IT-2A">IT-2A (Sem 3)</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Timetable Weekly Column View */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => {
          const daySlots = timetable.filter(t => t.day.toLowerCase() === day.toLowerCase());
          return (
            <div key={day} className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden flex flex-col">
              <div className="bg-navy-900 text-white p-3.5 text-center font-bold text-xs uppercase tracking-wider">
                {day}
              </div>

              <div className="p-3 space-y-3 flex-1 bg-slate-50/40">
                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No lectures scheduled</p>
                ) : (
                  daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-indigo transition-colors"
                    >
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-indigo uppercase">
                        <Clock className="w-3 h-3" />
                        <span>{slot.time}</span>
                      </div>
                      <h4 className="text-xs font-bold text-navy-900 mt-1 leading-snug">
                        {slot.subject}
                      </h4>
                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{slot.faculty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{slot.room}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900">Add Timetable Slot for {selectedClass}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy-900">✕</button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Day of Week</label>
                <select
                  value={newEntry.day}
                  onChange={e => setNewEntry({ ...newEntry, day: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Time Range</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09:00 - 10:00"
                  value={newEntry.time}
                  onChange={e => setNewEntry({ ...newEntry, time: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems"
                  value={newEntry.subject}
                  onChange={e => setNewEntry({ ...newEntry, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Faculty In-Charge</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alan Vance"
                  value={newEntry.faculty}
                  onChange={e => setNewEntry({ ...newEntry, faculty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Lecture Hall / Lab</label>
                <input
                  type="text"
                  placeholder="Lab-301"
                  value={newEntry.room}
                  onChange={e => setNewEntry({ ...newEntry, room: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-indigo text-white font-bold rounded-xl shadow-xs">Save Lecture</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
