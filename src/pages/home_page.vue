<script setup lang="ts">
import { ref, computed } from "vue";

import { useStationStore } from "@/stores/stations";

import SearchAddress from "@/components/search_address.vue";
import StationTile from "@/components/station_tile.vue";
import type { Address, Station } from "@/custom_types";

const stationStore = useStationStore();

const addressId = ref("");
const noResultFromApi = ref(false);

function setChosenAddress(address: Address) {
  if (!address) {
    noResultFromApi.value = false;
    return;
  }
  stationStore
    .fetchGeofilter(address)
    .then((res) => (noResultFromApi.value = !res));
  addressId.value = address.id;
}

const stations = computed(() => {
  if (!addressId.value) return [];
  return stationStore.getStationsBySearchId(addressId.value);
});
</script>

<template>
  <div class="home w-full flex flex-col justify-center items-center">
    <div
      class="w-full flex flex-col md:flex-row md:max-w-7xl justify-evenly py-10 px-7 md:px-32"
    >
      <SearchAddress
        class="w-full md:w-[35%]"
        name="Adresse"
        @choose-address="setChosenAddress"
      />
      <!-- <SearchDropDown
        class="w-full md:w-[35%] mt-5 md:mt-0"
        name="Carburant"
        :items="carburants"
        v-model="refineCarburant"
      /> -->
    </div>
    <div
      class="w-full max-w-full px-5 flex flex-col justify-center items-center"
    >
      <p v-if="noResultFromApi">Aucun résultat.</p>
      <div v-else class="result-list w-full max-w-full flex justify-center">
        <div class="w-fit flex flex-col justify-center items-center">
          <StationTile
            class="flex-grow"
            v-for="(station, ind) in stations"
            :key="station.id + ' - ' + ind"
            :station="station"
            selected
          ></StationTile>
        </div>
      </div>
    </div>
  </div>
</template>
