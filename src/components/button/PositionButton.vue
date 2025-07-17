<template>
  <div class="position_button_template">
    <el-affix :offset="offset">
      <BaseButton :content="buttonContent" :button-click="buttonClick"/>
    </el-affix>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
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
      info: [] as Array<ButtonBase>
    });

    const buttonClick = (id: string) => {
      // eslint-disable-next-line no-unused-expressions
      const element = document.getElementById(id);
      if (element) {
        const elementPosition = element.offsetTop;
        const targetPosition = elementPosition - props.top;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    };

    return {
      ...toRefs(data),
      buttonClick
    };
  }
});
</script>
