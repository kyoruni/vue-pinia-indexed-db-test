<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Pokemon } from '@/interfaces';
import { usePokemonsStore } from '@/stores/pokemons';

const pokemonsStore = usePokemonsStore();
pokemonsStore.prepareList();

const pokemons = computed((): Map<number, Pokemon> => {
  return pokemonsStore.pokemons
});

const isEmptyList = computed((): boolean => {
  return pokemonsStore.isPokemonsEmpty();
});
</script>

<template>
  <div class="pokemon-list">
    <h2>一覧ページ</h2>
    <nav id="breadcrumbs">
      <ul>
        <li>
          <RouterLink :to="{ name: 'TopPage' }">TOP</RouterLink>
        </li>
        <li>
          ポケモン一覧
        </li>
      </ul>
    </nav>
    <section>
      <h3>ポケモン一覧</h3>
      <p>
        <RouterLink :to="{ name: 'PokemonAdd' }">新規登録</RouterLink>
      </p>
      <ul>
        <li v-if="isEmptyList">
          ポケモンが登録されていません
        </li>
        <li v-for="[id, pokemon] in pokemons" :key="id">
          ID: {{ id }}
          <RouterLink :to="{ name: 'PokemonDetail', params: { id: id } }">{{ pokemon.name }}</RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>