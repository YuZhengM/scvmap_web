<template>
  <BaseLoading id="cluster_annotation_with_button" ref="loading">
    <el-row :gutter="24">
      <el-col :span="12">
        <BaseSelect title="Cell count: " :select-data="cellCountData" :change-event="cellCountEvent" width="50%" is-line ref="cellCount"/>
      </el-col>
      <el-col :span="12">
        <BaseSelect title="Method: " :select-data="methodData" :change-event="methodEvent" width="60%" is-line ref="method"/>
      </el-col>
    </el-row>
    <ClusterAnnotation :sample-id="sampleId" :trait-id="traitId" :cell-count="cellCountValue" :method="methodValue"/>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import {
  DETAIL_CELL_COUNT_DATA,
  DETAIL_METHOD_DATA,
  getCellCountValue,
  linkTraitDetail
} from '@/assets/ts';
import { InputSelect } from '@/service/model/components/input';
import BaseSelect from '@/components/input/BaseSelect.vue';
import StringUtil from '@/service/util/base/string';
import ClusterAnnotation from '@/views/detail/common/ClusterAnnotation.vue';
import DetailApi from '@/api/service/detailApi';
import Base from '@/service/util/base/base';

export default defineComponent({
  name: 'ClusterAnnotationWithButton',
  components: {
    ClusterAnnotation,
    BaseSelect,
    BaseLoading
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
    const cellCount = ref();
    const method = ref();
    const clusterLoading = ref();
    const methodLoading = ref();
    const data = reactive({
      clusterId: StringUtil.randomString(10),
      traitClusterId: StringUtil.randomString(10),
      boxData: {} as any,
      drawerResize: {} as any,
      countPieData: [] as Array<InputSelect>,
      methodValue: '',
      sampleLabel: '',
      cellCountValue: 0,
      traitIdUrl: linkTraitDetail('')
    });

    const getOverview = () => DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
      data.sampleLabel = res.label;
      cellCount.value.select = getCellCountValue(res.cellCount);
      data.cellCountValue = cellCount.value.select;
    });

    const cellCountEvent = () => {
      data.cellCountValue = cellCount.value.select;
    };
    const methodEvent = () => {
      data.methodValue = method.value.select;
    };

    const startLoading = () => {
      loading.value.loading = true;
    };

    const endLoading = () => {
      loading.value.loading = false;
    };

    onMounted(() => {
      method.value.select = DETAIL_METHOD_DATA[0].value;
      data.methodValue = method.value.select;
    });

    // 监控
    watch(() => (props.sampleId), () => {
      if (Base.noNull(props.sampleId)) {
        data.cellCountValue = 0;
        getOverview();
      }
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      loading,
      cellCount,
      method,
      clusterLoading,
      methodLoading,
      cellCountEvent,
      methodEvent,
      startLoading,
      endLoading,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      methodData: DETAIL_METHOD_DATA
    };
  }
});
</script>
