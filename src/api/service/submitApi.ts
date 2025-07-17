import { Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';

export default class SubmitApi {
  /**
   * submit 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/submit';

  /**
   * submit 保存数据
   *
   * @param params
   */
  public static async save(params: any): Promise<Result<Boolean>> {
    return RequestApi.requestPost(this.PATH_PREFIX, params)
      .then((res: any) => res.data);
  }
}
