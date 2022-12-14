import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Category from '../components/goods/Category.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // 访问根路径时将自动跳转到login页面
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
      children: [
        { path: '/welcome', component: Welcome},
        { path: '/users', component: Users},
        { path: '/rights', component: Rights},
        { path: '/roles', component: Roles },
        {path: '/Categories', component: Category},
      ]
    }
  ]
})

// 挂载路由导航守卫
// to 将要访问的路径
// from 代表从哪个路径跳转而来的
// next()放行，next('/path')强制跳转到路径页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router