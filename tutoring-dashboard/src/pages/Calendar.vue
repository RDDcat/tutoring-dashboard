<script setup>
import { ref } from 'vue'
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from 'date-fns'

// 📆 현재 월의 날짜 목록 생성
const today = new Date()
const monthStart = startOfMonth(today)
const monthEnd = endOfMonth(today)

const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

// 샘플 데이터
const lessons = [
  { date: '2025-04-15', title: '수업: 함수 개념 복습' },
  { date: '2025-04-19', title: '수업: 문제풀이 실전' },
]

const reports = [
  { date: '2025-04-10', type: '중간보고서' },
  { date: '2025-04-30', type: '월말보고서' },
]

const getEvents = (day) => {
  const dateStr = format(day, 'yyyy-MM-dd')
  return [
    ...lessons.filter((l) => l.date === dateStr),
    ...reports.filter((r) => r.date === dateStr),
  ]
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">📅 수업 캘린더</h1>
    <div class="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 font-semibold">
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <template v-for="day in days" :key="day.toISOString()">
        <div class="p-2 bg-white border rounded h-28 flex flex-col text-xs">
          <div class="font-bold text-gray-800">{{ format(day, 'd') }}</div>
          <div
            v-for="event in getEvents(day)"
            :key="event.title"
            class="mt-1 truncate text-blue-600"
          >
            • {{ event.title || event.type }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
