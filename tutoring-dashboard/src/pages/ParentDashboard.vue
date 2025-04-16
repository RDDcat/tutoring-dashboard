<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

// 유저 스토어
const user = useUserStore()

const children = ref([])
const studentId = ref(null)

const thisMonth = new Date().toISOString().slice(0, 7)
const prevMonth = (() => {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
})()

const thisMonthStats = ref({
  lessons: 0,
  hours: 0,
  mid: 0,
  end: 0,
})
const prevMonthStats = ref({
  lessons: 0,
  hours: 0,
  mid: 0,
  end: 0,
})
const error = ref('')

onMounted(async () => {
  // 부모가 연결된 자녀 조회
  const { data, error: err } = await supabase
    .from('parents_students')
    .select('student_id, students(id, name)')
    .eq('parent_id', user.id)

  if (err) {
    error.value = '자녀 정보를 불러오지 못했습니다.'
    return
  }

  const validChildren = (data || [])
    .filter((d) => d.students)
    .map((d) => ({
      id: d.students.id,
      name: d.students.name,
    }))

  children.value = validChildren
  if (validChildren.length === 0) return

  studentId.value = validChildren[0].id
  await fetchStats()
})

async function fetchStats() {
  if (!studentId.value) return

  const { data: lessons } = await supabase
    .from('lessons')
    .select('date, start_time, end_time')
    .eq('student_id', studentId.value)

  const { data: reports } = await supabase
    .from('reports')
    .select('type, month')
    .eq('student_id', studentId.value)

  const calcStats = (month) => {
    const lessonsInMonth = lessons.filter((l) => l.date?.startsWith(month))
    const hours = lessonsInMonth.reduce((acc, cur) => {
      const start = cur.start_time
      const end = cur.end_time
      if (!start || !end) return acc
      const startH = Number(start.split(':')[0])
      const endH = Number(end.split(':')[0])
      return acc + (endH - startH)
    }, 0)

    const monthReports = reports.filter((r) => r.month === month)
    const mid = monthReports.filter((r) => r.type === '중간').length
    const end = monthReports.filter((r) => r.type === '월말').length

    return {
      lessons: lessonsInMonth.length,
      hours,
      mid,
      end,
    }
  }

  thisMonthStats.value = calcStats(thisMonth)
  prevMonthStats.value = calcStats(prevMonth)
}
</script>

<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left">
      📊 학부모 대시보드
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border rounded-xl shadow p-5 space-y-2">
        <h2 class="text-base sm:text-lg font-semibold text-blue-700">
          📅 당월 통계 ({{ thisMonth }})
        </h2>
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

      <div class="bg-white border rounded-xl shadow p-5 space-y-2">
        <h2 class="text-base sm:text-lg font-semibold text-purple-700">
          📅 전월 통계 ({{ prevMonth }})
        </h2>
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

    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
