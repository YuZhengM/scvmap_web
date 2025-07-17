// 分析页折叠信息
import { ButtonBase } from '@/service/model/components/button';
import { InputSelect } from '@/service/model/components/input';
import { toolboxSimple } from '@/service/util/echarts';

export const ANALYSIS_COLLAPSE_DATA = [
  { name: 'multiTrait', icon: 'fas fa-magnifying-glass-chart', title: 'Analyzing variant-to-function mapping' },
  { name: 'gene', icon: 'fas fa-magnifying-glass-chart', title: 'Analyzing variant-to-function mapping with genes' },
  { name: 'tf', icon: 'fas fa-magnifying-glass-chart', title: 'Analyzing variant-to-function mapping with TFs' }
];

export const ANALYSIS_BUTTON_CONTENT: Array<ButtonBase> = [
  {
    id: 'start',
    title: 'Start analysis'
  },
  {
    id: 'reset',
    title: 'Reset'
  },
  {
    id: 'example',
    title: 'For example'
  }
];

export const MAGMA_GENE_P_VALUE_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: 'P value ≤ 0.05', value: 0.05 },
  { label: 'P value ≤ 1.0E-2', value: 1.0E-2 },
  { label: 'P value ≤ 1.0E-3', value: 1.0E-3 },
  { label: 'P value ≤ 1.0E-4', value: 1.0E-4 },
  { label: 'P value ≤ 1.0E-5', value: 1.0E-5 },
  { label: 'P value ≤ 1.0E-6', value: 1.0E-6 },
  { label: 'P value ≤ 1.0E-7', value: 1.0E-7 },
  { label: 'P value ≤ 1.0E-8', value: 1.0E-8 },
  { label: 'P value ≤ 1.0E-9', value: 1.0E-9 },
  { label: 'P value ≤ 1.0E-10', value: 1.0E-10 },
  { label: 'P value ≤ 1.0E-20', value: 1.0E-20 },
  { label: 'P value ≤ 1.0E-30', value: 1.0E-30 },
  { label: 'P value ≤ 1.0E-40', value: 1.0E-40 },
  { label: 'P value ≤ 1.0E-50', value: 1.0E-50 },
  { label: 'P value ≤ 1.0E-60', value: 1.0E-60 },
  { label: 'P value ≤ 1.0E-70', value: 1.0E-70 },
  { label: 'P value ≤ 1.0E-80', value: 1.0E-80 },
  { label: 'P value ≤ 1.0E-90', value: 1.0E-90 },
  { label: 'P value ≤ 1.0E-100', value: 1.0E-100 },
  { label: 'P value ≤ 1.0E-125', value: 1.0E-125 },
  { label: 'P value ≤ 1.0E-150', value: 1.0E-150 },
  { label: 'P value ≤ 1.0E-175', value: 1.0E-175 },
  { label: 'P value ≤ 1.0E-200', value: 1.0E-200 },
  { label: 'P value ≤ 1.0E-225', value: 1.0E-225 },
  { label: 'P value ≤ 1.0E-250', value: 1.0E-250 },
  { label: 'P value ≤ 1.0E-275', value: 1.0E-275 },
  { label: 'P value ≤ 1.0E-300', value: 1.0E-300 }
];

export const DIFFERENCE_GENE_P_VALUE_DATA: Array<InputSelect> = MAGMA_GENE_P_VALUE_DATA;

export const DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: 'Adjusted p value ≤ 0.05', value: 0.05 },
  { label: 'Adjusted p value ≤ 1.0E-2', value: 1.0E-2 },
  { label: 'Adjusted p value ≤ 1.0E-3', value: 1.0E-3 },
  { label: 'Adjusted p value ≤ 1.0E-5', value: 1.0E-5 },
  { label: 'Adjusted p value ≤ 1.0E-10', value: 1.0E-10 },
  { label: 'Adjusted p value ≤ 1.0E-20', value: 1.0E-20 },
  { label: 'Adjusted p value ≤ 1.0E-30', value: 1.0E-30 },
  { label: 'Adjusted p value ≤ 1.0E-40', value: 1.0E-40 },
  { label: 'Adjusted p value ≤ 1.0E-50', value: 1.0E-50 },
  { label: 'Adjusted p value ≤ 1.0E-60', value: 1.0E-60 },
  { label: 'Adjusted p value ≤ 1.0E-70', value: 1.0E-70 },
  { label: 'Adjusted p value ≤ 1.0E-80', value: 1.0E-80 },
  { label: 'Adjusted p value ≤ 1.0E-90', value: 1.0E-90 },
  { label: 'Adjusted p value ≤ 1.0E-100', value: 1.0E-100 },
  { label: 'Adjusted p value ≤ 1.0E-125', value: 1.0E-125 },
  { label: 'Adjusted p value ≤ 1.0E-150', value: 1.0E-150 },
  { label: 'Adjusted p value ≤ 1.0E-175', value: 1.0E-175 },
  { label: 'Adjusted p value ≤ 1.0E-200', value: 1.0E-200 },
  { label: 'Adjusted p value ≤ 1.0E-225', value: 1.0E-225 },
  { label: 'Adjusted p value ≤ 1.0E-250', value: 1.0E-250 },
  { label: 'Adjusted p value ≤ 1.0E-275', value: 1.0E-275 },
  { label: 'Adjusted p value ≤ 1.0E-300', value: 1.0E-300 }
];

