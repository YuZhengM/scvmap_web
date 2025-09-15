// 分析结果也中 Sample Overview
import { TableHead } from '@/service/model/components/table';
import { linkDetailGene, linkDetailTf, linkDetailVariant, linkSampleDetail, linkTraitDetail } from '@/assets/ts/statusUtil';
import { InputSelect } from '@/service/model/components/input';
import { ButtonBase } from '@/service/model/components/button';

export const ANALYSIS_MULTI_TRAIT_BUTTON_POSITION_DATA: Array<ButtonBase> = [
  {
    id: 'position_enrichment',
    title: 'Enrichment heatmap'
  },
  {
    id: 'position_cell',
    title: 'TRS'
  },
  {
    id: 'position_difference_gene',
    title: 'Differential genes'
  },
  {
    id: 'position_magma_gene',
    title: 'Trait-relevant genes'
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
    title: 'Trait-relevant TFs'
  },
  {
    id: 'position_tf_network',
    title: 'TF hub network'
  }
];

export const ANALYSIS_GENE_BUTTON_POSITION_DATA: Array<ButtonBase> = [
  {
    id: 'position_information',
    title: 'Sample information'
  },
  {
    id: 'position_cell',
    title: 'TRS'
  },
  {
    id: 'position_difference_gene',
    title: 'Differential genes'
  },
  {
    id: 'position_magma_gene',
    title: 'Trait-relevant genes'
  },
  {
    id: 'position_gene_network',
    title: 'Gene hub network'
  }
];

export const ANALYSIS_TF_BUTTON_POSITION_DATA: Array<ButtonBase> = [
  {
    id: 'position_information',
    title: 'Sample information'
  },
  {
    id: 'position_cell',
    title: 'TRS'
  },
  {
    id: 'position_difference_tf',
    title: 'Differential TFs'
  },
  {
    id: 'position_homer_tf',
    title: 'Trait-relevant TFs'
  },
  {
    id: 'position_tf_network',
    title: 'TF hub network'
  }
];

export const ANALYSIS_STRATEGY_DATA: Array<InputSelect> = [
  {
    label: 'Mean',
    value: 'mean'
  },
  {
    label: 'Median',
    value: 'median'
  },
  {
    label: 'Sum',
    value: 'sum'
  }
];

export const DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', width: 130, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'traitAbbr', title: 'Trait abbreviation', width: 200 },
  { column: 'trait', title: 'Trait description' }
];

export const DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', width: 130, database: 'f_sample_id', type: 1, href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type', width: 200, database: 'f_tissue_type', type: 1 },
  { column: 'healthTypeDescription', title: 'Health type description', width: 250, database: 'f_health_type_description', type: 1 }
];

export const DATA_ANALYSIS_DIFFERENCE_GENE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', database: 'f_sample_id', type: 1, width: 130, href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'cellType', title: 'Cell type', database: 'f_cell_type', type: 1 },
  { column: 'gene', title: 'Gene', database: 'f_gene', type: 1, href: (row: any) => linkDetailGene(row.gene) },
  { column: 'score', title: 'Score', database: 'f_score', type: 2, information: (row: any) => Number(row.score).toFixed(3) },
  { column: 'adjustedPValue', title: 'Adjusted P value', database: 'f_adjusted_p_value', type: 2, information: (row: any) => Number(row.adjustedPValue).toExponential(3) },
  { column: 'log2FoldChange', title: 'Log2(Fold change)', database: 'f_log2_fold_change', type: 2, information: (row: any) => Number(row.log2FoldChange).toFixed(3) },
  { column: 'pvalue', title: 'P value', database: 'f_p_value', type: 2, information: (row: any) => Number(row.pvalue).toExponential(3) }
];

export const DATA_ANALYSIS_DIFFERENCE_TF_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', width: 130, type: 1, href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'cellType', title: 'Cell type', type: 1 },
  { column: 'tf', title: 'TF', type: 1, href: (row: any) => linkDetailTf(row.tf) },
  { column: 'pvalue', title: 'P value', type: 2, information: (row: any) => Number(row.pvalue).toExponential(3) },
  { column: 'adjustedPValue', title: 'Adjusted P value', type: 2, information: (row: any) => Number(row.adjustedPValue).toExponential(3) },
  { column: 'log2FoldChange', title: 'Log2(Fold change)', type: 2, information: (row: any) => Number(row.log2FoldChange).toFixed(3) }
];

