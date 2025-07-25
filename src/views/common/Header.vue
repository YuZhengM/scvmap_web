<template>
  <div id="header">
    <LeftRight :leftWidth="80" is-equal-height>
      <template #left>
        <div class="title_menus row">
          <div class="col-4 title slideInLeft-enter">
            <el-image :preview-src-list="[logUrl]" :src="logUrl" :initial-index="0" fit="cover"/>
            <span class="title_font">
              <span class="title_prefix">SCV</span>
              <span class="title_suffix">db</span>
            </span>
          </div>
          <!-- 导航条 -->
          <div class="col-8 slideInRight-enter">
            <BaseNav :active="active" :menus="menus"/>
          </div>
        </div>
      </template>
      <template #right>
        <div class="tools">
          <a class="github" href="https://github.com/YuZhengM/scvdb-tutorial" target="_blank">
            <i class="fab fa-github-square"></i>
          </a>
          <a class="globe" href="https://clustrmaps.com/site/1c6dv" target="_blank">
            <i class="fas fa-globe-americas"></i>
            <a href='https://clustrmaps.com/site/1c6dv'  title='Visit tracker' v-show="false">
              <img src='//clustrmaps.com/map_v2.png?cl=ffffff&w=70&t=n&d=uBhdPbNtfUHxS71n7MyG3Ot20ZVijOiUdLDGyzgPjTo' alt="visit"/>
            </a>
          </a>
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
    // 获取路由
    const route = useRoute();
    const all = ref();
    const github = ref();
    // 获取刷新函数信息
    const onRefresh = inject<Function>('reload');
    const reload = () => onRefresh && onRefresh();

    const data = reactive({
      logUrl: logo
    });
    // 获取登录信息
    watch(() => route.fullPath, () => {
      // 这个执行函数 isRouterAlive 变量决定刷新区域
      reload();
    });

    onMounted(() => {
      // eslint-disable-next-line no-console
      console.log('Welcome to SCVdb!');
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
