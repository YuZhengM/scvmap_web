<template>
  <div id="app">
    <router-view name="header"/>
    <router-view v-if="isRouterAlive"/>
    <router-view name="footer"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, nextTick } from 'vue';
import '@/assets/less/Index.less';

export default defineComponent({
  name: 'App',
  setup() {
    // Refresh routing settings
    const isRouterAlive = ref<boolean>(true);
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
    };
    // pass `reload` parameter
    provide('reload', reload);
    return { isRouterAlive };
  }
});
</script>
