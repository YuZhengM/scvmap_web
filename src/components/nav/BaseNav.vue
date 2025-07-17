<template>
  <div id="base_nav">
    <div :class="i === active && active > -1 ? 'menu active' : 'menu'" v-for="(menu, i) in menus" :key="i" @click="menuClick(menu)">
      <div class="main">
        <span v-show="isShowCircle"></span> <span v-html="menu.title"></span>
        <span v-if="isShowCircle || menu.submenus">&nbsp;</span>
        <i class="fas fa-angle-down" v-if="menu.submenus"></i>
      </div>
      <div class="submenu" v-if="menu.submenus && menu.isShow">
        <a v-for="(submenu, i) in menu.submenus" :key="i" :href="submenu.href" @click="menuClick(submenu)">
          <div class="content" v-text="submenu.title"></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { defineComponent } from 'vue';
import '@/assets/less/components/nav/BaseNav.less';
import Jump from '@/service/util/base/jump';
import { NavBase } from '@/service/model/components/nav';

export default defineComponent({
  name: 'BaseNav',
  props: {
    active: {
      type: Number,
      default: () => 0
    },
    isShowCircle: {
      type: Boolean,
      default: () => false
    },
    menus: {
      type: Array,
      default: () => ([] as Array<NavBase>)
    }
  },
  setup() {
    const router = useRouter();
    // 设置响应数据
    const menuClick = (menu: NavBase) => {
      menu.isShow = true;
      if (menu.click) {
        Jump.routerDefault(router, menu.click);
      } else if (menu.href) {
        window.open(menu.href);
      }
    };
    return {
      menuClick
    };
  }
});
</script>
