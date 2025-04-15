import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Calendar from '@/pages/Calendar.vue'
import LessonReport from '@/pages/LessonReport.vue'
import ReportEditor from '@/pages/ReportEditor.vue'
import ReportViewer from '@/pages/ReportViewer.vue'
import ChildProgress from '@/pages/ChildProgress.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },

  { path: '/dashboard', component: Dashboard },

  // 선생님 전용
  { path: '/calendar', component: Calendar, meta: { role: 'teacher' } },
  { path: '/lesson-report', component: LessonReport, meta: { role: 'teacher' } },
  { path: '/report-editor', component: ReportEditor, meta: { role: 'teacher' } },

  // 부모 전용
  { path: '/report-viewer', component: ReportViewer, meta: { role: 'parent' } },
  { path: '/child-progress', component: ChildProgress, meta: { role: 'parent' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ 라우팅 가드
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 로그인 페이지는 누구나 접근 가능
  if (to.path === '/login') return next()

  // 유저 정보가 없으면 로그인 페이지로 강제 이동
  if (!userStore.id) {
    return next('/login')
  }

  // meta.role이 지정된 경우, 유저 role과 다르면 차단
  if (to.meta.role && userStore.role !== to.meta.role) {
    alert('접근 권한이 없습니다.')
    return next('/dashboard')
  }

  next()
})

export default router
