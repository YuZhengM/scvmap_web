<template>
  <div id="font_logo">
    <div class="logo" ref="logo">
      <span v-for="(item, i) in letters" :key="i" v-text="item"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/components/logo/FontLogo.less';

export default defineComponent({
  name: 'FontLogo',
  props: {
    width: {
      type: Number,
      default: () => 110
    },
    height: {
      type: Number,
      default: () => 110
    },
    fontSize: {
      type: Number,
      default: () => 40
    },
    letterSpacing: {
      type: Number,
      default: () => 12
    },
    letters: {
      type: Array,
      default: () => ['L', 'I', 'C', 'L', 'A', 'B']
    }
  },
  setup(props) {
    const logo = ref();
    // 设置响应数据
    const data = reactive({});
    onMounted(() => {
      logo.value.style.width = `${props.width + 20}px`;
      logo.value.style.height = `${props.height + 20}px`;
      logo.value.style.fontSize = `${props.fontSize}px`;
      logo.value.style.letterSpacing = `${props.letterSpacing}px`;
    });
    return {
      ...toRefs(data),
      logo
    };
  }
});
</script>