export const DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA: Array<InputSelect> = DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA;

export const DIFFERENCE_TF_P_VALUE_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: 'P value ≤ 0.05', value: 0.05 },
  { label: 'P value ≤ 1.0E-2', value: 1.0E-2 },
  { label: 'P value ≤ 1.0E-3', value: 1.0E-3 },
  { label: 'P value ≤ 1.0E-4', value: 1.0E-4 },
  { label: 'P value ≤ 1.0E-5', value: 1.0E-5 },
  { label: 'P value ≤ 1.0E-6', value: 1.0E-6 },
  { label: 'P value ≤ 1.0E-7', value: 1.0E-7 },
  { label: 'P value ≤ 1.0E-8', value: 1.0E-8 },
  { label: 'P value ≤ 1.0E-9', value: 1.0E-9 },
  { label: 'P value ≤ 1.0E-10', value: 1.0E-10 },
  { label: 'P value ≤ 1.0E-20', value: 1.0E-20 },
  { label: 'P value ≤ 1.0E-30', value: 1.0E-30 },
  { label: 'P value ≤ 1.0E-40', value: 1.0E-40 },
  { label: 'P value ≤ 1.0E-50', value: 1.0E-50 },
  { label: 'P value ≤ 1.0E-60', value: 1.0E-60 },
  { label: 'P value ≤ 1.0E-70', value: 1.0E-70 },
  { label: 'P value ≤ 1.0E-80', value: 1.0E-80 },
  { label: 'P value ≤ 1.0E-90', value: 1.0E-90 }
];

export const HOMER_TF_P_VALUE_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: 'P value ≤ 0.1', value: 0.1 },
  { label: 'P value ≤ 0.05', value: 0.05 },
  { label: 'P value ≤ 1.0E-2', value: 1.0E-2 },
  { label: 'P value ≤ 1.0E-3', value: 1.0E-3 },
  { label: 'P value ≤ 1.0E-4', value: 1.0E-4 },
  { label: 'P value ≤ 1.0E-5', value: 1.0E-5 },
  { label: 'P value ≤ 1.0E-6', value: 1.0E-6 },
  { label: 'P value ≤ 1.0E-7', value: 1.0E-7 },
  { label: 'P value ≤ 1.0E-8', value: 1.0E-8 },
  { label: 'P value ≤ 1.0E-9', value: 1.0E-9 },
  { label: 'P value ≤ 1.0E-10', value: 1.0E-10 }
];

export const HOMER_TF_Q_VALUE_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: 'Q value ≤ 0.1', value: 0.1 },
  { label: 'Q value ≤ 0.05', value: 0.05 },
  { label: 'Q value ≤ 1.0E-2', value: 1.0E-2 },
  { label: 'Q value ≤ 1.0E-3', value: 1.0E-3 },
  { label: 'Q value ≤ 1.0E-4', value: 1.0E-4 },
  { label: 'Q value ≤ 1.0E-5', value: 1.0E-5 },
  { label: 'Q value ≤ 1.0E-6', value: 1.0E-6 },
  { label: 'Q value ≤ 1.0E-7', value: 1.0E-7 },
  { label: 'Q value ≤ 1.0E-8', value: 1.0E-8 },
  { label: 'Q value ≤ 1.0E-9', value: 1.0E-9 },
  { label: 'Q value ≤ 1.0E-10', value: 1.0E-10 }
];

