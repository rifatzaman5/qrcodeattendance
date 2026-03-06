'use client';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  subjects?: { name: string; code: string };
  timetable?: { day: string; start_time: string; end_time: string };
}

interface SubjectSummary {
  name: string;
  code: string;
  total: number;
}

export default function StudentViewAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance')
      .then(r => r.json())
      .then(data => { setRecords(data); setLoading(false); });
  }, []);

  // Group by subject for summary
  const summary = records.reduce((acc, r) => {
    const key = r.subjects?.code || 'unknown';
    if (!acc[key]) acc[key] = { name: r.subjects?.name || 'Unknown', code: key, total: 0 };
    acc[key].total++;
    return acc;
  }, {} as Record<string, SubjectSummary>);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
        <p className="text-gray-500 text-sm">{records.length} total records</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : (
        <>
          {/* Summary cards */}
          {Object.keys(summary).length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {Object.values(summary).map(s => (
                <div key={s.code} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1">{s.code}</p>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{s.name}</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">{s.total}</p>
                  <p className="text-xs text-gray-400">classes attended</p>
                </div>
              ))}
            </div>
          )}

          {/* Full records table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>{['Date', 'Subject', 'Code', 'Time', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{r.date}</td>
                    <td className="px-4 py-3 text-gray-700">{r.subjects?.name}</td>
                    <td className="px-4 py-3 font-mono text-gray-500 text-xs">{r.subjects?.code}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.timetable?.start_time} – {r.timetable?.end_time}</td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Present</span></td>
                  </tr>
                ))}
                {!records.length && <tr><td colSpan={5} className="text-center py-8 text-gray-400">No attendance records yet</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
