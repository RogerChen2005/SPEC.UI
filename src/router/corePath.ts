import type { RouteRecordRaw } from "vue-router";

const Home = () => import("~/views/HomeView.vue");

export const coreRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true, title: "主页" },
  }
];
