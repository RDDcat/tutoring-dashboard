import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/pages/Dashboard.vue'
import Calendar from '@/pages/Calendar.vue'
import LessonReport from '@/pages/LessonReport.vue'
import ReportEditor from '@/pages/ReportEditor.vue'
import ReportViewer from '@/pages/ReportViewer.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/calendar', component: Calendar },
  { path: '/lesson-report', component: LessonReport },
  { path: '/report-editor', component: ReportEditor },
  { path: '/report-viewer', component: ReportViewer },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
