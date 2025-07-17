<template>
  <div class="base_switch_template" :style="isInline ? `display: inline-block;` : 'display: block;'">
    <span v-html="title" v-if="title"></span>
    <el-switch v-model="value"
               size="large"
               :inline-prompt="isInline"
               :active-color="activeColor"
               :inactive-color="inactiveColor"
               :active-text="activeText"
               :inactive-text="inactiveText"
               @change="change">
    </el-switch>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/components/switch/BaseSwitch.less';

export default defineComponent({
  name: 'BaseSwitch',
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    activeColor: {
      type: String,
      default: () => '#ceb213'
    },
    inactiveColor: {
      type: String,
      default: () => '#3ba272'
    },
    activeText: {
      type: String,
      default: () => ''
    },
    inactiveText: {
      type: String,
      default: () => ''
    },
    changeEvent: {
      type: Function,
      default: () => ({})
    },
    isInline: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const data = reactive({
      value: true
    });
    const change = (val: string) => {
      props.changeEvent(val);
    };
    return {
      ...toRefs(data),
      change
    };
  }
});
</script>
