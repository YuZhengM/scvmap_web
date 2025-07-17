// table 数据样式
export interface TableHead {
  // 列的名字
  column: string;
  // 页面显示的内容
  title: string;
  // 该列链接
  href?: Function;
  // 该列的宽度
  width?: number;
  // 该列的提示内容
  content?: string;
  // 后端分页排序的时候数据库中的字段
  database?: string;
  // 自定义显示内容信息
  information?: Function;
  // 数据库中的字段类型
  type?: number;
}
