<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const students = ref([])
const newStudentName = ref('')
const message = ref('')
const error = ref('')

const fetchStudents = async () => {
  const { data, error: err } = await supabase
    .from('students')
    .select('id, name, created_at')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  if (!err) students.value = data
  else error.value = err.message
}

onMounted(fetchStudents)

const addStudent = async () => {
  error.value = ''
  message.value = ''

  if (!newStudentName.value.trim()) {
    error.value = '이름을 입력하세요.'
    return
  }

  const { error: insertError } = await supabase.from('students').insert({
    name: newStudentName.value.trim(),
    teacher_id: user.id,
  })

  if (insertError) {
    error.value = insertError.message
  } else {
    message.value = '학생이 등록되었습니다.'
    newStudentName.value = ''
    fetchStudents()
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">👩‍🎓 학생 목록</h1>

    <!-- 등록 폼 -->
    <div class="flex space-x-2">
      <input
        v-model="newStudentName"
        placeholder="새 학생 이름"
        class="flex-1 p-2 border rounded"
      />
      <button @click="addStudent" class="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
        ➕ 등록
      </button>
    </div>

    <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

    <!-- 목록 -->
    <ul class="space-y-2 mt-4">
      <li
        v-for="student in students"
        :key="student.id"
        class="p-4 border bg-white rounded shadow-sm"
      >
        <div class="font-semibold text-gray-800">{{ student.name }}</div>
        <div class="text-xs text-gray-500">등록일: {{ student.created_at?.slice(0, 10) }}</div>
      </li>
    </ul>
  </div>
</template>
