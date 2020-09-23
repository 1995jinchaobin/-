import Vue from 'vue'
import VueRouter from 'vue-router'
// import Statistical from '@/views/web/Statistical.vue'
const Statistical = () => import(/* webpackChunkName: "statistical_JBpeizhi_CSpeizhi" */ '@/views/web/Statistical.vue')
// import JBpeizhi from '@/views/wzpeizhi/JBpeizhi.vue'
const JBpeizhi = () => import(/* webpackChunkName: "statistical_JBpeizhi_CSpeizhi" */ '@/views/wzpeizhi/JBpeizhi.vue')
// import CSpeizhi from '@/views/wzpeizhi/CSpeizhi.vue'
const CSpeizhi = () => import(/* webpackChunkName: "statistical_JBpeizhi_CSpeizhi" */ '@/views/wzpeizhi/CSpeizhi.vue')

const Ad = () => import(/* webpackChunkName: "ad_comment_record" */ '@/views/content/Ad.vue')
const Comment = () => import(/* webpackChunkName: "ad_comment_record" */ '@/views/content/Comment.vue')
const Record = () => import(/* webpackChunkName: "ad_comment_record" */ '@/views/content/Record.vue')

const Trade = () => import(/* webpackChunkName: "trade_invest_member" */ '@/views/gold/Trade.vue')
const Invest = () => import(/* webpackChunkName: "trade_invest_member" */ '@/views/invest/Invest.vue')
const Member = () => import(/* webpackChunkName: "trade_invest_member" */ '@/views/member/Member.vue')

const MineInfo = () => import(/* webpackChunkName: "mineInfo_mineSite_generalInfo" */ '@/views/mineAdmin/MineInfo.vue')
const MineSite = () => import(/* webpackChunkName: "mineInfo_mineSite_generalInfo" */ '@/views/mineAdmin/MineSite.vue')
const GeneralInfo = () => import(/* webpackChunkName: "mineInfo_mineSite_generalInfo" */ '@/views/system/GeneralInfo.vue')

// import HomeUp from '@/views/mineSys/HomeUp.vue'
// import List from '@/views/mineSys/List.vue'
const MallAdmin = () => import(/* webpackChunkName: "mallAdmin_setGood" */ '@/views/mineSys/MallAdmin.vue')
const SetGood = () => import(/* webpackChunkName: "mallAdmin_setGood" */ '@/views/member/SetGood.vue')

const Notice = () => import(/* webpackChunkName: "notice_addGood_order" */ '@/views/mineSys/Notice.vue')
const AddGood = () => import(/* webpackChunkName: "notice_addGood_order" */ '@/views/mineSys/AddGood.vue')
const Order = () => import(/* webpackChunkName: "notice_addGood_order" */ '@/views/mineSys/Order.vue')

const User = () => import(/* webpackChunkName: "login_home_user" */ '@/views/common/User')
const Login = () => import(/* webpackChunkName: "login_home_user" */ '@/views/Login')
const Home = () => import(/* webpackChunkName: "login_home_user" */ '@/views/Home')
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
    name: 'home',
    component: Home,
    children: [
      { path: '/user', component: User },
      { path: '/ad', component: Ad },
      { path: '/comment', component: Comment },
      { path: '/record', component: Record },
      { path: '/trade', component: Trade },
      { path: '/invest', component: Invest },
      { path: '/member', component: Member },
      { path: '/setgood', component: SetGood },
      { path: '/mineInfo', component: MineInfo },
      { path: '/mineSite', component: MineSite },
      // { path: '/homeUp', component: HomeUp },
      // { path: '/list', component: List },
      { path: '/mallAdmin', component: MallAdmin },
      { path: '/notice', component: Notice },
      { path: '/addGood', component: AddGood },
      { path: '/order', component: Order },
      { path: '/generalInfo', component: GeneralInfo },
      { path: '/statistical', component: Statistical },
      { path: '/jbpeizhi', component: JBpeizhi },
      { path: '/cspeizhi', component: CSpeizhi }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
// 请求拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('userToken')
  if (!tokenStr) return next('/login')
  next()
})
// 修改原型对象中的push方法
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }
export default router
