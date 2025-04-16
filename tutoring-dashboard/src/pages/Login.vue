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

const login = async () => {
  error.value = null

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    return
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    error.value = userError.message
    return
  }

  const user = userData.user

  const { data: userInfo, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (fetchError) {
    error.value = fetchError.message
    return
  }

  const store = useUserStore()
  store.setUser(userInfo)
  router.push('/dashboard')
}
</script>
