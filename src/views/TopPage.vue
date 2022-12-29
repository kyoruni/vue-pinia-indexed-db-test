<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="top-page">
    <h2>TopPage.vue</h2>
    <nav id="breadcrumbs">
      <ul>
        <li>TOP</li>
      </ul>
    </nav>
    <section>
      <p>
        <RouterLink :to="{ name: 'PokemonList' }">
          一覧ページ
        </RouterLink>
      </p>
    </section>
  </div>
</template>