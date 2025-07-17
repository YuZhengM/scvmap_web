import { App } from 'vue';

// 导入自定义 ts
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Json from '@/service/util/base/json';
import File from '@/service/util/base/file';
import StorageUtil from '@/service/util/base/storage';
import Message from '@/service/util/base/message';
import Time from '@/service/util/base/time';
import NumberUtil from '@/service/util/base/number';
import StringUtil from '@/service/util/base/string';

// 设置全局引用
export default function properties(app: App): void {
  app.config.globalProperties.$base = Base;
  app.config.globalProperties.$jump = Jump;
  app.config.globalProperties.$json = Json;
  app.config.globalProperties.$time = Time;
  app.config.globalProperties.$file = File;
  app.config.globalProperties.$storage = StorageUtil;
  app.config.globalProperties.$message = Message;
  app.config.globalProperties.$number = NumberUtil;
  app.config.globalProperties.$string = StringUtil;
}
