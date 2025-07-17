import { TableHead } from '@/service/model/components/table';
import { getPubmedLink, linkGeo, linkSampleDetail, linkTraitDetail } from '@/assets/ts/statusUtil';

export const DATA_BROWSE_TRAIT_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', database: 'f_trait_id', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  // { column: 'sourceId', title: 'Source ID', database: 'f_source_id', width: 120 },
  { column: 'sourceName', title: 'Source cohort', database: 'f_source_name' },
  { column: 'type', title: 'Type', database: 'f_type' },
  // { column: 'sourceGenome', title: 'Source genome', database: 'f_source_genome', content: 'Reference genome information of this trait or disease in the original data.' },
  { column: 'traitAbbr', title: 'Trait abbreviation', database: 'f_trait_abbr' },
  { column: 'trait', title: 'Trait description', database: 'f_trait', width: 200 },
  { column: 'variantCount', title: 'VC', database: 'f_variant_count', content: 'The number of variants in this trait or disease.' },
  { column: 'variantPpSum', title: 'PP sum', database: 'f_variant_pp_sum', content: 'Sum the posterior probability values of mutations in this trait or disease.' }
  // { column: 'hg19Count', title: 'hg19 VC', database: 'f_hg19_count', content: 'The number of variants in this trait or disease in the HG19 reference genome.' },
  // { column: 'hg19PpSum', title: 'hg19 PP sum', database: 'f_hg19_pp_sum', content: 'Sum the posterior probability values of mutations in this trait or disease in the HG19 reference genome.' },
  // { column: 'hg38Count', title: 'hg38 VC', database: 'f_hg38_count', content: 'The number of variants in this trait or disease in the HG38 reference genome.' },
  // { column: 'hg38PpSum', title: 'hg38 PP sum', database: 'f_hg38_pp_sum', content: 'Sum the posterior probability values of mutations in this trait or disease in the HG38 reference genome.' }
];

export const DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type' },
  { column: 'healthTypeDescription', title: 'Health type description' },
  { column: 'cellCount', title: 'Cell count' },
  { column: 'gseId', title: 'GSE ID', href: (row: any) => linkGeo(row.gseId) },
  {
    column: 'pmid',
    title: 'PMID',
    information: (row: any) => row.pmid.split(',').map((item: string) => getPubmedLink(item)).join(',')
  }
  // { column: 'genome', title: 'Genome' },
  // { column: 'sequencingType', title: 'Sequencing type' }
];

export const DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION2: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type' },
  { column: 'cellType', title: 'Cell type' },
  { column: 'cellCount', title: 'Cell count' },
  { column: 'gseId', title: 'GSE ID', href: (row: any) => linkGeo(row.gseId) },
  // {
  //   column: 'geoId',
  //   title: 'GEO ID',
  //   information: (row: any) => row.gseId.split(',').map((item: string) => getGeoLink(item)).join(',')
  // },
  {
    column: 'pmid',
    title: 'PMID',
    information: (row: any) => row.pmid.split(',').map((item: string) => getPubmedLink(item)).join(',')
  }
  // { column: 'genome', title: 'Genome' }
];
