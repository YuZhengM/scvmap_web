<template>
  <div class="left_right_template">
    <div class="left" ref="left">
      <slot name="left"></slot>
    </div>
    <div class="right" ref="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/components/layout/LeftRight.less';

export default defineComponent({
  name: 'LeftRight',
  props: {
    leftWidth: {
      type: Number,
      default: () => 50
    },
    isEqualHeight: {
      type: Boolean,
      default: () => false
    },
    height: {
      type: Number,
      default: () => 0
    },
    padding: {
      type: Number,
      default: () => 2.5
    }
  },
  setup(props) {
    // 获取 ref 元素
    const left = ref();
    const right = ref();
    const data = reactive({
      second: 0.5
    });
    // 修改样式信息
    onMounted(() => {
      left.value.style.width = `${String(props.leftWidth - props.padding)}%`;
      right.value.style.width = `${String(100 - props.padding - props.leftWidth)}%`;
    });
    // 页面加载完获取左右高度
    nextTick(() => {
      if (props.isEqualHeight && props.height === 0) {
        // 当左边高度大于右边, 则将左边高度复制给右边
        if (left.value.clientHeight > right.value.clientHeight) {
          right.value.style.height = `${left.value.clientHeight}px`;
        } else {
          left.value.style.height = `${right.value.clientHeight}px`;
        }
      }
      if (props.height > 0) {
        right.value.style.height = `${props.height}px`;
        left.value.style.height = `${props.height}px`;
      }
    });
    return {
      ...toRefs(data),
      left,
      right,
      getLeftLabel: () => left.value,
      getRightLabel: () => right.value
    };
  }
});
</script>
