<template>
  <BaseLoading class="base_tabs_template" ref="loading" :style="`height: ${height}px;`">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane type="border-card" :name="tabs.name" v-for="(tabs, i) in tabsData" :key="i">
        <template #label>
          <i :class="tabs.icon" v-if="tabs.icon"></i>
          {{ tabs.title }}
        </template>
        <slot :name="tabs.name"></slot>
      </el-tab-pane>
    </el-tabs>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/components/tabs/BaseTabs.less';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { TabsBase } from '@/service/model/components/tabs';
import { TabsPaneContext } from 'element-plus/es';

export default defineComponent({
  name: 'BaseTabs',
  components: { BaseLoading },
  props: {
    active: {
      type: String,
      default: () => 'first'
    },
    tabsData: {
      type: Array,
      default: () => [] as Array<TabsBase>
    },
    change: {
      type: Function,
      default: () => ({})
    },
    height: {
      type: String,
      default: () => '100%'
    }
  },
  setup(props) {
    const loading = ref();
    const data = reactive({
      activeName: ''
    });
    const handleClick = (tab: TabsPaneContext, event: Event) => {
      props.change(tab, event);
    };
    onMounted(() => {
      data.activeName = props.active;
    });
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    return {
      ...toRefs(data),
      loading,
      handleClick,
      startLoading,
      endLoading
    };
  }
});
</script>
