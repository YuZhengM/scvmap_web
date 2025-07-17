<template>
  <div class="base_input_template">
    <span class="title" v-if="title">
      {{ title }}
      <BaseTooltip placement="top" v-if="description" :content="description">
        <i class="fas fa-question-circle"></i>
      </BaseTooltip>
    </span>
    <el-input v-model="input" :type="type" :min="min" :rows="rows" :placeholder="placeholder" clearable
              :style="(isLine ? 'display: inline-block;width: ' : 'display: block;width: ') + (width ? width + 'px;' : '100%;')"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/components/input/BaseInput.less';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';

export default defineComponent({
  name: 'BaseInput',
  components: { BaseTooltip },
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    placeholder: {
      type: String,
      default: () => 'Please input'
    },
    /**
     * textarea, text
     */
    type: {
      type: String,
      default: () => 'text'
    },
    description: {
      type: String,
      default: () => undefined
    },
    rows: {
      type: Number,
      default: () => 1
    },
    min: {
      type: Number,
      default: () => undefined
    },
    isLine: {
      type: Boolean,
      default: () => false
    },
    width: {
      type: Number,
      default: () => undefined
    }
  },
  setup() {
    const data = reactive({
      input: ''
    });
    return {
      ...toRefs(data)
    };
  }
});
</script>
