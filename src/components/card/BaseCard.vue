<template>
  <div class="base_card_template">
    <!-- Title -->
    <div class="title">
      <i :class="icon" v-if="icon"></i>
      <span v-text="title"></span>
    </div>
    <!-- Content -->
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@/assets/less/components/card/BaseCard.less';

export default defineComponent({
  name: 'BaseCard',
  props: {
    icon: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      default: () => 'Title'
    }
  }
});
</script>
