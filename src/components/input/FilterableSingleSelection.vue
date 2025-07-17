<template>
  <div class="base_filterable_single_selection">
    <span class="title" v-if="title">
      {{ title }}
      <BaseTooltip placement="top" v-if="description" :content="description">
        <i class="fas fa-question-circle"></i>
      </BaseTooltip>
    </span>
    <el-cascader
        v-model="select"
        :placeholder="placeholder"
        :options="selectData"
        filterable
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/components/input/FilterableSingleSelection.less';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';

export default defineComponent({
  name: 'FilterableSingleSelection',
  components: { BaseTooltip },
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    description: {
      type: String,
      default: () => undefined
    },
    placeholder: {
      type: String,
      default: () => 'Please select'
    },
    selectData: {
      type: Array,
      default: () => [] as Array<any>
    }
  },
  setup() {
    const data = reactive({
      select: ''
    });

    return {
      ...toRefs(data)
    };
  }
});
</script>