export const ANALYSIS_GENE_ENRICHMENT_P_VALUE_SELECT_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: 'P value ≤ 0.1', value: 0.1 },
  { label: 'P value ≤ 0.05', value: 0.05 },
  { label: 'P value ≤ 1.0E-2', value: 1.0E-2 },
  { label: 'P value ≤ 1.0E-3', value: 1.0E-3 },
  { label: 'P value ≤ 1.0E-4', value: 1.0E-4 },
  { label: 'P value ≤ 1.0E-5', value: 1.0E-5 },
  { label: 'P value ≤ 1.0E-6', value: 1.0E-6 },
  { label: 'P value ≤ 1.0E-7', value: 1.0E-7 },
  { label: 'P value ≤ 1.0E-8', value: 1.0E-8 },
  { label: 'P value ≤ 1.0E-9', value: 1.0E-9 },
  { label: 'P value ≤ 1.0E-10', value: 1.0E-10 }
];

export const ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA: Array<InputSelect> = [
  { label: 'All', value: 0 },
  { label: '|Log2(Fold change)| ≥ 0.5', value: 0.5 },
  { label: '|Log2(Fold change)| ≥ 0.6', value: 0.6 },
  { label: '|Log2(Fold change)| ≥ 0.7', value: 0.7 },
  { label: '|Log2(Fold change)| ≥ 1', value: 1 },
  { label: '|Log2(Fold change)| ≥ 1.5', value: 1.5 },
  { label: '|Log2(Fold change)| ≥ 2', value: 2 },
  { label: '|Log2(Fold change)| ≥ 3', value: 3 },
  { label: '|Log2(Fold change)| ≥ 4', value: 4 },
  { label: '|Log2(Fold change)| ≥ 5', value: 5 },
  { label: '|Log2(Fold change)| ≥ 6', value: 6 },
  { label: '|Log2(Fold change)| ≥ 7', value: 7 },
  { label: '|Log2(Fold change)| ≥ 8', value: 8 },
  { label: '|Log2(Fold change)| ≥ 9', value: 9 },
  { label: '|Log2(Fold change)| ≥ 10', value: 10 }
];

export const ANALYSIS_GENE_SET_SELECT_DATA: Array<InputSelect> = [
  { label: 'GO (Biological process)', value: 'GO_Biological_Process_2023' },
  { label: 'GO (Cellular component)', value: 'GO_Cellular_Component_2023' },
  { label: 'GO (Molecular function)', value: 'GO_Molecular_Function_2023' },
  { label: 'KEGG', value: 'KEGG_2016' },
  { label: 'GWAS (Catalog)', value: 'GWAS_Catalog_2023' }
];

export const geneEnrichmentOption = (data: any) => ({
  title: {
    text: ''
  },
  toolbox: toolboxSimple(),
  color: ['#0f51b5'],
  grid: {
    left: 100,
    right: 150,
    top: '15%',
    bottom: '15%'
  },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,0.7)'
  },
  xAxis: {
    type: 'value',
    name: 'Combined score',
    nameGap: 25,
    position: 'bottom',
    nameLocation: 'middle',
    nameTextStyle: {
      fontSize: 20
    },
    splitLine: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    axisLabel: {
      show: true,
      interval: 'auto',
      formatter: (params: any) => (params.length > 10 ? `${params.substring(0, 10)}...` : params)
    },
    name: '',
    nameLocation: 'end',
    nameGap: 25,
    nameTextStyle: {
      fontSize: 20
    },
    splitLine: {
      show: false
    }
  },
  visualMap: [
    {
      left: 'right',
      top: '15%',
      dimension: 3,
      min: data.countMin,
      max: data.countMax,
      itemWidth: 30,
      itemHeight: 120,
      calculable: true,
      precision: 0.1,
      text: ['Odds ratio'],
      textGap: 15,
      inRange: {
        symbolSize: [10, 70]
      },
      outOfRange: {
        symbolSize: [10, 70],
        color: ['rgba(255,255,255,0.4)']
      },
      controller: {
        inRange: {
          color: ['#b73721']
        },
        outOfRange: {
          color: ['#999']
        }
      }
    },
    {
      left: 'right',
      bottom: '15%',
      dimension: 2,
      min: data.pValueMin,
      max: data.pValueMax,
      itemHeight: 120,
      text: ['-log(P value)'],
      textGap: 15,
      calculable: true,
      precision: 0.1,
      inRange: {
        colorLightness: [0.9, 0.5]
      },
      outOfRange: {
        color: ['rgba(255,255,255,0.4)']
      },
      controller: {
        inRange: {
          color: ['#0f51b5']
        },
        outOfRange: {
          color: ['#999']
        }
      }
    }
  ],
  series: [
    {
      type: 'scatter',
      itemStyle: {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.3)'
      },
      data: data.data
    }
  ]
});
