<template>
  <aside class="w-60 h-screen bg-white border-r shadow-sm fixed top-0 left-0 flex flex-col">
    <div class="p-6 text-xl font-bold text-blue-600 border-b">과외 대시보드</div>

    <nav class="flex-1 p-4 space-y-2">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="block px-4 py-2 rounded text-gray-700 hover:bg-blue-100"
        :class="{ 'bg-blue-50 font-semibold text-blue-700': $route.path === item.path }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()

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
