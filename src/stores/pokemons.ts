import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Pokemon } from '@/interfaces';

interface State {
  pokemonList: Map<number, Pokemon>;
};

export const usePokemonsStore = defineStore('pokemons', () => {
  // store
  const pokemons = ref(new Map<number, Pokemon>());
  // getters
  const getById = (id: number): Pokemon => {
    const pokemon = pokemons.value.get(id) as Pokemon;
    return pokemon;
  };
  const isPokemonsEmpty = (): boolean => {
    return pokemons.value.size === 0;
  };
  // action
  function prepareList () {
    let pokemonsData = new Map<number, Pokemon>();
    const pokemonsJSONString = sessionStorage.getItem('pokemons');
    // セッションストレージにデータがあれば取得
    if (pokemonsJSONString) {
      const pokemonsJSON = JSON.parse(pokemonsJSONString);
      pokemonsData = new Map<number, Pokemon>(pokemonsJSON);
    }
    pokemons.value = pokemonsData;
  };

  function addPokemon (pokemon: Pokemon) {
    pokemons.value.set(pokemon.id, pokemon);
    const pokemonJSONString = JSON.stringify([...pokemons.value]);
    sessionStorage.setItem('pokemons', pokemonJSONString);
  };

  return { pokemons, isPokemonsEmpty, prepareList, getById, addPokemon };
});