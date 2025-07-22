<template>
  <div id="download">
    <div class="download">
      <h2 class="title">
        Download
      </h2>
      <el-divider></el-divider>
      <SingleCard :title="{ icon: 'fas fa-circle-down', content: 'Download trait- or disease-relevant cell score (TRS) data for each sample' }" ref="singleCard1">
        <BaseTable :table-data="sampleTableData" :is-service-paging="false" :download-url="overviewDownload('sample_info.txt')" :table-description="sampleDescription">
          <template #default>
            <el-table-column label="scATAC-seq" stripe align="center">
              <template #default="scope">
                <el-link :href="scatacDownload(scope.row)">
                  <el-button size="small" type="primary"> h5ad &nbsp; <i class="fas fa-file-download"></i></el-button>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="g-chromVAR" stripe align="center">
              <template #default="scope">
                <el-link :href="gChromVARDownload(scope.row)">
                  <el-button size="small" type="primary"> h5ad &nbsp; <i class="fas fa-file-download"></i></el-button>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="SCAVENGE" stripe align="center">
              <template #default="scope">
                <el-link :href="scavengeDownload(scope.row)">
                  <el-button size="small" type="primary"> h5ad &nbsp; <i class="fas fa-file-download"></i></el-button>
                </el-link>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
      </SingleCard>
      <br/>
      <SingleCard :title="{ icon: 'fas fa-circle-down', content: `Download fine-mapping result data for each sample` }" ref="singleCard2">
        <BaseTable :update-new-data="listTraitInformation"
                   :download-url="overviewDownload('trait_info.xlsx')"
                   :table-description="traitDescription">
          <template #default>
            <el-table-column label="Trait" stripe align="center" width="250">
              <template #default="scope">
                <BaseTooltip :content="scope.row.trait">
                  <span>{{ scope.row.trait.length > 25 ? `${scope.row.trait.substring(0, 25)}...` : scope.row.trait }}</span>
                </BaseTooltip>
              </template>
            </el-table-column>
            <el-table-column label="Download" stripe align="center">
              <template #default="scope">
                <el-link :href="fineMappingDownload(scope.row)">
                  <el-button size="small" type="primary"> txt &nbsp; <i class="fas fa-file-download"></i></el-button>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="Download (LiftOver)" stripe align="center">
              <template #default="scope">
                <el-link :href="fineMappingHg19Download(scope.row)">
                  <el-button size="small" type="primary"> hg19 &nbsp; <i class="fas fa-file-download"></i></el-button>
                </el-link>
                &nbsp;
                <el-link :href="fineMappingHg38Download(scope.row)">
                  <el-button size="small" type="primary"> hg38 &nbsp; <i class="fas fa-file-download"></i></el-button>
                </el-link>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
      </SingleCard>
      <br/>
      <SingleCard :title="{ icon: 'fas fa-circle-down', content: `Download other data` }">
        <table class="table table-hover table-striped">
          <tbody ref="tbody">
          <tr>
            <th>Differential TFs data</th>
            <td>
              <el-link :href="differentialTfDownload()">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Differential Genes data</th>
            <td>
              <el-link :href="differentialGeneDownload()">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>MAGMA result data (Annotation) (hg19)</th>
            <td>
              <el-link :href="magmaHomerDataDownload('magma_anno_hg19_data.tar.gz')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>MAGMA result data (Annotation) (hg38)</th>
            <td>
              <el-link :href="magmaHomerDataDownload('magma_anno_hg38_data.tar.gz')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>MAGMA result data (Analysis) (hg19)</th>
            <td>
              <el-link :href="magmaHomerDataDownload('magma_hg38_data.tar.gz')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>MAGMA result data (Analysis) (hg38)</th>
            <td>
              <el-link :href="magmaHomerDataDownload('magma_hg38_data.tar.gz')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>HOMER result data (hg19)</th>
            <td>
              <el-link :href="magmaHomerDataDownload('trait_tf_hg19.txt')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>HOMER result data (hg38)</th>
            <td>
              <el-link :href="magmaHomerDataDownload('trait_tf_hg38.txt')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Gene enrichment results of traits (hg19)</th>
            <td>
              <el-link :href="geneEnrichmentTrait('hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Gene enrichment results of traits (hg38)</th>
            <td>
              <el-link :href="geneEnrichmentTrait('hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Gene enrichment for differential genes</th>
            <td>
              <el-link :href="geneEnrichmentDifferentialGenesDownload()">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Fine-mapping result data (source)</th>
            <td>
              <el-link :href="fineMappingResultDownload('trait')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Fine-mapping result data (hg19)</th>
            <td>
              <el-link :href="fineMappingResultDownload('hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Fine-mapping result data (hg38)</th>
            <td>
              <el-link :href="fineMappingResultDownload('hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Common SNP for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('dbsnp_common_snp', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Common SNP for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('dbsnp_common_snp', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Risk SNP for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('gwasatlas_v20191115_risk_snp', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Risk SNP for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('gwasatlas_v20191115_risk_snp', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>eQTL for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('gtex_v10_eqtl', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>eQTL for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('gtex_v10_eqtl', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Enhancer (SEA v3) for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('sea_v3_enhancer', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Enhancer (SEA v3) for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('sea_v3_enhancer', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Enhancer (SEdb v2) for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('sedb_v2_enhancer', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Enhancer (SEdb v2) for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('sedb_v2_enhancer', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Super enhancer (dbSUPER) for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('dbsuper_super_enhancer', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Super enhancer (dbSUPER) for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('dbsuper_super_enhancer', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Super enhancer (SEA v3) for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('sea_v3_super_enhancer', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Super enhancer (SEA v3) for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('sea_v3_super_enhancer', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          <tr>
            <th>Super enhancer (SEdb v2) for gene annotation (hg19)</th>
            <td>
              <el-link :href="annotationDownload('sedb_v2_super_enhancer', 'hg19')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
            <th>Super enhancer (SEdb v2) for gene annotation (hg38)</th>
            <td>
              <el-link :href="annotationDownload('sedb_v2_super_enhancer', 'hg38')">
                <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
              </el-link>
            </td>
          </tr>
          </tbody>
        </table>
      </SingleCard>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import BaseTable from '@/components/table/BaseTable.vue';
