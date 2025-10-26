import type { RouteRecordRaw } from "vue-router";

import SettingsView from "~/views/SettingsView.vue";
import CreateView from "~/views/Create/CreateView.vue";

export const rootRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: CreateView,
    meta: { requiresAuth: true, title: "创建" },
  },
  {
    path: "/settings",
    component: SettingsView,
    meta: { requiresAuth: true, title: "设置" },
  },
  {
    path: "/about",
    component: () => import("~/views/AboutView.vue"),
    meta: { requiresAuth: false, title: "关于" },
  }
];
