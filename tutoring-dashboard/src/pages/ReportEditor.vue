<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const students = ref([])
const studentId = ref('')
const month = ref(new Date().toISOString().slice(0, 7)) // '2025-04'
const reportType = ref('중간') // '중간' or '월말'
const content = ref('')
const existingId = ref(null)
const message = ref('')
const error = ref('')

onMounted(async () => {
  const { data } = await supabase.from('students').select('id, name').eq('teacher_id', user.id)
  students.value = data
})

watch([studentId, month, reportType], async () => {
  content.value = ''
  existingId.value = null
  if (!studentId.value || !month.value || !reportType.value) return

  const { data } = await supabase
    .from('reports')
    .select('*')
    .eq('student_id', studentId.value)
    .eq('month', month.value)
    .eq('type', reportType.value)
    .maybeSingle()

  if (data) {
    content.value = data.content || ''
    existingId.value = data.id
  }
})

const saveReport = async () => {
  if (!studentId.value || !month.value || !reportType.value) {
    error.value = '모든 항목을 입력해주세요.'
    return
  }

  const payload = {
    student_id: studentId.value,
    month: month.value,
    type: reportType.value,
    content: content.value,
  }

  const { error: saveError } = existingId.value
    ? await supabase.from('reports').update(payload).eq('id', existingId.value)
    : await supabase.from('reports').insert(payload)

  if (saveError) {
    error.value = saveError.message
  } else {
    message.value = existingId.value ? '보고서를 수정했습니다.' : '보고서를 저장했습니다!'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">📄 보고서 작성</h1>

    <div class="space-y-2">
      <label class="block font-medium">학생</label>
      <select v-model="studentId" class="w-full p-2 border rounded">
        <option disabled value="">학생을 선택하세요</option>
        <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="block font-medium">대상 월</label>
      <input v-model="month" type="month" class="w-full p-2 border rounded" />
    </div>

    <div class="space-y-2">
      <label class="block font-medium">보고서 종류</label>
      <select v-model="reportType" class="w-full p-2 border rounded">
        <option value="중간">중간 보고서</option>
        <option value="월말">월말 보고서</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="block font-medium">내용</label>
      <textarea v-model="content" rows="6" class="w-full p-2 border rounded resize-none" />
    </div>

    <button @click="saveReport" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      저장하기
    </button>

    <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>
