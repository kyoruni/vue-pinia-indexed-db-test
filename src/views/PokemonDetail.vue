<script setup lang="ts">
import { inject, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import type { Pokemon } from '@/interfaces';
import { usePokemonsStore } from '@/stores/pokemons';
interface Props {
  id: number;
};
const router = useRouter();
const props = defineProps<Props>();
const pokemonsStore = usePokemonsStore();
const pokemon = computed((): Pokemon => {
  return pokemonsStore.getById(props.id);
});

const submit = (pokemonId: number) => {
  const confirm = window.confirm('削除してもよろしいですか？');
  if (!confirm) {
    return;
  }
  const promise = pokemonsStore.deletePokemon(pokemonId);
  promise.then(
    (result: boolean) => {
      if (result) {
        router.push({ name: 'PokemonList'} );
      }
    }
  );
  promise.catch(
    (error) => {
      console.log('データ削除に失敗しました', error);
    }
  );
};
</script>

<template>
  <div class="pokemon-detail">
    <h2>ポケモン詳細</h2>
    <nav id="breadcrumbs">
      <ul>
        <li>
          <RouterLink :to="{ name: 'TopPage' }">TOP</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'PokemonList' }">ポケモン一覧</RouterLink>
        </li>
        <li>ポケモン詳細</li>
      </ul>
    </nav>
    <section>
      <h3>ポケモン詳細情報</h3>
      <dl>
        <dt>ID</dt>
        <dd>{{ pokemon.id }}</dd>
        <dt>名前</dt>
        <dd>{{ pokemon.name }}</dd>
        <dt>タイプ1</dt>
        <dd>{{ pokemon.type1 }}</dd>
        <dt>タイプ2</dt>
        <dd>{{ pokemon.type2 || '---' }}</dd>
        <dt>分類</dt>
        <dd>{{ pokemon.species }}ポケモン</dd>
      </dl>
      <form @submit.prevent="submit(pokemon.id)">
        <button type="submit">削除</button>
      </form>
    </section>
  </div>
</template>