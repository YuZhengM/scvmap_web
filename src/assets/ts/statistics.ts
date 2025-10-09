import { KeyValue } from '@/service/model/data';
import { echartsTitle, TOOLBOX, toolboxSimple } from '@/service/util/echarts';

// Statistics of chromatin accessibility data
export const CHROMATIN_ACCESSIBILITY: Array<KeyValue> = [
  {
    key: 'Number of scATAC-seq samples',
    value: '1,83'
  },
  {
    key: 'Number of tissue types',
    value: '20'
  },
  {
    key: 'Number of cell types',
    value: '206'
  },
  {
    key: 'Number of Cells',
    value: '1,342,173'
  },
  {
    key: 'The total sum of accessible chromatin regions',
    value: '54,615,438'
  }
];
// Statistics of chromatin accessibility data
export const FINE_MAPPING_RESULTS: Array<KeyValue> = [
  {
    key: 'The total sum of SNPs in all trait samples (hg19)',
    value: '21,679,322'
  },
  {
    key: 'The total sum of SNPs in all trait samples (hg38)',
    value: '21,676,961'
  },
  {
    key: 'Number of AFR',
    value: '53'
  },
  {
    key: 'Number of AMR',
    value: '79'
  },
  {
    key: 'Number of EAS',
    value: '289'
  },
  {
    key: 'Number of EUR',
    value: '5,108'
  },
  {
    key: 'Number of SAS',
    value: '30'
  },
  {
    key: 'Number of UKB',
    value: '10,325'
  },
  {
    key: 'Number of fine-mapping results',
    value: '15,884'
  }
];

export const STATISTICS_TRS: Array<KeyValue> = [
  {
    key: 'Number of trait-sample pairs (SCAVENGE)',
    value: '1,937,588'
  },
  {
    key: 'Number of trait-sample pairs (g-chromVAR)',
    value: '1,939,308'
  },
  {
    key: 'Number of trait-cell type pairs (SCAVENGE)',
    value: '13,152,640'
  },
  {
    key: 'Number of trait-cell type pairs (g-chromVAR)',
    value: '13,163,419'
  },
  {
    key: 'Number of trait-cell pairs (SCAVENGE)',
    value: '16,053,257,050'
  },
  {
    key: 'Number of trait-cell pairs (g-chromVAR)',
    value: '16,064,377,248'
  }
];

// Statistics of annotation
export const ANNOTATION: Array<KeyValue> = [
  { key: 'Gene number', value: '125,456' },
  { key: 'TF number', value: '1,176' },
  { key: 'Common SNP number (hg19)', value: '37,906,832' },
  { key: 'Common SNP number (hg38)', value: '37,302,978' },
  { key: 'eQTL number (hg19)', value: '101,034,022' },
  { key: 'eQTL number (hg38)', value: '101,558,011' },
  { key: 'Risk SNP number (hg19)', value: '97,080' },
  { key: 'Risk SNP number (hg38)', value: '96,950' },
  { key: 'Typical-enhancer number (SEA v3) (hg19)', value: '2,152,998' },
  { key: 'Typical-enhancer number (SEA v3) (hg38)', value: '2,171,877' },
  { key: 'Typical-enhancer number (SEdb v2) (hg19)', value: '24,599,529' },
  { key: 'Typical-enhancer number (SEdb v2) (hg38)', value: '24,738,376' },
  { key: 'Super-enhancer number (SEA v3) (hg19)', value: '107,116' },
  { key: 'Super-enhancer number (SEA v3) (hg38)', value: '109,304' },
  { key: 'Super-enhancer number (dbSUPER) (hg19)', value: '65,950' },
  { key: 'Super-enhancer number (dbSUPER) (hg38)', value: '65,893' },
  { key: 'Super-enhancer number (SEdb v2) (hg19)', value: '1,159,763' },
  { key: 'Super-enhancer number (SEdb v2) (hg38)', value: '1,168,518' }
];

