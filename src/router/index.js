import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/index";

// 修复重复路由点击报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/user/index.vue"),
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const tokenTime = localStorage.getItem("tokenTime");
  const currentTime = new Date().getTime();

  if (to.name === 'login') {
    next()
    return
  }

  if (token && tokenTime) {
    // 判断时间是否合法
    if (currentTime - tokenTime > 60 * 60 * 24 * 1000) {
      localStorage.clear()

      next({ name: "login" });
    } else {
      next()
    }
  }
  else {
    next({ name: "login" });
  }

});
export default router;
