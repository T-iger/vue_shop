import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Role from '../components/role/Role'
import Menu from '../components/menu/Menu'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/Welcome',
      component: Welcome
    }, {
      path: '/user',
      component: User
    }, {
      path: '/role',
      component: Role
    }, {
      path: '/menu',
      component: Menu
    }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，这个用来拦截没有token的请求地址
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行  next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
