import Search from '@/views/Search.vue';
import Header from '@/views/common/Header.vue';
import Footer from '@/views/common/Footer.vue';
import TraitSearchResult from '@/views/searchResult/TraitSearchResult.vue';
import SampleSearchResult from '@/views/searchResult/SampleSearchResult.vue';

const props = (active: number) => ({
  default: true,
  header: { active },
  footer: true
});

// active value
const active = 2;

// search page
const search = {
  path: '/search',
  name: 'Search',
  components: {
    default: Search,
    header: Header,
    footer: Footer
  },
  props: props(active)
};

// search result pages
const searchResult = [
  {
    path: '/search_trait',
    name: 'TraitSearchResult',
    components: {
      default: TraitSearchResult,
      header: Header,
      footer: Footer
    },
    props: props(active)
  },
  {
    path: '/search_sample',
    name: 'SampleSearchResult',
    components: {
      default: SampleSearchResult,
      header: Header,
      footer: Footer
    },
    props: props(active)
  }
];

const searchRouter = [
  search,
  ...searchResult
];

export default searchRouter;
