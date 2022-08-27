<script setup lang="ts">
import { computed, toRefs } from "vue";

import { MapPinIcon } from "@heroicons/vue/24/outline";

import type { Station } from "@/custom_types";
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

// const isFirst = (index: number) => index == 0;
// const isLast = (index: number) => index == carburants.value.length - 1;
</script>

<template>
  <div class="list-tile w-full py-3 text-slate-300">
    <div
      class="main w-full my-3 flex flex-col md:flex-row justify-center items-center md:justify-between"
    >
      <div
        class="prices px-2 md:px-3 flex justify-between border-2 md:border-0 border-slate-100/80 rounded-2xl"
      >
        <div
          class="flex flex-1 flex-col justify-start items-center p-2 md:p-3 md:mx-3 border-0 md:border-2 border-slate-100/80 rounded-2xl"
          :class="{
            'border-slate-300/20 text-white/10': !carburantPrice(
              carburant.name
            ),
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
        class="address px-12 mt-5 md:mt-0 md:ml-7 md:py-2 w-fit flex justify-center items-center md:border-2 rounded-xl"
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
  </div>
</template>
