<template>
  <div id="gene_enrichment">
    <LeftRight :left-width="65">
      <template #left>
        <BaseSelect title="Gene set: " :select-data="geneSetData" :change-event="geneSetEvent" is-line ref="geneSet"/>
      </template>
      <template #right>
        <el-link :href="geneEnrichmentDownload()">
          <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
    </LeftRight>
    <BaseBr/>
    <LeftRight>
      <template #left>
        <BaseSelect title="Cell type: " :select-data="clusterData" :change-event="changeEvent" is-line ref="cluster"/>
      </template>
      <template #right>
        <BaseSelect title="P value: " :select-data="pData" :change-event="pEvent" is-line ref="p"/>
      </template>
    </LeftRight>
    <br/>
    <Echarts :resize-value="{ width: width, height: 800 }" ref="echarts" v-show="isHaveData"/>
    <p v-show="!isHaveData">There is no data on the enrichment of differentially expressed genes in the cell types of this sample.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DetailApi from '@/api/service/detailApi';
import { ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA, ANALYSIS_GENE_SET_SELECT_DATA, geneEnrichmentOption, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import BaseSelect from '@/components/input/BaseSelect.vue';
import ArrayUtil from '@/service/util/base/array';
import { InputSelect } from '@/service/model/components/input';
import Echarts from '@/components/echarts/Echarts.vue';
import Base from '@/service/util/base/base';
import Time from '@/service/util/base/time';
import LeftRight from '@/components/layout/LeftRight.vue';
import AnalysisApi from '@/api/service/analysisApi';
import BaseBr from '@/components/divider/BaseBr.vue';
import NumberUtil from '@/service/util/base/number';

export default defineComponent({
  name: 'GeneEnrichment',
  components: { BaseBr, LeftRight, Echarts, BaseSelect },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    width: {
      type: Number,
      default: () => 500
    }
  },
  setup(props) {
    const geneSet = ref();
    const cluster = ref();
    const echarts = ref();
    const p = ref();
    const data = reactive({
      id: NumberUtil.random10(),
      clusterData: [] as Array<InputSelect>,
      isHaveData: true
    });
    const listClusterValue = () => {
      if (Base.noNull(props.sampleId)) {
        return DetailApi.listSampleCellTypeTimeSexDrug(props.sampleId, data.id).then((res: any) => {
          ArrayUtil.clear(data.clusterData);
          if (Base.noNull(res)) {
            (res as Array<string>).forEach((item: any) => {
              data.clusterData.push({ label: item.field, value: item.field });
            });
            cluster.value.select = data.clusterData[0].value;
          }
        });
      }
    };
    const geneEnrichmentEcharts = () => {
      echarts.value.startLoading();
      AnalysisApi.listGeneEnrichmentData({
        sampleId: props.sampleId,
        geneSet: geneSet.value.select,
        cellType: cluster.value.select,
        value: p.value.select
      }).then((res: any) => {
        if (Base.isNull(res.geneEnrichmentList) || res.geneEnrichmentList.length === 0) {
          data.isHaveData = false;
          echarts.value.endLoading();
          return;
        }
        data.isHaveData = true;
        Time.awaitData(() => {
          const dataValue: Array<any> = [];
          const countArray: any = [];
          const pValueArray: any = [];
          (res.geneEnrichmentList as Array<any>).forEach((item: any) => {
            const pValue = Number(item.pvalue) === 0 ? 0 : -Math.log(Number(item.pvalue));
            countArray.push(item.oddsRatio);
            pValueArray.push(pValue);
            dataValue.push([Number(item.combinedScore), item.term, pValue, item.oddsRatio]);
          });
          const dataInfo: any = {
            data: dataValue,
            countMin: Math.min.apply(null, countArray),
            countMax: Math.max.apply(null, countArray),
            pValueMin: Math.min.apply(null, pValueArray),
            pValueMax: Math.max.apply(null, pValueArray)
          };
          echarts.value.endLoading();
          echarts.value.drawEcharts(geneEnrichmentOption(dataInfo));
        }, data.isHaveData);
      });
    };
    const changeEvent = () => {
      geneEnrichmentEcharts();
    };
    const geneSetEvent = () => {
      geneEnrichmentEcharts();
    };
    const pEvent = changeEvent;
    const execRequest = () => {
      const info = listClusterValue();
      if (info) {
        info.then(() => {
          geneEnrichmentEcharts();
        });
      }
    };
    const geneEnrichmentDownload = () => `${STATIC_DOWNLOAD_PATH}/enrichment/scatac/gene_enrichment/${props.sampleId}_gene_enrichment_data.txt`;

    onMounted(() => {
      geneSet.value.select = ANALYSIS_GENE_SET_SELECT_DATA[0].value;
      p.value.select = ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA[1].value;
      execRequest();
    });
    // 监控
    watch(() => props.sampleId, () => {
      if (Base.noNull(props.sampleId)) {
        execRequest();
      }
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      geneSet,
      cluster,
      p,
      echarts,
      changeEvent,
      geneEnrichmentDownload,
      pEvent,
      execRequest,
      geneSetEvent,
      geneSetData: ANALYSIS_GENE_SET_SELECT_DATA,
      pData: ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA
    };
  }
});
</script>
