import { InputSelect } from '@/service/model/components/input';

// table data style
export interface TableHead {
  // The name of the column
  column?: string;
  // The content displayed on the page
  title: string;
  // The link of the column
  href?: Function;
  // The width of the column
  width?: number;
  // The tooltip content of the column
  content?: string;
  // The database field used for pagination and sorting
  database?: string;
  // Custom display content information
  information?: Function;
  // The data type of the database field
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
