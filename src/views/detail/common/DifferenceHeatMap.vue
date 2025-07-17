<template>
  <div id="difference_heat_map">
    <BaseLoading ref="loading">
      <LeftRight :left-width="35">
        <template #left>
          <BaseSelect title="Top count:" is-line width="41%" :change-event="topCountGraphChange" :select-data="topCountData" ref="topCountGraph" :description="topDescription"/>
        </template>
        <template #right>
          <BaseSelect title="Log<sub>2</sub>(Fold change):" :is-line="true" width="55%" :change-event="cellTypeGraphChange" :select-data="Log2FoldChangeSelectData" ref="log2FoldChange"/>
        </template>
      </LeftRight>
      <div class="textarea">
        <div class="title">
          <span>Add {{ element === 'gene' ? 'gene' : 'TF' }}s: </span>
          <el-button @click="exampleClick" v-if="element === 'gene'"> Example </el-button>
          <el-button @click="addGenesClick"> Plot </el-button>
          <span class="heatmap_value"> {{ element === 'gene' ? 'Value: `Score` score in the `Display`.'
              : 'Value: `-Log10(P-value)` score.' }}</span>
        </div>
        <BaseInput type="textarea" :rows="2" :placeholder="placeholder" ref="geneTextarea"/>
      </div>
      <br/>
      <div ref="heatMap">
        <canvas :id="heatMapId" width="600" height="600"></canvas>
      </div>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import '@/plugins/canvasxpress';
import '@/assets/less/views/Detail.less';
import StringUtil from '@/service/util/base/string';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import Base from '@/service/util/base/base';
import DetailApi from '@/api/service/detailApi';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA, DETAIL_ELEMENT_HEAT_MAP_TOP_COUNT_DATA } from '@/assets/ts';
import { ElNotification } from 'element-plus';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseInput from '@/components/input/BaseInput.vue';

export default defineComponent({
  name: 'DifferenceHeatMap',
  components: { BaseInput, LeftRight, BaseSelect, BaseLoading },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    element: {
      type: String,
      default: () => 'gene'
    },
    topDescription: {
      type: String,
      default: () => 'Top count'
    }
  },
  setup(props) {
    const loading = ref();
    const heatMap = ref();
    const topCountGraph = ref();
    const log2FoldChange = ref();
    const geneTextarea = ref();
    const data = reactive({
      heatMapId: StringUtil.randomString(10),
      placeholder: `Please input the ${props.element}s  e.g. RCC2,APOE,LPP`
    });
    // 画热图
    const plotHeatMap = (dataInfo: any) => {
      // 需要先重新添加
      heatMap.value.innerHTML = `<canvas id="${data.heatMapId}" width="600" height="700"></canvas>`;
      // @ts-ignore CanvasXpress 这个在 ts 中报错, 忽略下一行一切错误
      // eslint-disable-next-line no-undef,no-new
      new CanvasXpress(data.heatMapId, {
        x: {
          traits: dataInfo.ylabelList
        },
        y: {
          data: dataInfo.data,
          vars: dataInfo.xlabelList,
          smps: dataInfo.ylabelList
        }
      }, props.element === 'gene' ? {
        graphType: 'Heatmap',
        heatmapCellBoxColor: 'rgb(255,255,255)',
        samplesClustered: 'true',
        variablesClustered: 'true',
        showTransition: 'false',
        showHeatmapIndicator: 'false',
        showLegend: 'true',
        showSmpDendrogram: 'false',
        showVarDendrogram: 'false'
      } : {
        colorSpectrum: [
          'white',
          '#fe5916'
        ],
        graphType: 'Heatmap',
        heatmapCellBoxColor: 'rgb(255,255,255)',
        samplesClustered: 'true',
        variablesClustered: 'true',
        showTransition: 'false',
        showHeatmapIndicator: 'false',
        showLegend: 'true',
        showSmpDendrogram: 'false',
        showVarDendrogram: 'false'
      });
    };
    const getDifferenceHeatmap = () => {
      if (loading.value) {
        loading.value.loading = true;
        DetailApi.getDifferenceHeatmapBySampleId(props.element, {
          sampleId: props.sampleId,
          topCount: topCountGraph.value.select,
          log2FoldChange: log2FoldChange.value.select,
          names: geneTextarea.value.input
        }).then((res: any) => {
          loading.value.loading = false;
          plotHeatMap(res);
        });
      }
    };

    const topCountGraphChange = () => {
      if (topCountGraph.value.select >= 2000) {
        ElNotification({ title: 'Tips', message: 'Too many quantity selections may cause slow loading, please be patient and wait!', type: 'info' });
      }
      getDifferenceHeatmap();
    };

    const cellTypeGraphChange = () => {
      getDifferenceHeatmap();
    };

    const addGenesClick = () => {
      getDifferenceHeatmap();
    };

    const exampleClick = () => {
      if (props.element === 'gene') {
        geneTextarea.value.input = 'GLI1,GLI2,GLI3,GLI4,ASIP,SLC45A2,OCA2,PADI6,RCC2,RGS22,CASC15,LINC00111'
            + ',ZBTB10,LY6E,ENSG00000284956,IL6,ENSG00000287521,ENSG00000290101,CALCA,LINC01232,FKBPL,HIF1A';
      }
    };

    onMounted(() => {
      topCountGraph.value.select = props.element === 'gene' ? 100 : 20;
      log2FoldChange.value.select = 0.6;
      data.placeholder = props.element === 'gene' ? 'Please input the genes  e.g. RCC2,APOE,LPP' : 'Please input the TFs  e.g. SPI1,GLI1,GLI2';

      if (Base.noNull(props.sampleId)) {
        getDifferenceHeatmap();
      }
    });

    // 监控
    watch(() => ({ value1: props.sampleId }), () => {
      if (Base.noNull(props.sampleId)) {
        getDifferenceHeatmap();
      }
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      loading,
      heatMap,
      topCountGraph,
      log2FoldChange,
      geneTextarea,
      topCountGraphChange,
      cellTypeGraphChange,
      addGenesClick,
      exampleClick,
      topCountData: DETAIL_ELEMENT_HEAT_MAP_TOP_COUNT_DATA,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA
    };
  }
});
</script>
