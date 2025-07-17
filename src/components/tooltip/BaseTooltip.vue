<template>
  <div id="base_tooltip">
    <el-tooltip :placement="placement" :content="content">
      <el-button>
        <slot></slot>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'BaseTooltip',
  props: {
    placement: {
      type: String,
      default: () => 'right'
    },
    content: {
      type: String,
      default: () => 'This is a tooltip.'
    }
  },
  setup() {
    // 设置响应数据
    const data = reactive({});
    return {
      ...toRefs(data)
    };
  }
});
</script>

<style lang="less">

#base_tooltip {
  display: inline-block;
  margin-left: 5px;

  > button {
    min-height: 0;
    padding: 0;
    line-height: 0;
    border: 0;
    background-color: rgba(0, 0, 0, 0);
    //height: 10px;
  }

}

</style>
