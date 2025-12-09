<template>
  <div class="base_image_template">
    <el-card :shadow="shadow">
      <el-image :preview-src-list="[url]" :src="url" :initial-index="0" :fit="fit"/>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@/assets/less/components/image/BaseImage.less';

export default defineComponent({
  name: 'BaseImage',
  props: {
    url: {
      type: String,
      default: () => ''
    },
    // fill, contain, cover, none, scale-down
    fit: {
      type: String,
      default: () => 'cover'
    },
    shadow: {
      type: String,
      default: () => 'always'
    }
  },
  setup() {
    return {};
  }
});
</script>
