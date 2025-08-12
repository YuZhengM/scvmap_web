<template>
  <div id="tf_detail">
    <SingleCard :title="{ icon: 'fas fa-list', content: `Overview of TF ${tf}` }" ref="singleCard1">
      <ArrayTable :table-data="tfTableData" v-show="isShow && !isShowEcharts" ref="tfTable"/>
      <div v-show="!isShow && isShowEcharts">
        <Echarts :resize-value="graphResize" ref="echarts1"/>
      </div>
      <LeftRight class="overview" v-show="isShow && isShowEcharts">
        <template #left>
          <ArrayTable :table-data="tfTableData" v-show="isShow" ref="tfTable"/>
        </template>
        <template #right>
          <Echarts :resize-value="graphResize" ref="echarts2"/>
        </template>
      </LeftRight>
    </SingleCard>
    <br/>
    <SingleCard :title="{ icon: 'fas fa-list', content: 'TF-relevant traits or diseases' }" ref="singleCard2">
      <BaseSelect title="Genome:" :select-data="genomeData" width="20%" is-line :change-event="genomeChange" ref="genome"/>
      <BaseTable :table-data="tfTraitData" :is-service-paging="false" :before-column-number="0" :table-description="tfTraitTableDescription" ref="tfTrait">
        <template #default>
          <el-table-column label="Detail" width="100" stripe align="center">
            <template #default="scope">
              <el-link :href="linkHomerDetail(scope.row)" target="_blank">
                <el-button size="small" type="primary"><i class="fas fa-link"></i></el-button>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="View" width="100" stripe align="center">
            <template #default="scope">
              <el-button @click="variantInfoShow(scope.row)"> View</el-button>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </SingleCard>
    <br/>
    <SingleCard :title="{ icon: 'fas fa-list', content: 'scATAC-seq data associated with the TF' }" ref="singleCard3">
      <BaseTable :table-data="sampleTableData" :is-service-paging="false" :table-description="sampleTableDescription"/>
    </SingleCard>
    <br/>
    <BaseDrawer title="TF enriched information obtained by HOMER" size="50%" ref="drawer">
      <ArrayTable :table-data="homerInfoTableData" ref="homerInfoTable"/>
    </BaseDrawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import '@/assets/less/views/Detail.less';
