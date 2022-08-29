<script setup lang="ts">
import { computed, toRefs } from "vue";

import { MapPinIcon } from "@heroicons/vue/24/outline";

import type { Station } from "@/custom_types";
import { formatLastMajDate } from "@/utils";
import { useCarburantStore } from "@/stores/carburant";

const props = defineProps<{
  station: Station;
}>();

const { station } = toRefs(props);

const carburantStore = useCarburantStore();

const carburants = computed(() => {
  return carburantStore.items;
});

function carburantPrice(c: string) {
  return station.value.carburants
    .find((carburant) => carburant.name === c)
    ?.price.toFixed(3);
}

const dateMaj = computed(() => {
  return formatLastMajDate(station.value.carburants[0]?.date_maj);
});

// const isFirst = (index: number) => index == 0;
// const isLast = (index: number) => index == carburants.value.length - 1;
</script>

<template>
  <div
    class="list-tile w-full py-3 text-slate-900 dark:text-slate-300 flex justify-center items-center"
  >
    <div
      class="main py-3 my-3 px-2 md:px-3 flex flex-col justify-center items-start rounded-2xl bg-teal-100/50 shadow-md dark:shadow-none dark:bg-teal-900/30"
    >
      <div class="flex flex-col md:flex-row justify-center items-center">
        <div class="prices flex justify-between">
          <div
            class="flex flex-1 flex-col justify-start items-center p-2 md:py-3 md:mx-3"
            :class="{
              'border-slate-300/20 text-black/30 dark:text-white/10':
                !carburantPrice(carburant.name),
            }"
            v-for="carburant in carburants"
            :key="carburant.name"
          >
            <h1 class="text-sm md:text-base">{{ carburant.name }}</h1>
            <p class="mt-3 text-xs md:text-sm">
              {{ carburantPrice(carburant.name) ?? "0.000" }}
            </p>
          </div>
        </div>
        <a
          class="address w-full md:w-fit px-3 md:px-7 mt-3 md:mt-0 md:ml-7 py-3 flex justify-center items-center rounded-xl bg-teal-500 dark:bg-teal-700/70 dark:shadow-xl text-slate-100"
          :href="
            'http://www.google.com/maps/place/' +
            station.position.lat +
            ',' +
            station.position.long
          "
          target="_blank"
        >
          <span class="w-7 h-7">
            <MapPinIcon></MapPinIcon>
          </span>
          <h1 class="text-center ml-3">Voir sur la carte</h1>
        </a>
      </div>
      <p class="mt-3 text-xs w-full text-center md:text-right">
        Dernière mise à jour le {{ dateMaj }}.
      </p>
    </div>
  </div>
</template>
