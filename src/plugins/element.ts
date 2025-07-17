import { App } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const elementIcon: any = Object.entries(ElementPlusIconsVue);

export default function use(app: App): void {
  app.use(ElementPlus);
  elementIcon.forEach((item: any) => {
    app.component(item.key, item.component);
  });
}
