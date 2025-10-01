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
  { column: 'chr', title: 'Chr', database: 'f_chr', type: 1 },
  { column: 'position', title: 'Position', database: 'f_position', type: 1 },
  { column: 'ref', title: 'Ref', database: 'f_ref', type: 1 },
  { column: 'alt', title: 'Alt', database: 'f_alt', type: 1 },
  { column: 'geneName', title: 'Gene', database: 'f_gene_name', type: 1 },
  { column: 'tssDistance', title: 'TSS distance', database: 'f_tss_distance', type: 1 },
  { column: 'af', title: 'AF', database: 'f_af', type: 1 },
  { column: 'pvalueNominal', title: 'P value (nominal)', database: 'f_p_value_nominal', type: 1 },
  { column: 'tissueType', title: 'Tissue type', database: 'f_tissue_type', type: 1 }
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

export const geneGraphOption: any = (data: any, layout = 'none') => ({
  title: {
    top: 'bottom',
    left: 'right'
  },
  toolbox: toolboxSimple(),
  tooltip: {},
  legend: [
    {
      top: '5%',
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
      layout,
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
        edgeLength: 80,
        repulsion: 600,
        gravity: 0.5,
        layoutAnimation: true
        // iterations: 100
      },
      draggable: true
    }
  ]
});

export const overlapGeneGraphOption: any = (data: any) => ({
  title: {
    top: 'bottom',
    left: 'right'
  },
  toolbox: toolboxSimple('top', 10),
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
      emphasis: {
        focus: 'adjacency',
        label: {
          position: 'right',
          show: true,
          formatter: (name: any) => name.name
        }
      },
      label: {
        show: true,
        fontSize: 18,
        formatter: (name: any) => name.name
      },
      force: {
        // edgeLength: 10,
        // repulsion: 50,
        gravity: 0.2
      },
      draggable: true
    }
  ]
});

export const overlapSnpCountBarOption: any = (data: any) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  toolbox: toolboxSimple('top', 10),
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: data.xdata,
      axisTick: {
        alignWithLabel: true
      },
      datasetIndex: 0,
      axisLabel: {
        interval: 0,
        rotate: 60
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Count',
      type: 'bar',
      barWidth: '60%',
      data: data.ydata
    }
  ]
});

export const geneSnpGraphOption: any = (data: Array<any>, gene: string) => {
  const categories: Array<any> = [
    {
      name: 'Gene'
    },
    {
      name: 'Variant'
    }
  ];
  const nodes: Array<any> = [{
    id: gene,
    name: gene,
    category: 'Gene',
    symbolSize: 50
  }];
  const links: Array<any> = [];

  data.forEach((item: any) => {
    links.push({
      source: item.rsId,
      target: gene
    });
    nodes.push({
      id: item.rsId,
      name: item.rsId,
      category: 'Variant',
      symbolSize: 25
    });
  });

  const geneSnpGraphData: any = {
    nodes,
    links,
    categories
  };

  return {
    title: {
      top: 'bottom',
      left: 'right'
    },
    toolbox: toolboxSimple(),
    tooltip: {},
    legend: [
      {
        // selectedMode: 'single',
        data: geneSnpGraphData.categories.map((a: any) => a.name)
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
        data: geneSnpGraphData.nodes,
        links: geneSnpGraphData.links,
        categories: geneSnpGraphData.categories,
        roam: true,
        label: {
          show: true,
          fontSize: 18,
          formatter: (name: any) => name.name
        },
        force: {
          repulsion: 400
        },
        draggable: true
      }
    ]
  };
};

// noinspection JSUnusedGlobalSymbols
export const geneTraitCountOption = (data: any) => ({
  title: echartsTitle('Trait count (MAGMA)'),
  tooltip: {
    trigger: 'item',
    formatter: (value: any) => `${value.name} <br/> ${value.seriesName}: ${value.value} <br/> percent: ${value.percent}%`
  },
  toolbox: toolboxSimple('top', 30),
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
