<template>
  <div id="header">
    <LeftRight :leftWidth="80" is-equal-height>
      <template #left>
        <div class="title_menus row">
          <div class="col-4 title slideInLeft-enter">
            <el-image :preview-src-list="[logUrl]" :src="logUrl" :initial-index="0" fit="cover"/>
            <span class="title_font">
              <span class="title_prefix">scV</span>
              <span class="title_suffix">MAP</span>
            </span>
          </div>
          <div class="col-8 slideInRight-enter">
            <BaseNav :active="active" :menus="menus"/>
          </div>
        </div>
      </template>
      <template #right>
        <div class="tools">
          <a class="github" href="https://github.com/YuZhengM/scvmap_reproducibility" target="_blank">
            <i class="fab fa-github-square"></i>
          </a>
          <a class="globe" href="https://clustrmaps.com/site/1c7in" target="_blank">
            <i class="fas fa-globe-americas"></i>
            <a href='https://clustrmaps.com/site/1c7in' title='Visit tracker' v-show="false">
              <img src='//www.clustrmaps.com/map_v2.png?d=Xj6CuwfZ06R0277UEPHiVlXVLKI7rGyPBNtFswspMC8&cl=ffffff' alt="visit"/>
            </a>
          </a>
<!--          <a class="orcid" href="https://orcid.org/0009-0006-0777-4043" target="orcid.widget" rel="me noopener noreferrer">-->
<!--            <img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID iD icon"/>-->
<!--          </a>-->
        </div>
      </template>
    </LeftRight>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';
import '@/assets/less/common/Header.less';
import BaseNav from '@/components/nav/BaseNav.vue';
import { HEADER_MENUS, PROJECT_NAME } from '@/assets/ts';
import LeftRight from '@/components/layout/LeftRight.vue';

const logo = require('@/assets/img/home/logo.png');

export default defineComponent({
  name: 'Header',
  props: {
    active: {
      type: Number,
      default: () => 0
    }
  },
  components: { LeftRight, BaseNav },
  setup() {
    // Get route
    const route = useRoute();
    const all = ref();
    const github = ref();
    // Get refresh function information
    const onRefresh = inject<Function>('reload');
    const reload = () => onRefresh && onRefresh();

    const data = reactive({
      logUrl: logo
    });
    // Get URL
    watch(() => route.fullPath, () => {
      // The execution function isRouterAlive variable determines the refresh area
      reload();
    });

    onMounted(() => {
      // eslint-disable-next-line no-console
      console.log('Welcome to scVMAP!');
    });

    return {
      ...toRefs(data),
      name: PROJECT_NAME,
      menus: HEADER_MENUS,
      all,
      github
    };
  }
});
</script>
