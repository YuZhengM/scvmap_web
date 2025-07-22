import { TableHead } from '@/service/model/components/table';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import { getGeoLink, getPubmedLink, getSampleDetailLink, linkDetailVariant, linkSampleDetail } from '@/assets/ts/statusUtil';
import { KeyValue } from '@/service/model/data';
import { echartsTitle, PIE_LABEL, toolboxSimple } from '@/service/util/echarts';
import { ButtonBase } from '@/service/model/components/button';

export const DETAIL_BUTTON_POSITION_DATA: Array<ButtonBase> = [
  {
    id: 'position_overview',
    title: 'Overview'
  },
  {
    id: 'position_cell',
    title: 'Enriched cells'
  },
  {
    id: 'position_difference_gene',
    title: 'Differential genes'
  },
  {
    id: 'position_magma_gene',
    title: 'Genes with enriched trait'
  },
  {
    id: 'position_gene_network',
    title: 'Gene hub network'
  },
  {
    id: 'position_difference_tf',
    title: 'Differential TFs'
  },
  {
    id: 'position_homer_tf',
    title: 'TFs with enriched trait'
  },
  {
    id: 'position_tf_network',
    title: 'TF hub network'
  }
];

export const sampleClusterLayoutMain: any = (width = 680, height = 800, size = 14) => ({
  // title: '',
  legend: {
    y: 1,
    yref: 'paper',
    font: {
      family: 'Arial, sans-serif',
      size,
      color: 'grey'
    }
  },
  margin: {
    pad: 0,
    l: 20,
    r: 10,
    b: 50,
    t: 35
  },
  width,
  height
});

export const sampleClusterLayout: any = (width = 680, height = 800, size = 14) => ({
  legend: {
    y: 1,
    yref: 'paper',
    font: {
      family: 'Arial, sans-serif',
      size,
      color: 'grey'
    }
  },
  margin: {
    pad: 0,
    l: 20,
    r: 10,
    b: 50,
    t: 35
  },
  width,
  height
});

// 形成聚类图
export const formClusterPlotMethod: any = (res: Array<any>, size = 2, title = 'TRS') => {
  const item: any = res[0] as any;
  return [{
    x: item.x,
    y: item.y,
    mode: 'markers',
    type: 'scatter',
    name: item.name,
    text: item.text,
    textposition: 'top center',
    textfont: { family: 'Raleway, sans-serif' },
    marker: {
      size,
      color: item.color,
      // colorscale: 'Viridis',
      // colorscale: 'Jet',
      // colorscale: 'Rainbow',
      showscale: true,
      colorbar: {
        title: {
          text: title,
          side: 'right',
          font: {
            weight: 'bold',
            size: 20
          }
        }
      }
    }
  }];
};

export const clusterForm: any = (res: any, size = 2) => {
  const data: any[] = [];
  (res.plotlyDataList as any[]).forEach((item: any) => {
    data.push({
      x: item.x,
      y: item.y,
      mode: 'markers',
      type: 'scatter',
      name: item.name,
      text: item.text,
      textposition: 'top center',
      textfont: { family: 'Raleway, sans-serif' },
      marker: { size }
    });
  });
  return data;
};

// 注释按钮信息
export const DETAIL_CELL_COUNT_DATA: Array<InputSelect> = [
  {
    label: '5%',
    value: 0.05
  },
  {
    label: '10%',
    value: 0.1
  },
  {
    label: '20%',
    value: 0.2
  },
  {
    label: '30%',
    value: 0.3
  },
  {
    label: '40%',
    value: 0.4
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '60%',
    value: 0.6
  },
  {
    label: '80%',
    value: 0.8
  },
  {
    label: '100%',
    value: 1.0
  }
];

export const getCellCountValue = (sampleCellCount: number) => {
  const rate = 1000 / sampleCellCount;
  if (rate <= 0.05) {
    return 0.05;
  }
  if (rate > 0.05 && rate <= 0.1) {
    return 0.1;
  }
  if (rate > 0.1 && rate <= 0.2) {
    return 0.2;
  }
  if (rate > 0.2 && rate <= 0.3) {
    return 0.3;
  }
  if (rate > 0.3 && rate <= 0.4) {
    return 0.4;
  }
  if (rate > 0.4 && rate <= 0.5) {
    return 0.5;
  }
  if (rate > 0.5 && rate <= 0.6) {
    return 0.6;
  }
  if (rate > 0.6 && rate <= 0.8) {
    return 0.8;
  }
  return 1.0;
};

// 注释按钮信息
export const DETAIL_METHOD_DATA: Array<InputSelect> = [
  {
    label: 'SCAVENGE',
    value: 'scavenge'
  },
  {
    label: 'g-chromVAR',
    value: 'gchromvar'
  }
];

