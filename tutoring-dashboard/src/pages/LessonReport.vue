<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const students = ref([])
const studentId = ref('')
const date = ref(new Date().toISOString().slice(0, 10))

const publicNote = ref('')
const privateNote = ref('')
const reportId = ref(null) // 기존 리포트 ID 저장
const message = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  const { data, error: err } = await supabase
    .from('students')
    .select('id, name')
    .eq('teacher_id', user.id)

  console.log('👨‍🏫 불러온 학생:', data, err) // 이거 확인!!
  if (!err) {
    students.value = data
  }
})

// ✅ 학생 or 날짜 변경 시 기존 리포트 자동 조회
watch([studentId, date], async () => {
  publicNote.value = ''
  privateNote.value = ''
  reportId.value = null
  if (!studentId.value || !date.value) return

  const { data, error: fetchError } = await supabase
    .from('lessons')
    .select('*')
    .eq('student_id', studentId.value)
    .eq('date', date.value)
    .maybeSingle()

  if (!fetchError && data) {
    publicNote.value = data.public_note || ''
    privateNote.value = data.private_note || ''
    reportId.value = data.id
  }
})

const saveReport = async () => {
  if (!studentId.value || !date.value) {
    error.value = '학생과 날짜를 선택해주세요.'
    return
  }

  error.value = ''
  message.value = ''
  loading.value = true

  const payload = {
    student_id: studentId.value,
    date: date.value,
    public_note: publicNote.value,
    private_note: privateNote.value,
  }

  const { error: saveError } = reportId.value
    ? await supabase.from('lessons').update(payload).eq('id', reportId.value)
    : await supabase.from('lessons').insert(payload)

  loading.value = false

  if (saveError) {
    error.value = saveError.message
  } else {
    message.value = reportId.value ? '리포트가 수정되었습니다.' : '리포트가 저장되었습니다!'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">📝 수업 리포트 작성</h1>

    <div class="space-y-2">
      <label class="block font-medium text-gray-700">학생 선택</label>
      <select v-model="studentId" class="w-full p-2 border rounded">
        <option disabled value="">학생을 선택하세요</option>
        <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="block font-medium text-gray-700">수업 날짜</label>
      <input v-model="date" type="date" class="w-full p-2 border rounded" />
    </div>

    <div class="space-y-2">
      <label class="block font-medium text-gray-700">📢 공개 내용</label>
      <textarea v-model="publicNote" rows="4" class="w-full p-2 border rounded resize-none" />
    </div>

    <div class="space-y-2">
      <label class="block font-medium text-gray-700">🔒 비공개 메모</label>
      <textarea v-model="privateNote" rows="4" class="w-full p-2 border rounded resize-none" />
    </div>

    <button
      @click="saveReport"
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      💾 저장하기
    </button>

    <p v-if="message" class="text-green-600 font-medium mt-2">{{ message }}</p>
    <p v-if="error" class="text-red-500 font-medium mt-2">{{ error }}</p>
  </div>
</template>
