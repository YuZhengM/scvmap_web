import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';

export default class VariantDetailApi {
  /**
   * detail 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/variant/detail';

  /**
   * Sample Overview 数据
   */
  public static async listTraitByRsId(rsId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/variant/${rsId}/${genome}`).then((res: any) => res.data);
  }

  public static async getVariantRelevanceGraph(rsId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/variant/graph/${rsId}/${genome}`).then((res: any) => res.data);
  }
}
