<template>
  <BaseLoading id="sample_cluster_annotation" ref="loading">
    <SingleCard :title="{ content: 'Trait-relevant cell score' }" id="position_cell" ref="singleCard">
      <template #head>
        <el-link :href="trsDownload()">
          <el-button size="small" type="primary"> Download TRS &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
        <span class="kl_score" v-show="Number(traitId.split('_')[2]) <= 79"> TRS KL score: {{ klScore }} </span>
      </template>
      <template #default>
        <BaseTabs active="finemap" :tabs-data="[{ name: 'finemap', title: 'FINEMAP' }, { name: 'susie', title: 'SuSiE' }]"
                  :change="fineMappingMethodChange" v-show="isHaveSusie"/>
        <BaseBr/>
        <el-row :gutter="24">
          <el-col :span="3"></el-col>
          <el-col :span="8" class="method_select">
            <BaseSelect class="metadata_style" title="Metadata: " :select-data="metadataData" width="65%" :change-event="metadataEvent" is-line ref="metadata" v-show="metadataData.length > 1"/>
            <div v-show="metadataData.length === 1" class="metadata">Metadata: Cell type</div>
          </el-col>
          <el-col :span="8" class="method_select">
            <BaseSelect title="Method: " :select-data="methodData" width="65%" :change-event="methodEvent" is-line ref="method"/>
          </el-col>
          <el-col :span="3"></el-col>
        </el-row>
        <el-divider></el-divider>
        <LeftRight :left-width="60">
          <template #left>
            <BaseTable :table-data="traitTableData"
                       :is-service-paging="false"
                       :table-description="tableDescription"
                       :page-sizes="[10, 15, 25, 30, 40, 50, 100]"
                       is-simple
                       :page-event="traitPageEvent"
                       is-selection
                       :selection-change="traitSelectionChange"
                       :is-select-change="traitIsSelectChange"
                       ref="traitTable"/>
          </template>
          <template #right>
            <Echarts :resize-value="{ width: 400, height: 400 }" :expand-option="enrichExpandOption" ref="echarts"/>
            <p>Enriched trait: This sample <strong>({{ sampleId }})</strong> has a value greater than 0 for these traits.</p>
            <p>No enriched trait: This sample <strong>({{ sampleId }})</strong> has zero TRS values for all of these traits.</p>
          </template>
        </LeftRight>
        <el-divider></el-divider>
        <el-row :gutter="24">
          <el-col :span="1"></el-col>
          <el-col :span="6">
            <BaseSelect title="Cell count: " :select-data="cellCountData" :change-event="cellCountEvent" width="50%" is-line ref="cellCount"/>
          </el-col>
          <el-col :span="12">
            <div class="title_alone">Trait: {{ traitName }}</div>
          </el-col>
          <el-col :span="5">
            <el-button class="title_trait"><a :href="traitIdUrl" target="_blank"> Trait ID: {{ traitId }} </a></el-button>
          </el-col>
        </el-row>
        <ClusterAnnotation :sample-id="sampleId"
                           :trait-id="traitId"
                           :cell-count="cellCountValue"
                           :method="methodValue"
                           :metadata="metadataValue"
                           :fine-mapping-method="fineMappingMethodValue"
                           ref="clusterAnno"/>
      </template>
    </SingleCard>
    <BaseBr/>
    <GeneInfoAnnotation :sample-id="sampleId" :trait-id="traitId" :metadata="metadataValue" ref="geneInfoAnno" v-show="fineMappingMethodValue === 'finemap'"/>
    <BaseBr/>
    <TfInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="tfInfoAnno" v-show="metadataValue === 'cell_type' && fineMappingMethodValue === 'finemap'"/>
    <BaseBr/>
    <ComprehensiveNetworkAnnotation :sample-id="sampleId" :trait-id="traitId" v-show="metadataValue === 'cell_type' && fineMappingMethodValue === 'finemap'"/>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import DetailApi from '@/api/service/detailApi';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import {
  enrichedTraitCountCountOption,
  DETAIL_CELL_COUNT_DATA,
  DETAIL_METHOD_DATA,
  linkTraitDetail,
  STATIC_DOWNLOAD_PATH,
  getCellCountValue,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
} from '@/assets/ts';
import { InputSelect } from '@/service/model/components/input';
import BaseSelect from '@/components/input/BaseSelect.vue';
import StringUtil from '@/service/util/base/string';
import Echarts from '@/components/echarts/Echarts.vue';
import Time from '@/service/util/base/time';
import ClusterAnnotation from '@/views/detail/common/ClusterAnnotation.vue';
import GeneInfoAnnotation from '@/views/detail/common/GeneInfoAnnotation.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import TfInfoAnnotation from '@/views/detail/common/TfInfoAnnotation.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import Base from '@/service/util/base/base';
import LeftRight from '@/components/layout/LeftRight.vue';
import ComprehensiveNetworkAnnotation from '@/views/detail/common/ComprehensiveNetworkAnnotation.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';

