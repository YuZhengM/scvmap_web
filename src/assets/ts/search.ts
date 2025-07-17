// search 页折叠信息
import { InputSelect } from '@/service/model/components/input';
import { ButtonBase } from '@/service/model/components/button';
import { echartsTitle, toolboxSimple } from '@/service/util/echarts';

export const SEARCH_COLLAPSE_DATA = [
  { name: 'trait', icon: 'fas fa-search', title: 'Search information by category or source cohort' },
  { name: 'sample', icon: 'fas fa-search', title: 'Search information by tissue type or cell type' },
  { name: 'gene', icon: 'fas fa-search', title: 'Search information by gene' },
  { name: 'tf', icon: 'fas fa-search', title: 'Search information by TF' },
  { name: 'variant', icon: 'fas fa-search', title: 'Search information by SNP' }
];

export const SEARCH_BUTTON: Array<ButtonBase> = [
  {
    id: 'start',
    title: 'Start search'
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

export const SEARCH_SELECT_DATA: Array<InputSelect> = [
  {
    label: 'Proximal',
    value: 'proximal_gene',
    description: 'Proximal gene'
  },
  {
    label: 'Closest',
    value: 'closest_gene',
    description: 'Closest gene'
  },
  {
    label: 'Overlap',
    value: 'overlap_gene',
    description: 'Overlap gene'
  }
];

export const SEARCH_CHROMOSOME_DATA: Array<InputSelect> = [
  { label: 'All Chr', value: 'All', description: 'All' },
  { label: 'Chr 1', value: 'chr1', description: 'chr1' },
  { label: 'Chr 2', value: 'chr2', description: 'chr2' },
  { label: 'Chr 3', value: 'chr3', description: 'chr3' },
  { label: 'Chr 4', value: 'chr4', description: 'chr4' },
  { label: 'Chr 5', value: 'chr5', description: 'chr5' },
  { label: 'Chr 6', value: 'chr6', description: 'chr6' },
  { label: 'Chr 7', value: 'chr7', description: 'chr7' },
  { label: 'Chr 8', value: 'chr8', description: 'chr8' },
  { label: 'Chr 9', value: 'chr9', description: 'chr9' },
  { label: 'Chr 10', value: 'chr10', description: 'hr10' },
  { label: 'Chr 11', value: 'chr11', description: 'hr11' },
  { label: 'Chr 12', value: 'chr12', description: 'hr12' },
  { label: 'Chr 13', value: 'chr13', description: 'hr13' },
  { label: 'Chr 14', value: 'chr14', description: 'hr14' },
  { label: 'Chr 15', value: 'chr15', description: 'hr15' },
  { label: 'Chr 16', value: 'chr16', description: 'hr16' },
  { label: 'Chr 17', value: 'chr17', description: 'hr17' },
  { label: 'Chr 18', value: 'chr18', description: 'hr18' },
  { label: 'Chr 19', value: 'chr19', description: 'hr19' },
  { label: 'Chr 20', value: 'chr20', description: 'hr20' },
  { label: 'Chr 21', value: 'chr21', description: 'hr21' },
  { label: 'Chr 22', value: 'chr22', description: 'hr22' },
  { label: 'Chr X', value: 'chrX', description: 'chrX' },
  { label: 'Chr Y', value: 'chrY', description: 'chrY' },
  { label: 'Chr MT', value: 'chrM', description: 'chrM' }
];

export const traitCountOption = (legend: string[], data: any[]) => ({
  title: echartsTitle('Statistics on the number of traits in each cohort'),
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    padding: [60, 5, 5, 5],
    left: 'left',
    type: 'scroll',
    data: legend
  },
  series: [
    {
      name: 'Number',
      type: 'pie',
      radius: '45%',
      center: ['50%', '50%'],
      data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

export const pieCountOption = (data: any[], text: string) => ({
  title: echartsTitle('Category Distribution'),
  tooltip: {
    trigger: 'item'
  },
  toolbox: toolboxSimple(),
  legend: {
    type: 'scroll',
    top: '10%',
    left: 'center'
  },
  graphic: {
    type: 'text',
    left: 'center',
    top: 'center',
    style: {
      text,
      textAlign: 'center',
      fill: '#786e6e',
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 50
    }
  },
  series: [
    {
      name: text,
      type: 'pie',
      radius: ['45%', '65%'],
      avoidLabelOverlap: false,
      padAngle: 0.1,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 0.5
      },
      label: {
        show: false,
        position: 'center'
      },
      // emphasis: {
      //   label: {
      //     show: true,
      //     fontSize: 40,
      //     fontWeight: 'bold'
      //   }
      // },
      labelLine: {
        show: true
      },
      data
    }
  ]
});
