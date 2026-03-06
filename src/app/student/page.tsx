import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export default async function StudentDashboard() {
  const session = await getSession();

  const { data: student } = await supabaseAdmin
    .from('students')
    .select('name, enrollment_no, batch, semester, branch')
    .eq('id', session!.id)
    .single();

  const { count: totalAtt } = await supabaseAdmin
    .from('attendance')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', session!.id);

  const today = new Date().toISOString().split('T')[0];
  const { count: todayAtt } = await supabaseAdmin
    .from('attendance')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', session!.id)
    .eq('date', today);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome, {student?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{student?.enrollment_no} • Batch {student?.batch} • Semester {student?.semester}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-lg mb-3 text-xl">✅</div>
          <p className="text-3xl font-bold text-gray-800">{totalAtt || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Attendances</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg mb-3 text-xl">📅</div>
          <p className="text-3xl font-bold text-gray-800">{todayAtt || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Today's Attendance</p>
        </div>
      </div>

      {/* Student info card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">My Profile</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Enrollment', value: student?.enrollment_no },
            { label: 'Branch', value: student?.branch },
            { label: 'Batch', value: student?.batch },
            { label: 'Semester', value: student?.semester },
          ].map(item => (
            <div key={item.label}>
              <p className="text-gray-400 text-xs">{item.label}</p>
              <p className="font-medium text-gray-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/student/mark-attendance" className="px-5 py-3 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors">📷 Mark Attendance (Scan QR)</a>
          <a href="/student/view-attendance" className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">📋 View My Attendance</a>
        </div>
      </div>
    </div>
  );
}
