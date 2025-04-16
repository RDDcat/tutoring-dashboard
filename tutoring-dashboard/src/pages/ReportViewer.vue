<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const children = ref([])
const studentId = ref('')

// ✅ 전월 계산 로직 (로컬 기준 정확하게)
const pad = (n) => n.toString().padStart(2, '0')
const now = new Date()
const prevMonthStr =
  now.getMonth() === 0
    ? `${now.getFullYear() - 1}-12`
    : `${now.getFullYear()}-${pad(now.getMonth())}`

const month = ref(prevMonthStr)

const midReport = ref('')
const endReport = ref('')
const error = ref('')

onMounted(async () => {
  const { data, error: err } = await supabase
    .from('parents_students')
    .select('student_id, students(id, name)')
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

    // ✅ 자녀가 있다면 첫 번째 자녀를 자동 선택
    if (validChildren.length > 0) {
      studentId.value = validChildren[0].id
    }
  }
})

watch([studentId, month], async () => {
  midReport.value = ''
  endReport.value = ''
  if (!studentId.value || !month.value) return

  const { data, error: err } = await supabase
    .from('reports')
    .select('type, content')
    .eq('student_id', studentId.value)
    .eq('month', month.value)

  if (err) {
    error.value = '보고서를 불러오는 중 오류가 발생했습니다.'
  } else {
    for (const r of data) {
      if (r.type === '중간') midReport.value = r.content
      if (r.type === '월말') endReport.value = r.content
    }
  }
})
</script>

<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left">
      📄 자녀 보고서 열람
    </h1>

    <!-- 자녀 선택 -->
    <div class="space-y-1">
      <label class="block font-medium text-sm sm:text-base">자녀 선택</label>
      <select v-model="studentId" class="block w-full p-2 border rounded-md">
        <option disabled value="">자녀를 선택하세요</option>
        <option v-for="c in children" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <!-- 월 선택 -->
    <div class="space-y-1">
      <label class="block font-medium text-sm sm:text-base">대상 월</label>
      <input v-model="month" type="month" class="block w-full p-2 border rounded-md" />
    </div>

    <!-- 보고서 카드 -->
    <div class="space-y-4">
      <div v-if="midReport" class="p-4 bg-white border rounded-xl shadow-sm">
        <h2 class="font-semibold text-blue-700 mb-2 text-base md:text-lg">📝 중간 보고서</h2>
        <p class="text-sm md:text-base text-gray-700 whitespace-pre-wrap">{{ midReport }}</p>
      </div>

      <div v-if="endReport" class="p-4 bg-white border rounded-xl shadow-sm">
        <h2 class="font-semibold text-purple-700 mb-2 text-base md:text-lg">📘 월말 보고서</h2>
        <p class="text-sm md:text-base text-gray-700 whitespace-pre-wrap">{{ endReport }}</p>
      </div>
    </div>

    <!-- 없을 때 안내 -->
    <p v-if="!midReport && !endReport && studentId && month" class="text-gray-500 text-sm">
      선택한 월의 보고서가 없습니다.
    </p>

    <!-- 에러 -->
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