import '@/assets/less/views/Download.less';
import { DOWNLOAD_SAMPLE_DESCRIPTION, DOWNLOAD_TRAIT_DESCRIPTION, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import DownloadApi from '@/api/service/downloadApi';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import { Page } from '@/service/model/reponse/request';

export default defineComponent({
  name: 'Download',
  components: { BaseTooltip, SingleCard, BaseTable },
  setup() {
    const singleCard1 = ref();
    const singleCard2 = ref();
    // 设置响应数据
    const data = reactive({
      sampleTableData: [] as Array<any>,
      traitTableData: [] as Array<any>
    });

    const listSampleInformation = () => {
      singleCard1.value.startLoading();
      DownloadApi.listSampleInformation().then((res: any) => {
        singleCard1.value.endLoading();
        data.sampleTableData = res;
      });
    };

    const listTraitInformation = (page: Page) => DownloadApi.listTraitInformation(page);

    const overviewDownload = (filename: string) => `${STATIC_DOWNLOAD_PATH}/overview/${filename}`;
    const scatacDownload = (row: any) => `${STATIC_DOWNLOAD_PATH}/scatac/${row.label}_sc_atac_snapATAC2.h5ad`;
    const gChromVARDownload = (row: any) => `${STATIC_DOWNLOAD_PATH}/trs_big/${row.label}/${row.label}_trs_gchromvar.h5ad`;
    const scavengeDownload = (row: any) => `${STATIC_DOWNLOAD_PATH}/trs_big/${row.label}/${row.label}_trs_scavenge.h5ad`;
    const fineMappingDownload = (row: any) => `${STATIC_DOWNLOAD_PATH}/variant/trait/${row.traitCode}.txt`;
    const fineMappingHg19Download = (row: any) => `${STATIC_DOWNLOAD_PATH}/variant/hg19/${row.traitCode}.bed`;
    const fineMappingHg38Download = (row: any) => `${STATIC_DOWNLOAD_PATH}/variant/hg38/${row.traitCode}.bed`;
    const differentialTfDownload = () => `${STATIC_DOWNLOAD_PATH}/difference/difference_tf_data.txt`;
    const differentialGeneDownload = () => `${STATIC_DOWNLOAD_PATH}/difference/difference_gene_data.txt`;
    const geneEnrichmentDifferentialGenesDownload = () => `${STATIC_DOWNLOAD_PATH}/enrichment/gene_enrichment_table_data.tar.gz`;
    const magmaHomerDataDownload = (filename: string) => `${STATIC_DOWNLOAD_PATH}/magma_homer/${filename}`;
    const fineMappingResultDownload = (genome: string) => `${STATIC_DOWNLOAD_PATH}/trait/fine_mapping_${genome}.tar.gz`;
    const annotationDownload = (name: string, genome: string) => `${STATIC_DOWNLOAD_PATH}/gene/${genome}/${name}_${genome}.tar.gz`;
    const geneEnrichmentTrait = (genome: string) => `${STATIC_DOWNLOAD_PATH}/enrichment/gene_enrichment_trait_${genome}.tar.gz`;

    onMounted(() => {
      listSampleInformation();
    });

    return {
      ...toRefs(data),
      singleCard1,
      singleCard2,
      listSampleInformation,
      listTraitInformation,
      overviewDownload,
      scatacDownload,
      gChromVARDownload,
      scavengeDownload,
      fineMappingDownload,
      fineMappingHg19Download,
      fineMappingHg38Download,
      differentialTfDownload,
      differentialGeneDownload,
      geneEnrichmentDifferentialGenesDownload,
      magmaHomerDataDownload,
      fineMappingResultDownload,
      annotationDownload,
      geneEnrichmentTrait,
      sampleDescription: DOWNLOAD_SAMPLE_DESCRIPTION,
      traitDescription: DOWNLOAD_TRAIT_DESCRIPTION
    };
  }
});
</script>
