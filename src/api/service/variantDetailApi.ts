import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';
import NumberUtil from '@/service/util/base/number';

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
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/variant/${rsId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async getVariantRelevanceGraph(rsId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/variant/graph/${rsId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }
}
