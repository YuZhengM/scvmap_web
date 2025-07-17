<template>
  <div id="BaseBr" :style="'height: ' + height + 'px;'"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseBr',
  props: {
    height: {
      type: Number,
      default: () => 10
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped>

#BaseBr {
  display: block;
}

</style>
