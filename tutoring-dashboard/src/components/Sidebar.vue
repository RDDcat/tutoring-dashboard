<template>
  <!-- 사용자 role이 없으면 빈 화면 -->
  <div v-if="!user.role" class="w-60 bg-white p-4">⏳ 사용자 정보 불러오는 중...</div>

  <!-- role 있을 때만 사이드바 렌더 -->
  <aside v-else class="w-60 h-screen bg-white border-r shadow-sm p-4">
    <div class="text-lg font-bold text-blue-600 mb-6">과외 대시보드</div>

    <nav class="space-y-2">
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
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const menu = computed(() =>
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
      ],
)
</script>
