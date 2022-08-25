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
  return station.value.carburants.find((carburant) => carburant.name === c)
    ?.price;
}
</script>

<template>
  <div class="list-tile w-full my-3 flex justify-between">
    <div class="prices flex flex-grow justify-between bg-slate-500">
      <div
        class="flex flex-col justify-start items-center mx-5"
        v-for="carburant in carburants"
        :key="carburant.name"
      >
        <h1>{{ carburant.name }}</h1>
        <p class="mt-3">{{ carburantPrice(carburant.name) ?? "-.---" }}</p>
      </div>
    </div>
    <div
      class="address max-w-[200px] w-[200px] bg-orange-900 ml-5 flex justify-center items-center"
    >
      <span class="w-7 h-7">
        <MapPinIcon></MapPinIcon>
      </span>
      <h1 class="text-center ml-3">Station</h1>
    </div>
  </div>
</template>
