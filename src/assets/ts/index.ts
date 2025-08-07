import { NavBase } from '@/service/model/components/nav';

export * from '@/assets/ts/home';
export * from '@/assets/ts/contact';
export * from '@/assets/ts/statistics';
export * from '@/assets/ts/dataBrowse';
export * from '@/assets/ts/search';
export * from '@/assets/ts/searchResult';
export * from '@/assets/ts/analysis';
export * from '@/assets/ts/analysisResult';
export * from '@/assets/ts/download';
export * from '@/assets/ts/statusUtil';
export * from '@/assets/ts/detail';
export * from '@/assets/ts/geneDetail';
export * from '@/assets/ts/variantDetail';

// 导航栏
export const HEADER_MENUS: Array<NavBase> = [
  {
    title: 'Home',
    click: '/',
    href: process.env.BASE_URL,
    isShow: false
  },
  {
    title: 'Data-browse',
    click: '/data_browse',
    href: `${process.env.BASE_URL}data_browse`,
    isShow: false
  },
  {
    title: 'Search',
    click: '/search',
    href: `${process.env.BASE_URL}search`,
    isShow: false
  },
  {
    title: 'Analysis',
    click: '/analysis',
    href: `${process.env.BASE_URL}analysis`,
    isShow: false
  },
  {
    title: 'Statistics',
    click: '/statistics',
    href: `${process.env.BASE_URL}statistics`,
    isShow: false
  },
  {
    title: 'Download',
    click: '/download',
    href: `${process.env.BASE_URL}download`,
    isShow: false
  },
  {
    title: 'Contact',
    click: '/contact',
    href: `${process.env.BASE_URL}contact`,
    isShow: false
  },
  {
    title: 'Help <i class="fa fa-arrow-up-right-from-square"></i>',
    href: 'https://scvmap.readthedocs.io/en/latest/',
    isShow: false
  }
];
