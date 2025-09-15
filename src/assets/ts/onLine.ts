import { TableHead } from '@/service/model/components/table';
import { linkJobDetail } from '@/assets/ts/statusUtil';
import Time from '@/service/util/base/time';

export const ON_LINE_USER_SAMPLE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'jobId', title: 'Job ID', database: 'f_job_id', type: 1, href: (row: any) => linkJobDetail(row.jobId) },
  { column: 'jobStatus', title: 'Job status', database: 'f_job_status', type: 1 },
  { column: 'scFileId', title: 'scATAC-seq file', database: 'f_sc_file_id', type: 1 },
  { column: 'variantFileId', title: 'Trait file', database: 'f_variant_file_id', type: 1 },
  { column: 'createTime', title: 'Create time', database: 'f_create_time', type: 1, information: (row: any) => Time.getDate(row.createTime) },
  { column: 'updateTime', title: 'Update time', database: 'f_update_time', type: 1, information: (row: any) => Time.getDate(row.updateTime) }
];

export const ON_LINE_SAMPLE_TABLE_DESCRIPTION: Array<TableHead> = [
  { column: 'sampleId', title: 'Sample ID', database: 'f_sample_id', type: 1, href: (row: any) => linkJobDetail(row.sampleId) },
  { column: 'tissueType', title: 'Tissue type', database: 'f_tissue_type', type: 1 },
  { column: 'healthTypeDescription', title: 'Health type description', database: 'f_health_type_description', type: 1 },
  { column: 'cellTypeCount', title: 'Cell type count', database: 'f_cell_type_count', type: 2 },
  { column: 'cellCount', title: 'Cell count', database: 'f_cell_count', type: 2 }
];
