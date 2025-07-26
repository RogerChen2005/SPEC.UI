import type { Router } from "vue-router";

export function routerSetup(router: Router) {
  router.afterEach((to) => {
    // 设置页面标题
    if (to.meta.title) {
      document.title = to.meta.title as string;
    }
  });
}
