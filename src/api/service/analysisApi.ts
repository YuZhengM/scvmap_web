import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';

export default class AnalysisApi {
  /**
   * analysis 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/analysis';

  /**
   * analysis data
   */
  public static async listTrait(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/list`).then((res: any) => res.data);
  }

  public static async listTraitBySampleId(sampleId: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/list/${sampleId}`).then((res: any) => res.data);
  }

  public static async listTraitBySampleIdAndTraitIdList(sampleId: string, traitIdList: []): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait/list/${sampleId}`, { traitIdList }).then((res: any) => res.data);
  }

  public static async getSampleTraitsHeatmap(sampleId: string, method: string, strategy: string, param: any): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/sample/heatmap/${sampleId}/${method}/${strategy}`, param).then((res: any) => res.data);
  }

  public static async listSample(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/list`).then((res: any) => res.data);
  }

  public static async listDataByGenes(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gene`, params).then((res: any) => res.data);
  }

  public static async listDataByTfs(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/tf`, params).then((res: any) => res.data);
  }

  public static async getGeneGraphData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gene/regulation/graph`, params).then((res: any) => res.data);
  }

  public static async getTfGraphData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/tf/regulation/graph`, params).then((res: any) => res.data);
  }

  public static async listMagmaVariantInfoDataByTraitIdAndGene(traitId: string, genome: string, gene: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/magma/gene/${traitId}/${genome}/${gene}`).then((res: any) => res.data);
  }

  public static async listGeneEnrichmentData(params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gene/enrichment`, params).then((res: any) => res.data);
  }

  public static async listSampleDataByGene(gene: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/gene/${gene}`).then((res: any) => res.data);
  }

  public static async listSampleDataByTf(tf: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/tf/${tf}`).then((res: any) => res.data);
  }
}
