<template>
  <div class="url_template" ref="content"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'Url',
  props: {
    url: {
      type: String,
      required: true,
      default: () => ''
    },
    width: {
      type: String,
      default: () => '100%'
    },
    height: {
      type: String,
      default: () => '100%'
    }
  },
  setup(props) {
    const content = ref();
    const resetUrl = (url: string) => {
      if (content.value) {
        content.value.innerHTML = '';
        const frame = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" width="${props.width}" height="${props.height}" src="${url}"></iframe>`;
        const newNode = document.createElement('div');
        newNode.innerHTML = frame;
        newNode.style.height = props.height.endsWith('%') ? newNode.style.height : `${newNode.style.height}px`;
        content.value.insertBefore(newNode, content.value.firstChild);
      }
    };
    onMounted(() => {
      resetUrl(props.url);
    });
    // 监控
    watch(() => props.url, (newValue) => {
      // 更新 URL
      resetUrl(newValue);
    }, {
      immediate: true,
      deep: true
    });
    return {
      content,
      resetUrl
    };
  }
});
</script>
