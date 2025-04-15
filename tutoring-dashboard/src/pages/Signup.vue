<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4">
      <h2 class="text-2xl font-bold text-center">회원가입</h2>
      <input v-model="name" type="text" placeholder="이름" class="w-full p-2 border rounded" />
      <select v-model="role" class="w-full p-2 border rounded">
        <option disabled value="">역할을 선택하세요</option>
        <option value="teacher">선생님</option>
        <option value="parent">학부모</option>
      </select>
      <input v-model="email" type="email" placeholder="이메일" class="w-full p-2 border rounded" />
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="w-full p-2 border rounded"
      />
      <button
        @click="signup"
        class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        회원가입
      </button>
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('')
const error = ref(null)
const router = useRouter()

const signup = async () => {
  error.value = null

  const { data, error: authError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    return
  }

  const userId = data.user.id

  const { error: dbError } = await supabase.from('users').insert({
    id: userId,
    name: name.value,
    role: role.value,
  })

  if (dbError) {
    error.value = dbError.message
    return
  }

  router.push('/dashboard')
}
</script>
