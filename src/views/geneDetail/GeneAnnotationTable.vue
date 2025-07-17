<template>
  <div id="gene_annotation_table">
    <BaseTabs active="common_snp" :tabs-data="annotationTabs">
      <template #common_snp>
        <BaseTable :table-data="commonSnpData" :is-service-paging="false" :table-description="commonSnpTableDescription" ref="commonSnp"/>
      </template>
      <template #risk_snp>
        <BaseTable :table-data="riskSnpData" :is-service-paging="false" :table-description="riskSnpTableDescription" ref="riskSnp"/>
      </template>
      <template #eqtl>
        <BaseTable :table-data="eqtlData" :is-service-paging="false" :table-description="eqtlTableDescription" ref="eqtl"/>
      </template>
      <template #enhancer_sea>
        <BaseTable :table-data="enhancerSeaData" :is-service-paging="false" :table-description="enhancerSeaTableDescription" ref="enhancerSea"/>
      </template>
      <template #enhancer_sedb>
        <BaseTable :table-data="enhancerSedbData" :is-service-paging="false" :table-description="enhancerSedbTableDescription" ref="enhancerSedb"/>
      </template>
      <template #super_enhancer_dbsuper>
        <BaseTable :table-data="superEnhancerDbsuperData" :is-service-paging="false" :table-description="superEnhancerDbsuperTableDescription" ref="superEnhancerDbsuper"/>
      </template>
      <template #super_enhancer_sea>
        <BaseTable :table-data="superEnhancerSeaData" :is-service-paging="false" :table-description="superEnhancerSeaTableDescription" ref="superEnhancerSea"/>
      </template>
      <template #super_enhancer_sedb>
        <BaseTable :table-data="superEnhancerSedbData" :is-service-paging="false" :table-description="superEnhancerSedbTableDescription" ref="superEnhancerSedb"/>
      </template>
    </BaseTabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import {
  GENE_DETAIL_COMMON_SNP_TABLE_DESCRIPTION,
  GENE_DETAIL_ENHANCER_SEA_TABLE_DESCRIPTION,
  GENE_DETAIL_ENHANCER_SEDB_TABLE_DESCRIPTION,
  GENE_DETAIL_EQTL_TABLE_DESCRIPTION,
  GENE_DETAIL_GENOME_TABS,
  GENE_DETAIL_REGULATION_REGION_TABS,
  GENE_DETAIL_RISK_SNP_TABLE_DESCRIPTION,
  GENE_DETAIL_SUPER_ENHANCER_DBSUPER_TABLE_DESCRIPTION, GENE_DETAIL_SUPER_ENHANCER_SEA_TABLE_DESCRIPTION, GENE_DETAIL_SUPER_ENHANCER_SEDB_TABLE_DESCRIPTION
} from '@/assets/ts';
import GeneTfDetailApi from '@/api/service/geneTfDetailApi';
import Base from '@/service/util/base/base';

