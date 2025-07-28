import type { RouteRecordRaw } from "vue-router";

import SettingsView from "~/views/SettingsView.vue";
import ProjectList from "~/views/ProjectList.vue";

export const rootRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: ProjectList,
    meta: { requiresAuth: true, title: "项目列表" },
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