import { KeyValue } from '@/service/model/data';
import GeneTfDetailApi from '@/api/service/geneTfDetailApi';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  ANALYSIS_GENOME_DATA,
  DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1,
  GENE_DETAIL_GENE_TRAIT_TABLE_DESCRIPTION,
  GENE_DETAIL_GENOME_TABS,
  STATIC_HOMER_PATH,
  geneTraitCountOption
} from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import AnalysisApi from '@/api/service/analysisApi';
import LeftRight from '@/components/layout/LeftRight.vue';
import ArrayTable from '@/components/table/ArrayTable.vue';
import ArrayUtil from '@/service/util/base/array';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import Time from '@/service/util/base/time';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'TfDetail',
  components: {
    BaseDrawer,
    ArrayTable,
    LeftRight,
    BaseSelect,
    Echarts,
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
    const tfTable = ref();
    const drawer = ref();
    const homerInfoTable = ref();
    const echarts1 = ref();
    const echarts2 = ref();
    const genome = ref();

    const data = reactive({
      genomeValue: 'hg19' as string,
      tf: '' as string,
      traitId: '' as string,
      isShow: true,
      isShowEcharts: true,
      tfTableData: [] as Array<KeyValue>,
      tfTraitData: [] as Array<any>,
      sampleTableData: [] as Array<any>,
      homerInfoTableData: [] as Array<KeyValue>,
      magmaVariantInfoTableData: [] as Array<any>,
      graphResize: {
        width: 400,
        height: 350
      }
    });

    const getTfInfo = () => {
      tfTable.value.startLoading();
      ArrayUtil.clear(data.tfTraitData);
      GeneTfDetailApi.getTfInfo(data.tf).then((res: any) => {
        tfTable.value.endLoading();
        if (Base.isNull(res)) {
          data.isShow = false;
        } else {
          data.isShow = true;
          data.tfTableData.push({ key: 'Symbol:', value: res.tfName });
          data.tfTableData.push({ key: 'Ensembl ID:', value: res.tfId });
          data.tfTableData.push({ key: 'Family:', value: res.family });
          if (res.protein !== null && res.protein !== '') {
            data.tfTableData.push({ key: 'Protein:', value: String(res.protein).replaceAll(';', '; ') });
          }
          data.tfTableData.push({ key: 'Entrez ID:', value: res.entrezId });
          tfTable.value.formatTable();
        }
      });
    };

    const getTfPie = () => {
      echarts1.value.startLoading();
      echarts2.value.startLoading();
      GeneTfDetailApi.getTfTraitCount(data.tf).then((res: any) => {
        echarts1.value.endLoading();
        echarts2.value.endLoading();
        if (res.data.length === 0) {
          data.isShowEcharts = false;
        } else {
          data.isShowEcharts = true;
          echarts1.value.drawEcharts(geneTraitCountOption(res));
          echarts2.value.drawEcharts(geneTraitCountOption(res));
        }
      });
    };

    const getTfTraitInfo = () => {
      singleCard2.value.startLoading();
      GeneTfDetailApi.listTraitByTfGenome(data.tf, genome.value.select).then((res: any) => {
        singleCard2.value.endLoading();
        data.tfTraitData = res;
      });
    };

    const overviewChange = (tag: any) => {
      data.genomeValue = tag.paneName;
    };

    const genomeChange = () => {
      getTfTraitInfo();
    };

    const listSampleData = () => {
      singleCard3.value.startLoading();
      AnalysisApi.listSampleDataByTf(data.tf).then((res: any) => {
        singleCard3.value.endLoading();
        data.sampleTableData = res;
      });
    };

    const variantInfoShow = (row: any) => {
      drawer.value.drawer = true;
      data.traitId = row.traitId;
      ArrayUtil.clear(data.homerInfoTableData);
      Time.delay(() => {
        homerInfoTable.value.startLoading();
        GeneTfDetailApi.listHomerInfoDataByTraitIdAndTf(row.traitId, data.tf, genome.value.select).then((res: any) => {
          homerInfoTable.value.endLoading();
          data.homerInfoTableData.push({ key: 'Trait ID:', value: res[0].traitId });
          data.homerInfoTableData.push({ key: 'TF:', value: res[0].tf });
          data.homerInfoTableData.push({ key: 'Motif name:', value: res[0].motifName });
          data.homerInfoTableData.push({ key: 'Consensus:', value: res[0].consensus });
          data.homerInfoTableData.push({ key: 'P value:', value: res[0].pvalue });
          data.homerInfoTableData.push({ key: 'Q value:', value: res[0].qvalue });
          homerInfoTable.value.formatTable();
        });
      }, 300);
    };

    const linkHomerDetail = (row: any) => `${STATIC_HOMER_PATH}/${genome.value.select}/${row.traitCode}/knownResults.html`;

    onMounted(() => {
      if (Base.isNull(route.query.tf)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      const sourceTf = route.query.tf as string;
      // This operation can be ignored
      data.tf = sourceTf.replaceAll('?', '-----');
      data.tf = data.tf.replaceAll('/', '_____');
      genome.value.select = 'hg19';
      getTfInfo();
      getTfPie();
      getTfTraitInfo();
      listSampleData();
    });
    return {
      ...toRefs(data),
      leftRight,
      singleCard1,
      singleCard2,
      singleCard3,
      tfTable,
      drawer,
      homerInfoTable,
      echarts1,
      echarts2,
      genome,
      overviewChange,
      genomeChange,
      linkHomerDetail,
      variantInfoShow,
      genomeData: ANALYSIS_GENOME_DATA,
      sampleTableDescription: DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1,
      tfTraitTableDescription: GENE_DETAIL_GENE_TRAIT_TABLE_DESCRIPTION,
      genomeTabs: GENE_DETAIL_GENOME_TABS
    };
  }
});
</script>
