<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">📊 대시보드</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
      <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 class="text-lg font-semibold mb-2 text-blue-700">👨‍🏫 선생님 통계</h2>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>총 수업 횟수: 25회</li>
          <li>총 수업 시간: 52시간</li>
          <li>학생 수: 3명</li>
        </ul>
      </div>

      <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 class="text-lg font-semibold mb-2 text-green-700">👨‍👩‍👧 부모 대시보드</h2>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>자녀 수업 진행률: 85%</li>
          <li>최근 보고서: 2024-03 월말 보고서</li>
          <li>누적 수업 시간: 14시간</li>
        </ul>
      </div>

      <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 class="text-lg font-semibold mb-2 text-purple-700">📅 일정 미리보기</h2>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>다음 수업: 4월 16일</li>
          <li>월말 보고서 마감: 4월 30일</li>
        </ul>
      </div>
    </div>
  </div>
</template>
