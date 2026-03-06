import { supabaseAdmin } from '@/lib/supabase';

async function getStats() {
  const [s, t, sub, att] = await Promise.all([
    supabaseAdmin.from('students').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('teachers').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('subjects').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('attendance').select('id', { count: 'exact', head: true }),
  ]);
  return { students: s.count || 0, teachers: t.count || 0, subjects: sub.count || 0, attendance: att.count || 0 };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const cards = [
    { label: 'Total Students', value: stats.students, color: 'bg-blue-500', emoji: '🎓' },
    { label: 'Total Teachers', value: stats.teachers, color: 'bg-purple-500', emoji: '👨‍🏫' },
    { label: 'Total Subjects', value: stats.subjects, color: 'bg-orange-500', emoji: '📚' },
    { label: 'Attendance Records', value: stats.attendance, color: 'bg-green-500', emoji: '✅' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">University of Gujrat — Smart Attendance System</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 ${card.color} rounded-lg mb-3 text-xl`}>
              {card.emoji}
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: '/admin/students', label: 'Manage Students', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
            { href: '/admin/teachers', label: 'Manage Teachers', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
            { href: '/admin/subjects', label: 'Manage Subjects', color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
            { href: '/admin/timetable', label: 'View Timetable', color: 'text-green-600 bg-green-50 hover:bg-green-100' },
          ].map((link) => (
            <a key={link.href} href={link.href} className={`px-4 py-3 rounded-lg font-medium text-sm text-center transition-colors ${link.color}`}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-800 rounded-xl text-white text-sm">
        <p className="font-semibold">SQAS — Smart Attendance System using QR Scanning</p>
        <p className="text-slate-300 text-xs mt-1">Sania Nawaz (BSIT51F22S064) • Sania Saeed (BSIT51F22S091) • Waqar Ali (BSIT51F21R051RE)</p>
      </div>
    </div>
  );
}
