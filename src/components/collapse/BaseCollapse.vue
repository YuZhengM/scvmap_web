<template>
  <BaseLoading class="base_collapse_template" ref="loading">
    <el-collapse :model-value="activeName" @change="handleChange" accordion>
      <el-collapse-item :name="collapse.name" v-for="(collapse, i) in collapseData" :key="i">
        <template #title>
          <i :class="collapse.icon" v-if="collapse.icon"></i>
          {{ collapse.title }}
        </template>
        <slot :name="collapse.name"></slot>
      </el-collapse-item>
    </el-collapse>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import '@/assets/less/components/collapse/BaseCollapse.less';
import BaseLoading from '@/components/loading/BaseLoading.vue';

export default defineComponent({
  name: 'BaseCollapse',
  components: { BaseLoading },
  props: {
    collapseData: {
      type: Array,
      default: () => ([])
    },
    activeName: {
      type: String,
      default: () => undefined
    },
    change: {
      type: Function,
      default: () => ({})
    }
  },
  setup(props) {
    const loading = ref();
    const handleChange = (val: string) => {
      props.change(val);
    };
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    return {
      loading,
      handleChange,
      startLoading,
      endLoading
    };
  }
});
</script>
