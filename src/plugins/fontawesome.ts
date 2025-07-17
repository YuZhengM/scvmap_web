import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { App } from 'vue';
import '@fortawesome/fontawesome-free';

library.add(fas, fab);

export default function use(app: App): void {
  app.component('font-awesome-icon', FontAwesomeIcon);
}
