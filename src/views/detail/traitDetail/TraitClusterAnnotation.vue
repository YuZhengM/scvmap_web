<template>
  <BaseLoading id="trait_cluster_annotation" ref="loading">
    <div v-show="isOverlap">
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
          <LeftRight>
            <template #left>
              <BaseTable :table-data="sampleTableData"
                         :is-service-paging="false"
                         :table-description="tableDescription"
                         :page-sizes="[10, 15, 25, 30, 40, 50, 100]"
                         is-simple
                         :page-event="samplePageEvent"
                         is-selection
                         :selection-change="sampleSelectionChange"
                         :is-select-change="sampleIsSelectChange"
                         ref="sampleTable"/>
            </template>
            <template #right>
              <Echarts :resize-value="{ width: 400, height: 400 }" :expand-option="enrichExpandOption" ref="echarts"/>
              <p>Enriched sample: This trait <strong>({{ traitId }})</strong> has a value greater than 0 for these samples.</p>
              <p>No enriched sample: This trait <strong>({{ traitId }})</strong> has zero TRS values for all of these samples.</p>
            </template>
          </LeftRight>
          <el-divider></el-divider>
          <el-row :gutter="24">
            <el-col :span="1"></el-col>
            <el-col :span="6">
              <BaseSelect title="Cell count: " :select-data="cellCountData" :change-event="cellCountEvent" width="50%" is-line ref="cellCount"/>
            </el-col>
            <el-col :span="12">
              <div class="title_alone">Tissue type: {{ tissueType }}</div>
            </el-col>
            <el-col :span="5">
              <el-button class="title_trait"><a :href="sampleIdUrl" target="_blank"> Sample ID: {{ sampleId }} </a></el-button>
            </el-col>
          </el-row>
          <ClusterAnnotation :sample-id="sampleId" :trait-id="traitId" :cell-count="cellCountValue" :metadata="metadataValue" :method="methodValue" :fine-mapping-method="fineMappingMethodValue"/>
        </template>
      </SingleCard>
      <BaseBr/>
      <GeneInfoAnnotation :sample-id="sampleId" :trait-id="traitId" :metadata="metadataValue" ref="geneInfoAnno" v-show="fineMappingMethodValue === 'finemap'"/>
      <BaseBr/>
      <TfInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="tfInfoAnno" v-show="metadataValue === 'cell_type' && fineMappingMethodValue === 'finemap'"/>
      <BaseBr/>
      <ComprehensiveNetworkAnnotation :sample-id="sampleId" :trait-id="traitId" v-show="metadataValue === 'cell_type' && fineMappingMethodValue === 'finemap'"/>
    </div>
    <div class="title_alone" v-show="!isOverlap">
      <div>
        The number of variants in this trait is too small and has not been enriched in any single-cell data.
      </div>
    </div>
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
  linkSampleDetail,
  getCellCountValue,
  DATA_DETAIL_SAMPLE_TABLE_DESCRIPTION,
  STATIC_DOWNLOAD_PATH
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
import { ElNotification } from 'element-plus';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import Base from '@/service/util/base/base';
import ComprehensiveNetworkAnnotation from '@/views/detail/common/ComprehensiveNetworkAnnotation.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';

