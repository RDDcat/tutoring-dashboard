// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import Login from '@/pages/Login.vue'
import ParentDashboard from '@/pages/ParentDashboard.vue'
import TeacherDashboard from '@/pages/TeacherDashboard.vue'
import Calendar from '@/pages/Calendar.vue'
import LessonReport from '@/pages/LessonReport.vue'
import ReportEditor from '@/pages/ReportEditor.vue'
import ReportViewer from '@/pages/ReportViewer.vue'
import ChildProgress from '@/pages/ChildProgress.vue'
import Students from '@/pages/Students.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },

  // ✅ 권한에 따라 리디렉션만 하는 대시보드 경로
  {
    path: '/dashboard',
    component: {
      render() {
        return null
      },
    },
    beforeEnter: (to, from, next) => {
      const { role } = useUserStore()
      if (role === 'parent') next('/report-viewer')
      else if (role === 'teacher') next('/students')
      else next('/login')
    },
  },

  // ✅ 선생님 전용
  { path: '/students', component: Students, meta: { role: 'teacher' } },
  { path: '/calendar', component: Calendar, meta: { role: 'teacher' } },
  { path: '/lesson-report', component: LessonReport, meta: { role: 'teacher' } },
  { path: '/report-editor', component: ReportEditor, meta: { role: 'teacher' } },

  // ✅ 부모 전용
  { path: '/report-viewer', component: ReportViewer, meta: { role: 'parent' } },
  { path: '/child-progress', component: ChildProgress, meta: { role: 'parent' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.path === '/login') return next()
  if (!userStore.id) return next('/login')

  if (to.meta.role && userStore.role !== to.meta.role) {
    alert('접근 권한이 없습니다.')
    return next('/dashboard')
  }

  next()
})

export default router
