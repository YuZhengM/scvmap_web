import { Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';

export default class DownloadApi {
  /**
   * download 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/download';

  /**
   * download Sample table 数据
   */
  public static async listSampleInformation(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample`).then((res: any) => res.data);
  }

  public static async listTraitInformation(params: {}): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait`, params).then((res: any) => res.data);
  }
}