export const echartsPairPieOption = (content: any) => ({
  title: content.map((data: any, idx: number) => {
    const left = idx * 33.3;
    return {
      text: data.title,
      left: `${left + 4}%`,
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
        fontSize: 17
      }
    };
  }),
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  series: content.map((data: any, idx: number) => {
    const left = idx * 33.3;
    return {
      name: data.title,
      type: 'pie',
      radius: [20, 50],
      left: `${left}%`,
      // height: '33.33%',
      // top: 'center',
      width: 366.6,
      color: data.color,
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        alignTo: 'edge',
        formatter: '{name|{b}}\n{time|{c}}',
        minMargin: 5,
        edgeDistance: 10,
        lineHeight: 15,
        rich: {
          time: {
            fontSize: 15,
            color: '#999'
          }
        }
      },
      labelLine: {
        length: 15,
        length2: 0,
        maxSurfaceAngle: 80
      },
      data: data.data
    };
  })
});

// 饼图
export const echartsPieOption = (data: any, legendLeft: any = '10%') => ({
  title: echartsTitle(data.title),
  color: data.color,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  toolbox: toolboxSimple(26, '2%'),
  grid: {
    top: '20%',
    right: '2%',
    left: '2%',
    bottom: '2%'
  },
  legend: {
    orient: 'horizontal',
    top: '15%',
    left: legendLeft,
    data: (data.data as Array<any>).flatMap((data: any) => data.name)
  },
  series: [
    {
      name: 'Count',
      type: 'pie',
      radius: '50%',
      center: ['50%', '60%'],
      data: data.data,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: data.show,
        alignTo: 'edge',
        formatter: '{name|{b}}\n{time|{c}}',
        minMargin: 2,
        edgeDistance: 50,
        lineHeight: 15,
        rich: {
          time: {
            fontSize: 10,
            color: '#999'
          }
        }
      },
      labelLine: {
        length: 30,
        length2: 0,
        maxSurfaceAngle: 80
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

// 饼图
export const echartsPopulationPieOption = (data: any) => ({
  title: echartsTitle(data.title),
  color: data.color,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  toolbox: toolboxSimple(26, '2%'),
  grid: {
    top: '20%',
    right: '2%',
    left: '2%',
    bottom: '2%'
  },
  legend: {
    orient: 'horizontal',
    top: '10%',
    data: (data.data as Array<any>).flatMap((data: any) => data.name)
  },
  graphic: {
    type: 'text',
    left: 'center',
    top: '53%',
    style: {
      text: data.text,
      textAlign: 'center',
      fill: '#786e6e',
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 50
    }
  },
  series: [
    {
      name: 'Count',
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '60%'],
      data: data.data,
      avoidLabelOverlap: true,
      padAngle: 0.1,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 0.5
      },
      label: {
        show: true
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

// 柱形图
export const echartsBarOption = (data: any, left: any = '10%') => ({
  title: echartsTitle(data.title, 12),
  color: [data.color],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    }
  },
  toolbox: toolboxSimple(),
  grid: {
    top: '10%',
    right: '6%',
    left,
    bottom: '10%'
  },
  xAxis: {
    type: 'category',
    data: data.data,
    axisLabel: {
      interval: 0,
      rotate: 0
    },
    nameTextStyle: {
      fontSize: 15
    }
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      fontSize: 15
    }
  },
  series: [{
    name: 'number',
    type: 'bar',
    barWidth: '60%',
    data: data.value
  }]
});

export const annotationOption = (data: any) => ({
  title: echartsTitle(data.title, 20),
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    orient: 'horizontal',
    top: '10%',
    data: ['hg19', 'hg38']
  },
  grid: {
    top: '16%',
    right: '2%',
    left: '10%',
    bottom: '10%'
  },
  toolbox: TOOLBOX,
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: data.xData,
      axisLabel: {
        interval: 0,
        rotate: 0
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
      name: 'hg19',
      type: 'bar',
      barGap: 0,
      emphasis: {
        focus: 'series'
      },
      data: data.yData[0]
    },
    {
      name: 'hg38',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: data.yData[1]
    }
  ]
});
