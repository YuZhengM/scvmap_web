import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';
import NumberUtil from '@/service/util/base/number';

export default class DetailApi {
  /**
   * detail 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/detail';

  public static async getSampleInfo(sampleId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/${sampleId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTraitInfo(traitId: string, genome: string, method: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait_info/${traitId}/${genome}/${method}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getCellTypeCount(sampleId: string, metadata: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cell_type/count/${sampleId}/${metadata}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async getTraitChrCount(traitId: string, genome: string, fineMappingMethod: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/chr/count/${traitId}/${genome}/${fineMappingMethod}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTraitBySampleId(sampleId: string, method: string, fineMappingMethod: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/overlap/${sampleId}/${method}/${fineMappingMethod}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listSampleInfoByTraitId(traitId: string, method: string, fineMappingMethod: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/overlap/${traitId}/${method}/${fineMappingMethod}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async getVariantTrait(traitId: string, method = 'finemap'): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/${traitId}/${method}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listClusterCoordinate(sampleId: string, cellRate: number, metadata: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cluster_coordinate/${sampleId}/${cellRate}/${metadata}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTraitCluster(sampleId: string, method: string, traitId: string, cellRate: number, metadata: string, fineMappingMethod: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cluster_coordinate/${sampleId}/${method}/${traitId}/${cellRate}/${metadata}/${fineMappingMethod}?id=${NumberUtil.random10()}`)
      .then((res: any) => res.data);
  }

  public static async listDifferenceGeneBySampleId(sampleId: string, metadata: string, cellType: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/difference_gene/${sampleId}/${metadata}/${cellType}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getDifferenceHeatmapBySampleId(element: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/difference_${element}/heatmap?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listDifferenceTfBySampleId(sampleId: string, cellType: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/difference_tf/${sampleId}/${cellType}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listChromvarDifferenceTfBySampleId(sampleId: string, cellType: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/chromvar_difference_tf/${sampleId}/${cellType}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listMagmaGeneByTraitId(traitId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/magma_gene/${traitId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listCiceroTraitGeneBySampleIdAndTraitId(sampleId: string, traitId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cicero_trait_gene/${sampleId}/${traitId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async getCiceroAndMagmaOverlapGene(sampleId: string, traitId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cicero_magma_gene/overlap/${sampleId}/${traitId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listHomerTfByTraitId(traitId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/homer_tf/${traitId}/${genome}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listGimmeTfByTraitId(sampleId: string, traitId: string, page: any): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/gimme_tf/${sampleId}/${traitId}?id=${NumberUtil.random10()}`, page).then((res: any) => res.data);
  }

  public static async listSampleCellTypeTimeSexDrug(sampleId: string, id: number, metadata = 'cell_type'): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cell_type/${sampleId}/${metadata}?id=${id}`).then((res: any) => res.data);
  }

  public static async listEqtlBytraitId(traitId: string, genome: string, chr: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/eqtl/${traitId}/${genome}/${chr}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listMpraByTraitId(traitId: string, genome: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/mpra/${traitId}/${genome}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listInteractionByTraitId(traitId: string, genome: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/interaction/${traitId}/${genome}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getKlScoreData(sampleId: string, traitId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/kl_score/${sampleId}/${traitId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }
}
