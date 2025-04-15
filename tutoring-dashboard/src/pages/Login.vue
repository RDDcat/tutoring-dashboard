<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
      <h2 class="text-2xl font-bold text-center">로그인</h2>
      <input v-model="email" type="email" placeholder="이메일" class="w-full p-2 border rounded" />
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="w-full p-2 border rounded"
      />
      <button @click="login" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        로그인
      </button>
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

const login = async () => {
  error.value = null

  // 1. 로그인 시도
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    return
  }

  // 2. 로그인 성공 → 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. users 테이블에서 이름, 역할 가져오기
  const { data: userInfo, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userError) {
    error.value = userError.message
    return
  }

  // 4. Pinia에 저장
  const store = useUserStore()
  store.setUser(userInfo)

  // 5. 이동
  router.push('/dashboard')
}
</script>
