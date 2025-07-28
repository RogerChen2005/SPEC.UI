import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

// Core components, load previously.
import Home from "~/views/HomeView.vue";
import Main from "~/views/MainView.vue";
import CreateView from "~/views/Create/CreateView.vue";
import UnauthorizedView from "~/views/UnauthorizedView.vue";
import NotFoundView from "~/views/NotFoundView.vue";
import { routerSetup } from "./setup";
import { projectRoutes } from "./projectPath";
import { rootRoutes } from "./rootPath";

const routes: readonly RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true, title: "主页" },
    children: rootRoutes,
  },
  {
    path: "/create",
    component: CreateView,
    meta: { requiresAuth: false, title: "创建" },
  },
  {
    path: "/project",
    component: Main,
    meta: { requiresAuth: true, title: "Main" },
    children: projectRoutes,
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
