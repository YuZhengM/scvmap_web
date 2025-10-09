import { Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';
import { Page } from '@/service/model/reponse/request';
import NumberUtil from '@/service/util/base/number';

/**
 * searchApi
 */
export default class HomeApi {
  /**
   * home interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/home';

  public static async listInfoByContent(label: string, content: string, page: Page): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/search/${label}/${content}?id=${NumberUtil.random10()}`, page).then((res: any) => res.data);
  }
}
