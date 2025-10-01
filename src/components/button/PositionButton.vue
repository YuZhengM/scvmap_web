<template>
  <div class="position_button_template">
    <el-affix :offset="offset">
      <BaseButton :content="infoContent" :button-click="buttonClick"/>
    </el-affix>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
import '@/assets/less/components/button/PositionButton.less';
import { ButtonBase } from '@/service/model/components/button';
import BaseButton from '@/components/button/BaseButton.vue';

export default defineComponent({
  name: 'PositionButton',
  components: { BaseButton },
  props: {
    buttonContent: {
      type: Array,
      default: () => [] as Array<ButtonBase>
    },
    offset: {
      type: Number,
      default: () => 50
    },
    top: {
      type: Number,
      default: () => 170
    }
  },
  setup(props) {
    const data = reactive({
      infoContent: [] as Array<ButtonBase>,
      topValue: props.top
    });

    const buttonClick = (id: string) => {
      // eslint-disable-next-line no-unused-expressions
      const element = document.getElementById(id);
      if (element) {
        const elementPosition = element.offsetTop;
        const targetPosition = elementPosition - data.topValue;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    };

    watch(() => props.buttonContent, (newValue: any) => {
      data.infoContent = newValue;
    }, {
      immediate: true,
      deep: true
    });

    watch(() => props.top, (newValue: any) => {
      data.topValue = newValue;
    }, {
      immediate: true,
      deep: true
    });

    return {
      ...toRefs(data),
      buttonClick
    };
  }
});
</script>
