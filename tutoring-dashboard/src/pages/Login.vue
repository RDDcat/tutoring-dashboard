<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100 px-4 sm:px-6">
    <div class="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
      <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-center">🔐 로그인</h2>

      <div class="space-y-2">
        <input
          v-model="email"
          type="email"
          placeholder="이메일"
          class="w-full p-3 border rounded-md text-sm"
        />
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호"
          class="w-full p-3 border rounded-md text-sm"
        />
      </div>

      <button
        @click="login"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
      >
        로그인
      </button>

      <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
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
const store = useUserStore()

const login = async () => {
  error.value = null

  // 1️⃣ 로그인 시도
  const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (loginError) {
    error.value = loginError.message
    return
  }

  // 2️⃣ 현재 로그인된 유저 정보 가져오기
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    error.value = userError?.message || '유저 정보를 불러올 수 없습니다.'
    return
  }

  const user = userData.user

  // 3️⃣ users 테이블에서 사용자 정보 조회 (이름, 역할 등)
  const { data: userInfo, error: userInfoError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userInfoError) {
    error.value = userInfoError.message
    return
  }

  // 4️⃣ Pinia 저장 및 이동
  store.setUser(userInfo)
  router.push('/dashboard')
}
console.log('SUPABASE VERSION TEST:', supabase.auth.signInWithPassword)
</script>
