<template>
  <span id="vertical_divider">
    <el-divider direction="vertical"></el-divider>
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'VerticalDivider',
  setup() {
    // 设置响应数据
    const data = reactive({});
    return {
      ...toRefs(data)
    };
  }
});
</script>
