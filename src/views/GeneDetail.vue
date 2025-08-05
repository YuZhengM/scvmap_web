<template>
  <div id="gene_detail">
    <div class="gene_detail">
      <SingleCard :title="{ icon: 'fas fa-list', content: `Overview of gene ${gene}` }" ref="singleCard1">
        <!-- Gene overview -->
        <LeftRight ref="leftRight">
          <template #left>
            <BaseTabs active="hg38" :change="overviewChange" :tabs-data="genomeTabs">
              <template #hg19>
                <BaseBr/>
                <div v-show="isShowHg19">
                  <ArrayTable :table-data="geneTableData1" v-show="isSingle1" ref="singleGeneTable1"/>
                  <BaseTable :table-data="geneHg19Data"
                             :is-service-paging="false"
                             :before-column-number="2"
                             :pageSizes="[5, 10]"
                             :table-description="geneInfoDescription"
                             v-show="!isSingle1"
                             ref="geneTable1">
                    <template #default>
                      <el-table-column label="Region" width="200" stripe align="center">
                        <template #default="scope">
                          {{ scope.row.chr }}:{{ scope.row.start }}-{{ scope.row.end }}
                        </template>
                      </el-table-column>
                    </template>
                  </BaseTable>
                </div>
                <div v-show="!isShowHg19">
                  <p>
                    This data is empty.
                  </p>
                </div>
              </template>
              <template #hg38>
                <BaseBr/>
                <div v-show="isShowHg38">
                  <ArrayTable :table-data="geneTableData2" v-show="isSingle2" ref="singleGeneTable2"/>
                  <BaseTable :table-data="geneHg38Data"
                             :is-service-paging="false"
                             :before-column-number="2"
                             :pageSizes="[5, 10]"
                             :table-description="geneInfoDescription"
                             v-show="!isSingle2"
                             ref="geneTable2">
                    <template #default>
                      <el-table-column label="Region" width="220" stripe align="center">
                        <template #default="scope">
                          {{ scope.row.chr }}:{{ scope.row.start }}-{{ scope.row.end }}
                        </template>
                      </el-table-column>
                    </template>
                  </BaseTable>
                </div>
                <div v-show="!isShowHg38">
                  <p>
                    This data is empty.
                  </p>
                </div>
              </template>
            </BaseTabs>
          </template>
          <template #right>
            <Echarts :resize-value="graphResize" ref="echarts1"/>
          </template>
        </LeftRight>
      </SingleCard>
      <br/>
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Gene-relevant traits or diseases' }" ref="singleCard2">
        <BaseSelect title="Genome:" :select-data="genomeData" width="20%" is-line :change-event="genomeChange" ref="genome"/>
        <BaseTable :table-data="geneTraitData" :is-service-paging="false" :before-column-number="0" :table-description="geneTraitTableDescription" ref="geneTrait">
          <template #default>
            <el-table-column label="Description" stripe align="center" width="150">
              <template #default="scope">
                <el-button @click="variantInfoShow(scope.row)"> View</el-button>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
      </SingleCard>
      <br/>
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Regulation region' }" ref="singleCard3">
        <BaseTabs active="hg38" :tabs-data="genomeTabs">
          <template #hg19>
            <div v-show="isShowHg19">
              <BaseSelect title="Ensembl ID:" :select-data="geneIdHg19Data" width="20%" is-line :change-event="geneIdHg19Change" v-show="!isSingle1" ref="geneIdSelect1"/>
              <BaseBr/>
              <GeneAnnotationTable :gene-id="geneIdHg19" genome="hg19"/>
            </div>
            <div v-show="!isShowHg19">
              <p>
                This data is empty.
              </p>
            </div>
          </template>
          <template #hg38>
            <div v-show="isShowHg38">
              <BaseSelect title="Ensembl ID:" :select-data="geneIdHg38Data" width="20%" is-line :change-event="geneIdHg38Change" v-show="!isSingle2" ref="geneIdSelect2"/>
              <BaseBr/>
              <GeneAnnotationTable :gene-id="geneIdHg38" genome="hg38"/>
            </div>
            <div v-show="!isShowHg38">
              <p>
                This data is empty.
              </p>
            </div>
          </template>
        </BaseTabs>
      </SingleCard>
      <br/>
      <SingleCard :title="{ icon: 'fas fa-list', content: 'scATAC-seq data associated with the gene' }" ref="singleCard4">
        <BaseTable :table-data="sampleTableData" :is-service-paging="false" :table-description="sampleTableDescription"/>
      </SingleCard>
      <br/>
    </div>
    <BaseDrawer title="Annotation on variant information enriched in MAGAM" size="50%" ref="drawer">
      <SingleCard :title="{ content: `The ${gene} associated with ${traitId}` }">
        <ArrayTable :table-data="magmaInfoTableData" ref="magmaInfoTable"/>
      </SingleCard>
      <br/>
      <SingleCard :title="{ content: `Detailed variant mapping of the ${gene} associated with ${traitId}` }">
        <BaseTable :table-data="magmaVariantInfoTableData"
                   :is-service-paging="false"
                   :download-url="magmaGeneAnnoDownload()"
                   :table-description="magmaVariantInfoTableDescription"
                   ref="magmaVariantInfoTable"/>
      </SingleCard>
      <br/>
      <SingleCard :title="{ content: `${gene}-relevant SNP regulatory network` }">
        <Echarts :resize-value="{ width: 500, height: 500 }" ref="geneSnpGraphECharts"/>
      </SingleCard>
    </BaseDrawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/Detail.less';