export default defineComponent({
  name: 'GeneAnnotationTable',
  components: {
    BaseTabs,
    BaseTable
  },
  props: {
    geneId: {
      type: String,
      default: () => ''
    },
    genome: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const commonSnp = ref();
    const eqtl = ref();
    const riskSnp = ref();
    const enhancerSea = ref();
    const enhancerSedb = ref();
    const superEnhancerDbsuper = ref();
    const superEnhancerSea = ref();
    const superEnhancerSedb = ref();
    const data = reactive({
      chr: '',
      commonSnpData: [] as Array<any>,
      riskSnpData: [] as Array<any>,
      eqtlData: [] as Array<any>,
      enhancerSeaData: [] as Array<any>,
      enhancerSedbData: [] as Array<any>,
      superEnhancerDbsuperData: [] as Array<any>,
      superEnhancerSeaData: [] as Array<any>,
      superEnhancerSedbData: [] as Array<any>
    });

    const getGeneInfo = () => {
      GeneTfDetailApi.getGeneById(props.geneId, props.genome).then((res: any) => {
        data.chr = res.chr;
      });
    };

    const listGeneInteractiveCommonSnpInfo = () => {
      commonSnp.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveCommonSnp(props.geneId, props.genome).then((res: any) => {
        commonSnp.value.endLoading();
        data.commonSnpData = res;
      });
    };

    const listGeneInteractiveRiskSnpInfo = () => {
      riskSnp.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveRiskSnp(props.geneId, props.genome).then((res: any) => {
        riskSnp.value.endLoading();
        data.riskSnpData = res;
      });
    };

    const listGeneInteractiveEqtlInfo = () => {
      eqtl.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveEqtl(props.geneId, props.genome).then((res: any) => {
        eqtl.value.endLoading();
        data.eqtlData = res;
      });
    };

    const listGeneInteractiveEnhancerSeaInfo = () => {
      enhancerSea.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveEnhancerSea(props.geneId, props.genome).then((res: any) => {
        enhancerSea.value.endLoading();
        data.enhancerSeaData = res;
      });
    };

    const listGeneInteractiveEnhancerSedbInfo = () => {
      enhancerSedb.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveEnhancerSedb(props.geneId, props.genome).then((res: any) => {
        enhancerSedb.value.endLoading();
        data.enhancerSedbData = res;
      });
    };

    const listGeneInteractiveSuperEnhancerDbsuperInfo = () => {
      superEnhancerDbsuper.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveSuperEnhancerDbsuper(props.geneId, props.genome).then((res: any) => {
        superEnhancerDbsuper.value.endLoading();
        data.superEnhancerDbsuperData = res;
      });
    };

    const listGeneInteractiveSuperEnhancerSeaInfo = () => {
      superEnhancerSea.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveSuperEnhancerSea(props.geneId, props.genome).then((res: any) => {
        superEnhancerSea.value.endLoading();
        data.superEnhancerSeaData = res;
      });
    };

    const listGeneInteractiveSuperEnhancerSedbInfo = () => {
      superEnhancerSedb.value.startLoading();
      GeneTfDetailApi.listGeneInteractiveSuperEnhancerSedb(props.geneId, props.genome).then((res: any) => {
        superEnhancerSedb.value.endLoading();
        data.superEnhancerSedbData = res;
      });
    };

    const getAllData = () => {
      listGeneInteractiveCommonSnpInfo();
      listGeneInteractiveRiskSnpInfo();
      listGeneInteractiveEqtlInfo();
      listGeneInteractiveEnhancerSeaInfo();
      listGeneInteractiveEnhancerSedbInfo();
      listGeneInteractiveSuperEnhancerDbsuperInfo();
      listGeneInteractiveSuperEnhancerSeaInfo();
      listGeneInteractiveSuperEnhancerSedbInfo();
    };

    onMounted(() => {
      if (Base.noNull(props.geneId) && Base.noNull(props.genome)) {
        getGeneInfo();
      }
    });

    watch(() => ({ value1: props.geneId, value2: props.genome }), () => {
      if (Base.noNull(props.geneId) && Base.noNull(props.genome)) {
        getGeneInfo();
        getAllData();
      }
    }, {
      immediate: true,
      deep: true
    });

    return {
      ...toRefs(data),
      commonSnp,
      eqtl,
      riskSnp,
      enhancerSea,
      enhancerSedb,
      superEnhancerDbsuper,
      superEnhancerSea,
      superEnhancerSedb,
      annotationTabs: GENE_DETAIL_REGULATION_REGION_TABS,
      genomeTabs: GENE_DETAIL_GENOME_TABS,
      commonSnpTableDescription: GENE_DETAIL_COMMON_SNP_TABLE_DESCRIPTION,
      eqtlTableDescription: GENE_DETAIL_EQTL_TABLE_DESCRIPTION,
      riskSnpTableDescription: GENE_DETAIL_RISK_SNP_TABLE_DESCRIPTION,
      enhancerSeaTableDescription: GENE_DETAIL_ENHANCER_SEA_TABLE_DESCRIPTION,
      enhancerSedbTableDescription: GENE_DETAIL_ENHANCER_SEDB_TABLE_DESCRIPTION,
      superEnhancerDbsuperTableDescription: GENE_DETAIL_SUPER_ENHANCER_DBSUPER_TABLE_DESCRIPTION,
      superEnhancerSeaTableDescription: GENE_DETAIL_SUPER_ENHANCER_SEA_TABLE_DESCRIPTION,
      superEnhancerSedbTableDescription: GENE_DETAIL_SUPER_ENHANCER_SEDB_TABLE_DESCRIPTION
    };
  }
});
</script>
