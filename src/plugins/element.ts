import { App } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const elementIcons = Object.entries(ElementPlusIconsVue);

export default function use(app: App): void {
  app.use(ElementPlus as any);

  // 注册图标组件
  elementIcons.forEach(([iconName, iconComponent]) => {
    app.component(iconName, iconComponent);
  });
}
