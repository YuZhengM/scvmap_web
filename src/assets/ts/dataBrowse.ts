import { TableHead } from '@/service/model/components/table';
import { getPubmedLink, linkGeo, linkSampleDetail, linkTraitDetail } from '@/assets/ts/statusUtil';

export const DATA_BROWSE_TRAIT_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', database: 'f_trait_id', type: 1, width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'traitName', title: 'Trait name', database: 'f_trait_name', type: 1, width: 200 },
  { column: 'sourceName', title: 'Source cohort', database: 'f_source_name', type: 1 },
  { column: 'type', title: 'Type', database: 'f_type', type: 1 },
  { column: 'traitAbbr', title: 'Trait abbreviation', database: 'f_trait_abbr', type: 1 },
  { column: 'trait', title: 'Trait description', database: 'f_trait', type: 1, width: 200 },
  { column: 'variantCount', title: 'VC', database: 'f_variant_count', type: 2, content: 'The number of variants in this trait or disease.' },
  { column: 'variantPpSum', title: 'PP sum', database: 'f_variant_pp_sum', type: 2, content: 'Sum the posterior probability values of mutations in this trait or disease.' }
];

export const DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'sampleName', title: 'Sample name' },
  { column: 'tissueType', title: 'Tissue type' },
  { column: 'healthTypeDescription', title: 'Disease type description' },
  { column: 'cellCount', title: 'Cell count' },
  { column: 'gseId', title: 'GSE ID', href: (row: any) => linkGeo(row.gseId) },
  {
    column: 'pmid',
    title: 'PMID',
    information: (row: any) => (row.pmid === '-' ? '-' : row.pmid.split(',').map((item: string) => getPubmedLink(item)).join(','))
  }
];

export const DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION2: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type' },
  { column: 'cellType', title: 'Cell type' },
  { column: 'cellCount', title: 'Cell count' },
  { column: 'gseId', title: 'GSE ID', href: (row: any) => linkGeo(row.gseId) },
  {
    column: 'pmid',
    title: 'PMID',
    information: (row: any) => (row.pmid === '-' ? '-' : row.pmid.split(',').map((item: string) => getPubmedLink(item)).join(','))
  }
];
