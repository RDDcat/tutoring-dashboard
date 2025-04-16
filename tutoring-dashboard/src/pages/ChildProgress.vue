<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const children = ref([])
const studentId = ref('')
const month = ref(new Date().toISOString().slice(0, 7))

const totalLessons = ref(0)
const totalHours = ref(0)
const midReportSubmitted = ref(false)
const endReportSubmitted = ref(false)
const error = ref('')

onMounted(async () => {
  const { data, error: err } = await supabase
    .from('parents_students')
    .select('student_id, students ( id, name )')
    .eq('parent_id', user.id)

  if (err) {
    error.value = '자녀 정보를 불러오지 못했습니다.'
  } else {
    const validChildren = (data || [])
      .filter((d) => d.students)
      .map((d) => ({
        id: d.students.id,
        name: d.students.name,
      }))

    children.value = validChildren

    // ✅ 첫 번째 자녀 자동 선택
    if (validChildren.length > 0) {
      studentId.value = validChildren[0].id
    }
  }
})

watch([studentId, month], async () => {
  totalLessons.value = 0
  totalHours.value = 0
  midReportSubmitted.value = false
  endReportSubmitted.value = false
  error.value = ''

  if (!studentId.value || !month.value) return

  const monthStart = `${month.value}-01`
  const monthEnd = new Date(
    new Date(monthStart).getFullYear(),
    new Date(monthStart).getMonth() + 1,
    0,
  )
    .toISOString()
    .slice(0, 10)

  const { data: lessons } = await supabase
    .from('lessons')
    .select('date, start_time, end_time')
    .eq('student_id', studentId.value)
    .gte('date', monthStart)
    .lte('date', monthEnd)

  totalLessons.value = lessons.length

  totalHours.value = lessons.reduce((sum, l) => {
    if (l.start_time && l.end_time) {
      const start = new Date(`2000-01-01T${l.start_time}`)
      const end = new Date(`2000-01-01T${l.end_time}`)
      const diff = (end - start) / (1000 * 60 * 60)
      return sum + diff
    }
    return sum
  }, 0)

  const { data: reports } = await supabase
    .from('reports')
    .select('type')
    .eq('student_id', studentId.value)
    .eq('month', month.value)

  midReportSubmitted.value = reports.some((r) => r.type === '중간')
  endReportSubmitted.value = reports.some((r) => r.type === '월말')
})
</script>
<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left">
      📊 자녀 진행 현황
    </h1>

    <!-- 자녀 선택 -->
    <div class="space-y-1">
      <label class="block font-medium text-sm sm:text-base">자녀 선택</label>
      <select v-model="studentId" class="block w-full p-2 border rounded-md">
        <option disabled value="">자녀를 선택하세요</option>
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }}
        </option>
      </select>
    </div>

    <!-- 월 선택 -->
    <div class="space-y-1">
      <label class="block font-medium text-sm sm:text-base">대상 월</label>
      <input v-model="month" type="month" class="block w-full p-2 border rounded-md" />
    </div>

    <!-- 진행 통계 카드 -->
    <div v-if="studentId" class="mt-4 bg-white p-4 border rounded-xl shadow space-y-3">
      <p class="text-sm md:text-base text-gray-800">
        📚 수업 횟수: <strong>{{ totalLessons }}</strong> 회
      </p>
      <p class="text-sm md:text-base text-gray-800">
        ⏱️ 총 수업 시간: <strong>{{ totalHours.toFixed(1) }}</strong> 시간
      </p>
      <p class="text-sm md:text-base text-gray-800">
        📝 중간 보고서:
        <span :class="midReportSubmitted ? 'text-green-600' : 'text-red-500'">
          {{ midReportSubmitted ? '제출됨' : '미제출' }}
        </span>
      </p>
      <p class="text-sm md:text-base text-gray-800">
        📘 월말 보고서:
        <span :class="endReportSubmitted ? 'text-green-600' : 'text-red-500'">
          {{ endReportSubmitted ? '제출됨' : '미제출' }}
        </span>
      </p>
    </div>

    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
