<template>
  <BaseLoading id="cluster_annotation_with_button" ref="loading">
    <el-row :gutter="24">
      <el-col :span="8">
        <BaseSelect title="Metadata: " :select-data="metadataData" width="50%" :change-event="metadataEvent" is-line ref="metadata" v-show="metadataData.length > 1"/>
        <div v-show="metadataData.length === 1" class="metadata">Metadata: Cell type</div>
      </el-col>
      <el-col :span="8">
        <BaseSelect title="Cell count: " :select-data="cellCountData" :change-event="cellCountEvent" width="40%" is-line ref="cellCount"/>
      </el-col>
      <el-col :span="8">
        <BaseSelect title="Method: " :select-data="methodData" :change-event="methodEvent" width="50%" is-line ref="method"/>
      </el-col>
    </el-row>
    <ClusterAnnotation :sample-id="sampleId"
                       :trait-id="traitId"
                       :cell-count="cellCountValue"
                       :method="methodValue"
                       :metadata="metadataValue"
                       :cluster-height="clusterHeight"
                       :is-left-right="isLeftRight"/>
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
    const cellCount = ref();
    const method = ref();
    const clusterLoading = ref();
    const methodLoading = ref();
    const metadata = ref();
    const data = reactive({
      clusterId: StringUtil.randomString(10),
      traitClusterId: StringUtil.randomString(10),
      boxData: {} as any,
      drawerResize: {} as any,
      countPieData: [] as Array<InputSelect>,
      methodValue: '',
      sampleLabel: '',
      cellCountValue: 0,
      metadataData: [{
        label: 'Cell type',
        value: 'cell_type',
        default: true
      }] as Array<InputSelect>,
      metadataValue: 'cell_type',
      traitIdUrl: linkTraitDetail('')
    });

    const getOverview = () => DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
      data.sampleLabel = res.label;
      cellCount.value.select = getCellCountValue(res.cellCount);
      data.cellCountValue = cellCount.value.select;

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

    const metadataEvent = async () => {
      data.metadataValue = metadata.value.select;
    };

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
      data.metadataValue = data.metadataData[0].value as string;
    });

    // Monitor the sampleId property
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
      metadata,
      cellCountEvent,
      metadataEvent,
      methodEvent,
      startLoading,
      endLoading,
      cellCountData: DETAIL_CELL_COUNT_DATA,
      methodData: DETAIL_METHOD_DATA
    };
  }
});
</script>
