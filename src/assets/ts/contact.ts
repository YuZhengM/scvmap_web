import { CardBase } from '@/service/model/components/card';

// 联系内容
export const CONTACTS = [
  {
    title: 'Principal Investigator:',
    content: 'Chunquan Li, Ph.D.'
  },
  {
    title: '',
    content: 'The First Affiliated Hospital, University of South China, Hengyang 421001, China'
  },
  {
    title: 'Email',
    content: ' lcqbio@163.com'
  }
];

// 联系内容
export const CONTACT_SELF_LINK = [
  {
    title: 'scVMAP tutorial: ',
    link: 'https://scvmap.readthedocs.io/en/latest/'
  },
  {
    title: 'scVMAP front-end: ',
    link: 'https://github.com/YuZhengM/scvmap_web'
  },
  {
    title: 'scVMAP back-end: ',
    link: 'https://github.com/YuZhengM/scvmap'
  }
];

// 团队其他项目
export const SISTER_PROJECTS: Array<CardBase> = [{
  title: 'scATAC-Ref',
  url: 'https://bio.liclab.net/scATAC-Ref/',
  content: 'scATAC-Ref: a reference of scATAC-seq with known cell labels in multi-species'
}, {
  title: 'sc2GWAS',
  url: 'https://bio.liclab.net/sc2GWAS/',
  content: 'sc2GWAS: A comprehensive platform linking single cell and GWAS traits of human'
}, {
  title: 'scImmOmics',
  url: 'https://bio.liclab.net/scImmOmics/',
  content: 'scImmOmics: a manually curated resource of single-cell multi-omics immune data'
}, {
  title: 'SpatialRef',
  url: 'https://bio.liclab.net/spatialref/',
  content: 'SpatialRef: A reference of spatial omics with known spot annotation'
}, {
  title: 'scBlood',
  url: 'https://bio.liclab.net/scBlood/',
  content: 'scBlood: A comprehensive single-cell accessible chromatin database of blood cells'
}, {
  title: 'GREAP',
  url: 'https://bio.liclab.net/Greap/view/index',
  content: 'GREAP: a comprehensive human genomic region sets enrichment analysis platform'
}, {
  title: 'SEdb',
  url: 'http://www.licpathway.net/sedb/',
  content: 'SEdb: the comprehensive human Super-Enhancer database'
}, {
  title: 'ENdb',
  url: 'http://www.licpathway.net/ENdb/index.php',
  content: 'ENdb: an experimentally supported enhancer database for human and mouse'
}, {
  title: 'SEanalysis',
  url: 'https://bio.liclab.net/SEanalysis/',
  content: 'SEanalysis: a web tool for super-enhancer associated regulatory analysis'
}, {
  title: 'LncSEA',
  url: 'https://bio.liclab.net/LncSEA/index.php',
  content: 'LncSEA: a comprehensive human lncRNA sets resource and enrichment analysis platform'
}, {
  title: 'KnockTF',
  url: 'http://www.licpathway.net/KnockTF/',
  content: 'KnockTF: a comprehensive human gene expression profile database with knockdown/knockout of transcription factors'
}, {
  title: 'TRCirc',
  url: 'http://www.licpathway.net/TRCirc/view/index',
  content: 'TRCirc: a resource for transcriptional regulation information of circRNAs'
}, {
  title: 'TRlnc',
  url: 'http://www.licpathway.net/TRlnc/view/index',
  content: 'TRlnc: a comprehensive database of human transcriptional regulation of lncRNAs'
}, {
  title: 'VARAdb',
  url: 'http://www.licpathway.net/VARAdb/',
  content: 'VARAdb: a variation annotation database for human'
}];
