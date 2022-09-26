<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { onClickOutside } from "@vueuse/core";

import type { Address } from "../custom_types";
// import { dummyHistory } from "@/assets/data";
import { searchAddresses } from "@/parsers/addresses";
import { useStationStore } from "@/stores/stations";

const stationStore = useStationStore();
const emit = defineEmits(["choose-address"]);

const input = ref();

// ************* HISTORY *************

const searchHistory = computed(() => {
  // return dummyHistory;
  return [...stationStore.getSearchHistory].reverse();
});

const showHistory = computed(() => {
  return (
    searchHistory.value.length > 0 && !isLoading.value && !isNoresult.value
  );
});

// **********************************
// ************* SEARCH *************

const searchValue = ref("");

let timeout: number;

const chosenItem = ref<Address | undefined>(undefined);

const emptySearch = computed(() => searchValue.value === "");

const isListEmpty = computed(() => {
  return items.value.length == 0;
});

const isNoresult = computed(() => {
  return isListEmpty.value && !isLoading.value && searchValue.value.length > 0;
});

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

function clearSearch() {
  searchValue.value = "";
  chosenItem.value = undefined;
  items.value = [];
  toggleShowList(false);
  emit("choose-address", undefined);
}

function chooseListElement(address: Address) {
  if (isLoading.value) return;
  // console.log("chosen address ", address);
  if (address) {
    // console.log("chosen address : ", address.ville, address.label);
    searchValue.value = getAddressLabel(address);
    chosenItem.value = address;
  }
  emit("choose-address", address);
  // console.log("show list value ", showList.value);
  if (showList.value) toggleShowList(false);
}

function firstItem(): Address {
  return items.value[0] ?? null;
}

function getAddressLabel(address: Address): string {
  return address.label === address.ville
    ? address.label + ", " + address.code_postal
    : address.label;
}

// ************************************
// ************* DROPDOWN *************

const items = ref([] as Address[]);

const isLoading = ref(false);
const dropdownRef = ref();
const showList = ref(false);

function toggleShowList(show: boolean) {
  if (!show) input.value.blur();
  showList.value = show;
}

const setDropdownFullSize = computed(() => {
  return (
    (showList.value && (!isListEmpty.value || showHistory.value)) ||
    isLoading.value
  );
});

onClickOutside(dropdownRef, () => {
  if (!showList.value || isLoading.value) return;
  input.value.blur();
  chooseListElement(chosenItem.value ?? firstItem());
  toggleShowList(false);
});

// ************************************
</script>

<template>
  <div class="choice w-full relative" ref="dropdownRef">
    <div class="w-full flex flex-row justify-start items-end relative">
      <label class="w-full" for="searchBar">
        <span class="ml-2"> Adresse </span>
        <input
          class="w-full h-9 text-slate-800 dark:text-slate-50 mt-1 pl-3 pr-10 py-2 bg-white dark:bg-slate-700 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 block rounded-xl sm:text-sm invalid:border-red-500 invalid:text-red-600 disabled:shadow-none border-[1px] border-emerald-900/50 dark:border-none focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/30 transition-all duration-50 z-10"
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
      class="choices rounded-xl h-fit w-full mt-1 overflow-y-scroll dark:text-slate-50 text-slate-700 dark:bg-slate-700 bg-slate-50 transition-all absolute z-50 -t-10 shadow-md"
      :class="{
        'h-48': setDropdownFullSize,
      }"
      v-if="showList"
    >
      <ul>
        <p class="text-center m-1" v-if="isNoresult">Aucun résultat.</p>
        <div
          v-if="isLoading"
          class="w-full h-full flex justify-center items-center my-5"
        >
          <div
            class="loading-spinner border-teal-900/70 border-t-teal-500"
          ></div>
        </div>
        <div v-else>
          <li
            class="rounded-xl m-1 p-2 hover:bg-emerald-300/[.3] hover:cursor-pointer"
            v-for="(address, ind) in items"
            :key="ind"
            @click="chooseListElement(address)"
          >
            {{ getAddressLabel(address) }}
          </li>
        </div>
        <div v-if="showHistory">
          <p class="caption ml-3 mt-3 text-xs font-semibold text-slate-400">
            Historique
          </p>
          <li
            v-for="addr in searchHistory"
            :key="addr.id"
            @click="chooseListElement(addr)"
            class="rounded-xl m-1 p-2 hover:bg-emerald-300/[.3] hover:cursor-pointer"
          >
            {{ getAddressLabel(addr) }}
          </li>
        </div>
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
