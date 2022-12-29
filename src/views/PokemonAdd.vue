<script setup lang="ts">
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import type { Pokemon } from '@/interfaces';
import { usePokemonsStore } from '@/stores/pokemons';

const router = useRouter();
const pokemonsStore = usePokemonsStore();
const pokemon: Pokemon = reactive(
  {
    id: 0,
    name: '',
    type1: '',
    type2: '',
    species: ''
  }
);
const types = [
  'ノーマル',
  'ほのお',
  'みず',
  'くさ',
  'でんき',
  'こおり',
  'かくとう',
  'どく',
  'いわ',
  'じめん',
  'ひこう',
  'エスパー',
  'むし',
  'ゴースト',
  'ドラゴン',
  'あく',
  'はがね',
  'フェアリー',
];
const submit = () => {
  pokemonsStore.addPokemon(pokemon);
  router.push({ name: 'PokemonList' });
};
</script>

<template>
  <div class="pokemon-add">
    <h2>ポケモン新規登録</h2>
    <nav id="breadcrumbs">
      <ul>
        <li>
          <RouterLink :to="{ name: 'TopPage' }">TOP</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'PokemonList' }">ポケモン一覧</RouterLink>
        </li>
        <li>ポケモン新規登録</li>
      </ul>
    </nav>
    <section>
      <p>登録ボタンを押してね</p>
      <form @submit.prevent="submit">
        <dl>
          <!-- ID -->
          <dt>
            <label for="id">ID</label>
          </dt>
          <dd>
            <input id="id" type="number" v-model.number="pokemon.id" required/>
          </dd>
          <!-- 名前 -->
          <dt>
            <label for="name">名前</label>
          </dt>
          <dd>
            <input id="name" type="text" v-model="pokemon.name" required/>
          </dd>
          <!-- タイプ1 -->
          <dt>
            <label for="type1">タイプ1</label>
          </dt>
          <dd>
            <select id="type1" v-model="pokemon.type1" required>
              <option v-for="(type, index) in types" :key="index">
                {{  type  }}
              </option>
            </select>
          </dd>
          <!-- タイプ2 -->
          <dt>
            <label for="type2">タイプ2</label>
          </dt>
          <dd>
            <select id="type2" v-model="pokemon.type2">
              <option v-for="(type, index) in types" :key="index">
                {{  type  }}
              </option>
            </select>
          </dd>
          <!-- 分類 -->
          <dt>
            <label for="species">分類</label>
          </dt>
          <dd>
            <input id="species" type="text" v-model="pokemon.species" required/> ポケモン
          </dd>
        </dl>
        <button type="submit">登録</button>
      </form>
    </section>
  </div>
</template>