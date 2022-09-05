<script setup lang="ts">
import { computed, toRefs, ref } from "vue";

import { MapPinIcon } from "@heroicons/vue/24/outline";

import type { Station } from "@/custom_types";
import { formatLastMajDate } from "@/utils";

// onMounted(() => {
//   window.addEventListener("resize", () => {
//     // console.log("resized screen");
//     isSmallScreen.value = window.innerWidth < 768;
//   });
// });

const props = defineProps<{
  station: Station;
  carburantFilter: string;
  selected: boolean;
}>();

const { station, selected, carburantFilter } = toRefs(props);

const prices = computed(() => {
  const filter = carburantFilter.value;
  const carburants = [...station.value.carburants];
  if (filter !== "")
    return carburants.sort((a, b) =>
      a.name === filter ? -1 : b.name === filter ? 1 : 0
    );
  return carburants;
});

const dateMaj = computed(() => {
  return formatLastMajDate(station.value.carburants[0]?.date_maj);
});

// const isFirst = (index: number) => index == 0;
// const isLast = (index: number) => index == carburants.value.length - 1;$

const isSmallScreen = ref(false);
</script>

<template>
  <div
    class="list-tile w-full text-slate-900 dark:text-slate-300 py-3 my-3 px-2 md:px-3 flex flex-col justify-center items-start rounded-2xl bg-teal-100/50 shadow-md dark:shadow-none dark:bg-teal-900/30"
  >
    <div class="w-full flex flex-col md:flex-row justify-between items-center">
      <div class="prices flex justify-center items-center">
        <div
          class="flex flex-1 flex-col justify-start items-center p-2 md:py-3 md:mx-3"
          v-for="carburant in prices"
          :key="carburant.name"
        >
          <h1 class="text-sm md:text-base">{{ carburant.name }}</h1>
          <p class="mt-3 text-xs md:text-sm">
            {{ carburant.price ?? "0.000" }}
          </p>
        </div>
      </div>

      <Transition name="fade">
        <a
          v-if="selected || !isSmallScreen"
          class="go-to-btn w-full md:w-fit px-3 md:px-7 mt-3 md:mt-0 md:mx-3 py-3 flex justify-center items-center rounded-xl bg-teal-500 dark:bg-teal-700/70 dark:shadow-xl text-slate-100"
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
      </Transition>
    </div>
    <Transition name="fade-delayed">
      <p
        v-if="selected || !isSmallScreen"
        class="caption my-1 text-xs w-full text-center text-slate-50/50"
      >
        Dernière mise à jour le {{ dateMaj }}.
      </p>
    </Transition>
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
