<template>
  <div id="footer">
    <div class="content">
      Copyright 2025 © USC <img class="PB" src="@/assets/img/common/PB.png" alt="PB.log"/> 黑ICP备16009434号-1 Li C Lab
    </div>
    <div class="link">
          <span v-for="(link, i) in links" :key="i">
            <a target="_blank" :href="link.href" @click="menuClick(link)" v-html="link.title"></a>
            <VerticalDivider v-if="i !== links.length - 1"/>
          </span>
    </div>
    <CookieNotification />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/less/common/Footer.less';
import { HEADER_MENUS } from '@/assets/ts';
import VerticalDivider from '@/components/divider/VerticalDivider.vue';
import Jump from '@/service/util/base/jump';
import CookieNotification from '@/components/cookie/CookieNotification.vue';

export default defineComponent({
  name: 'Footer',
  components: { CookieNotification, VerticalDivider },
  setup() {
    // Get the router instance
    const router = useRouter();
    const data = reactive({
      links: HEADER_MENUS
    });
    // Set the response data
    const menuClick = (menu: any) => {
      menu.isShow = true;
      Jump.routerDefault(router, menu.click);
    };
    return {
      ...toRefs(data),
      menuClick
    };
  }
});
</script>
