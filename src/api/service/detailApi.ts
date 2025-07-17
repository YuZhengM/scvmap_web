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

  public static async listTraitInfo(traitId: string, genome: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait_info/${traitId}/${genome}`, params).then((res: any) => res.data);
  }

  public static async getCellTypeCount(sampleId: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cell_type/count/${sampleId}`).then((res: any) => res.data);
  }

  public static async getTraitChrCount(traitId: string, genome: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/chr/count/${traitId}/${genome}`).then((res: any) => res.data);
  }

  public static async listTraitBySampleId(sampleId: string, method: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/overlap/${sampleId}/${method}`).then((res: any) => res.data);
  }

  public static async listSampleInfoByTraitId(traitId: string, method: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/overlap/${traitId}/${method}`).then((res: any) => res.data);
  }

  public static async getVariantTrait(traitId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/${traitId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listClusterCoordinate(sampleId: string, cellRate: number): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cluster_coordinate/${sampleId}/${cellRate}`).then((res: any) => res.data);
  }

  public static async listTraitCluster(sampleId: string, method: string, traitId: string, cellRate: number): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cluster_coordinate/${sampleId}/${method}/${traitId}/${cellRate}`).then((res: any) => res.data);
  }

  public static async listDifferenceGeneBySampleId(sampleId: string, cellType: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/difference_gene/${sampleId}/${cellType}`, params).then((res: any) => res.data);
  }

  public static async getDifferenceHeatmapBySampleId(element: string, params: {}): Promise<Result> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/difference_${element}/heatmap`, params).then((res: any) => res.data);
  }

  public static async listDifferenceTfBySampleId(sampleId: string, cellType: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/difference_tf/${sampleId}/${cellType}`).then((res: any) => res.data);
  }

  public static async listMagmaGeneByTraitId(traitId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/magma_gene/${traitId}/${genome}`).then((res: any) => res.data);
  }

  public static async listHomerTfByTraitId(traitId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/homer_tf/${traitId}/${genome}`).then((res: any) => res.data);
  }

  public static async listSampleCellType(sampleId: string, id: number): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cell_type/${sampleId}?id=${id}`).then((res: any) => res.data);
  }
}