export default defineComponent({
  name: 'SampleClusterAnnotation',
  components: {
    BaseTabs,
    ComprehensiveNetworkAnnotation,
    LeftRight,
    BaseTable,
    TfInfoAnnotation,
    BaseBr,
    GeneInfoAnnotation,
    ClusterAnnotation,
    Echarts,
    BaseSelect,
    BaseLoading,
    SingleCard
  },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const loading = ref();
    const singleCard = ref();
    const cellCount = ref();
    const metadata = ref();
    const method = ref();
    const echarts = ref();
    const clusterAnno = ref();
    const geneInfoAnno = ref();
    const tfInfoAnno = ref();
    const boxPlot = ref();
    const traitTable = ref();
    const clusterLoading = ref();
    const methodLoading = ref();
    const data = reactive({
      clusterId: StringUtil.randomString(10),
      traitClusterId: StringUtil.randomString(10),
      boxData: {} as any,
      enrichExpandOption: {} as any,
      metadataData: [{
        label: 'Cell type',
        value: 'cell_type',
        default: true
      }] as Array<InputSelect>,
      countPieData: [] as Array<InputSelect>,
      traitIsSelectChange: true as boolean,
      traitTableData: [] as Array<any>,
      traitId: '',
      traitName: '',
      traitLabel: '',
      klScore: '-1',
      metadataValue: 'cell_type',
      fineMappingMethodValue: 'finemap',
      sampleLabel: '',
      genome: '',
      sampleCellCount: 1,
      methodValue: '',
      cellCountValue: 0,
      isHaveSusie: true,
      traitIdUrl: linkTraitDetail('')
    });

    const getOverview = async () => DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
      data.sampleLabel = res.label;
      data.genome = res.genome;
      data.sampleCellCount = res.cellCount;

      if (res.timeExist === 1) {
        data.metadataData.push({ label: 'Age/day/time', value: 'time' });
      }
      if (res.sexExist === 1) {
        data.metadataData.push({ label: 'Sex', value: 'sex' });
      }
      if (res.drugExist === 1) {
        data.metadataData.push({ label: 'Drug resistance', value: 'drug' });
      }
    });

    const listTrait = async () => {
      clusterAnno.value.startLoading();
      geneInfoAnno.value.startLoading();
      tfInfoAnno.value.startLoading();
      echarts.value.startLoading();
      traitTable.value.startLoading();
      return DetailApi.listTraitBySampleId(props.sampleId, method.value.select, data.fineMappingMethodValue).then((res: any) => {
        clusterAnno.value.endLoading();
        geneInfoAnno.value.endLoading();
        tfInfoAnno.value.endLoading();
        echarts.value.endLoading();
        traitTable.value.endLoading();
        const { traitSampleList, echartsPieData } = res;
        data.countPieData = echartsPieData;
        data.traitTableData = traitSampleList;
        data.enrichExpandOption = enrichedTraitCountCountOption(data.countPieData);
        echarts.value.drawEcharts(enrichedTraitCountCountOption(data.countPieData, false));
      });
    };

    const cellCountEvent = () => {
      data.cellCountValue = cellCount.value.select;
    };

    const methodEvent = async () => {
      data.methodValue = method.value.select;
      await listTrait();
      traitTable.value.selectionToggleChange([data.traitTableData[0]]);
    };

    const metadataEvent = async () => {
      data.metadataValue = metadata.value.select;
    };

    const trsDownload = () => `${STATIC_DOWNLOAD_PATH}/trs/${data.sampleLabel}/${data.sampleLabel}__${data.genome}__${data.traitLabel}.bed__mat_info.rda`;

    const traitPageEvent = () => {
      const traitShowData = traitTable.value.showData.filter((item: any) => item.traitId === data.traitId);
      if (Base.noNull(traitShowData)) {
        Time.delay(() => {
          traitTable.value.selectionToggleChange(traitShowData);
        }, 300);
      }
    };

    const traitKlScoreInfo = () => {
      DetailApi.getKlScoreData(props.sampleId, data.traitId).then((res: any) => {
        data.klScore = (res as number).toFixed(5);
      });
    };

    const fineMappingMethodChange = async (tag: any) => {
      data.fineMappingMethodValue = tag.paneName;
      await listTrait();
      const traitIdList: Array<String> = data.traitTableData.map((item: any) => item.traitId);

      if (Number(data.traitId.split('_')[2]) > 79 || traitIdList.indexOf(data.traitId) < 0) {
        traitTable.value.selectionToggleChange([data.traitTableData[0]]);
      } else {
        traitPageEvent();
      }
    };

    const traitSelectionChange = (val: any) => {
      if (val.length > 1) {
        data.traitIsSelectChange = false;
        traitTable.value.selectionToggleChange(val.slice(0, val.length - 1));
        data.traitIsSelectChange = true;
      } else if (val.length === 1) {
        cellCount.value.select = getCellCountValue(data.sampleCellCount);
        data.cellCountValue = cellCount.value.select;
        data.traitId = val[0].traitId;
        data.isHaveSusie = Number(data.traitId.split('_')[2]) <= 79;
        data.traitName = val[0].trait;
        data.traitLabel = val[0].traitCode as string;
        data.traitIdUrl = linkTraitDetail(data.traitId);
      }

      if (Number(data.traitId.split('_')[2]) <= 79) {
        traitKlScoreInfo();
      }
    };

    onMounted(async () => {
      method.value.select = DETAIL_METHOD_DATA[0].value;
      data.methodValue = method.value.select;
      data.metadataValue = data.metadataData[0].value as string;
      await getOverview();
      cellCount.value.select = getCellCountValue(data.sampleCellCount);
      data.cellCountValue = cellCount.value.select;
      await listTrait();
      traitTable.value.selectionToggleChange([data.traitTableData[0]]);
    });
    return {
      ...toRefs(data),
      loading,
      singleCard,
      cellCount,
      metadata,
      method,
      echarts,
      clusterAnno,
      geneInfoAnno,
      tfInfoAnno,
      boxPlot,
      traitTable,
      clusterLoading,
      methodLoading,
      traitPageEvent,
      traitSelectionChange,
      cellCountEvent,
      metadataEvent,
      fineMappingMethodChange,
      methodEvent,
      trsDownload,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      methodData: DETAIL_METHOD_DATA,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
