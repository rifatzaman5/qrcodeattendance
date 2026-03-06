import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get('student_id');
  const teacher_id = searchParams.get('teacher_id');
  const subject_id = searchParams.get('subject_id');
  const date = searchParams.get('date');

  let query = supabaseAdmin
    .from('attendance')
    .select('*, students(name, enrollment_no), subjects(name, code), teachers(name), timetable(day, start_time, end_time)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (student_id) query = query.eq('student_id', student_id);
  if (teacher_id) query = query.eq('teacher_id', teacher_id);
  if (subject_id) query = query.eq('subject_id', subject_id);
  if (date) query = query.eq('date', date);

  const { data, error } = await query.limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
