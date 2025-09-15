import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { clearPending } from '@/plugins/axios';
import Index from '@/views/Home.vue';
import Header from '@/views/common/Header.vue';
import Footer from '@/views/common/Footer.vue';
import DataBrowse from '@/views/DataBrowse.vue';
import Statistics from '@/views/Statistics.vue';
import Contact from '@/views/Contact.vue';
import Detail from '@/views/Detail.vue';
import searchRouter from '@/router/modules/search';
import analysisRouter from '@/router/modules/analysis';
import GeneDetail from '@/views/GeneDetail.vue';
import TfDetail from '@/views/TfDetail.vue';
import SimpleSearchResult from '@/views/homeResult/SimpleSearchResult.vue';
import Download from '@/views/Download.vue';
import VariantDetail from '@/views/VariantDetail.vue';
import OnLine from '@/views/OnLine.vue';
import OnLineInformation from '@/views/onLine/OnLineInformation.vue';
import OnLineExec from '@/views/onLine/OnLineExec.vue';
import OnLineResult from '@/views/onLine/OnLineResult.vue';

const props = (active: number) => ({
  default: true,
  header: { active },
  footer: true
});

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    components: {
      default: Index,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/simple_search',
    name: 'SimpleSearchResult',
    components: {
      default: SimpleSearchResult,
      header: Header,
      footer: Footer
    }
  },
  ...analysisRouter,
  {
    path: '/data_browse',
    name: 'DataBrowse',
    components: {
      default: DataBrowse,
      header: Header,
      footer: Footer
    },
    props: props(1)
  },
  ...searchRouter,
  {
    path: '/statistics',
    name: 'Statistics',
    components: {
      default: Statistics,
      header: Header,
      footer: Footer
    },
    props: props(4)
  },
  {
    path: '/download',
    name: 'Download',
    components: {
      default: Download,
      header: Header,
      footer: Footer
    },
    props: props(5)
  },
  {
    path: '/contact',
    name: 'Contact',
    components: {
      default: Contact,
      header: Header,
      footer: Footer
    },
    props: props(6)
  },
  {
    path: '/on_line',
    name: 'OnLine',
    components: {
      default: OnLine,
      header: Header,
      footer: Footer
    },
    props: props(7)
  },
  {
    path: '/on_line_information',
    name: 'OnLineInformation',
    components: {
      default: OnLineInformation,
      header: Header,
      footer: Footer
    },
    props: props(7)
  },
  {
    path: '/one_line_exec',
    name: 'OnLineExec',
    components: {
      default: OnLineExec,
      header: Header,
      footer: Footer
    },
    props: props(7)
  },
  {
    path: '/job_detail',
    name: 'OnLineResult',
    components: {
      default: OnLineResult,
      header: Header,
      footer: Footer
    },
    props: props(7)
  },
  {
    path: '/detail',
    name: 'Detail',
    components: {
      default: Detail,
      header: Header,
      footer: Footer
    },
    props: props(-1)
  },
  {
    path: '/gene_detail',
    name: 'GeneDetail',
    components: {
      default: GeneDetail,
      header: Header,
      footer: Footer
    },
    props: props(-1)
  },
  {
    path: '/tf_detail',
    name: 'TfDetail',
    components: {
      default: TfDetail,
      header: Header,
      footer: Footer
    },
    props: props(-1)
  },
  {
    path: '/variant_detail',
    name: 'VariantDetail',
    components: {
      default: VariantDetail,
      header: Header,
      footer: Footer
    },
    props: props(-1)
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // Clear all requests before jumping the route
  clearPending();
  next();
});

export default router;