export const DATA_ANALYSIS_CHROMVAR_DIFFERENCE_TF_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', width: 130, type: 1, href: (row: any) => linkSampleDetail(row.sampleId) },
  { column: 'cellType', title: 'Cell type', type: 1 },
  { column: 'tf', title: 'TF', type: 1, href: (row: any) => linkDetailTf(row.tf) },
  { column: 'pvalue', title: 'P value', type: 2, information: (row: any) => Number(row.pvalue).toExponential(3) },
  { column: 'pvalueAdjust', title: 'Adjusted P value', type: 2, information: (row: any) => Number(row.pvalueAdjust).toExponential(3) },
  { column: 'mean1', title: 'Mean1', type: 2, information: (row: any) => Number(row.mean1).toFixed(3) },
  { column: 'mean2', title: 'Mean2', type: 2, information: (row: any) => Number(row.mean1).toFixed(3) }
];

export const DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'gene', title: 'Gene', href: (row: any) => linkDetailGene(row.gene) },
  { column: 'chr', title: 'Chr', content: 'Chromosome', information: (row: any) => `chr${row.chr}` },
  { column: 'start', title: 'Start', content: 'Starting boundary of gene annotation on chromosomes' },
  { column: 'end', title: 'End', content: 'Ending boundary of gene annotation on chromosomes' },
  { column: 'nsnps', title: 'SNP count', content: 'The number of SNPs not annotated to this gene based on previous SNP QC exclusion' },
  { column: 'zvalue', title: 'Z score', information: (row: any) => Number(row.zvalue).toFixed(3) },
  { column: 'pvalue', title: 'P value', information: (row: any) => Number(row.pvalue).toExponential(3) }
];

export const DATA_ANALYSIS_TRAIT_GENE_CICERO_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'gene', title: 'Gene', href: (row: any) => linkDetailGene(row.gene) },
  { column: 'score', title: 'Co-score' },
  { column: 'rsId', title: 'rsID' },
  { column: 'pp', title: 'PP', information: (row: any) => Number(row.pp).toFixed(3) },
  { column: 'weight', title: 'Weight', content: 'The weight of the SNP-gene linkage in the trait.' },
  { column: 'position', title: 'Position', content: 'Position of causal variant.' },
  { column: 'traitPeak', title: 'Peak (trait)', content: 'Peak region overlapping with causal variant.' },
  { column: 'genePeak', title: 'Peak (gene)', content: 'Peak region overlapping with gene promoter.' }
];

export const DATA_ANALYSIS_TRAIT_TF_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'tf', title: 'TF', href: (row: any) => linkDetailTf(row.tf) },
  // { column: 'motifName', title: 'Motif name' },
  { column: 'consensus', title: 'Consensus' },
  { column: 'pvalue', title: 'P value', information: (row: any) => Number(row.pvalue).toExponential(3) },
  { column: 'qvalue', title: 'Q value', information: (row: any) => Number(row.qvalue).toExponential(3) }
];

export const DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'traitId', title: 'Trait ID', width: 120, href: (row: any) => linkTraitDetail(row.traitId) },
  { column: 'gene', title: 'Gene', href: (row: any) => linkDetailGene(row.gene) },
  { column: 'rsId', title: 'rsID', content: 'The number of SNPs not annotated to this gene based on previous SNP QC exclusion', href: (row: any) => linkDetailVariant(row.rsId) }
];

export const ANALYSIS_GENOME_DATA: Array<InputSelect> = [
  { label: 'hg19', value: 'hg19' },
  { label: 'hg38', value: 'hg38' }
];

export const ANALYSIS_TRAIT_GENE_METHOD_DATA: Array<InputSelect> = [
  { label: 'Cicero', value: 'cicero' },
  { label: 'MAGMA', value: 'magma' }
];

export const ANALYSIS_TRAIT_GENE_ALL_METHOD_DATA: Array<InputSelect> = [
  { label: 'Cicero', value: 'cicero' },
  { label: 'MAGMA', value: 'magma' },
  { label: 'Overlap', value: 'overlap' }
];

export const ANALYSIS_META_DATA_DATA: Array<InputSelect> = [
  { label: 'Enriched trait', value: 'enrichment' },
  { label: 'No enriched trait', value: 'noEnrichment' }
];

export const ANALYSIS_TOP_COUNT_DATA: Array<InputSelect> = [
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
  { label: '1000', value: 1000 },
  { label: '1500', value: 1500 },
  { label: '2000', value: 2000 },
  { label: '2500', value: 2500 },
  { label: '3000', value: 3000 },
  { label: '3500', value: 3500 },
  { label: '4000', value: 4000 },
  { label: '4500', value: 4500 },
  { label: '5000', value: 5000 },
  { label: '5500', value: 5500 },
  { label: '6000', value: 6000 },
  { label: '6500', value: 6500 },
  { label: '7000', value: 7000 },
  { label: '7500', value: 7500 },
  { label: '8000', value: 8000 },
  { label: '9000', value: 9000 },
  { label: '10000', value: 10000 },
  { label: '20000', value: 20000 },
  { label: 'All', value: 0 }
];
