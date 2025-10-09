<template>
  <BaseLoading id="trait_overview_detail" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-th-large', content: 'Fine-mapping result overview' }" id="position_overview">
      <template #head>
        <el-link :href="traitFileDownload()">
          <el-button size="small" type="primary"> Fine-mapping data ({{ fineMappingMethodValue }}) &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <BaseTabs active="finemap" :tabs-data="[{ name: 'finemap', title: 'FINEMAP' }, { name: 'susie', title: 'SuSiE' }]"
                  :change="fineMappingMethodChange" v-show="isHaveSusie"/>
        <BaseBr/>
        <LeftRight :is-left-right="isLeftRight" ref="leftRight">
          <template #left>
            <table class="table table-hover table-striped">
              <thead></thead>
              <tbody>
              <tr v-for="(item, i) in overviewTableData" :key="i">
                <th>
                  {{ item.key }}:
                  <BaseTooltip :content="item.description" v-if="item.description"><i class="fa fa-question-circle"></i></BaseTooltip>
                </th>
                <td v-html="item.value" v-if="item.key !== 'Source ID'"></td>
                <td v-if="item.key === 'Source ID'">
                  <el-button v-html="item.value" @click="sourceIdClick"></el-button>
                </td>
              </tr>
              </tbody>
            </table>
          </template>
          <template #right>
            <BaseSelect title="Genome:" :select-data="genomeData" width="40%" is-line :change-event="genomeChange" ref="genome"/>
            <BaseBr/>
            <BaseTabs active="echarts" :tabs-data="traitTabs">
              <template #echarts>
                <Echarts :resize-value="{ width: 600, height: 500}" ref="chrEcharts"/>
              </template>
              <template #description>
                <BaseTable :update-new-data="listVariantInformation"
                           :is-mounted="variantInfoIsMounted"
                           search-title=""
                           :width="98"
                           :content-width="20"
                           :field-width="20"
                           :service-search-width="90"
                           :button-size="[52, 30]"
                           :download-urls="[{'url': traitVariantInfoDownload(), 'title': `Download (${fineMappingMethodValue}-${genomeValue})`}]"
                           layout="total, prev, pager, next"
                           :page-sizes="[5, 10]"
                           :table-description="tableDescription"
                           ref="variantInfoTable"/>
              </template>
            </BaseTabs>
          </template>
        </LeftRight>
      </template>
    </SingleCard>
    <BaseDrawer title="Source Information" size="35%" ref="drawer">
      <table class=" table table-hover table-striped">
        <thead></thead>
        <tbody>
        <tr v-for="(item, i) in sourceTableData" :key="i">
          <th v-text="item.key"></th>
          <td v-html="item.value"></td>
        </tr>
        </tbody>
      </table>
    </BaseDrawer>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/Overview.less';
