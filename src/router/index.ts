import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TopPage from'@/views/TopPage.vue';

const routeSettings: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'TopPage',
    component: TopPage,
  },
  {
    path: '/pokemons',
    name: 'PokemonList',
    // 動的インポート
    // 表示が必要になってからインポートする
    // memo: TopPageは必ず表示されるので、事前にインポートしていてよい
    component: () => {
      return import('@/views/PokemonList.vue');
    },
  },
  {
    path: '/pokemon/:id',
    name: 'PokemonDetail',
    component: () => {
      return import('@/views/PokemonDetail.vue');
    },
    props: (routes) => {
      return {
        id: Number(routes.params.id),
      }
    },
  },
  {
    path: '/pokemon/add',
    name: 'PokemonAdd',
    component: () => {
      return import('@/views/PokemonAdd.vue');
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => {
      return import('@/views/NotFound.vue');
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings,
});

export default router;