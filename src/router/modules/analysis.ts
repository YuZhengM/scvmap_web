import Analysis from '@/views/Analysis.vue';
import Header from '@/views/common/Header.vue';
import Footer from '@/views/common/Footer.vue';
import AnalysisMultiTrait from '@/views/analysisResult/AnalysisMultiTrait.vue';
import AnalysisGeneExplore from '@/views/analysisResult/AnalysisGeneExplore.vue';
import AnalysisTfExplore from '@/views/analysisResult/AnalysisTfExplore.vue';
import AnalysisCompareSc from '@/views/analysisResult/AnalysisCompareSc.vue';
import AnalysisCompareTrait from '@/views/analysisResult/AnalysisCompareTrait.vue';

const props = (active: number) => ({
  default: true,
  header: { active },
  footer: true
});

// active value
const active = 3;

// analysis page
const analysis = {
  path: '/analysis',
  name: 'Analysis',
  components: {
    default: Analysis,
    header: Header,
    footer: Footer
  },
  props: props(active)
};

// analysis result pages
const analysisResult = [
  {
    path: '/analysis_multi_trait',
    name: 'AnalysisMultiTrait',
    components: {
      default: AnalysisMultiTrait,
      header: Header,
      footer: Footer
    },
    props: props(active)
  },
  {
    path: '/analysis_gene',
    name: 'AnalysisGeneExplore',
    components: {
      default: AnalysisGeneExplore,
      header: Header,
      footer: Footer
    },
    props: props(active)
  },
  {
    path: '/analysis_tf',
    name: 'AnalysisTfExplore',
    components: {
      default: AnalysisTfExplore,
      header: Header,
      footer: Footer
    },
    props: props(active)
  },
  {
    path: '/analysis_compare_sc',
    name: 'AnalysisCompareSc',
    components: {
      default: AnalysisCompareSc,
      header: Header,
      footer: Footer
    },
    props: props(active)
  },
  {
    path: '/analysis_compare_trait',
    name: 'AnalysisCompareTrait',
    components: {
      default: AnalysisCompareTrait,
      header: Header,
      footer: Footer
    },
    props: props(active)
  }
];

const analysisRouter = [
  analysis,
  ...analysisResult
];

export default analysisRouter;
