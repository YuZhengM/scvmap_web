// noinspection HttpUrlsUsage,SpellCheckingInspection

// 项目名, 项目版本等
export const PROJECT_NAME = 'scVMAP';
export const PROJECT_VERSION = 'v1.0.0';

export const PROJECT_URL = process.env.NODE_ENV === 'production' ? 'https://${IP}/scvmap_service/' : 'http://localhost:81/api/';
const DOMAIN_NAME = 'https://${IP}/';

export const PROJECT_WEB_URL = `${DOMAIN_NAME}scvmap/`;
// 静态资源路径
export const STATIC_DOWNLOAD_PATH = `${DOMAIN_NAME}scvmap_static/download`;
export const STATIC_USER_PATH = `${DOMAIN_NAME}scvmap_static/user`;
export const STATIC_HOMER_PATH = `${DOMAIN_NAME}scvmap_static/homer`;
export const STATIC_MAGMA_PATH = `${DOMAIN_NAME}scvmap_static/magma`;
// 文件操作路径
export const FILE_UPLOAD_URL = `${PROJECT_URL}file/upload`;

// 存储状态 key 值
export const STORAGE_ACCEPT_ID = 'scvmap14253365422663655162212851';

// 页面连接
export const linkTraitDetail = (traitId: string) => `detail?traitId=${traitId}`;
export const linkSampleDetail = (sampleId: string) => `detail?sampleId=${sampleId}`;
export const linkJobDetail = (jobId: string) => `job_detail?jobId=${jobId}`;
export const linkDetailGene = (gene: string) => `gene_detail?gene=${gene}`;
export const linkDetailTf = (tf: string) => `tf_detail?tf=${tf}`;
export const linkDetailVariant = (variant: string) => `variant_detail?variant=${variant}`;
export const getSampleDetailLink = (sampleId: string) => `<a href="${linkSampleDetail(sampleId)}" target="_blank">${sampleId}</a>`;
export const getJobDetailLink = (jobId: string) => `<a href="${linkJobDetail(jobId)}" target="_blank">${jobId}</a>`;

export const linkPmid = (pmid: string) => `https://www.ncbi.nlm.nih.gov/pubmed/${pmid}`;
export const getPubmedLink = (pmid: string) => `<a href="https://www.ncbi.nlm.nih.gov/pubmed/${pmid}" target="_blank">${pmid}</a>`;

export const linkGeo = (gsm: string) => `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${gsm}`;
export const getGeoLink = (geoId: string) => `<a href="${linkGeo(geoId)}" target="_blank">${geoId}</a>`;

export const getExampleUrlHtml = (downloadUrl: string, title: string) => `<a href="${downloadUrl}" target="_blank" class="el-link">`
  + `<button class="el-button el-button--small el-button--primary">${title}<i class="fas fa-file-download el-icon--right"></i></button></a>`;
