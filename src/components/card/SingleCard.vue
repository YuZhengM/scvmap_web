<template>
  <BaseLoading class="single_card_template" ref="loading">
    <div class="title" v-if="title">
      <i :class="title.icon" v-if="title.icon"></i>
      <span> </span>
      <span v-html="title.content"></span>
      <span v-if="$slots.head">&nbsp;</span>
      <slot name="head"></slot>
    </div>
    <div class="content" ref="content" :style="`padding: ${padding}px;`">
      <slot name="default"></slot>
    </div>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import '@/assets/less/components/card/SingleCard.less';
import BaseLoading from '@/components/loading/BaseLoading.vue';

export default defineComponent({
  name: 'SingleCard',
  components: { BaseLoading },
  props: {
    title: {
      type: Object,
      default: () => undefined
    },
    padding: {
      type: Number,
      default: () => 20
    }
  },
  setup(props) {
    const loading = ref();
    const content = ref();
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    const getContentWidth = () => content.value.clientWidth - props.padding;
    return {
      loading,
      content,
      startLoading,
      endLoading,
      getContentWidth
    };
  }
});
</script>