import DetailApi from '@/api/service/detailApi';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { ANALYSIS_FINE_MAPPING_METHOD_DATA, ANALYSIS_GENOME_DATA, chrCountOption, DETAIL_TRAIT_INFORMATION_TABLE_DESCRIPTION, getPubmedLink, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { TabsBase } from '@/service/model/components/tabs';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import { Page } from '@/service/model/reponse/request';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';

export default defineComponent({
  name: 'TraitOverview',
  components: {
    BaseTooltip,
    BaseBr,
    BaseSelect,
    BaseTable,
    BaseTabs,
    BaseDrawer,
    Echarts,
    BaseLoading,
    LeftRight,
    SingleCard
  },
  props: {
    traitId: {
      type: String,
      default: () => ''
    },
    isLeftRight: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const genome = ref();
    const drawer = ref();
    const chrEcharts = ref();
    const variantInfoTable = ref();
    const data = reactive({
      overviewTableData: [] as any,
      sampleTableData: [] as Array<KeyValue>,
      sourceTableData: [] as Array<KeyValue>,
      traitTabs: [
        {
          name: 'echarts',
          title: 'Chromosome count'
        },
        {
          name: 'description',
          title: 'Trait information'
        }
      ] as Array<TabsBase>,
      variantInfoIsMounted: false,
      isHaveSusie: false,
      genomeValue: '',
      fineMappingMethodValue: '',
      traitLabel: ''
    });
    // Get the trait overview data
    const getOverview = async () => {
      loading.value.loading = true;
      // sample ID
      const res: any = await DetailApi.getVariantTrait(props.traitId, data.fineMappingMethodValue);
      loading.value.loading = false;
      ArrayUtil.clear(data.overviewTableData);
      const { source } = res;
      const { genome } = source;
      data.genomeValue = genome;
      const liftOverGenome = genome === 'hg38' ? 'hg19' : 'hg38';
      // Sample overview
      data.overviewTableData.push({ key: 'Trait ID', value: res.traitId });
      data.overviewTableData.push({ key: 'Trait name', value: res.traitName });
      data.overviewTableData.push({ key: 'Trait label', value: res.traitCode });
      data.traitLabel = res.traitCode;
      data.overviewTableData.push({ key: 'Genome', value: genome, description: 'The original reference genome for collecting data.' });
      data.overviewTableData.push({ key: 'Trait abbreviation', value: res.traitAbbr });
      data.overviewTableData.push({ key: 'Trait description', value: res.trait });
      data.overviewTableData.push({ key: 'Author', value: res.author });
      data.overviewTableData.push({ key: 'Type', value: res.type });
      data.overviewTableData.push({ key: 'ICD-10', value: res.icd10 });
      data.overviewTableData.push({ key: 'Category', value: res.category });
      data.overviewTableData.push({ key: 'Subcategory', value: res.subcategory });
      data.overviewTableData.push({ key: 'Three category', value: res.threeCategory });
      data.overviewTableData.push({ key: 'Variant count', value: res.variantCount });
      data.overviewTableData.push({ key: 'The sum of all variant PP values', value: res.variantPpSum });
      data.overviewTableData.push({ key: `Variant count (${liftOverGenome})`, value: genome === 'hg38' ? res.hg19Count : res.hg38Count });
      data.overviewTableData.push({ key: `The sum of all variant PP values (${liftOverGenome})`, value: genome === 'hg38' ? res.hg19PpSum : res.hg38PpSum });
      data.overviewTableData.push({ key: 'Source ID', value: res.sourceId });
      data.overviewTableData.push({ key: 'Data source link', value: `<a href="${res.url}" target="_blank"> <i class="fa fa-link"></i> </a>` });
      // source information
      data.sourceTableData.push({ key: 'Source ID:', value: source.id });
      data.sourceTableData.push({ key: 'Source name:', value: `<a href="${source.link}" target="_blank">${source.name}</a>` });
      data.sourceTableData.push({ key: 'Source information:', value: source.source });
      data.sourceTableData.push({ key: 'Trait count:', value: source.filterCount });
      data.sourceTableData.push({ key: 'Source description:', value: source.description });
      data.sourceTableData.push({ key: 'Source PMID:', value: source.pmid === '-' ? '-' : getPubmedLink(source.pmid) });
    };

    const listVariantInformation = (page: Page) => DetailApi.listTraitInfo(props.traitId, genome.value.select, data.fineMappingMethodValue, page);

    const sourceIdClick = () => {
      drawer.value.drawer = true;
    };

    // Plot the chromosome count graph for the trait
    const getChrResize = () => {
      chrEcharts.value.startLoading();
      DetailApi.getTraitChrCount(props.traitId, genome.value.select, data.fineMappingMethodValue).then((res: any) => {
        chrEcharts.value.endLoading();
        chrEcharts.value.drawEcharts(chrCountOption(res));
      });
    };

    const genomeChange = () => {
      data.genomeValue = genome.value.select;
      variantInfoTable.value.dataUpdate();
      getChrResize();
    };

    const fineMappingMethodChange = (tag: any) => {
      data.fineMappingMethodValue = tag.paneName as string;
      variantInfoTable.value.dataUpdate();
      getOverview();
      getChrResize();
    };

    const traitFileDownload = () => {
      const suffix = data.fineMappingMethodValue === 'finemap' ? '' : '_susie';
      return `${STATIC_DOWNLOAD_PATH}/variant_${suffix}/trait/${data.traitLabel}.txt`;
    };
    const traitVariantInfoDownload = () => {
      const suffix = data.fineMappingMethodValue === 'finemap' ? '' : '_susie';
      return `${STATIC_DOWNLOAD_PATH}/variant_${suffix}/${data.genomeValue}/${data.traitLabel}.bed`;
    };

    onMounted(async () => {
      data.fineMappingMethodValue = ANALYSIS_FINE_MAPPING_METHOD_DATA[0].value as string;
      data.isHaveSusie = Number(props.traitId.split('_')[2]) <= 79;
      await getOverview();
      genome.value.select = ANALYSIS_GENOME_DATA[0].value;
      data.variantInfoIsMounted = true;
      getChrResize();
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      genome,
      drawer,
      chrEcharts,
      variantInfoTable,
      sourceIdClick,
      genomeChange,
      fineMappingMethodChange,
      traitFileDownload,
      traitVariantInfoDownload,
      listVariantInformation,
      genomeData: ANALYSIS_GENOME_DATA,
      fineMappingMethodData: ANALYSIS_FINE_MAPPING_METHOD_DATA,
      tableDescription: DETAIL_TRAIT_INFORMATION_TABLE_DESCRIPTION
    };
  }
});
</script>
