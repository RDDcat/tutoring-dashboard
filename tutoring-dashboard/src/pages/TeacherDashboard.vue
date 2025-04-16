<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const pad = (n) => n.toString().padStart(2, '0')
const now = new Date()
const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
const prevMonth =
  now.getMonth() === 0
    ? `${now.getFullYear() - 1}-12`
    : `${now.getFullYear()}-${pad(now.getMonth())}`

const thisStats = ref({ lessons: 0, hours: 0 })
const prevStats = ref({ lessons: 0, hours: 0 })
const error = ref('')

onMounted(async () => {
  const { data: students, error: err } = await supabase
    .from('students')
    .select('id')
    .eq('teacher_id', user.id)

  if (err) {
    error.value = '학생 정보를 불러오지 못했습니다.'
    return
  }

  const studentIds = students.map((s) => s.id)
  await loadStats(thisMonth, thisStats, studentIds)
  await loadStats(prevMonth, prevStats, studentIds)
})

const loadStats = async (month, refObj, studentIds) => {
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
    .select('date, start_time, end_time, student_id')
    .in('student_id', studentIds)
    .gte('date', monthStart)
    .lte('date', monthEnd)

  refObj.value = {
    lessons: lessons.length,
    hours: lessons.reduce((sum, l) => {
      if (l.start_time && l.end_time) {
        const start = new Date(`2000-01-01T${l.start_time}`)
        const end = new Date(`2000-01-01T${l.end_time}`)
        return sum + (end - start) / (1000 * 60 * 60)
      }
      return sum
    }, 0),
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">📈 선생님 대시보드</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border rounded shadow p-4 space-y-2">
        <h2 class="font-semibold text-blue-700">📅 당월 통계 ({{ thisMonth }})</h2>
        <p>
          수업 횟수: <strong>{{ thisStats.lessons }}</strong> 회
        </p>
        <p>
          총 수업 시간: <strong>{{ thisStats.hours.toFixed(1) }}</strong> 시간
        </p>
      </div>

      <div class="bg-white border rounded shadow p-4 space-y-2">
        <h2 class="font-semibold text-purple-700">📅 전월 통계 ({{ prevMonth }})</h2>
        <p>
          수업 횟수: <strong>{{ prevStats.lessons }}</strong> 회
        </p>
        <p>
          총 수업 시간: <strong>{{ prevStats.hours.toFixed(1) }}</strong> 시간
        </p>
      </div>
    </div>

    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
  </div>
</template>