import GeneTfDetailApi from '@/api/service/geneTfDetailApi';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  ANALYSIS_GENOME_DATA,
  DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION,
  DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1,
  GENE_DETAIL_GENE_INFO_TABLE_DESCRIPTION,
  GENE_DETAIL_GENE_TRAIT_TABLE_DESCRIPTION,
  GENE_DETAIL_GENOME_TABS, geneSnpGraphOption,
  geneTraitCountOption,
  STATIC_MAGMA_PATH
} from '@/assets/ts';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import GeneAnnotationTable from '@/views/geneDetail/GeneAnnotationTable.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import Time from '@/service/util/base/time';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import AnalysisApi from '@/api/service/analysisApi';
import { ElNotification } from 'element-plus';
import ArrayTable from '@/components/table/ArrayTable.vue';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import { InputSelect } from '@/service/model/components/input';
import BaseBr from '@/components/divider/BaseBr.vue';

export default defineComponent({
  name: 'GeneDetail',
  components: {
    BaseBr,
    ArrayTable,
    BaseDrawer,
    BaseSelect,
    GeneAnnotationTable,
    Echarts,
    LeftRight,
    BaseTabs,
    BaseTable,
    SingleCard
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const leftRight = ref();
    const singleCard1 = ref();
    const singleCard2 = ref();
    const singleCard3 = ref();
    const singleCard4 = ref();
    const singleGeneTable1 = ref();
    const singleGeneTable2 = ref();
    const geneTable1 = ref();
    const geneTable2 = ref();
    const echarts1 = ref();
    const genome = ref();
    const geneIdSelect1 = ref();
    const geneIdSelect2 = ref();
    const magmaInfoTable = ref();
    const magmaVariantInfoTable = ref();
    const geneSnpGraphECharts = ref();
    const drawer = ref();

    const data = reactive({
      genomeValue: 'hg19' as string,
      gene: '' as string,
      traitId: '' as string,
      traitLabel: '' as string,
      geneIdHg19: '' as string,
      geneIdHg38: '' as string,
      isShowHg19: true,
      isShowHg38: true,
      isSingle1: true,
      isSingle2: true,
      geneTableData1: [] as Array<KeyValue>,
      geneTableData2: [] as Array<KeyValue>,
      geneHg19Data: [] as Array<any>,
      geneHg38Data: [] as Array<any>,
      geneIdHg19Data: [] as Array<InputSelect>,
      geneIdHg38Data: [] as Array<InputSelect>,
      geneTraitData: [] as Array<any>,
      sampleTableData: [] as Array<any>,
      magmaInfoTableData: [] as Array<KeyValue>,
      magmaVariantInfoTableData: [] as Array<any>,
      graphResize: {
        width: 400,
        height: 350
      }
    });

    const getGeneHg19Info = () => {
      singleGeneTable1.value.startLoading();
      singleGeneTable2.value.startLoading();
      geneTable1.value.startLoading();
      ArrayUtil.clear(data.geneTableData1);
      GeneTfDetailApi.getGeneInfo(data.gene, 'hg19').then((res: any) => {
        singleGeneTable1.value.endLoading();
        singleGeneTable2.value.endLoading();
        geneTable1.value.endLoading();
        const result = (res as Array<any>);
        if (result.length === 0) {
          data.isShowHg19 = false;
        } else if (result.length === 1) {
          data.isSingle1 = true;
          data.geneTableData1.push({ key: 'Gene:', value: res[0].geneName });
          data.geneTableData1.push({ key: 'Ensembl ID:', value: res[0].geneId });
          data.geneTableData1.push({ key: 'Region:', value: `${res[0].chr}:${res[0].start}-${res[0].end}` });
          data.geneTableData1.push({ key: 'Strand:', value: res[0].strand });
          data.geneTableData1.push({ key: 'Gene type:', value: res[0].geneType });
          data.geneTableData1.push({ key: 'Source:', value: res[0].source });
          singleGeneTable1.value.formatTable();
          data.geneIdHg19 = res[0].geneId;
        } else {
          data.isSingle1 = false;
          data.geneHg19Data = result;
          result.forEach((item: any) => {
            data.geneIdHg19Data.push({
              label: item.geneId,
              value: item.geneId,
              description: `${item.chr}:${item.start}-${item.end}`
            });
          });
          data.geneIdHg19 = data.geneIdHg19Data[0].value as string;
          geneIdSelect1.value.select = data.geneIdHg19;
        }
      });
    };

    const getGeneHg38Info = () => {
      singleGeneTable2.value.startLoading();
      geneTable2.value.startLoading();
      ArrayUtil.clear(data.geneTableData1);
      GeneTfDetailApi.getGeneInfo(data.gene, 'hg38').then((res: any) => {
        singleGeneTable2.value.endLoading();
        geneTable2.value.endLoading();
        const result = (res as Array<any>);
        if (result.length === 0) {
          data.isShowHg38 = false;
        } else if (result.length === 1) {
          data.isSingle2 = true;
          data.geneTableData2.push({ key: 'Gene:', value: res[0].geneName });
          data.geneTableData2.push({ key: 'Ensembl ID:', value: res[0].geneId });
          data.geneTableData2.push({ key: 'Region:', value: `${res[0].chr}:${res[0].start}-${res[0].end}` });
          data.geneTableData2.push({ key: 'Strand:', value: res[0].strand });
          data.geneTableData2.push({ key: 'Gene type:', value: res[0].geneType });
          data.geneTableData2.push({ key: 'Source:', value: res[0].source });
          singleGeneTable2.value.formatTable();
          data.geneIdHg38 = res[0].geneId;
        } else {
          data.isSingle2 = false;
          data.geneHg38Data = result;
          result.forEach((item: any) => {
            data.geneIdHg38Data.push({
              label: item.geneId,
              value: item.geneId,
              description: `${item.chr}:${item.start}-${item.end}`
            });
          });
          data.geneIdHg38 = data.geneIdHg38Data[0].value as string;
          geneIdSelect2.value.select = data.geneIdHg38;
        }
      });
    };

    const getGenePie = () => {
      echarts1.value.startLoading();
      GeneTfDetailApi.getGeneTraitCount(data.gene).then((res: any) => {
        echarts1.value.endLoading();
        // echarts
        echarts1.value.drawEcharts(geneTraitCountOption(res));
      });
    };

    const getGeneTraitInfo = () => {
      singleCard2.value.startLoading();
      GeneTfDetailApi.listTraitByGeneGenome(data.gene, genome.value.select).then((res: any) => {
        singleCard2.value.endLoading();
        data.geneTraitData = res;
      });
    };

    const overviewChange = (tag: any) => {
      data.genomeValue = tag.paneName;
    };

    const geneIdHg19Change = () => {
      data.geneIdHg19 = geneIdSelect1.value.select;
    };

    const geneIdHg38Change = () => {
      data.geneIdHg38 = geneIdSelect2.value.select;
    };

    const genomeChange = () => {
      getGeneTraitInfo();
    };

    const variantInfoShow = (row: any) => {
      drawer.value.drawer = true;
      data.traitId = row.traitId;
      data.traitLabel = row.traitCode;
      ArrayUtil.clear(data.magmaInfoTableData);
      Time.delay(() => {
        magmaInfoTable.value.startLoading();
        magmaVariantInfoTable.value.startLoading();
        geneSnpGraphECharts.value.startLoading();
        GeneTfDetailApi.listMagmaInfoDataByTraitIdAndGene(row.traitId, data.gene, genome.value.select).then((res: any) => {
          magmaInfoTable.value.endLoading();
          data.magmaInfoTableData.push({ key: 'Trait ID:', value: res[0].traitId });
          data.magmaInfoTableData.push({ key: 'Gene:', value: res[0].gene });
          data.magmaInfoTableData.push({ key: 'Chr:', value: res[0].chr });
          data.magmaInfoTableData.push({ key: 'Start:', value: res[0].start });
          data.magmaInfoTableData.push({ key: 'End:', value: res[0].end });
          data.magmaInfoTableData.push({ key: 'SNP count:', value: res[0].nsnps });
          data.magmaInfoTableData.push({ key: 'Z score:', value: res[0].zvalue });
          data.magmaInfoTableData.push({ key: 'P value:', value: res[0].pvalue });
          magmaInfoTable.value.formatTable();
        });
        AnalysisApi.listMagmaVariantInfoDataByTraitIdAndGene(row.traitId, genome.value.select, data.gene).then((res: any) => {
          magmaVariantInfoTable.value.endLoading();
          geneSnpGraphECharts.value.endLoading();
          data.magmaVariantInfoTableData = res;
          geneSnpGraphECharts.value.drawEcharts(geneSnpGraphOption(res, data.gene));
        });
      }, 300);
    };

    const listSampleData = () => {
      singleCard4.value.startLoading();
      AnalysisApi.listSampleDataByGene(data.gene).then((res: any) => {
        singleCard4.value.endLoading();
        data.sampleTableData = res;
      });
    };
    const magmaGeneAnnoDownload = () => `${STATIC_MAGMA_PATH}/magma_output/${genome.value.select}_anno/${data.traitLabel}.genes.annot`;

    onMounted(() => {
      if (Base.isNull(route.query.gene)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      data.gene = route.query.gene as string;
      genome.value.select = 'hg19';
      getGeneHg19Info();
      getGeneHg38Info();
      getGenePie();
      getGeneTraitInfo();
      listSampleData();
    });
    return {
      ...toRefs(data),
      leftRight,
      singleCard1,
      singleCard2,
      singleCard3,
      singleCard4,
      singleGeneTable1,
      singleGeneTable2,
      geneTable1,
      geneTable2,
      echarts1,
      genome,
      geneIdSelect1,
      geneIdSelect2,
      magmaInfoTable,
      magmaVariantInfoTable,
      geneSnpGraphECharts,
      drawer,
      geneIdHg19Change,
      geneIdHg38Change,
      overviewChange,
      genomeChange,
      variantInfoShow,
      magmaGeneAnnoDownload,
      genomeData: ANALYSIS_GENOME_DATA,
      geneInfoDescription: GENE_DETAIL_GENE_INFO_TABLE_DESCRIPTION,
      sampleTableDescription: DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1,
      magmaInfoTableDescription: DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION,
      magmaVariantInfoTableDescription: DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION,
      geneTraitTableDescription: GENE_DETAIL_GENE_TRAIT_TABLE_DESCRIPTION,
      genomeTabs: GENE_DETAIL_GENOME_TABS
    };
  }
});
</script>
