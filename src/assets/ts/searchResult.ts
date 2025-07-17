import { TableHead } from '@/service/model/components/table';
import {
  getGeoLink, getPubmedLink,
  linkSampleDetail,
  linkTraitDetail
} from '@/assets/ts/statusUtil';

export const SEARCH_TRAIT_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', database: 'f_trait_id', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'sourceId', title: 'Source ID', width: 120 },
  { column: 'sourceName', title: 'Source cohort', database: 'f_source_name', width: 120 },
  { column: 'sourceGenome', title: 'Source genome', database: 'f_source_genome', width: 120, content: 'Reference genome information of this trait or disease in the original data.' },
  { column: 'traitAbbr', title: 'Trait abbreviation', database: 'f_trait_abbr', width: 150 },
  { column: 'trait', title: 'Trait description', database: 'f_trait', width: 300 },
  { column: 'type', title: 'Type', database: 'f_type', width: 120 },
  { column: 'icd10', title: 'ICD-10', database: 'f_icd10', width: 120 },
  { column: 'category', title: 'Category', database: 'f_category', width: 300 },
  { column: 'subcategory', title: 'Subcategory', database: 'f_subcategory', width: 300 },
  {
    column: 'threeCategory',
    title: 'The third Category',
    database: 'f_three_category',
    width: 300,
    content: 'This trait or disease belongs to the category of this column, which is a subcategory of the `Subcategory` column on the left.'
  },
  { column: 'variantCount', title: 'VC', database: 'f_variant_count', width: 120, content: 'The number of variants in this trait or disease.' },
  { column: 'variantPpSum', title: 'PP sum', database: 'f_variant_pp_sum', width: 120, content: 'Sum the posterior probability values of variants in this trait or disease.' },
  { column: 'hg19Count', title: 'hg19 VC', database: 'f_hg19_count', width: 120, content: 'The number of variants in this trait or disease in the HG19 reference genome.' },
  {
    column: 'hg19PpSum',
    title: 'hg19 PP sum',
    database: 'f_hg19_pp_sum',
    width: 120,
    content: 'Sum the posterior probability values of variants in this trait or disease in the HG19 reference genome.'
  },
  { column: 'hg38Count', title: 'hg38 VC', database: 'f_hg38_count', width: 120, content: 'The number of variants in this trait or disease in the HG38 reference genome.' },
  {
    column: 'hg38PpSum',
    title: 'hg38 PP sum',
    database: 'f_hg38_pp_sum',
    width: 120,
    content: 'Sum the posterior probability values of variants in this trait or disease in the HG38 reference genome.'
  }
];

export const SEARCH_SAMPLE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', database: 'f_sample_id', href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type', database: 'f_tissue_type' },
  { column: 'healthTypeDescription', title: 'Health type description', database: 'f_health_type_description' },
  { column: 'cellTypeCount', title: 'Cell type count', database: 'f_cell_type_count' },
  { column: 'cellCount', title: 'Cell count', database: 'f_cell_count' },
  {
    column: 'gseId',
    title: 'GSE ID',
    database: 'f_gse_id',
    information: (row: any) => row.gseId.split(',').map((item: string) => getGeoLink(item)).join(',')
  },
  {
    column: 'pmid',
    title: 'PMID',
    database: 'f_pmid',
    information: (row: any) => row.pmid.split(',').map((item: string) => getPubmedLink(item)).join(',')
  },
  { column: 'genome', title: 'Genome', database: 'f_genome' },
  { column: 'sequencingType', title: 'Sequencing type', database: 'f_sequencing_type' }
];
