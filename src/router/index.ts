import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ReviewPage from '../pages/ReviewPage.vue'
import ManagePage from '../pages/ManagePage.vue'
import AddPage from '../pages/AddPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/review', name: 'review', component: ReviewPage },
    { path: '/manage', name: 'manage', component: ManagePage },
    { path: '/add', name: 'add', component: AddPage },
  ],
})

export default router
