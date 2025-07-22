import { InputSelect } from '@/service/model/components/input';

// table 数据样式
export interface TableHead {
  // 列的名字
  column?: string;
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

export const TABLE_NUMBER_SYMBOL_SELECT: Array<InputSelect> = [
  {
    label: '=',
    value: 1,
    default: true
  },
  {
    label: '!=',
    value: 2
  },
  {
    label: '>',
    value: 3
  },
  {
    label: '>=',
    value: 4
  },
  {
    label: '<',
    value: 5
  },
  {
    label: '<=',
    value: 6
  }
];

export const TABLE_STRING_SYMBOL_SELECT: Array<InputSelect> = [
  {
    label: '=',
    value: 1,
    default: true
  },
  {
    label: '!=',
    value: 2
  },
  {
    label: 'contain',
    value: 7
  },
  {
    label: 'not-contain',
    value: 8
  },
  {
    label: 'starts with',
    value: 9
  },
  {
    label: 'ends with',
    value: 10
  }
];
