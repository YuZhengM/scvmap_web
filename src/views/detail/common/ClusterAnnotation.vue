<template>
  <BaseLoading id="cluster_annotation" ref="loading">
    <LeftRight :is-left-right="isLeftRight" ref="leftRight">
      <template #left>
        <BaseLoading ref="clusterLoading">
          <div :id="clusterId"></div>
        </BaseLoading>
      </template>
      <template #right>
        <BaseLoading ref="methodLoading">
          <div :id="traitClusterId"></div>
        </BaseLoading>
      </template>
    </LeftRight>
    <el-divider></el-divider>
    <TraitBoxPlot :box-data="boxData" :metadata="metadata" :label="label" ref="boxPlot"/>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DetailApi from '@/api/service/detailApi';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import {
  clusterForm,
  DETAIL_CELL_COUNT_DATA,
  DETAIL_METHOD_DATA,
  formClusterPlotMethod,
  sampleClusterLayout,
  sampleClusterLayoutMain
} from '@/assets/ts';
import { InputSelect } from '@/service/model/components/input';
import StringUtil from '@/service/util/base/string';
import config from '@/service/util/plotly';
import TraitBoxPlot from '@/views/detail/common/TraitBoxPlot.vue';

// 导入 plotly
import Plotly from 'plotly.js-dist-min';
import Base from '@/service/util/base/base';

export default defineComponent({
  name: 'ClusterAnnotation',
  components: {
    TraitBoxPlot,
    BaseLoading,
    LeftRight
  },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    traitId: {
      type: String,
      default: () => ''
    },
    method: {
      type: String,
      default: () => 'scavenge'
    },
    metadata: {
      type: String,
      default: () => 'cell_type'
    },
    fineMappingMethod: {
      type: String,
      default: () => 'finemap'
    },
    cellCount: {
      type: Number,
      default: () => -1
    },
    clusterHeight: {
      type: Number,
      default: () => 580
    },
    isLeftRight: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const boxPlot = ref();
    const clusterLoading = ref();
    const methodLoading = ref();
    const data = reactive({
      clusterId: StringUtil.randomString(10),
      traitClusterId: StringUtil.randomString(10),
      traitData: [] as Array<InputSelect>,
      boxData: {} as any,
      label: '' as string
    });

    // 得到数据
    const getClusterValue = () => {
      if (clusterLoading.value) {
        clusterLoading.value.loading = true;
        DetailApi.listClusterCoordinate(props.sampleId, props.cellCount, props.metadata).then((res: any) => {
          clusterLoading.value.loading = false;
          Plotly.newPlot(data.clusterId, clusterForm(res, 5), sampleClusterLayoutMain(leftRight.value.getLeftLabel().offsetWidth * 0.98, props.clusterHeight), config);
        });
      }
    };

    const getTraitClusterData = () => {
      if (methodLoading.value) {
        methodLoading.value.loading = true;
        boxPlot.value.startLoading();
        DetailApi.listTraitCluster(props.sampleId, props.method, props.traitId, props.cellCount, props.metadata, props.fineMappingMethod).then((res: any) => {
          data.label = props.method === 'scavenge' ? 'TRS' : 'Z score';
          data.boxData = res.plotlyDataList[0] as any;
          methodLoading.value.loading = false;
          boxPlot.value.endLoading();
          const formClusterPlotData = formClusterPlotMethod(res.plotlyDataList, 2, data.label);
          Plotly.newPlot(data.traitClusterId, formClusterPlotData, sampleClusterLayout(leftRight.value.getLeftLabel().offsetWidth * 0.98, props.clusterHeight), config);
        });
      }
    };

    const checkValue = () => Base.noNull(props.sampleId) && Base.noNull(props.traitId) && Base.noNull(props.method)
        && Base.noNull(props.metadata) && Base.noNull(props.fineMappingMethod) && props.cellCount > 0;

    const startLoading = () => {
      loading.value.loading = true;
    };

    const endLoading = () => {
      loading.value.loading = false;
    };

    onMounted(() => {
      if (Base.noNull(props.sampleId) && props.cellCount > 0) {
        getClusterValue();
      }
      if (checkValue()) {
        getTraitClusterData();
      }
    });

    // Monitor the sampleId, traitId, cellCount, metadata, method, and fineMappingMethod properties
    watch(() => ({
      value1: props.sampleId,
      value2: props.traitId,
      value3: props.cellCount,
      value4: props.metadata,
      value5: props.method,
      value6: props.fineMappingMethod
    }), () => {
      if (Base.noNull(props.sampleId) && props.cellCount > 0) {
        getClusterValue();
      }
      if (checkValue()) {
        getTraitClusterData();
      }
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      clusterLoading,
      methodLoading,
      boxPlot,
      startLoading,
      endLoading,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      methodData: DETAIL_METHOD_DATA
    };
  }
});
</script>
