<script setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const user = useUserStore()
const isOpen = ref(false)

const menu =
  user.role === 'teacher'
    ? [
        { path: '/dashboard', label: '대시보드' },
        { path: '/students', label: '학생 목록' },
        { path: '/calendar', label: '수업 캘린더' },
        { path: '/lesson-report', label: '수업 리포트' },
        { path: '/report-editor', label: '보고서 작성' },
      ]
    : [
        { path: '/dashboard', label: '대시보드' },
        { path: '/child-progress', label: '자녀 현황' },
        { path: '/report-viewer', label: '보고서 열람' },
      ]
</script>

<template>
  <!-- 모바일 햄버거 버튼 -->
  <button
    class="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
    @click="isOpen = !isOpen"
  >
    ☰
  </button>

  <!-- 사이드바 -->
  <aside
    :class="[
      'fixed top-0 left-0 w-60 h-screen bg-white border-r shadow-sm z-40 transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0 md:relative md:block',
    ]"
  >
    <div class="flex items-center justify-between p-6 border-b text-xl font-bold text-blue-600">
      과외 대시보드
      <button class="md:hidden text-gray-500 text-lg" @click="isOpen = false">✕</button>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="block px-4 py-2 rounded text-gray-700 hover:bg-blue-100"
        :class="{ 'bg-blue-50 font-semibold text-blue-700': $route.path === item.path }"
        @click="isOpen = false"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
