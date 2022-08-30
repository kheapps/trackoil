<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { onClickOutside } from "@vueuse/core";

import type { Address } from "../custom_types";
import { searchAddresses } from "@/parsers/addresses";

const emit = defineEmits(["choose-address"]);

const items = ref([] as Address[]);
const isLoading = ref(false);
const searchValue = ref("");
const dropdownRef = ref();
const input = ref();
const showList = ref(false);

const chosenItem = ref<Address | undefined>(undefined);

const isListEmpty = computed(() => {
  return items.value.length == 0;
});

const emptySearch = computed(() => searchValue.value === "");

let timeout: number;

watch(searchValue, (search) => {
  clearTimeout(timeout);
  if (search === "") {
    items.value = [];
    isLoading.value = false;
    return;
  }
  if (chosenItem.value) return;
  isLoading.value = true;

  timeout = setTimeout(function () {
    const querySearch = search.split(" ").join("+");

    searchAddresses(querySearch).then((addresses) => {
      // console.log("suggested addresses : ", addresses);
      items.value = [...addresses];
      isLoading.value = false;
    });
  }, 500);
});

function chooseListElement(address: Address) {
  // console.log("chosen address ", address);
  if (address) {
    searchValue.value = address.label;
    chosenItem.value = address;
  }
  emit("choose-address", address);
  // console.log("show list value ", showList.value);
  if (showList.value) toggleShowList(false, true);
}

function firstItem(): Address {
  return items.value[0] ?? null;
}

function toggleShowList(show: boolean, chosenItem = false) {
  if (!show) input.value.blur();
  showList.value = show;
  // console.log("toggle show is item chosen ", chosenItem);
  // if (required.value && !show && !chosenItem) choseListElement(firstItem());
}

function clearSearch() {
  searchValue.value = "";
  chosenItem.value = undefined;
  items.value = [];
  toggleShowList(false);
  // emit("update:modelValue", "");
}

onClickOutside(dropdownRef, () => {
  if (!showList.value) return;
  input.value.blur();
  chooseListElement(chosenItem.value ?? firstItem());
  toggleShowList(false);
});
</script>

<template>
  <div class="choice w-full relative" ref="dropdownRef">
    <div class="w-full flex flex-row justify-start items-end relative">
      <label class="w-full" for="searchBar">
        <span class="ml-2"> Adresse </span>
        <input
          class="w-full h-9 text-slate-800 mt-1 pl-3 pr-10 py-2 bg-white placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 block rounded-xl sm:text-sm invalid:border-red-500 invalid:text-red-600 disabled:shadow-none border-[1px] border-emerald-900/50 dark:border-none focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/30 transition-all duration-50 z-10"
          id="searchBar"
          type="text"
          placeholder="Adresse"
          v-model="searchValue"
          @focus="toggleShowList(true)"
          @keydown.enter="chooseListElement(chosenItem ?? firstItem())"
          ref="input"
        />
      </label>
      <div
        class="h-9 w-9 rounded-tr-xl rounded-br-xl flex justify-center items-center transition-all absolute right-0 scale-0"
        :class="{ 'scale-100 ': !emptySearch }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-slate-500 hover:cursor-pointer"
          @click="clearSearch"
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
      class="choices rounded-xl h-0 w-full mt-1 overflow-y-scroll text-slate-50 dark:text-slate-700 bg-slate-700 dark:bg-slate-50 transition-all absolute z-50 -t-10 shadow-md"
      :class="{
        'h-48': showList,
        'h-fit': isListEmpty && showList,
      }"
    >
      <ul>
        <div
          v-if="isLoading"
          class="w-full h-full flex justify-center items-center my-5"
        >
          <div
            class="loading-spinner border-teal-900/70 border-t-teal-500"
          ></div>
        </div>
        <p class="text-center m-1" v-if="isListEmpty && !isLoading">
          Aucun résultat.
        </p>
        <li
          class="rounded-xl m-1 p-2 hover:bg-emerald-300/[.3] hover:cursor-pointer"
          v-for="(address, ind) in items"
          :key="ind"
          @click="chooseListElement(address)"
        >
          {{ address.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.choices::-webkit-scrollbar {
  display: none;
}
.choices {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
