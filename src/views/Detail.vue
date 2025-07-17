<template>
  <div id="detail">
    <div class="detail">
      <PositionButton :button-content="buttonContent" :top="125"/>
      <BaseBr />
      <div v-if="value == 1">
        <SampleDetail/>
      </div>
      <div v-if="value == 2">
        <TraitDetail/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/Detail.less';
import SampleDetail from '@/views/detail/SampleDetail.vue';
import TraitDetail from '@/views/detail/TraitDetail.vue';
import { DETAIL_BUTTON_POSITION_DATA } from '@/assets/ts';
import PositionButton from '@/components/button/PositionButton.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'Detail',
  components: { BaseBr, PositionButton, TraitDetail, SampleDetail },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const overview = ref();
    const data = reactive({
      value: 0 as number
    });

    onMounted(() => {
      if (Base.isNull(route.query.sampleId) && Base.isNull(route.query.traitId)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      } else if (Base.isNull(route.query.traitId)) {
        data.value = 1;
      } else if (Base.isNull(route.query.sampleId)) {
        data.value = 2;
      }
    });
    return {
      ...toRefs(data),
      overview,
      buttonContent: DETAIL_BUTTON_POSITION_DATA
    };
  }
});
</script>
