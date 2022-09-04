<script setup lang="ts">
import { ref, computed } from "vue";

import { dummyStations } from "@/assets/data";
import { useStationStore } from "@/stores/stations";

import SearchAddress from "@/components/search_address.vue";
import StationTile from "@/components/station_tile.vue";
import CarburantDropdown from "@/components/carburant_dropdown.vue";
import type { Address } from "@/custom_types";

const stationStore = useStationStore();

const addressId = ref("");
const noResultFromApi = ref(false);

function setChosenAddress(address: Address) {
  if (!address) {
    addressId.value = "";
    noResultFromApi.value = false;
    return;
  }
  addressId.value = address.id;
  window.localStorage.setItem("address-data", JSON.stringify(address));
  if (stationStore.getGroupById(address.id)) return;
  stationStore
    .fetchGeofilter(address)
    .then((res) => (noResultFromApi.value = !res));
}

const stations = computed(() => {
  if (carburantFilter.value !== "")
    return dummyStations.stations.sort(
      (a, b) =>
        (a.carburants.find((c) => c.name === carburantFilter.value)?.price ??
          0) -
        (b.carburants.find((c) => c.name === carburantFilter.value)?.price ?? 0)
    );
  return dummyStations.stations;
  // if (!addressId.value) return [];
  // return stationStore.getStationsBySearchId(addressId.value);
});

const noStationAvailable = computed(() => {
  return stations.value?.length === 0;
});

const carburantFilter = ref("");

const filters = computed(() => {
  const filters = [] as string[];
  stations.value?.forEach((station) => {
    station.carburants.forEach((c) => {
      if (!filters.includes(c.name)) filters.push(c.name);
    });
  });
  return filters;
});

function setCarburantFilter(carburant: string) {
  carburantFilter.value = carburant;
}
</script>

<template>
  <div class="home w-full flex flex-col justify-center items-center">
    <div
      class="w-full flex flex-col md:flex-row md:max-w-7xl justify-evenly py-10 px-7 md:px-32"
    >
      <SearchAddress
        class="w-full md:w-[35%]"
        @choose-address="setChosenAddress"
      />
      <CarburantDropdown
        class="w-full md:w-[35%]"
        @filter-selected="setCarburantFilter"
        :items="filters"
      />
    </div>
    <div
      class="w-full max-w-full px-5 flex flex-col justify-center items-center"
    >
      <p v-if="noStationAvailable">
        Veuillez saisir une adresse ou une ville pour voir les prix des stations
        à proximité.
      </p>
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
