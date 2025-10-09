import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';
import NumberUtil from '@/service/util/base/number';

export default class AnalysisApi {
  /**
   * analysis interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/analysis';

  /**
   * analysis data
   */
  public static async listTrait(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTraitBySampleId(sampleId: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/list/${sampleId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTraitBySampleIdAndTraitIdList(sampleId: string, traitIdList: []): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait/list/${sampleId}?id=${NumberUtil.random10()}`, { traitIdList }).then((res: any) => res.data);
  }

  public static async getSampleTraitsHeatmap(sampleId: string, method: string, strategy: string, param: any): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/sample/heatmap/${sampleId}/${method}/${strategy}?id=${NumberUtil.random10()}`, param).then((res: any) => res.data);
  }

  public static async listSample(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listDataByGenes(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gene?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listDataByTfs(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/tf?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getGeneGraphData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gene/regulation/graph?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getTfGraphData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/tf/regulation/graph?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getTfGeneGraphData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/tf_gene/regulation/graph?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listMagmaVariantInfoDataByTraitIdAndGene(traitId: string, genome: string, gene: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/magma/gene/${traitId}/${genome}/${gene}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listGeneEnrichmentData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gene/enrichment?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listSampleDataByGene(gene: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/gene/${gene}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listSampleDataByTf(tf: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/tf/${tf}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }
}
