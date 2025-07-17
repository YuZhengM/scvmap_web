<template>
  <div class="base_switch_button_template">
    <span class="left_text"> {{ left_text }} &nbsp; </span>
    <span class="middle_button">
        <label class="switch" ref="switchLabel">
          <input type="checkbox" @click="buttonClick" ref="checkboxInput"/>
          <span class="slider"></span>
        </label>
      </span>
    <span class="right_text"> &nbsp; {{ right_text }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/components/button/SwitchButton.less';
import { ButtonBase } from '@/service/model/components/button';

export default defineComponent({
  name: 'SwitchButton',
  props: {
    left_text: {
      type: String,
      default: () => 'Display'
    },
    right_text: {
      type: String,
      default: () => 'Visualization'
    },
    leftEvent: {
      type: Function,
      default: () => ({})
    },
    rightEvent: {
      type: Function,
      default: () => ({})
    }
  },
  setup(props) {
    const switchLabel = ref();
    const checkboxInput = ref();
    const data = reactive({
      info: [] as Array<ButtonBase>
    });

    const buttonClick = (event: MouseEvent) => {
      event.stopPropagation();
      if (checkboxInput.value.checked) {
        props.rightEvent();
      } else {
        props.leftEvent();
      }
    };

    onMounted(() => {
      checkboxInput.value.checked = true;
    });

    return {
      switchLabel,
      checkboxInput,
      buttonClick,
      ...toRefs(data)
    };
  }
});
</script>
