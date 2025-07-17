<template>
  <div class="source_card_template">
    <div class="card">
      <div class="card-header" v-html="title"></div>
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SourceCard',
  props: {
    title: {
      type: String,
      default: () => 'Title 标题'
    }
  }
});
</script>
