<template>
  <div id="sample_detail">
    <div class="sample_detail">
      <!-- sample overview -->
      <SampleOverview :sample-id="String(sampleId)" ref="overview"/>
      <br/>
      <!-- Accessible chromatin region annotation of Region ID -->
      <SampleClusterAnnotation :sample-id="String(sampleId)" ref="clusterAnnotation"/>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/Detail.less';
import SampleOverview from '@/views/detail/sampleDetail/SampleOverview.vue';
import SampleClusterAnnotation from '@/views/detail/sampleDetail/SampleClusterAnnotation.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'SampleDetail',
  components: { SampleClusterAnnotation, SampleOverview },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const overview = ref();
    const clusterAnnotation = ref();

    const data = reactive({
      sampleId: route.query.sampleId,
      metadataValue: 'cell_type',
      fineMappingMethodValue: 'finemap'
    });

    onMounted(() => {
      if (Base.isNull(route.query.sampleId)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      window.onresize = () => {
        overview.value.plotResize();
      };
    });

    watch(() => clusterAnnotation.value?.metadataValue, (newValue: any) => {
      if (clusterAnnotation.value) {
        data.metadataValue = newValue;
      }
    }, {
      immediate: true,
      deep: true
    });

    watch(() => clusterAnnotation.value?.fineMappingMethodValue, (newValue: any) => {
      if (clusterAnnotation.value) {
        data.fineMappingMethodValue = newValue;
      }
    }, {
      immediate: true,
      deep: true
    });

    return {
      ...toRefs(data),
      overview,
      clusterAnnotation
    };
  }
});
</script>
