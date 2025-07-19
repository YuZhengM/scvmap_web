import { linkPmid, linkTraitDetail } from '@/assets/ts/statusUtil';
import { echartsTitle, toolboxSimple } from '@/service/util/echarts';
import { TableHead } from '@/service/model/components/table';

export const GENE_DETAIL_GENE_INFO_TABLE_DESCRIPTION = [
  // { column: 'geneName', title: 'Gene', width: 110 },
  { column: 'geneId', title: 'Ensembl ID', width: 180 },
  { column: 'strand', title: 'Strand', width: 100 },
  { column: 'geneType', title: 'Gene type', width: 150 },
  { column: 'source', title: 'Source', width: 130 }
];

export const GENE_DETAIL_GENE_TRAIT_TABLE_DESCRIPTION = [
  { column: 'traitId', title: 'Trait ID', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'sourceName', title: 'Source cohort', width: 150 },
  { column: 'type', title: 'Type', width: 120 },
  { column: 'traitAbbr', title: 'Trait abbreviation' },
  { column: 'trait', title: 'Trait description' }
];

export const GENE_DETAIL_REGULATION_REGION_TABS = [
  { name: 'common_snp', title: 'Common SNP' },
  { name: 'risk_snp', title: 'Risk SNP' },
  { name: 'eqtl', title: 'eQTL' },
  { name: 'enhancer_sea', title: 'TE (SEA v3)' },
  { name: 'enhancer_sedb', title: 'TE (SEdb v2)' },
  { name: 'super_enhancer_dbsuper', title: 'SE (dbSUPER)' },
  { name: 'super_enhancer_sea', title: 'SE (SEA v3)' },
  { name: 'super_enhancer_sedb', title: 'SE (SEdb v2)' }
];

export const GENE_DETAIL_GENOME_TABS = [
  { name: 'hg19', title: 'hg19' },
  { name: 'hg38', title: 'hg38' }
];

export const GENE_DETAIL_COMMON_SNP_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr' },
  { column: 'position', title: 'Position' },
  { column: 'rsId', title: 'rsID' },
  { column: 'ref', title: 'Ref' },
  { column: 'alt', title: 'Alt' }
];

export const GENE_DETAIL_EQTL_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr' },
  { column: 'position', title: 'Position' },
  { column: 'ref', title: 'Ref' },
  { column: 'alt', title: 'Alt' },
  { column: 'geneName', title: 'Gene' },
  { column: 'tssDistance', title: 'TSS distance' },
  { column: 'af', title: 'AF' },
  { column: 'pvalueNominal', title: 'P value (nominal)' },
  { column: 'tissueType', title: 'Tissue type' }
];

export const GENE_DETAIL_RISK_SNP_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr' },
  { column: 'position', title: 'Position' },
  { column: 'rsId', title: 'rsID' },
  { column: 'ref', title: 'Ref' },
  { column: 'alt', title: 'Alt' },
  { column: 'trait', title: 'Trait' },
  { column: 'pvalue', title: 'P value' },
  { column: 'population', title: 'Population' },
  { column: 'pmid', title: 'PMID', href: (row: any) => linkPmid(row.pmid) }
];

export const GENE_DETAIL_ENHANCER_SEA_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr' },
  { column: 'start', title: 'Start' },
  { column: 'end', title: 'End' },
  { column: 'associatedGene', title: 'Associated gene' },
  { column: 'cellTissueType', title: 'Cell/Tissue type' },
  { column: 'recognitionFactor', title: 'recognitionFactor' },
  { column: 'sequenceRegion', title: 'Sequence Region' },
  { column: 'seId', title: 'SE ID' }
];

export const GENE_DETAIL_ENHANCER_SEDB_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr' },
  { column: 'start', title: 'Start' },
  { column: 'sampleId', title: 'Sample ID' },
  { column: 'seId', title: 'SE ID' },
  { column: 'cellSource', title: 'Cell source' },
  { column: 'cellType', title: 'Cell type' },
  { column: 'tissueType', title: 'Tissue type' },
  { column: 'cellState', title: 'Cell state' }
];

export const GENE_DETAIL_SUPER_ENHANCER_DBSUPER_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr' },
  { column: 'start', title: 'Start' },
  { column: 'end', title: 'End' },
  { column: 'cellType', title: 'Cell type' },
  { column: 'seId', title: 'SE ID' }
];

export const GENE_DETAIL_SUPER_ENHANCER_SEA_TABLE_DESCRIPTION = GENE_DETAIL_ENHANCER_SEA_TABLE_DESCRIPTION;

export const GENE_DETAIL_SUPER_ENHANCER_SEDB_TABLE_DESCRIPTION = [
  ...GENE_DETAIL_ENHANCER_SEDB_TABLE_DESCRIPTION
];

export const geneGraphOption: any = (data: any) => ({
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
      name: 'Name',
      type: 'graph',
      // layout: 'force',
      data: data.nodes,
      links: data.links,
      categories: data.categories,
      emphasis: {
        focus: 'adjacency',
        label: {
          position: 'right',
          show: true,
          formatter: (name: any) => name.name
        }
      },
      roam: true,
      label: {
        show: false,
        formatter: (name: any) => name.name
      },
      force: {
        initLayout: 'circular',
        // edgeLength: 10,
        repulsion: 200,
        gravity: 0.5
      }
    }
  ]
});

export const geneSnpGraphOption: any = (data: any) => ({
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
      layout: 'force',
      data: data.nodes,
      links: data.links,
      categories: data.categories,
      roam: true,
      label: {
        show: true,
        fontSize: 18,
        formatter: (name: any) => name.name
      },
      force: {
        repulsion: 400
      }
    }
  ]
});

// noinspection JSUnusedGlobalSymbols
export const geneTraitCountOption = (data: any) => ({
  title: echartsTitle('Trait count'),
  tooltip: {
    trigger: 'item',
    formatter: (value: any) => `${value.name} <br/> ${value.seriesName}: ${value.value} <br/> percent: ${value.percent}%`
  },
  toolbox: toolboxSimple(),
  legend: {
    type: 'scroll',
    top: '10%',
    left: 'center'
  },
  grid: {
    top: '10%',
    right: '2%',
    left: '2%',
    bottom: '10%'
  },
  series: [
    {
      name: 'Count',
      type: 'pie',
      radius: '50%',
      center: ['50%', '60%'],
      data: data.data,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#fff',
        borderWidth: 0
      },
      label: { show: true },
      labelLine: {
        length: 20
      },
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
