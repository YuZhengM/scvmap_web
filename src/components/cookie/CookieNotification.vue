<template>
  <div class="cookie_notification_template">
    <div v-if="!cookieAccepted" class="cookie_notification">
      <div>
        <h2>Your Privacy, Our Guarantee</h2>
      </div>
      <div class="info">We use necessary cookies to ensure that the website functions properly.</div>
      <div class="info">We will not intentionally, directly, or indirectly collect any of your personal information.</div>
      <div class="info">If you unintentionally disclose any personal information during the search process, we will not transmit it to any third party in any way.</div>
      <div class="info">In fact, we do not collect or store any of your personal information.</div>
      <div class="accept">
        <button class="button" @click="acceptCookie">Accept all cookies</button>
      </div>
      <div class="blessing">Wishing you a pleasant browsing experience!</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import '@/assets/less/components/cookie/CookieNotification.less';
import Cookies from 'js-cookie';

export default defineComponent({
  name: 'CookieNotification',
  props: {
    icon: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      default: () => 'Title 标题'
    }
  },
  setup() {
    const cookieAccepted = ref(false);

    // 检查是否已经接受过 Cookie
    onMounted(() => {
      cookieAccepted.value = Cookies.get('cookie_accepted') === 'true';
    });

    // 用户接受 Cookie
    const acceptCookie = () => {
      // 设置 Cookie，有效期为 7 天
      Cookies.set('cookie_accepted', 'true', { expires: 7 });
      cookieAccepted.value = true;
    };

    return {
      cookieAccepted,
      acceptCookie
    };
  }
});
</script>
