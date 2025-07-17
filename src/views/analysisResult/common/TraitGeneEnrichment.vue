<template>
  <div id="trait_gene_enrichment">
    <LeftRight :left-width="65">
      <template #left>
        <BaseSelect title="Gene set: " :select-data="geneSetData" :change-event="geneSetEvent" is-line ref="geneSet"/>
      </template>
      <template #right>
        <el-link :href="geneEnrichmentDownloadUrl" v-show="geneEnrichmentDownloadUrl">
          <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
    </LeftRight>
    <BaseBr/>
    <LeftRight :left-width="70">
      <template #left>
        <BaseSelect title="P value: " :select-data="pData" :change-event="pEvent" is-line ref="p"/>
      </template>
    </LeftRight>
    <br/>
    <Echarts :resize-value="{ width: width, height: 800 }" ref="echarts" v-show="isHaveData"/>
    <p v-show="!isHaveData">There is no data on the enrichment of genes related to this trait.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DetailApi from '@/api/service/detailApi';
import { ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA, ANALYSIS_GENE_SET_SELECT_DATA, geneEnrichmentOption, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import BaseSelect from '@/components/input/BaseSelect.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import Base from '@/service/util/base/base';
import Time from '@/service/util/base/time';
import LeftRight from '@/components/layout/LeftRight.vue';
import AnalysisApi from '@/api/service/analysisApi';
import BaseBr from '@/components/divider/BaseBr.vue';
import NumberUtil from '@/service/util/base/number';
import FileApi from '@/api/service/fileApi';

export default defineComponent({
  components: { BaseBr, LeftRight, Echarts, BaseSelect },
  name: 'TraitGeneEnrichment',
  props: {
    traitId: {
      type: String,
      default: () => ''
    },
    genome: {
      type: String,
      default: () => 'hg19'
    },
    width: {
      type: Number,
      default: () => 500
    }
  },
  setup(props) {
    const geneSet = ref();
    const echarts = ref();
    const p = ref();
    const data = reactive({
      id: NumberUtil.random10(),
      isHaveData: true,
      traitCode: '',
      geneEnrichmentDownloadUrl: '' as string | undefined
    });

    const geneEnrichmentDownload = () => {
      const fileUrl = `${STATIC_DOWNLOAD_PATH}/enrichment/trait/${props.genome}/${data.traitCode}_gene_enrichment_trait_data.txt`;
      const filePath = `download/enrichment/trait/${props.genome}/${data.traitCode}_gene_enrichment_trait_data.txt`;
      FileApi.isExist(filePath).then((res: boolean) => {
        data.geneEnrichmentDownloadUrl = res ? fileUrl : undefined;
      });
    };

    const listTraitInfo = () => {
      if (Base.noNull(props.traitId)) {
        DetailApi.getVariantTrait(props.traitId).then((res: any) => {
          data.traitCode = res.traitCode;
          geneEnrichmentDownload();
        });
      }
    };

    const geneEnrichmentEcharts = () => {
      if (props.traitId && echarts.value && p.value && geneSet.value) {
        echarts.value.startLoading();
        AnalysisApi.listGeneEnrichmentData({
          traitId: props.traitId,
          geneSet: geneSet.value.select,
          value: p.value.select,
          genome: props.genome
        }).then((res: any) => {
          if (Base.isNull(res.traitGeneEnrichmentList) || res.traitGeneEnrichmentList.length === 0) {
            data.isHaveData = false;
            echarts.value.endLoading();
            return;
          }
          data.isHaveData = true;
          Time.awaitData(() => {
            const dataValue: Array<any> = [];
            const countArray: any = [];
            const pValueArray: any = [];
            (res.traitGeneEnrichmentList as Array<any>).forEach((item: any) => {
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
      }
    };
    const changeEvent = () => {
      geneEnrichmentEcharts();
    };
    const geneSetEvent = () => {
      geneEnrichmentEcharts();
    };
    const pEvent = changeEvent;
    const execRequest = () => {
      listTraitInfo();
      geneEnrichmentEcharts();
    };

    onMounted(() => {
      geneSet.value.select = ANALYSIS_GENE_SET_SELECT_DATA[4].value;
      p.value.select = ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA[1].value;
      execRequest();
    });
    // 监控
    watch(() => ({ value1: props.traitId, value2: props.genome }), () => {
      if (Base.noNull(props.traitId) && Base.noNull(props.genome)) {
        execRequest();
      }
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      geneSet,
      p,
      echarts,
      changeEvent,
      pEvent,
      execRequest,
      geneSetEvent,
      geneSetData: ANALYSIS_GENE_SET_SELECT_DATA,
      pData: ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA
    };
  }
});
</script>
