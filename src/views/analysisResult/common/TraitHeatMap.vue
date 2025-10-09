<template>
  <div id="trait_heat_map">
    <BaseLoading ref="loading">
      <div ref="heatMap">
        <canvas :id="heatMapId" width="550" height="700"></canvas>
      </div>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import '@/plugins/canvasxpress';
import StringUtil from '@/service/util/base/string';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import AnalysisApi from '@/api/service/analysisApi';
import Base from '@/service/util/base/base';

export default defineComponent({
  name: 'TraitHeatMap',
  components: { BaseLoading },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    traitIdList: {
      type: Array,
      default: () => []
    },
    method: {
      type: String,
      default: () => 'scavenge'
    },
    strategy: {
      type: String,
      default: () => 'mean'
    }
  },
  setup(props) {
    const loading = ref();
    const heatMap = ref();

    const data = reactive({
      heatMapId: StringUtil.randomString(10)
    });

    const plotHeatMap = (dataInfo: any) => {
      // It needs to be added again first
      heatMap.value.innerHTML = `<canvas id="${data.heatMapId}" width="550" height="700"></canvas>`;
      // @ts-ignore CanvasXpress is not defined in ts, ignore the next line error
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
      }, {
        colorSpectrum: [
          'white',
          '#fe5916'
        ],
        graphType: 'Heatmap',
        heatmapCellBoxColor: 'rgb(255,255,255)',
        samplesClustered: 'true',
        variablesClustered: 'true',
        showTransition: 'true',
        showHeatmapIndicator: 'false',
        showLegend: 'false',
        showSmpDendrogram: 'false',
        showVarDendrogram: 'false'
      });
    };

    const getSampleTraitsHeatmap = () => {
      if (loading.value) {
        loading.value.loading = true;
        AnalysisApi.getSampleTraitsHeatmap(props.sampleId, props.method, props.strategy, { traitIdList: props.traitIdList }).then((res: any) => {
          loading.value.loading = false;
          plotHeatMap(res);
        });
      }
    };

    onMounted(() => {
      if (Base.noNull(props.method) && Base.noNull(props.strategy) && Base.noNull(props.traitIdList) && props.traitIdList.length > 1) {
        getSampleTraitsHeatmap();
      }
    });

    watch(() => ({ value1: props.method, value2: props.strategy, value3: props.traitIdList }), () => {
      if (Base.noNull(props.method) && Base.noNull(props.strategy) && Base.noNull(props.traitIdList) && props.traitIdList.length > 1) {
        getSampleTraitsHeatmap();
      }
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      loading,
      heatMap,
      getSampleTraitsHeatmap
    };
  }
});
</script>
