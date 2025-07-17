<template>
  <div class="base_radio_template">
    <el-radio-group v-model="radio" :style="isLine ? 'flex-direction: row; align-items: center;' : 'flex-direction: column; align-items: flex-start;'">
      <div v-for="(radio, i) in radioData" :key="i" class="radio">
        <el-radio :label="radio.label" size="large">{{ radio.title }}</el-radio>
      </div>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { RadioBase } from '@/service/model/components/radio';
import '@/assets/less/components/radio/BaseRadio.less';

export default defineComponent({
  name: 'BaseRadio',
  props: {
    radioData: {
      type: Array,
      default: () => [] as Array<RadioBase>
    },
    eventChange: {
      type: Function,
      default: () => ({})
    },
    isLine: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const data = reactive({
      radio: ''
    });
    const change = (value: string) => {
      props.eventChange(value);
    };
    return {
      ...toRefs(data),
      change
    };
  }
});
</script>
