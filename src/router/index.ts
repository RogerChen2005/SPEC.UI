import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// Core components, load previously.
import Main from "~/views/MainView.vue";
import UnauthorizedView from "~/views/UnauthorizedView.vue";
import NotFoundView from "~/views/NotFoundView.vue";
import { routerSetup } from "./setup";
import { coreRoutes } from "./corePath";

const routes:readonly RouteRecordRaw[] = [
  {
    path: "/",
    component: Main,
    meta: { requiresAuth: true, title: "Main"},
    children: coreRoutes
  },
  {
    path: "/unauthorized",
    component: UnauthorizedView,
    meta: { requiresAuth: false, title: "未授权访问" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundView,
    meta: { requiresAuth: false, title: "404 Not Found" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

routerSetup(router);

export default router;
