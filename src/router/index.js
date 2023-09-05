import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EtapaView from '../views/EtapaView.vue'
import LoginView from '../views/LoginView.vue'
import Dashboard from '../views/Dashboard.vue'
import GuardUsuario from '../service/middlewareUsuario';


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta:{layout:'admin'},
    beforeEnter: GuardUsuario.auth
  },
  {
    path: '/etapas/:pk_id_tarefa',
    name: 'etapas',
    component: EtapaView,
    component: () => import('../views/EtapaView.vue'),
    meta:{layout:'admin'},
    beforeEnter: GuardUsuario.auth
    
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta:{layout:'default'},
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta:{layout:'admin'},
    component: () => import('../views/Dashboard.vue'),
    beforeEnter: GuardUsuario.auth
  },
  {
    path: '/dashboard/:pk_id_tarefa',
    name: 'dashboard tarefa',
    component: Dashboard,
    meta:{layout:'admin'},
    component: () => import('../views/Dashboard.vue'),
    beforeEnter: GuardUsuario.auth
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
