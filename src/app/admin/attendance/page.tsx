'use client';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  students?: { name: string; enrollment_no: string };
  subjects?: { name: string; code: string };
  teachers?: { name: string };
  timetable?: { day: string; start_time: string };
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ date: '', subject: '' });

  const fetchRecords = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.date) params.set('date', filter.date);
    const r = await fetch(`/api/attendance?${params}`);
    if (r.ok) setRecords(await r.json());
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, [filter.date]);

  const filtered = filter.subject
    ? records.filter(r => r.subjects?.name?.toLowerCase().includes(filter.subject.toLowerCase()))
    : records;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1>
        <p className="text-gray-500 text-sm">{records.length} total records</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
        <input type="text" placeholder="Filter by subject…" value={filter.subject} onChange={e => setFilter({ ...filter, subject: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-48" />
        {(filter.date || filter.subject) && (
          <button onClick={() => setFilter({ date: '', subject: '' })} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">Clear</button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>{['Date', 'Student', 'Enrollment', 'Subject', 'Teacher', 'Time', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.date}</td>
                  <td className="px-4 py-3 text-gray-800">{r.students?.name}</td>
                  <td className="px-4 py-3 font-mono text-blue-600 text-xs">{r.students?.enrollment_no}</td>
                  <td className="px-4 py-3 text-gray-700">{r.subjects?.name} <span className="text-gray-400 text-xs">({r.subjects?.code})</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{r.teachers?.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.timetable?.start_time}</td>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">{r.status}</span></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} className="text-center py-8 text-gray-400">No attendance records</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
