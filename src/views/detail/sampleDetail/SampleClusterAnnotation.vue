<template>
  <BaseLoading id="sample_cluster_annotation" ref="loading">
    <SingleCard :title="{ content: 'Trait- or disease-relevant cell score' }" id="position_cell" ref="singleCard">
      <template #head>
        <el-link :href="trsDownload()">
          <el-button size="small" type="primary"> Download TRS &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <el-row :gutter="24">
          <el-col :span="6"></el-col>
          <el-col :span="12" class="method_select">
            <BaseSelect title="Method: " :select-data="methodData" width="65%" :change-event="methodEvent" is-line ref="method"/>
          </el-col>
          <el-col :span="6"></el-col>
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
        <ClusterAnnotation :sample-id="sampleId" :trait-id="traitId" :cell-count="cellCountValue" :method="methodValue" ref="clusterAnno"/>
      </template>
    </SingleCard>
    <BaseBr/>
    <GeneInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="geneInfoAnno"/>
    <BaseBr/>
    <TfInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="tfInfoAnno"/>
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
  ANALYSIS_META_DATA_DATA,
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

export default defineComponent({
  name: 'SampleClusterAnnotation',
  components: {
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
      countPieData: [] as Array<InputSelect>,
      traitIsSelectChange: true as boolean,
      traitTableData: [] as Array<any>,
      traitId: '',
      traitName: '',
      traitLabel: '',
      sampleLabel: '',
      genome: '',
      sampleCellCount: 1,
      methodValue: '',
      cellCountValue: 0,
      traitIdUrl: linkTraitDetail('')
    });

    const getOverview = () => DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
      data.sampleLabel = res.label;
      data.genome = res.genome;
      data.sampleCellCount = res.cellCount;
    });

    const listTrait = () => {
      // 清空
      clusterAnno.value.startLoading();
      geneInfoAnno.value.startLoading();
      tfInfoAnno.value.startLoading();
      echarts.value.startLoading();
      traitTable.value.startLoading();
      return DetailApi.listTraitBySampleId(props.sampleId, method.value.select).then((res: any) => {
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

    const methodEvent = () => {
      data.methodValue = method.value.select;
      listTrait().then(() => {
        traitTable.value.selectionToggleChange([data.traitTableData[0]]);
      });
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

    const traitSelectionChange = (val: any) => {
      if (val.length > 1) {
        data.traitIsSelectChange = false;
        traitTable.value.selectionToggleChange(val.slice(0, val.length - 1));
        data.traitIsSelectChange = true;
      } else if (val.length === 1) {
        cellCount.value.select = getCellCountValue(data.sampleCellCount);
        data.cellCountValue = cellCount.value.select;
        data.traitId = val[0].traitId;
        data.traitName = val[0].trait;
        data.traitLabel = val[0].traitCode as string;
        data.traitIdUrl = linkTraitDetail(data.traitId);
      }
    };

    onMounted(() => {
      method.value.select = DETAIL_METHOD_DATA[0].value;
      data.methodValue = method.value.select;
      getOverview().then(() => {
        cellCount.value.select = getCellCountValue(data.sampleCellCount);
        data.cellCountValue = cellCount.value.select;
        listTrait().then(() => {
          traitTable.value.selectionToggleChange([data.traitTableData[0]]);
        });
      });
    });
    return {
      ...toRefs(data),
      loading,
      singleCard,
      cellCount,
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
      methodEvent,
      trsDownload,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      metaDataData: ANALYSIS_META_DATA_DATA,
      methodData: DETAIL_METHOD_DATA,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
