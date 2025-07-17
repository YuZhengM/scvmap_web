<template>
  <div class="base_loading_template custom-loading-svg" v-loading="loading"
       element-loading-background="rgba(0, 0, 0, 0.4)">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/components/loading/BaseLoading.less';

export default defineComponent({
  name: 'BaseLoading',
  setup() {
    const data = reactive({
      loading: false
    });
    return {
      ...toRefs(data)
    };
  }
});
</script>
