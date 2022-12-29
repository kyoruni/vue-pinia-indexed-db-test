import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Pokemon } from '@/interfaces';

interface State {
  pokemonList: Map<number, Pokemon>;
  isLoading: boolean;
};

export const usePokemonsStore = defineStore('pokemons', () => {
  // state
  const pokemons = ref(new Map<number, Pokemon>());
  const isLoading = ref(true);
  // getters
  const getById = (id: number): Pokemon => {
    const pokemon = pokemons.value.get(id) as Pokemon;
    return pokemon;
  };
  const isPokemonsEmpty = (): boolean => {
    return pokemons.value.size === 0;
  };
  // action
  async function prepareList (): Promise<boolean> {
    // DBオブジェクトを取得
    const database = await getDatabase();
    const promise = new Promise<boolean>(
      (resolve, reject) => {
        // トランザクションオブジェクトを取得
        const transaction = database.transaction('pokemons', 'readonly');
        // オブジェクトストアを取得
        const objectStore = transaction.objectStore('pokemons');
        // 空のリストを生成
        const pokemonList = new Map<number, Pokemon>();
        // オブジェクトストアのデータを取得
        const request = objectStore.openCursor();
        // データ取得に成功
        request.onsuccess = (event) => {
          // カーソルオブジェクトを取得
          const target = event.target as IDBRequest;
          const cursor = target.result as IDBCursorWithValue;
          if (cursor) {
            // カーソルのキーを取得
            const id = cursor.key as number;
            // カーソルの値を取得
            const pokemon = cursor.value as Pokemon;
            // リストに入れる
            pokemonList.set(id, pokemon);
            // カーソルの次のデータへ
            cursor.continue();
          }
        };
        // トランザクションに成功
        transaction.oncomplete = () => {
          // stateに入れる
          pokemons.value = pokemonList;
          // 読み込み中でなくなる
          isLoading.value = false;
          // 非同期処理が完了したので、Promiseをtrueにしておく
          resolve(true);
        };
        // トランザクションに失敗
        transaction.onerror = (event) => {
          console.log('ERROR: データ取得に失敗しました', event);
          reject(new Error('ERROR: データ取得に失敗しました'));
        };
      }
    );
    // let pokemonsData = new Map<number, Pokemon>();
    // const pokemonsJSONString = sessionStorage.getItem('pokemons');
    // // セッションストレージにデータがあれば取得
    // if (pokemonsJSONString) {
    //   const pokemonsJSON = JSON.parse(pokemonsJSONString);
    //   pokemonsData = new Map<number, Pokemon>(pokemonsJSON);
    // }
    // pokemons.value = pokemonsData;
    return promise;
  };

  async function addPokemon (pokemon: Pokemon): Promise<boolean> {
    // オブジェクト作成
    const pokemonAdd: Pokemon = {
      ...pokemon
    };
    // DBオブジェクトを取得
    const database = await getDatabase();
    const promise = new Promise<boolean>(
      (resolve, reject) => {
        // トランザクションオブジェクトを取得
        const transaction = database.transaction('pokemons', 'readwrite');
        // オブジェクトストアを取得
        const objectStore = transaction.objectStore('pokemons');
        // 登録
        objectStore.put(pokemonAdd);
        // トランザクション成功
        transaction.oncomplete = () => {
          // 非同期処理が完了したので、Promiseをtrueにしておく
          resolve(true);
        };
        // トランザクション失敗
        transaction.onerror = (event) => {
          console.log('ERROR: データ登録に失敗しました', event);
          reject(new Error('ERROR: データ登録に失敗しました'));
        };
      }
    );
    return promise;
  };

  let _database: IDBDatabase;
  async function getDatabase (): Promise<IDBDatabase> {
    const promise = new Promise<IDBDatabase>(
      (resolve, reject) => {
        if (_database) {
          console.log('DEBUG: DBあるよ');
          resolve(_database);
        } else {
          // IndexedDBをオープン(存在しない場合は作成) 引数 DB名,DBのバージョン番号
          // バージョン番号がブラウザのDBより大きい場合、onupgradeneededが呼ばれる
          const request = window.indexedDB.open('asyncdb', 1);
          request.onupgradeneeded = (event) => {
            // TypeScriptはevent.target.resultで直接取れないので、一旦オブジェクトに変換
            const target = event.target as IDBRequest;
            const database = target.result as IDBDatabase;
            database.createObjectStore('pokemons', { keyPath: 'id' });
          };
          request.onsuccess = (event) => {
            const target = event.target as IDBRequest;
            const _database = target.result as IDBDatabase;
            resolve(_database);
          };
          request.onerror = (event) => {
            console.log('ERROR: DBをオープンできません');
            reject(new Error('ERROR: DBをオープンできません'));
          };
        }
      }
    );
    return promise;
  };

  return { pokemons, isLoading, isPokemonsEmpty, prepareList, getById, addPokemon, getDatabase };
});