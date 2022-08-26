import Vue from "vue";
import VueRouter from "vue-router";

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
  },
  {
    path: "/RealtimeData",
    name: "RealtimeData",
    component: () => import("@/views/pages/RealtimeData.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