export default defineComponent({
  name: 'TraitClusterAnnotation',
  components: {
    BaseTabs,
    ComprehensiveNetworkAnnotation,
    BaseTable,
    LeftRight,
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
    traitId: {
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
    const sample = ref();
    const echarts = ref();
    const geneInfoAnno = ref();
    const tfInfoAnno = ref();
    const sampleTable = ref();
    const clusterLoading = ref();
    const methodLoading = ref();
    const data = reactive({
      clusterId: StringUtil.randomString(10),
      traitClusterId: StringUtil.randomString(10),
      isOverlap: true,
      isHaveSusie: true,
      countPieData: [] as Array<InputSelect>,
      metadataData: [{
        label: 'Cell type',
        value: 'cell_type',
        default: true
      }] as Array<InputSelect>,
      sampleIsSelectChange: true as boolean,
      sampleTableData: [] as Array<any>,
      boxData: {} as any,
      enrichExpandOption: {} as any,
      sampleId: '',
      sampleLabel: '',
      genome: '',
      tissueType: '',
      methodValue: '',
      metadataValue: 'cell_type',
      traitLabel: '',
      klScore: '-1',
      fineMappingMethodValue: 'finemap',
      cellCountValue: 0 as number,
      sampleCellCount: 1,
      sampleIdUrl: linkSampleDetail('')
    });

    const listSample = async () => {
      // 清空
      geneInfoAnno.value.startLoading();
      tfInfoAnno.value.startLoading();
      echarts.value.startLoading();
      sampleTable.value.startLoading();
      return DetailApi.listSampleInfoByTraitId(props.traitId, method.value.select, data.fineMappingMethodValue).then((res: any) => {
        geneInfoAnno.value.endLoading();
        tfInfoAnno.value.endLoading();
        echarts.value.endLoading();
        sampleTable.value.endLoading();
        const { traitSampleList, echartsPieData } = res;
        if (echartsPieData.data[0].value === 0) {
          data.isOverlap = false;
          ElNotification({
            title: 'Information:',
            message: 'The number of variants in this trait is too small and has not been enriched in any single-cell data.',
            type: 'success'
          });
          return;
        }
        data.countPieData = echartsPieData;
        data.sampleTableData = traitSampleList;
        data.enrichExpandOption = enrichedTraitCountCountOption(data.countPieData);
        echarts.value.drawEcharts(enrichedTraitCountCountOption(data.countPieData, false));
      });
    };

    const cellCountEvent = () => {
      data.cellCountValue = cellCount.value.select;
    };

    const getSampleInfo = async () => DetailApi.getSampleInfo(data.sampleId).then((res: any) => {
      data.sampleCellCount = res.cellCount;
      data.sampleLabel = res.label;
      data.genome = res.genome;

      data.metadataData = [{
        label: 'Cell type',
        value: 'cell_type',
        default: true
      }] as Array<InputSelect>;

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

    const getTraitInfo = () => DetailApi.getVariantTrait(props.traitId, data.fineMappingMethodValue).then((res: any) => {
      data.traitLabel = res.traitCode;
    });

    const samplePageEvent = () => {
      const sampleShowData = sampleTable.value.showData.filter((item: any) => item.sampleId === data.sampleId);
      if (Base.noNull(sampleShowData)) {
        Time.delay(() => {
          sampleTable.value.selectionToggleChange(sampleShowData);
        }, 300);
      }
    };

    const traitKlScoreInfo = () => {
      DetailApi.getKlScoreData(data.sampleId, props.traitId).then((res: any) => {
        data.klScore = (res as number).toFixed(5);
      });
    };

    const setSampleId = async () => {
      await listSample();
      if (data.isOverlap) {
        Time.delay(async () => {
          const sampleIdList: Array<String> = data.sampleTableData.map((item: any) => item.sampleId);

          if (Number(props.traitId.split('_')[2]) > 79 || sampleIdList.indexOf(data.sampleId) < 0) {
            sampleTable.value.selectionToggleChange([data.sampleTableData[0]]);
          } else {
            samplePageEvent();
          }

          await getSampleInfo();
          cellCount.value.select = getCellCountValue(data.sampleCellCount);
          data.cellCountValue = cellCount.value.select;
        }, 300);
      }
    };

    const fineMappingMethodChange = (tag: any) => {
      data.fineMappingMethodValue = tag.paneName;
      setSampleId();
    };

    const metadataEvent = async () => {
      data.metadataValue = metadata.value.select;
    };

    const methodEvent = () => {
      data.methodValue = method.value.select;
      setSampleId();
    };

    const sampleSelectionChange = async (val: any) => {
      if (val.length > 1) {
        data.sampleIsSelectChange = false;
        sampleTable.value.selectionToggleChange(val.slice(0, val.length - 1));
        data.sampleIsSelectChange = true;
      } else if (val.length === 1) {
        data.cellCountValue = 0;
        data.sampleId = val[0].sampleId;
        await getSampleInfo();
        cellCount.value.select = getCellCountValue(data.sampleCellCount);
        data.cellCountValue = cellCount.value.select;
        data.tissueType = val[0].tissueType;
        data.sampleIdUrl = linkSampleDetail(data.sampleId);
      }

      if (Number(props.traitId.split('_')[2]) <= 79) {
        traitKlScoreInfo();
      }
    };

    const trsDownload = () => {
      const suffix = data.fineMappingMethodValue === 'finemap' ? '' : '_susie';
      return `${STATIC_DOWNLOAD_PATH}/trs${suffix}/${data.sampleLabel}/${data.sampleLabel}__${data.genome}__${data.traitLabel}.bed__mat_info.rda`;
    };

    onMounted(() => {
      method.value.select = DETAIL_METHOD_DATA[0].value;
      data.methodValue = method.value.select;
      data.metadataValue = data.metadataData[0].value as string;
      data.isHaveSusie = Number(props.traitId.split('_')[2]) <= 79;
      getTraitInfo();
      setSampleId();
    });
    return {
      ...toRefs(data),
      loading,
      singleCard,
      cellCount,
      metadata,
      method,
      sample,
      sampleTable,
      echarts,
      clusterLoading,
      methodLoading,
      geneInfoAnno,
      tfInfoAnno,
      cellCountEvent,
      metadataEvent,
      methodEvent,
      samplePageEvent,
      fineMappingMethodChange,
      sampleSelectionChange,
      trsDownload,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      methodData: DETAIL_METHOD_DATA,
      tableDescription: DATA_DETAIL_SAMPLE_TABLE_DESCRIPTION
    };
  }
});
</script>
