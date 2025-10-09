import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';
import NumberUtil from '@/service/util/base/number';

export default class VariantDetailApi {
  /**
   * variant detail interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/variant/detail';

  /**
   * variant detail data
   */
  public static async listTraitByRsId(rsId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/variant/${rsId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  /**
   * variant relevance graph data
   */
  public static async getVariantRelevanceGraph(rsId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/variant/graph/${rsId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }
}
