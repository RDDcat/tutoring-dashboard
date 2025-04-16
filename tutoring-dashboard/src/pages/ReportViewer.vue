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
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">📄 자녀 보고서 열람</h1>

    <div class="space-y-2">
      <label class="block font-medium">자녀 선택</label>
      <select v-model="studentId" class="w-full p-2 border rounded">
        <option disabled value="">자녀를 선택하세요</option>
        <option v-for="c in children" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="block font-medium">대상 월</label>
      <input v-model="month" type="month" class="w-full p-2 border rounded" />
    </div>

    <div v-if="midReport || endReport" class="space-y-4 mt-4">
      <div v-if="midReport" class="p-4 bg-white border rounded shadow-sm">
        <h2 class="font-semibold text-blue-700 mb-2">📝 중간 보고서</h2>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ midReport }}</p>
      </div>

      <div v-if="endReport" class="p-4 bg-white border rounded shadow-sm">
        <h2 class="font-semibold text-purple-700 mb-2">📘 월말 보고서</h2>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ endReport }}</p>
      </div>
    </div>

    <p v-if="!midReport && !endReport && studentId && month" class="text-sm text-gray-500">
      선택한 월의 보고서가 없습니다.
    </p>

    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>
