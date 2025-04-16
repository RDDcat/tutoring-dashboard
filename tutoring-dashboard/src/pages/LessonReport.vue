<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const students = ref([])
const studentId = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const startTime = ref('')
const endTime = ref('')
const publicNote = ref('')
const privateNote = ref('')
const existingId = ref(null)
const message = ref('')
const error = ref('')

onMounted(async () => {
  const { data } = await supabase.from('students').select('id, name').eq('teacher_id', user.id)

  students.value = data

  // ✅ 첫 번째 학생 자동 선택
  if (data?.length) studentId.value = data[0].id
})

// 수업 데이터가 이미 존재하는지 확인 (같은 날짜+학생)
watch([studentId, date], async () => {
  if (!studentId.value || !date.value) return

  const { data } = await supabase
    .from('lessons')
    .select('*')
    .eq('student_id', studentId.value)
    .eq('date', date.value)
    .maybeSingle()

  if (data) {
    startTime.value = data.start_time || ''
    endTime.value = data.end_time || ''
    publicNote.value = data.public_note || ''
    privateNote.value = data.private_note || ''
    existingId.value = data.id
  } else {
    startTime.value = ''
    endTime.value = ''
    publicNote.value = ''
    privateNote.value = ''
    existingId.value = null
  }
})

const saveLesson = async () => {
  error.value = ''
  message.value = ''

  if (!studentId.value || !date.value || !startTime.value || !endTime.value) {
    error.value = '학생, 날짜, 시간은 필수 입력입니다.'
    return
  }

  const payload = {
    student_id: studentId.value,
    date: date.value,
    start_time: startTime.value,
    end_time: endTime.value,
    public_note: publicNote.value,
    private_note: privateNote.value,
  }

  const { error: dbError } = existingId.value
    ? await supabase.from('lessons').update(payload).eq('id', existingId.value)
    : await supabase.from('lessons').insert(payload)

  if (dbError) {
    error.value = dbError.message
  } else {
    message.value = existingId.value ? '수업 정보를 수정했습니다.' : '수업 정보를 저장했습니다.'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">📘 수업 정보 작성</h1>

    <div class="space-y-2">
      <label class="block font-medium">학생</label>
      <select v-model="studentId" class="w-full p-2 border rounded">
        <option disabled value="">학생을 선택하세요</option>
        <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block font-medium">수업 날짜</label>
        <input type="date" v-model="date" class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block font-medium">시간</label>
        <div class="flex space-x-2">
          <input type="time" v-model="startTime" class="p-2 border rounded w-1/2" />
          <input type="time" v-model="endTime" class="p-2 border rounded w-1/2" />
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block font-medium">📢 학부모 공개 메모</label>
      <textarea v-model="publicNote" class="w-full p-2 border rounded resize-none" rows="4" />
    </div>

    <div class="space-y-2">
      <label class="block font-medium">🔒 선생님 전용 메모</label>
      <textarea v-model="privateNote" class="w-full p-2 border rounded resize-none" rows="4" />
    </div>

    <button @click="saveLesson" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      저장하기
    </button>

    <p v-if="message" class="text-green-600">{{ message }}</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>
