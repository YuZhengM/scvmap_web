<template>
  <el-drawer v-model="drawer" :direction="direction" :size="size" @opened="opened" show-close v-loading="loading">
    <template #title>
      <span v-html="title"></span>
    </template>
    <slot></slot>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'BaseDrawer',
  components: {},
  props: {
    /**
     * ltr: 从左往右开
     * rtl: 从右往左开
     * ttb: 从上往下开
     * btt: 从下往上开
     */
    direction: {
      type: String,
      default: () => 'ltr'
    },
    title: {
      type: String,
      default: () => 'Title'
    },
    size: {
      type: String,
      default: () => '45%'
    },
    openEvent: {
      type: Function,
      default: () => ({})
    }
  },
  setup(props) {
    const data = reactive({
      drawer: false,
      loading: false
    });
    const opened = () => new Promise<void>((resolve) => {
      props.openEvent();
      resolve();
    });
    return {
      ...toRefs(data),
      opened
    };
  }
});
</script>

<style lang="less">

.el-drawer {
  padding: 5px 15px;
}

</style>
