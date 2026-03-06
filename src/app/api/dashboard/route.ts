import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [studentsRes, teachersRes, subjectsRes, attendanceRes] = await Promise.all([
    supabaseAdmin.from('students').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('teachers').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('subjects').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('attendance').select('id', { count: 'exact', head: true }),
  ]);

  return NextResponse.json({
    students: studentsRes.count || 0,
    teachers: teachersRes.count || 0,
    subjects: subjectsRes.count || 0,
    attendance: attendanceRes.count || 0,
  });
}
