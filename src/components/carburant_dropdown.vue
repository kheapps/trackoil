<script setup lang="ts">
import { computed, ref, toRefs } from "vue";

import { onClickOutside } from "@vueuse/core";

import type { Address } from "../custom_types";

const emit = defineEmits(["filter-selected"]);

const props = defineProps({
  items: { type: Array<string>, default: [] },
});

const { items } = toRefs(props);

const isLoading = ref(false);

const selectedCarburant = ref("");

const dropdownRef = ref();
const input = ref();
const showList = ref(false);

const chosenItem = ref<Address | undefined>(undefined);

function chooseListElement(carburant: string) {
  if (isLoading.value) return;
  // console.log("chosen address ", address);
  if (carburant) {
    // console.log("chosen address : ", address.ville, address.label);
    selectedCarburant.value = carburant;
    emit("filter-selected", carburant);
  }
  // emit("choose-address", address);
  // console.log("show list value ", showList.value);
  if (showList.value) toggleShowList(false);
}

function toggleShowList(show: boolean) {
  showList.value = show;
}

function clearFilter() {
  selectedCarburant.value = "";
  chosenItem.value = undefined;
  toggleShowList(false);
  emit("filter-selected", "");
}

onClickOutside(dropdownRef, () => {
  if (!showList.value || isLoading.value) return;
  toggleShowList(false);
});

const filterSelected = computed(() => selectedCarburant.value !== "");

const noFilterAvailable = computed(() => items.value.length === 0);
</script>

<template>
  <div class="choice w-full relative" ref="dropdownRef">
    <div class="w-full flex flex-row justify-start items-end relative">
      <label class="w-full relative" for="filterCarburant">
        <span class="ml-2"> Filtrer par carburant </span>
        <input
          class="w-full h-9 text-slate-800 dark:text-slate-50 mt-1 pl-3 pr-10 py-2 disable:bg-white disabled:dark:bg-slate-700 placeholder-slate-400 disabled:bg-white disabled:text-slate-800 block rounded-xl sm:text-sm invalid:border-red-500 invalid:text-red-600 disabled:shadow-none border-[1px] border-emerald-900/50 dark:border-none focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/30 transition-all duration-50 z-10"
          id="filterCarburant"
          type="text"
          placeholder="Carburant"
          v-model="selectedCarburant"
          disabled
          ref="input"
        />
        <div
          id="filterCarburant"
          class="absolute left-0 right-0 top-0 bottom-0"
          @click="toggleShowList(!showList)"
        ></div>
      </label>
      <div
        class="h-9 w-9 rounded-tr-xl rounded-br-xl flex justify-center items-center transition-all absolute right-0 scale-0"
        :class="{ 'scale-100 ': filterSelected }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-slate-500 hover:cursor-pointer"
          @click="clearFilter"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="showList"
      class="choices rounded-xl h-fit w-full mt-1 dark:text-slate-50 text-slate-700 dark:bg-slate-700 bg-slate-50 transition-all absolute z-50 -t-10 shadow-md"
    >
      <p v-if="noFilterAvailable" class="w-full text-center my-2">
        Aucun filtre disponible.
      </p>
      <ul>
        <li
          class="rounded-xl m-1 p-2 hover:bg-emerald-300/[.3] hover:cursor-pointer"
          v-for="(carburant, ind) in items"
          :key="ind"
          @click="chooseListElement(carburant)"
        >
          {{ carburant }}
        </li>
      </ul>
    </div>
  </div>
</template>
