<template>
  <aside class="w-64 bg-white shadow-lg">
    <nav class="p-4 space-y-4">
      <RouterLink to="/dashboard" class="block text-lg hover:text-blue-500">📊 대시보드</RouterLink>
      <RouterLink to="/calendar" class="block text-lg hover:text-blue-500"
        >📅 수업 캘린더</RouterLink
      >
      <RouterLink to="/lesson-report" class="block text-lg hover:text-blue-500"
        >📝 수업 리포트</RouterLink
      >
      <RouterLink to="/report-editor" class="block text-lg hover:text-blue-500"
        >✍️ 보고서 작성</RouterLink
      >
      <RouterLink to="/report-viewer" class="block text-lg hover:text-blue-500"
        >📄 보고서 열람</RouterLink
      >
    </nav>
  </aside>
</template>
