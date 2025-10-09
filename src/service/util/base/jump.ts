import { LocationQueryRaw, RouteLocationNormalizedLoaded, Router } from 'vue-router';
import Time from '@/service/util/base/time';

/**
 * Jump utility class
 * An example of path is /a/b/c
 */
class Jump {
  /**
   * In this page jump to url
   * @param router Router instance
   * @param path URL path
   */
  public static routerDefault(router: Router, path: string): void {
    router.push({ path }).then(() => true).catch(() => false);
  }

  /**
   * In this page jump to url
   * @param router Router instance
   * @param path URL path
   * @param query Query parameters
   */
  public static routerQuery(router: Router, path: string, query: LocationQueryRaw): void {
    router.push({
      path,
      query
    }).then(() => true).catch(() => false);
  }

  /**
   * In a new window jump to url
   * @param router Router instance
   * @param path URL path
   * @param query Query parameters
   */
  public static routerBlank(router: Router, path: string, query: LocationQueryRaw): void {
    const { href } = router.resolve({ path, query });
    window.open(href, '_blank');
  }

  /**
   * Jump to the index page
   * @param route Route location
   * @param router Router instance
   */
  public static index(route: RouteLocationNormalizedLoaded, router: Router) {
    if (route.path !== '/index' && route.path !== '/') {
      Jump.routerQuery(router, '/', Time.timeQuery());
    }
  }
}

export default Jump;
