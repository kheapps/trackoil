<script setup lang="ts">
import { ref, computed } from "vue";

// import { dummyStations } from "@/assets/data";
import { useStationStore } from "@/stores/stations";
import { useCarburantStore } from "@/stores/carburant";

import SearchAddress from "@/components/search_address.vue";
import StationTile from "@/components/station_tile.vue";
import CarburantDropdown from "@/components/carburant_dropdown.vue";
import type { Address, Carburant } from "@/custom_types";

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
  if (stationStore.getGroupById(address.id)) return;
  stationStore
    .fetchGeofilter(address)
    .then((res) => (noResultFromApi.value = !res));
}

function hasCarburant(carburants: Carburant[], filter: string): boolean {
  for (const c of carburants) {
    if (c.name === filter) return true;
  }
  return false;
}

const stations = computed(() => {
  if (!addressId.value) return [];
  // console.log("filter update stations ", carburantFilter.value);
  // const st = [...dummyStations.stations];
  const st = [...(stationStore.getStationsBySearchId(addressId.value) ?? [])];
  const filter = carburantFilter.value;
  if (filter !== "")
    return st
      .filter((s) => hasCarburant(s.carburants, filter))
      .sort(
        (a, b) =>
          (a.carburants.find((c) => c.name === filter)?.price ?? 0) -
          (b.carburants.find((c) => c.name === filter)?.price ?? 0)
      );
  return st;
});

const noStationAvailable = computed(() => {
  return stations.value?.length === 0;
});

const carburantStore = useCarburantStore();
const carburantFilter = ref("");
carburantStore
  .fetchCarburants()
  .then(() => console.log("fetched carburants list", carburantStore.items));

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
  // console.log("set carburant filter ", carburant);
  carburantFilter.value = carburant;
}
</script>

<template>
  <div class="home w-full flex flex-col justify-center items-center px-5">
    <div
      class="w-full flex flex-col md:flex-row md:max-w-7xl justify-evenly py-10 md:px-32"
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
    <div class="w-full max-w-full flex flex-col justify-center items-center">
      <p v-if="noStationAvailable">
        Veuillez saisir une adresse ou une ville pour voir les prix des stations
        à proximité.
      </p>
      <p v-if="noResultFromApi">Aucun résultat.</p>
      <div v-else class="result-list flex justify-center w-full md:w-fit">
        <div class="w-full flex flex-col justify-center items-center">
          <StationTile
            v-for="(station, ind) in stations"
            :key="station.id + ' - ' + ind"
            :station="station"
            :carburant-filter="carburantFilter"
          />
        </div>
      </div>
    </div>
  </div>
</template>
