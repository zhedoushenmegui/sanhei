import { createRouter, createWebHistory } from 'vue-router'

import home from '../views/home.vue'

const routes = [
  {
    name: 'home',
    path: '/sanhe1',
    component: home,
  },
  {
    name: 'flight',
    path: '/sanhe1/flight',
    component: () => import('../views/flight.vue'),
  },
  {
    name: 'sanhe1',
    path: '/sanhe1/sanhe1',
    component: () => import('../views/sanhe1.vue'),
  },
  {
    name: 'chengyu',
    path: '/sanhe1/chengyu',
    component: () => import('../views/chengyu.vue'),
  },
  {
    name: 'colortube',
    path: '/sanhe1/colortube',
    component: () => import('../views/ColorTube.vue'),
  },
  {
    name: 'sanhe1_3d',
    path: '/sanhe1/sanhe1_3d',
    component: () => import('../views/sanhe1_3d.vue'),
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
