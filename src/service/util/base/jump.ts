import { LocationQueryRaw, RouteLocationNormalizedLoaded, Router } from 'vue-router';
import Time from '@/service/util/base/time';

/**
 * 跳转的公共类
 * 其中 path 例子 /a/b/c
 */
class Jump {
  /**
   * 在本页面跳转到 url
   * @param router 路由
   * @param path 跳转的 url
   */
  public static routerDefault(router: Router, path: string): void {
    router.push({ path }).then(() => true).catch(() => false);
  }

  /**
   * 在本页面跳转到 url
   * @param router 路由
   * @param path 跳转的 url
   * @param query 参数
   */
  public static routerQuery(router: Router, path: string, query: LocationQueryRaw): void {
    router.push({
      path,
      query
    }).then(() => true).catch(() => false);
  }

  /**
   * 在新窗口跳转到 url
   * @param router 路由
   * @param path 跳转的 url
   * @param query 参数
   */
  public static routerBlank(router: Router, path: string, query: LocationQueryRaw): void {
    const { href } = router.resolve({ path, query });
    window.open(href, '_blank');
  }

  /**
   * 跳转首页
   * @param route
   * @param router
   */
  public static index(route: RouteLocationNormalizedLoaded, router: Router) {
    if (route.path !== '/index' && route.path !== '/') {
      Jump.routerQuery(router, '/', Time.timeQuery());
    }
  }
}

export default Jump;
