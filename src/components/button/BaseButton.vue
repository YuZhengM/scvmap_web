<template>
  <div :class="isBetween ? 'base_button_template div_flex_between' : 'base_button_template div_flex_start'">
    <el-button :class="isBetween ? '' : 'margin_left_right'" v-html="item.title" v-for="(item, i) in info" :key="i" @click="buttonClick(item.id, item)" :style="item.style"></el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
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
    // Button type: primary, success, info, warning, danger
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
      infoContent: [] as Array<ButtonBase>,
      info: [] as Array<ButtonBase>
    });

    const setContent = () => {
      if (data.infoContent) {
        data.info = [];
        data.infoContent.forEach((item: any) => {
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
    };

    onMounted(() => {
      data.infoContent = props.content as Array<ButtonBase>;
      setContent();
    });

    watch(() => props.content, (newValue: any) => {
      data.infoContent = newValue;
      setContent();
    }, {
      immediate: true,
      deep: true
    });

    return {
      ...toRefs(data)
    };
  }
});
</script>
