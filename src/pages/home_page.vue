<script setup lang="ts">
import { ref, computed } from "vue";
// import { storeToRefs } from "pinia";

// import { useVillesStore } from "@/stores/villes";
// import { useCarburantStore } from "@/stores/carburant";
import { useStationStore } from "@/stores/stations";

import SearchAddress from "@/components/search_address.vue";
import StationTile from "../components/station_tile.vue";
import type { Station } from "@/custom_types";

const defaultVille = "Paris";
const selectedStation = ref(0);

const isSelectedStation = (ind: number) => selectedStation.value === ind;
const selectStation = (ind: number) => (selectedStation.value = ind);

// VILLES *********

// const villeStore = useVillesStore();
// const { items: villes } = storeToRefs(villeStore);

// villeStore.fetchVilles().then(() => {
//   console.log("villes found : ", villeStore.items);
// });

const refineVille = ref(defaultVille);
// watch(refineVille, () =>
//   console.log("updated refine ville value : ", refineVille.value)
// );

// CARBURANTS *********

// const carburantStore = useCarburantStore();
// const { items: carburants } = storeToRefs(carburantStore);

// carburantStore
//   .fetchVilles()
//   .then(() => console.log("carburants found : ", carburantStore.items));

// const refineCarburant = ref("");
// watch(refineCarburant, () =>
//   console.log("updated refine carburant value : ", refineCarburant.value)
// );

// STATIONS *********

const stationStore = useStationStore();

// stationStore.fetchStations(defaultVille).then(() => {
//   console.log("fetched stations for Paris : ", stationStore.items);
//   // isLoadingStations.value = false;
// });

const stations = computed(() => {
  return [];
  // if (refineVille.value === "") return [];
  // const st = stationStore.getStationsByVille(refineVille.value);
  // console.log("station computed value ", st);
  // if (!st) {
  //   console.log("station undefined ", st);
  //   stationStore.fetchStations(refineVille.value);
  // }
  // return st;
});

const noCarburant = (station: Station) =>
  station.carburants?.length === 0 || !station.carburants[0].name;
</script>

<template>
  <div class="home w-full flex flex-col justify-center items-center">
    <div
      class="w-full flex flex-col md:flex-row md:max-w-7xl justify-evenly py-10 px-7 md:px-32"
    >
      <SearchAddress class="w-full md:w-[35%]" name="Adresse" />
      <!-- <SearchDropDown
        class="w-full md:w-[35%] mt-5 md:mt-0"
        name="Carburant"
        :items="carburants"
        v-model="refineCarburant"
      /> -->
    </div>
    <!-- <div
      class="w-full max-w-full px-5 flex flex-col justify-center items-center"
    >
      <div class="result-list w-full max-w-full flex justify-center">
        <div class="w-fit flex flex-col justify-center items-center">
          <StationTile
            class="flex-grow"
            :class="{
              hidden: noCarburant(station),
            }"
            v-for="(station, ind) in stations"
            :key="station.id"
            :station="station"
            :selected="isSelectedStation(ind)"
            @click="selectStation(ind)"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>
