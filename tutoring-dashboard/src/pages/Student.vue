<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">👩‍🎓 학생 목록</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + 학생 등록
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="student in students"
        :key="student.id"
        class="bg-white p-4 rounded-xl shadow border hover:shadow-md"
      >
        <h2 class="text-lg font-semibold text-gray-900">{{ student.name }}</h2>
        <p class="text-sm text-gray-500">등록일: {{ student.registered }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const students = [
  { id: 1, name: '임초현', registered: '2024-03-01' },
  { id: 2, name: '김예준', registered: '2024-04-01' },
]
</script>
