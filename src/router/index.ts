import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

// Core components, load previously.
import MainView from "~/views/MainView.vue";
import UnauthorizedView from "~/views/UnauthorizedView.vue";
import NotFoundView from "~/views/NotFoundView.vue";
import { routerSetup } from "./setup";
import { rootRoutes } from "./rootPath";

const routes: readonly RouteRecordRaw[] = [
  {
    path: "/",
    component: MainView,
    meta: { requiresAuth: true, title: "主页" },
    children: rootRoutes,
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
