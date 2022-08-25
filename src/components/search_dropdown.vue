<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";

import { onClickOutside } from "@vueuse/core";

import type { ApiFacet } from "../custom_types";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  items: { type: Array<ApiFacet>, default: new Array<ApiFacet>() },
  modelValue: String,
  name: String,
  required: { type: Boolean, default: false },
});

const { items, name, required, modelValue } = toRefs(props);

console.log("search ", name?.value, required.value);

const filteredItems = ref([...items.value]);

const searchValue = ref(modelValue?.value ?? "");
const dropdownRef = ref();
const input = ref();
const showList = ref(false);
const dropdown = ref(null);
const isFocused = ref(false);

const emptyList = computed(() => {
  return filteredItems.value.length === 0;
});

const emptySearch = computed(() => searchValue.value === "");

watch(items, () => {
  console.log("updated items watch : ", items.value);
  filteredItems.value = [...items.value];
  if (required.value && searchValue.value === "")
    searchValue.value = items.value[0].name;
});

watch(searchValue, (search) => {
  // console.log("search : ", search);
  // console.log("items : ", items);
  filteredItems.value = items.value.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );
});

function choseListElement(e: string) {
  console.log(e);
  searchValue.value = e;
  emit("update:modelValue", e);
  console.log("show list value ", showList.value);
  if (showList.value) toggleShowList(false, true);
}

function firstItem() {
  return filteredItems.value[0]?.name ?? items.value[0].name;
}

function toggleShowList(show: boolean, chosenItem = false) {
  isFocused.value = show;
  if (!show) input.value.blur();
  showList.value = show;
  console.log("toggle show is item chosen ", chosenItem);
  if (required.value && !show && !chosenItem) choseListElement(firstItem());
}

function clearSearch() {
  searchValue.value = "";
  emit("update:modelValue", "");
  if (required.value) input.value.focus();
}

onClickOutside(dropdownRef, () => {
  if (isFocused.value) {
    input.value.blur();
    toggleShowList(false);
  }
});
</script>

<template>
  <div class="choice w-full relative" ref="dropdownRef">
    <div class="w-full flex flex-row justify-start items-end relative">
      <label class="w-full" for="searchBar">
        <span class="ml-2">
          {{ name }}
        </span>
        <input
          class="w-full h-9 text-slate-800 mt-1 pl-3 pr-10 py-2 bg-white placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 block rounded-xl sm:text-sm invalid:border-red-500 invalid:text-red-600 disabled:shadow-none border-[1px] border-emerald-900/50 dark:border-none focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/30 transition-all duration-50 z-10"
          id="searchBar"
          type="text"
          :placeholder="name"
          v-model="searchValue"
          @focus="toggleShowList(true)"
          @keydown.enter="choseListElement(firstItem())"
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
      class="choices rounded-xl h-0 w-full mt-1 overflow-y-scroll text-slate-50 dark:text-slate-700 bg-slate-700 dark:bg-slate-50 transition-all absolute -t-10 shadow-md"
      :class="{
        'h-48': showList,
        'h-fit': emptyList && showList,
      }"
      ref="dropdown"
    >
      <ul>
        <p class="text-center m-1" v-if="emptyList">Aucun résultat.</p>
        <li
          class="rounded-xl m-1 p-2 hover:bg-emerald-300/[.3] hover:cursor-pointer"
          v-for="(v, ind) in filteredItems"
          :key="ind"
          @click="choseListElement(v.name)"
        >
          {{ v.name }}
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
