<template>
  <div id="home">
    <!-- 第一个区域 -->
    <SimpleSearch/>
    <div class="line"></div>
    <!-- 第二个区域 -->
    <BaseImage :url="url"/>
    <div class="line"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/views/Home.less';
import BaseImage from '@/components/image/BaseImage.vue';
import SimpleSearch from '@/views/home/SimpleSearch.vue';

const index = require('@/assets/img/home/overview.png');

export default defineComponent({
  name: 'Home',
  components: {
    SimpleSearch,
    BaseImage
  },
  setup() {
    const data = reactive({
      url: index
    });
    return {
      ...toRefs(data)
    };
  }
});
</script>
