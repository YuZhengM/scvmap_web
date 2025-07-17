import { createStore } from 'vuex';
import Storage from '@/service/util/base/storage';
import { STORAGE_ACCEPT_ID } from '@/assets/ts';

export default createStore({
  state: {
    accept: false as boolean
  },
  mutations: {},
  actions: {
    setAccept: ({ state }, accept: boolean) => {
      state.accept = accept;
      Storage.save(STORAGE_ACCEPT_ID, state.accept);
    },
    getAccept: ({ state }) => {
      const accept = Storage.get<any>(STORAGE_ACCEPT_ID);
      state.accept = accept || false;
    }
  },
  modules: {}
});
