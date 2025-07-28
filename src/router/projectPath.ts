import type { RouteRecordRaw } from "vue-router";


// const Project = () => import("~/views/ProjectView.vue");
import Project from "~/views/ProjectView.vue";

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: Project,
    meta: { requiresAuth: true, title: "主页" },
  }
];
