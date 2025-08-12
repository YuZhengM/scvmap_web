<template>
  <div id="trait_detail">
    <div class="trait_detail">
      <!-- sample overview -->
      <TraitOverview :trait-id="String(traitId)" ref="overview"/>
      <br/>
      <!-- Accessible chromatin region annotation of Region ID -->
      <TraitClusterAnnotation :trait-id="String(traitId)" ref="clusterAnnotation"/>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import '@/assets/less/views/Detail.less';
import TraitOverview from '@/views/detail/traitDetail/TraitOverview.vue';
import TraitClusterAnnotation from '@/views/detail/traitDetail/TraitClusterAnnotation.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'TraitDetail',
  components: { TraitClusterAnnotation, TraitOverview },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const overview = ref();

    const data = reactive({
      traitId: route.query.traitId
    });

    onMounted(() => {
      if (Base.isNull(route.query.traitId)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
    });
    return {
      ...toRefs(data),
      overview
    };
  }
});
</script>
