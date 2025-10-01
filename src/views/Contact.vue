<template>
  <div id="contact">
    <div class="content">
      <h2 class="title">
        Contact
      </h2>
      <el-divider></el-divider>
      <LeftRight :leftWidth="55">
        <template #left>
          <div v-for="(contact, i) in contacts" :key="i">
            <strong v-text="contact.title"></strong>
            {{ contact.content }}
          </div>
          <el-divider></el-divider>
          <span>
            We welcome researchers from all over the world to provide valuable advice for <strong>scVMAP</strong>,
            and make <strong>scVMAP</strong> more and more perfect.
          </span>
          <el-divider></el-divider>
          <div v-for="(item, i) in selfLinks" :key="i">
            <strong v-text="item.title"></strong>
            <a target="_blank" :href="item.link"> {{ item.link }} </a>
          </div>
        </template>
        <template #right>
          <BaseImage :url="img"/>
        </template>
      </LeftRight>
      <BaseBr />
      <SisterProject/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import { CONTACT_SELF_LINK, CONTACTS } from '@/assets/ts';
import '@/assets/less/views/Contact.less';
import BaseImage from '@/components/image/BaseImage.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import SisterProject from '@/views/contact/SisterProject.vue';

const img = require('@/assets/img/contact/contact_map.png');

export default defineComponent({
  name: 'Contact',
  components: { SisterProject, BaseBr, BaseImage, LeftRight },
  setup() {
    // Set up reactive data
    const data = reactive({
      contacts: CONTACTS,
      selfLinks: CONTACT_SELF_LINK
    });
    return {
      ...toRefs(data),
      img
    };
  }
});
</script>
