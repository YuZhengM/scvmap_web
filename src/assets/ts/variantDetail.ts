import { linkTraitDetail } from '@/assets/ts/statusUtil';
import { TableHead } from '@/service/model/components/table';
import { toolboxSimple } from '@/service/util/echarts';

export const VARIANT_DETAIL_TRAIT_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', database: 'f_trait_id', type: 1, width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'traitAbbr', title: 'Trait abbreviation', database: 'f_trait_abbr', type: 1, width: 250 },
  { column: 'trait', title: 'Trait description', database: 'f_trait', type: 1, width: 300 },
  { column: 'type', title: 'Type', database: 'f_type', type: 1, width: 120 },
  { column: 'icd10', title: 'ICD-10', database: 'f_icd10', type: 1, width: 120 },
  { column: 'category', title: 'Category', database: 'f_category', type: 1, width: 300 },
  { column: 'subcategory', title: 'Subcategory', database: 'f_subcategory', type: 1, width: 300 },
  { column: 'sourceId', title: 'Source ID', type: 1, width: 120 },
  { column: 'sourceName', title: 'Source cohort', database: 'f_source_name', type: 1, width: 120 },
  { column: 'sourceGenome', title: 'Source genome', database: 'f_source_genome', type: 1, width: 120, content: 'Reference genome information of this trait or disease in the original data.' },
  { column: 'variantCount', title: 'VC', database: 'f_variant_count', type: 2, width: 120, content: 'The number of variants in this trait or disease.' },
  { column: 'variantPpSum', title: 'PP sum', database: 'f_variant_pp_sum', type: 2, width: 120, content: 'Sum the posterior probability values of variants in this trait or disease.' },
  { column: 'hg19Count', title: 'hg19 VC', database: 'f_hg19_count', type: 2, width: 120, content: 'The number of variants in this trait or disease in the HG19 reference genome.' },
  {
    column: 'hg19PpSum',
    title: 'hg19 PP sum',
    database: 'f_hg19_pp_sum',
    type: 2,
    width: 120,
    content: 'Sum the posterior probability values of variants in this trait or disease in the HG19 reference genome.'
  },
  { column: 'hg38Count', title: 'hg38 VC', database: 'f_hg38_count', type: 2, width: 120, content: 'The number of variants in this trait or disease in the HG38 reference genome.' },
  {
    column: 'hg38PpSum',
    title: 'hg38 PP sum',
    database: 'f_hg38_pp_sum',
    type: 2,
    width: 120,
    content: 'Sum the posterior probability values of variants in this trait or disease in the HG38 reference genome.'
  }
];

export const variantGraphOption: any = (data: any) => ({
  title: {
    top: 'bottom',
    left: 'right'
  },
  toolbox: toolboxSimple(),
  tooltip: {},
  legend: [
    {
      // selectedMode: 'single',
      data: data.categories.map((a: any) => a.name)
    }
  ],
  grid: {
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    containLabel: true
  },
  series: [
    {
      name: '',
      type: 'graph',
      layout: 'none',
      data: data.nodes,
      links: data.links,
      categories: data.categories,
      roam: true,
      emphasis: {
        focus: 'adjacency',
        label: {
          position: 'right',
          show: true,
          formatter: (name: any) => name.name
        }
      },
      label: {
        show: false,
        formatter: (name: any) => name.name
      },
      force: {
        edgeLength: 50,
        repulsion: 100,
        gravity: 0.8
      },
      draggable: true
    }
  ]
});

export const variantGraphCircularOption: any = (data: any) => ({
  title: {
    top: 'bottom',
    left: 'right'
  },
  toolbox: toolboxSimple(),
  tooltip: {},
  legend: [
    {
      // selectedMode: 'single',
      data: data.categories.map((a: any) => a.name)
    }
  ],
  grid: {
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    containLabel: true
  },
  series: [
    {
      name: '',
      type: 'graph',
      layout: 'circular',
      circular: {
        rotateLabel: true
      },
      data: data.nodes,
      links: data.links,
      categories: data.categories,
      roam: true,
      emphasis: {
        focus: 'adjacency'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      draggable: true
    }
  ]
});