// noinspection JSUnusedGlobalSymbols
export const enrichedTraitCountCountOption = (data: any, labelShow = true) => ({
  title: {
    // text: 'Count',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: (value: any) => `${value.name} <br/> ${value.seriesName}: ${value.value} <br/> percent: ${value.percent}%`
  },
  toolbox: toolboxSimple(),
  legend: {
    orient: 'vertical',
    left: 'left',
    data: data.legend
  },
  series: [
    {
      name: 'Count',
      type: 'pie',
      radius: '60%',
      data: data.data,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: labelShow,
        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}: }{c} {per|{d}%}  ',
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 14,
        rich: {
          a: {
            color: '#6E7079',
            lineHeight: 22,
            align: 'center'
          },
          hr: {
            borderColor: '#8C8D8E',
            width: '100%',
            borderWidth: 1,
            height: 0
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [1, 2],
            borderRadius: 4,
            align: 'center'
          }
        }
      },
      labelLine: {
        length: 30
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

// noinspection JSUnusedGlobalSymbols
export const cellTypeCountOption = (data: any, isExpand = false) => ({
  title: echartsTitle('Cell type count'),
  tooltip: {
    trigger: 'item',
    formatter: (value: any) => `${value.name} <br/> ${value.seriesName}: ${value.value} <br/> percent: ${value.percent}%`
  },
  toolbox: toolboxSimple(),
  legend: isExpand ? {
    orient: 'vertical',
    top: 'center',
    left: 'left',
    data: data.legend
  } : {
    type: 'scroll',
    top: '10%',
    left: 'center'
  },
  grid: {
    top: isExpand ? '17%' : '10%',
    right: '2%',
    left: '2%',
    bottom: isExpand ? '5%' : '10%'
  },
  series: [
    {
      name: 'Count',
      type: 'pie',
      radius: isExpand ? '50%' : '50%',
      center: isExpand ? ['50%', '60%'] : ['50%', '60%'],
      data: data.data,
      itemStyle: {
        borderRadius: isExpand ? 10 : 0,
        borderColor: '#fff',
        borderWidth: isExpand ? 2 : 0
      },
      label: isExpand ? PIE_LABEL : { show: true },
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

// noinspection JSUnusedGlobalSymbols
export const chrCountOption = (data: any) => ({
  title: echartsTitle('Chromosome count'),
  tooltip: {
    trigger: 'item',
    formatter: (value: any) => `${value.name} <br/> ${value.seriesName}: ${value.value} <br/> percent: ${value.percent}%`
  },
  toolbox: toolboxSimple(),
  legend: {
    orient: 'vertical',
    left: 'left',
    data: data.legend
  },
  series: [
    {
      name: 'Count',
      type: 'pie',
      radius: '50%',
      data: data.data,
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

// noinspection JSUnusedGlobalSymbols
export const traitBoxOption = (data: any, yName = 'TRS') => ({
  title: echartsTitle('Trait- or disease-relevant cell score'),
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  toolbox: toolboxSimple(),
  grid: {
    left: '3%',
    right: '9%',
    bottom: '30%'
  },
  xAxis: {
    type: 'category',
    name: 'Cell types',
    data: data.map((item: any) => item.name),
    datasetIndex: 0,
    axisLabel: {
      interval: 0,
      rotate: 60
    }
  },
  yAxis: {
    type: 'value',
    name: yName
  },
  series: [
    {
      name: 'boxplot',
      type: 'boxplot',
      data,
      datasetIndex: 1
    }
  ]
});

export const getSampleArrayTable = (tableData: Array<KeyValue>, res: any, isLink = false) => {
  ArrayUtil.clear(tableData);
  // Sample overview
  tableData.push({ key: 'Sample ID:', value: isLink ? getSampleDetailLink(res.sampleId) : res.sampleId });
  tableData.push({ key: 'Sample label:', value: res.label });
  tableData.push({ key: 'Tissue type:', value: res.tissueType });
  tableData.push({ key: 'Cell type count:', value: res.cellTypeCount });
  tableData.push({ key: 'Cell count:', value: res.cellCount });
  tableData.push({ key: 'GSE ID:', value: getGeoLink(res.gseId) });
  tableData.push({ key: 'GEO ID:', value: res.geoId.split(',').map((item: string) => getGeoLink(item)).join(', ') });
  tableData.push({ key: 'PMID:', value: res.pmid.split(',').map((item: string) => getPubmedLink(item)).join(', ') });
  // tableData.push({ key: 'Species:', value: res.species });
  tableData.push({ key: 'Genome:', value: res.genome });
  tableData.push({ key: 'Health type:', value: res.healthType });
  tableData.push({ key: 'Health type description:', value: res.healthTypeDescription });
  tableData.push({ key: 'Source:', value: res.sourceUrl ? `<a href="${res.sourceUrl}" target="_blank">${res.source}</a>` : res.source });
  tableData.push({ key: 'Sequencing type:', value: res.sequencingType });
  tableData.push({ key: 'Description:', value: res.description });
};

export const DETAIL_TRAIT_INFORMATION_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'chr', title: 'Chr', database: 'f_chr', type: 1, width: 100 },
  { column: 'position', title: 'Position', database: 'f_position', type: 1, width: 150 },
  { column: 'pp', title: 'pp', database: 'f_pp', type: 2, width: 100 },
  { column: 'rsId', title: 'rsID', database: 'f_rs_id', type: 1, width: 100, href: (row: any) => linkDetailVariant(row.rsId) },
  { column: 'pvalue', title: 'P value', database: 'f_p_value', type: 2 },
  { column: 'allele1', title: 'Allele1', database: 'f_allele1', type: 1, content: 'Reference allele in the reference genome coordinate of the source cohort.' },
  { column: 'allele2', title: 'Allele2', database: 'f_allele2', type: 1, content: 'Alternative allele in the reference genome coordinate of the source cohort.' }
];

export const DATA_DETAIL_SAMPLE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', database: 'f_sample_id', type: 1, href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type', database: 'f_tissue_type', type: 1 }
];

export const DETAIL_ELEMENT_HEAT_MAP_TOP_COUNT_DATA: Array<InputSelect> = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 },
  { label: '60', value: 60 },
  { label: '70', value: 70 },
  { label: '80', value: 80 },
  { label: '90', value: 90 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
  { label: '1000', value: 1000 },
  { label: '1500', value: 1500 },
  { label: '2000', value: 2000 },
  { label: '2500', value: 2500 },
  { label: '3000', value: 3000 },
  { label: 'All', value: 0 }
];
