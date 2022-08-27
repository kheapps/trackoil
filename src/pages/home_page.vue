<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useVillesStore } from "@/stores/villes";
import { useCarburantStore } from "@/stores/carburant";
import { useStationStore } from "@/stores/stations";

import SearchDropDown from "@/components/search_dropdown.vue";
import StationTile from "../components/station_tile.vue";

const defaultVille = "Paris";
const isLoadingStations = ref(false);

// VILLES *********

const villeStore = useVillesStore();
const { items: villes } = storeToRefs(villeStore);

villeStore.fetchVilles().then(() => {
  console.log("villes found : ", villeStore.items);
});

const refineVille = ref(defaultVille);
// watch(refineVille, () =>
//   console.log("updated refine ville value : ", refineVille.value)
// );

// CARBURANTS *********

const carburantStore = useCarburantStore();
const { items: carburants } = storeToRefs(carburantStore);

carburantStore
  .fetchVilles()
  .then(() => console.log("carburants found : ", carburantStore.items));

const refineCarburant = ref("");
// watch(refineCarburant, () =>
//   console.log("updated refine carburant value : ", refineCarburant.value)
// );

// STATIONS *********

const stationStore = useStationStore();

stationStore.fetchStations(defaultVille).then(() => {
  console.log("fetched stations for Paris : ", stationStore.items);
  isLoadingStations.value = false;
});

const stations = computed(() => {
  if (refineVille.value === "") return [];
  const st = stationStore.getStationsByVille(refineVille.value);
  console.log("station computed value ", st);
  if (!st) stationStore.fetchStations(refineVille.value);
  return st;
});
</script>

<template>
  <div class="home w-full flex flex-col justify-center items-center">
    <div
      class="w-full flex flex-col md:flex-row justify-evenly py-10 px-7 md:p-32"
    >
      <SearchDropDown
        class="w-full md:w-[25%]"
        name="Ville"
        :items="villes"
        v-model="refineVille"
        required
      />
      <SearchDropDown
        class="w-full md:w-[25%] mt-5 md:mt-0"
        name="Carburant"
        :items="carburants"
        v-model="refineCarburant"
      />
    </div>
    <div class="flex flex-col justify-center items-center px-5">
      <div v-if="isLoadingStations" class="loading-spinner"></div>
      <div v-else class="result-list w-full max-w-full flex flex-col">
        <div class="" v-for="station in stations" :key="station.id">
          <StationTile :station="station"></StationTile>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
