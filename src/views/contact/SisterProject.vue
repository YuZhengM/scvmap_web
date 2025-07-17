<template>
  <div id="sister_project">
    <BaseCard icon="fas fa-heart" title="Sister Projects">
      <div class="sister_content">
        <div v-for="(item, i) in sisterProjects" :key="i">
          <span class="head">
            <i class="fas fa-thumbs-up"></i>
            <a :href="item.url" v-text="item.title" target="_blank"></a>
          </span>
          <span class="info" v-text="item.content"></span>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import BaseCard from '@/components/card/BaseCard.vue';
import { SISTER_PROJECTS } from '@/assets/ts';
import '@/assets/less/views/Contact.less';

export default defineComponent({
  name: 'sisterProject',
  components: { BaseCard },
  setup() {
    const data = reactive({
      sisterProjects: SISTER_PROJECTS
    });
    return {
      ...toRefs(data)
    };
  }
});
</script>
