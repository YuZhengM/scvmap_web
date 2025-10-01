<template>
  <div id="detail">
    <div class="detail">
      <PositionButton :button-content="buttonContent" :top="metadata === 'cell_type' ? 127 : 126"/>
      <BaseBr/>
      <div v-if="value == 1">
        <SampleDetail ref="sample"/>
      </div>
      <div v-if="value == 2">
        <TraitDetail ref="trait"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/Detail.less';
import SampleDetail from '@/views/detail/SampleDetail.vue';
import TraitDetail from '@/views/detail/TraitDetail.vue';
import { DETAIL_BUTTON_POSITION_DATA, DETAIL_BUTTON_POSITION_TIME_SEX_DRUG_DATA, DETAIL_BUTTON_POSITION_TRS_DATA } from '@/assets/ts';
import PositionButton from '@/components/button/PositionButton.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import { ElNotification } from 'element-plus';
import { ButtonBase } from '@/service/model/components/button';

export default defineComponent({
  name: 'Detail',
  components: { BaseBr, PositionButton, TraitDetail, SampleDetail },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sample = ref();
    const trait = ref();
    const data = reactive({
      value: 0 as number,
      metadata: 'cell_type',
      fineMappingMethodValue: 'finemap',
      buttonContent: [] as Array<ButtonBase>
    });

    const setButtonContent = () => {
      switch (data.metadata) {
        case 'cell_type':
          data.buttonContent = DETAIL_BUTTON_POSITION_DATA;
          break;
        default:
          data.buttonContent = DETAIL_BUTTON_POSITION_TIME_SEX_DRUG_DATA;
          break;
      }
    };

    const setButtonContentByFineMappingMethod = () => {
      switch (data.fineMappingMethodValue) {
        case 'finemap':
          data.buttonContent = DETAIL_BUTTON_POSITION_DATA;
          break;
        default:
          data.buttonContent = DETAIL_BUTTON_POSITION_TRS_DATA;
          break;
      }
    };

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

    watch(() => sample.value?.metadataValue, (newValue: any) => {
      if (sample.value && !Base.isNull(route.query.sampleId)) {
        data.metadata = newValue;
        setButtonContent();
      }
    }, {
      immediate: true,
      deep: true
    });

    watch(() => trait.value?.metadataValue, (newValue: any) => {
      if (trait.value && !Base.isNull(route.query.traitId)) {
        data.metadata = newValue;
        setButtonContent();
      }
    }, {
      immediate: true,
      deep: true
    });

    watch(() => sample.value?.fineMappingMethodValue, (newValue: any) => {
      if (sample.value && !Base.isNull(route.query.sampleId)) {
        data.fineMappingMethodValue = newValue;
        setButtonContentByFineMappingMethod();
      }
    }, {
      immediate: true,
      deep: true
    });

    watch(() => trait.value?.fineMappingMethodValue, (newValue: any) => {
      if (trait.value && !Base.isNull(route.query.traitId)) {
        data.fineMappingMethodValue = newValue;
        setButtonContentByFineMappingMethod();
      }
    }, {
      immediate: true,
      deep: true
    });

    return {
      ...toRefs(data),
      sample,
      trait
    };
  }
});
</script>
