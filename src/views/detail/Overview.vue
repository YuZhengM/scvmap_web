<template>
  <BaseLoading id="overview" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-th-large', content: 'Sample && Variant overview' }">
      <LeftRight ref="leftRight">
        <template #left>
          <BaseTabs active="scATAC" :tabs-data="overviewTabs">
            <template #scATAC>
              <ArrayTable :table-data="scATACOverviewTableData" ref="sampleOverviewArrayTable"/>
            </template>
            <template #variant>
              <table class=" table table-hover table-striped">
                <thead></thead>
                <tbody>
                <tr v-for="(item, i) in variantOverviewTableData" :key="i">
                  <th v-text="item.key"></th>
                  <td v-html="item.value" v-if="item.key !== 'Source ID:'"></td>
                  <td v-if="item.key === 'Source ID:'">
                    <el-button link v-html="item.value" @click="sourceIdClick"></el-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </template>
          </BaseTabs>
        </template>
        <template #right>
          <BaseTabs active="info" :tabs-data="overviewQcTabs">
            <template #tss_enrichment>
              <Echarts :onresize="qcResize" ref="tssEnrichmentEcharts"/>
            </template>
            <template #log_n_frags>
              <Echarts :onresize="qcResize" ref="logNFragsEcharts"/>
            </template>
          </BaseTabs>
        </template>
      </LeftRight>
    </SingleCard>
    <BaseDrawer title="Source Information" ref="sourceIdDrawer">
      <table class=" table table-hover table-striped">
        <thead></thead>
        <tbody>
        <tr v-for="(item, i) in variantSourceTableData" :key="i">
          <th v-text="item.key"></th>
          <td v-html="item.value"></td>
        </tr>
        </tbody>
      </table>
    </BaseDrawer>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/Overview.less';
import DetailApi from '@/api/service/detailApi';
import ArrayTable from '@/components/table/ArrayTable.vue';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import { DETAIL_CELL_COUNT_DATA, DETAIL_OVERVIEW_QC_TABS, DETAIL_OVERVIEW_TABS, DETAIL_SAMPLE_QC_DESCRIPTION } from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';

export default defineComponent({
  name: 'Overview',
  components: {
    BaseDrawer,
    Echarts,
    BaseTabs,
    BaseLoading,
    LeftRight,
    ArrayTable,
    SingleCard
  },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    traitId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const cellCount = ref();
    const sampleOverviewArrayTable = ref();
    const sourceIdDrawer = ref();
    const sampleQc = ref();
    const qcEcharts = ref();
    const tssEnrichmentEcharts = ref();
    const logNFragsEcharts = ref();
    const data = reactive({
      scATACOverviewTableData: [] as Array<KeyValue>,
      variantOverviewTableData: [] as Array<KeyValue>,
      variantSourceTableData: [] as Array<KeyValue>
    });
    // 得到数据
    const getOverview = () => {
      loading.value.loading = true;
      // sample ID
      DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
        loading.value.loading = false;
        ArrayUtil.clear(data.scATACOverviewTableData);
        // Sample overview
        data.scATACOverviewTableData.push({ key: 'Sample ID:', value: res.id });
        data.scATACOverviewTableData.push({ key: 'Sample name:', value: res.sampleName });
        data.scATACOverviewTableData.push({ key: 'Sample count:', value: res.sampleCount });
        data.scATACOverviewTableData.push({ key: 'Cell type count:', value: res.cellTypeCount });
        data.scATACOverviewTableData.push({ key: 'Cell count:', value: res.cellCount });
        data.scATACOverviewTableData.push({ key: 'GEO:', value: res.geo });
        data.scATACOverviewTableData.push({ key: 'PMID:', value: res.pmid });
        data.scATACOverviewTableData.push({ key: 'GSM:', value: res.gsm });
        data.scATACOverviewTableData.push({ key: 'SRA:', value: res.sra });
        data.scATACOverviewTableData.push({ key: 'Genome:', value: res.genome });
        data.scATACOverviewTableData.push({ key: 'liftOver:', value: res.liftOver });
        data.scATACOverviewTableData.push({ key: 'haveCellType:', value: res.haveCellType });
        data.scATACOverviewTableData.push({ key: 'haveUmap:', value: res.haveUmap });
        data.scATACOverviewTableData.push({ key: 'useSingler:', value: res.useSingler });
        sampleOverviewArrayTable.value.formatTable();
      });
      // variant
      DetailApi.getSampleInfo(props.traitId).then((res: any) => {
        ArrayUtil.clear(data.variantOverviewTableData);
        // variant overview
        data.variantOverviewTableData.push({ key: 'Variant ID:', value: res.id });
        data.variantOverviewTableData.push({ key: 'Trait:', value: res.trait });
        data.variantOverviewTableData.push({ key: 'Trait description:', value: res.traitDescription });
        data.variantOverviewTableData.push({ key: 'Trait file identifier:', value: res.traitFileIdentifier });
        data.variantOverviewTableData.push({ key: 'Variant count:', value: res.variantCount });
        data.variantOverviewTableData.push({ key: 'Genome:', value: res.genome });
        data.variantOverviewTableData.push({ key: 'Filename:', value: res.filename });
        const { variantSource } = res;
        data.variantOverviewTableData.push({ key: 'Source ID:', value: variantSource.id });
        data.variantSourceTableData.push({ key: 'Source ID:', value: variantSource.id });
        data.variantSourceTableData.push({ key: 'Source name:', value: variantSource.name });
        data.variantSourceTableData.push({ key: 'Source information:', value: variantSource.source });
        data.variantSourceTableData.push({ key: 'Trait count:', value: variantSource.traitCount });
        data.variantSourceTableData.push({ key: 'Source description:', value: variantSource.description });
        data.variantSourceTableData.push({ key: 'Source variant count:', value: variantSource.variantCount });
        data.variantSourceTableData.push({ key: 'Source PMID:', value: variantSource.pmid });
        data.variantSourceTableData.push({ key: 'Source links:', value: variantSource.links });
        data.variantSourceTableData.push({ key: 'Source cite:', value: variantSource.cite });
      });
    };
    const sourceIdClick = () => {
      sourceIdDrawer.value.drawer = true;
    };
    const qcResize = () => ({
      width: 600,
      height: 600
    });
    onMounted(() => {
      cellCount.value.select = DETAIL_CELL_COUNT_DATA[0].value;
      getOverview();
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      cellCount,
      sampleOverviewArrayTable,
      sourceIdDrawer,
      sampleQc,
      qcEcharts,
      tssEnrichmentEcharts,
      logNFragsEcharts,
      qcResize,
      sourceIdClick,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      overviewTabs: DETAIL_OVERVIEW_TABS,
      overviewQcTabs: DETAIL_OVERVIEW_QC_TABS,
      sampleQcDescription: DETAIL_SAMPLE_QC_DESCRIPTION
    };
  }
});
</script>
