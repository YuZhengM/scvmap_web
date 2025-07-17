import { InputSelect } from '@/service/model/components/input';

// sample search - select data - title
export const HOME_TITLE_DATA: Array<InputSelect> = [
  {
    label: 'Trait or disease',
    value: 'trait',
    default: true
  },
  {
    label: 'Single cell sample',
    value: 'sample'
  },
  {
    label: 'Gene',
    value: 'gene'
  },
  {
    label: 'TF',
    value: 'tf'
  },
  {
    label: 'Variant',
    value: 'variant'
  }
];

export const HOME_EXAMPLE_DATA: Array<InputSelect> = [
  {
    label: 'Trait',
    value: 'trait_id_894',
    id: 'trait_id_894'
  },
  {
    label: 'Trait',
    value: 'Alzheimer\'s disease',
    id: 'Alzheimer\'s disease'
  },
  {
    label: 'Sample',
    value: 'sample_id_1',
    id: 'sample_id_1'
  },
  {
    label: 'Sample',
    value: 'PBMC',
    id: 'PBMC'
  },
  {
    label: 'Gene',
    value: 'RCC2',
    id: 'RCC2'
  },
  {
    label: 'TF',
    value: 'HIF1A',
    id: 'HIF1A'
  },
  {
    label: 'Variant',
    value: 'rs57142672',
    id: 'rs57142672'
  }
];
