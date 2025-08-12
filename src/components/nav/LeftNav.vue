<template>
  <div class="left_nav_template" ref="leftNav">
    <el-radio-group v-if="isShowButton" class="collapse">
      <el-radio-button @click="isCollapse=false">expand</el-radio-button>
      <el-radio-button @click="isCollapse=true">collapse</el-radio-button>
    </el-radio-group>
    <el-menu :default-active="active" class="el-menu-vertical-demo" :collapse="isCollapse">
      <div v-for="(menu, i) in menus" :key="i">
        <!-- Check if there is a next level -->
        <el-menu-item :index="menu.index" v-if="!menu.submenus" v-text="menu.title" @click="menuClick(menu)"/>
        <el-sub-menu :index="menu.index" v-if="menu.submenus">
          <template #title>
            <span v-text="menu.title"></span>
          </template>
          <!-- Check if there is a next level -->
          <div v-for="(submenu, j) in menu.submenus" :key="j">
            <!-- No third level, the following is the second level -->
            <el-menu-item-group v-if="!submenu.submenus">
              <template #title>
                <span v-text="submenu.title" v-if="submenu.title"></span>
              </template>
              <div v-for="(name, m) in submenu.names" :key="m">
                <el-menu-item :index="name.index" v-text="name.title" @click="menuClick(menu)"/>
              </div>
            </el-menu-item-group>
            <!-- There is a third level -->
            <el-sub-menu :index="submenu.index" v-if="submenu.submenus">
              <template #title>
                <span v-text="submenu.title"></span>
              </template>
              <el-menu-item-group v-for="(third, z) in submenu.submenus" :key="z">
                <template #title>
                  <span v-text="third.title" v-if="third.title"></span>
                </template>
                <el-menu-item :index="name.index" v-for="(name, n) in third.names" :key="n" v-text="name.title" @click="menuClick(submenu)"/>
              </el-menu-item-group>
            </el-sub-menu>
          </div>
        </el-sub-menu>
      </div>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import '@/assets/less/components/nav/LeftNav.less';
import { NavLeft } from '@/service/model/components/nav';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LeftNav',
  props: {
    active: {
      type: String,
      default: () => '1'
    },
    isShowButton: {
      type: Boolean,
      default: () => false
    },
    menus: {
      type: Array,
      default: () => ([]) as Array<NavLeft>
    },
    // Specify the maximum height of the slider
    maxHeight: {
      type: Number,
      default: () => undefined
    }
  },
  components: {},
  setup(props) {
    const router = useRouter();
    const leftNav = ref();
    const data = reactive({
      isCollapse: false
    });
    const menuClick = (menu: NavLeft) => {
      if (menu.link) {
        Jump.routerDefault(router, menu.link);
      }
      // This code is incomplete
      if (props.maxHeight) {
        leftNav.value.style.maxHeight = props.maxHeight;
      }
    };
    return {
      ...toRefs(data),
      menuClick,
      leftNav
    };
  }
});
</script>
