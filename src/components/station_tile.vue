<script setup lang="ts">
import { computed, toRefs } from "vue";

import { useCarburantStore } from "@/stores/carburant";

import { MapPinIcon } from "@heroicons/vue/24/outline";

import type { Carburant, Station } from "@/custom_types";
import { formatLastMajDate } from "@/utils";

const carburantStore = useCarburantStore();

const props = defineProps<{
  station: Station;
  carburantFilter: string;
}>();

const { station, carburantFilter } = toRefs(props);

const prices = computed(() => {
  // const filter = carburantFilter.value;
  // const carburants = [...station.value.carburants];
  // if (filter !== "")
  //   return carburants.sort((a, b) =>
  //     a.name === filter ? -1 : b.name === filter ? 1 : 0
  //   );
  const carburants = [] as Array<Carburant>;

  for (const c of carburantStore.items) {
    const carburant = station.value.carburants.find((elem) => {
      console.log("comp name elem : ", elem.name, " c : ", c);
      return elem.name === c;
    });
    console.log("found carburant : ", carburant);
    const defCarburant = { name: c } as Carburant;
    carburants.push(carburant ?? defCarburant);
  }
  console.log("carburants : ", carburants);

  return carburants;
});

const dateMaj = computed(() => {
  return formatLastMajDate(station.value.carburants[0]?.date_maj);
});

// const isFirst = (index: number) => index == 0;
// const isLast = (index: number) => index == carburants.value.length - 1;$

function isFilter(name: string): boolean {
  return name === carburantFilter.value || carburantFilter.value === "";
}

function disableCarburant(carburant: Carburant) {
  return !isFilter(carburant.name) || !carburant.price;
}
</script>

<template>
  <div
    class="list-tile w-full text-slate-900 dark:text-slate-300 py-3 my-3 md:px-3 flex flex-col justify-center items-start rounded-2xl bg-teal-100/50 shadow-md dark:shadow-none dark:bg-teal-900/30"
  >
    <div
      class="w-full max-w-full flex flex-col md:flex-row justify-between items-center"
    >
      <div class="prices flex justify-center items-center">
        <div
          class="flex flex-1 flex-col justify-start items-center p-2 md:py-3 md:mx-3 grow"
          :class="{ 'opacity-50': disableCarburant(carburant) }"
          v-for="carburant in prices"
          :key="carburant.name"
        >
          <h1 class="text-sm md:text-base">{{ carburant.name }}</h1>
          <p class="mt-3 text-xs md:text-sm">
            {{ carburant.price ?? "0.000" }}
          </p>
        </div>
      </div>

      <div class="flex flex-col w-full my-3 px-5 md:px-0">
        <div
          class="w-full md:w-72 mt-3 md:mt-0 md:mx-3 py-3 flex justify-start items-center rounded-xl text-slate-100"
        >
          <a
            class="flex w-fit"
            :href="
              'http://www.google.com/maps/place/' +
              station.position.lat +
              ',' +
              station.position.long
            "
            target="_blank"
          >
            <span class="p-3 md:p-5 shrink-0 mr-3 bg-slate-200/30 rounded-xl">
              <MapPinIcon class="w-7 h-7"></MapPinIcon>
            </span>
          </a>
          <div class="grow verflow-hidden text-sm md:text-base overflow-hidden">
            <p
              class="w-full text-left truncate"
              :title="station.address + ', ' + station.ville"
            >
              {{ station.address }}
            </p>
            <p class="w-full text-left">{{ station.ville }}</p>
          </div>
        </div>
        <p
          class="caption mt-3 md:pl-3 text-xs w-full text-center md:text-left text-slate-50/50"
        >
          Dernière mise à jour le {{ dateMaj }}.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-from,
.fade-delayed-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}

.fade-enter-active,
.fade-delayed-enter-active {
  transition: all 150ms ease-out;
}

.fade-delayed-enter-active {
  transition-delay: 30ms;
}

.fade-leave-to,
.fade-delayed-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.fade-leave-active,
.fade-delayed-leave-active {
  transition: all 150ms ease-in;
  transition-delay: 100ms;
}
</style>
