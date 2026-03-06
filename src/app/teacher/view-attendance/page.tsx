'use client';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  students?: { name: string; enrollment_no: string };
  subjects?: { name: string; code: string };
  timetable?: { day: string; start_time: string };
}

export default function TeacherViewAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterDate) params.set('date', filterDate);
    fetch(`/api/attendance?${params}`)
      .then(r => r.json())
      .then(data => { setRecords(data); setLoading(false); });
  }, [filterDate]);

  const grouped = records.reduce((acc, r) => {
    const key = `${r.date}-${r.subjects?.name}`;
    if (!acc[key]) acc[key] = { date: r.date, subject: r.subjects, records: [] };
    acc[key].records.push(r);
    return acc;
  }, {} as Record<string, { date: string; subject?: { name: string; code: string }; records: AttendanceRecord[] }>);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1><p className="text-gray-500 text-sm">{records.length} total marks</p></div>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-4">
          {Object.values(grouped).map((group, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">{group.subject?.name}</span>
                  <span className="text-xs text-gray-400 ml-2">({group.subject?.code})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{group.date}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">{group.records.length} present</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {group.records.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.students?.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{r.students?.enrollment_no}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Present</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!Object.keys(grouped).length && <div className="text-center py-12 text-gray-400">No attendance records found</div>}
        </div>
      )}
    </div>
  );
}
