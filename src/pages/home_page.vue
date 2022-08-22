<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { useVillesStore } from "@/stores/villes";
import { useCarburantStore } from "@/stores/carburant";
import { useStationStore } from "@/stores/stations";
import SearchDropDown from "@/components/search_dropdown.vue";

// VILLES *********

const villeStore = useVillesStore();
const { items: villes } = storeToRefs(villeStore);

villeStore
  .fetchVilles()
  .then(() => console.log("villes found : ", villeStore.items));

const refineVille = ref("");
watch(refineVille, () =>
  console.log("updated refine ville value : ", refineVille.value)
);

// CARBURANTS *********

const carburantStore = useCarburantStore();
const { items: carburants } = storeToRefs(carburantStore);

carburantStore
  .fetchVilles()
  .then(() => console.log("carburants found : ", carburantStore.items));

const refineCarburant = ref("");
watch(refineCarburant, () =>
  console.log("updated refine ville value : ", refineVille.value)
);

// STATIONS *********

const stationStore = useStationStore();

stationStore
  .fetchStations("PARIS")
  .then(() => console.log("fetched stations for Paris : ", stationStore.items));
</script>

<template>
  <div class="home w-full">
    <div class="line flex justify-evenly p-32">
      <SearchDropDown
        class="w-[25%]"
        name="Ville"
        :items="villes"
        v-model="refineVille"
        required
      />
      <SearchDropDown
        class="w-[25%]"
        name="Carburant"
        :items="carburants"
        v-model="refineCarburant"
      />
    </div>
  </div>
</template>
