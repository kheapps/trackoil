<script setup lang="ts">
import { computed, ref, watch } from "vue";

import axios from "axios";

import type { facetType } from "../custom_types";
import SearchDropDown from "../components/search_dropdown.vue";

const api_url =
  "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&facet=ville&facet=prix_nom&facet=adresse";

// url par ville : https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&refine.ville=PARIS

const config = {
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  // },
};

const data = ref();

const refineVille = ref("");

const villes = computed<facetType[]>(() => {
  if (data.value) {
    const v = data.value["facet_groups"].find(
      (element: { name: string }) => element.name === "ville"
    ).facets;
    console.log("computed villes ", v);
    return v;
  }
  return [] as facetType[];
});

watch(refineVille, () =>
  console.log("updated refine ville value : ", refineVille.value)
);

// const carburants = ref<facetType[]>();
// const adresses = ref<facetType[]>();

axios
  .get(api_url, config)
  .then((result) => {
    console.log("result : ", result.data);
    data.value = result.data;

    // villes.value = result.data["facet_groups"].find(
    //   (element: { name: string }) => element.name === "ville"
    // ).facets;

    // carburants.value = result.data["facet_groups"].find(
    //   (element: { name: string }) => element.name === "prix_nom"
    // ).facets;

    // adresses.value = result.data["facet_groups"].find(
    //   (element: { name: string }) => element.name === "adresse"
    // ).facets;
  })
  .catch((err) => {
    console.error("error : ", err);
  });
</script>

<template>
  <div class="flex-col -w-3 m-3">
    <SearchDropDown :items="villes" v-model="refineVille" />
  </div>
</template>
