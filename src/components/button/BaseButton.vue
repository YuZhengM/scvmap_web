<template>
  <div :class="isBetween ? 'base_button_template div_flex_between' : 'base_button_template div_flex_start'">
    <el-button :class="isBetween ? '' : 'margin_left_right'" v-html="item.title" v-for="(item, i) in info" :key="i" @click="buttonClick(item.id, item)" :style="item.style"></el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import '@/assets/less/components/button/BaseButton.less';
import { ButtonBase } from '@/service/model/components/button';
import Json from '@/service/util/base/json';

export default defineComponent({
  name: 'BaseButton',
  props: {
    content: {
      type: Array,
      default: () => [] as Array<ButtonBase>
    },
    // 按钮类型 primary, success, info, warning, danger
    type: {
      type: String,
      default: () => 'primary'
    },
    buttonClick: {
      type: Function,
      default: () => ({})
    },
    isBetween: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const data = reactive({
      info: [] as Array<ButtonBase>
    });
    onMounted(() => {
      if (props.content) {
        props.content.forEach((item: any) => {
          let style = '';
          if (item.width) {
            style += `width: ${item.width}px;`;
          }
          if (item.color) {
            style += `color: ${item.color};`;
          }
          if (item.background_color) {
            style += `background-color: ${item.background_color};`;
          }
          Json.addItem(item, 'style', style);
          data.info.push(item);
        });
      }
    });
    return {
      ...toRefs(data)
    };
  }
});
</script>
