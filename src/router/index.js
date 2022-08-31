import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      login: true,
    },
  },
  {
    path: "/RealtimeData",
    name: "RealtimeData",
    component: () => import("@/views/pages/RealtimeData.vue"),
    meta: {
      login: true,
    },
  },
  {
    path: "/AlarmAnalysis",
    name: "AlarmAnalysis",
    component: () => import("@/views/pages/AlarmAnalysis.vue"),
    meta: {
      login: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  to.matched.some((route) => {
    if (route.meta.login) {
      if (store.state.token || localStorage.getItem("token")) {
        next();
      } else {
        next({ name: "Login", params: { path: route.path } });
      }
    } else {
      next();
    }
  });
});

export default router;
