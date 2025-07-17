import { Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';

/**
 * searchApi
 */
export default class HomeApi {
  /**
   * search 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/home';

  public static async listInfoByContent(label: string, content: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/search/${label}/${content}`).then((res: any) => res.data);
  }
}
