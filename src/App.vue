<script setup lang="ts">
import { RouterView } from "vue-router";
import { ChartBarIcon } from "@heroicons/vue/24/outline";

// const dataSource =
//   "https://data.economie.gouv.fr/explore/dataset/prix-carburants-fichier-instantane-test-ods-copie/information/";
</script>

<template>
  <header class="relative flex justify-center items-center py-7 mb-10">
    <h1 class="text-lg md:text-2xl font-bold">Prix des carburant</h1>
    <button
      class="absolute right-3 bg-teal-500 dark:bg-teal-800 px-5 py-2 rounded-full text-slate-100 text-sm md:text-base flex justify-center items-center"
    >
      <ChartBarIcon class="h-5" />
      <p class="ml-3 hidden md:block">Suivis</p>
    </button>
  </header>

  <main>
    <RouterView class="text-black dark:text-white" />
  </main>

  <footer
    class="flex flex-col justify-center items-center mt-10 py-9 text-sm md:text-base"
  >
    <a
      class="flex justify-center items-center"
      href="https://github.com/kheapps/trackoil"
      target="_blank"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-github"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
      <p class="ml-3">Voir le code source</p>
    </a>
    <p>
      Les données proviennent de cette
      <a
        class="text-teal-700"
        href="https://data.economie.gouv.fr/explore/dataset/prix-carburants-fichier-instantane-test-ods-copie/api/"
        target="_blank"
      >
        API.
      </a>
    </p>
    <h3>
      © 2022
      <a href="https://kheapps.com" target="_blank"> Kheapps </a>
    </h3>
  </footer>
</template>

<style>
.loading-spinner {
  display: inline-block;
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  -webkit-animation: spin 1s linear infinite;
}
.loading-spinner.small {
  width: 20px;
  height: 20px;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
