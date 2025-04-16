<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const children = ref([])

const thisMonthStats = ref({ lessons: 0, hours: 0, mid: 0, end: 0 })
const prevMonthStats = ref({ lessons: 0, hours: 0, mid: 0, end: 0 })
const error = ref('')

// 📅 로컬 기준으로 정확한 YYYY-MM
const pad = (n) => n.toString().padStart(2, '0')
const now = new Date()

const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}` // 4월 → '2025-04'
const prevMonth =
  now.getMonth() === 0
    ? `${now.getFullYear() - 1}-12`
    : `${now.getFullYear()}-${pad(now.getMonth())}` // 3월 → '2025-03'

onMounted(async () => {
  const { data: childData, error: fetchError } = await supabase
    .from('parents_students')
    .select('student_id, students(id)')
    .eq('parent_id', user.id)

  if (fetchError) {
    error.value = '자녀 조회에 실패했습니다.'
    return
  }

  const childList = (childData || []).filter((d) => d.students).map((d) => d.students.id)

  children.value = childList

  await loadStats(thisMonth, thisMonthStats)
  await loadStats(prevMonth, prevMonthStats)
})

const loadStats = async (month, targetRef) => {
  if (!children.value.length) return

  const monthStart = `${month}-01`
  const monthEnd = new Date(
    new Date(monthStart).getFullYear(),
    new Date(monthStart).getMonth() + 1,
    0,
  )
    .toISOString()
    .slice(0, 10)

  const { data: lessons } = await supabase
    .from('lessons')
    .select('start_time, end_time, date, student_id')
    .in('student_id', children.value)
    .gte('date', monthStart)
    .lte('date', monthEnd)

  const lessonCount = lessons.length
  const totalHour = lessons.reduce((sum, l) => {
    if (l.start_time && l.end_time) {
      const start = new Date(`2000-01-01T${l.start_time}`)
      const end = new Date(`2000-01-01T${l.end_time}`)
      return sum + (end - start) / (1000 * 60 * 60)
    }
    return sum
  }, 0)

  const { data: reports } = await supabase
    .from('reports')
    .select('type, student_id')
    .in('student_id', children.value)
    .eq('month', month)

  const midCount = reports.filter((r) => r.type === '중간').length
  const endCount = reports.filter((r) => r.type === '월말').length

  targetRef.value = {
    lessons: lessonCount,
    hours: totalHour,
    mid: midCount,
    end: endCount,
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">📊 학부모 대시보드</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border rounded shadow p-4 space-y-2">
        <h2 class="font-semibold text-blue-700">📅 당월 통계 ({{ thisMonth }})</h2>
        <p>
          수업 횟수: <strong>{{ thisMonthStats.lessons }}</strong> 회
        </p>
        <p>
          총 수업 시간: <strong>{{ thisMonthStats.hours.toFixed(1) }}</strong> 시간
        </p>
        <p>
          중간 보고서: <strong>{{ thisMonthStats.mid }}</strong> 건
        </p>
        <p>
          월말 보고서: <strong>{{ thisMonthStats.end }}</strong> 건
        </p>
      </div>

      <div class="bg-white border rounded shadow p-4 space-y-2">
        <h2 class="font-semibold text-purple-700">📅 전월 통계 ({{ prevMonth }})</h2>
        <p>
          수업 횟수: <strong>{{ prevMonthStats.lessons }}</strong> 회
        </p>
        <p>
          총 수업 시간: <strong>{{ prevMonthStats.hours.toFixed(1) }}</strong> 시간
        </p>
        <p>
          중간 보고서: <strong>{{ prevMonthStats.mid }}</strong> 건
        </p>
        <p>
          월말 보고서: <strong>{{ prevMonthStats.end }}</strong> 건
        </p>
      </div>
    </div>

    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>
