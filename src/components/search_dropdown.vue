<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";

import type { facetType } from "../custom_types";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  items: facetType[];
  modelValue: string;
}>();

// const props = defineProps({ items: facetType });

const { items } = toRefs(props);

const filteredItems = ref([...items.value]);

const searchValue = ref("");
const input = ref();
const showList = ref(false);
const dropdown = ref(null);

const emptyList = computed(() => {
  return filteredItems.value.length === 0;
});

const emptySearch = computed(() => searchValue.value === "");

watch(items, () => {
  console.log("updated items watch : ", items.value);
  filteredItems.value = [...items.value];
  console.log("ville 1 :", filteredItems.value[0].name);
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
  if (showList.value) toggleShowList(false);
}

function firstItem() {
  return filteredItems.value[0].name ?? "";
}

function toggleShowList(show: boolean) {
  if (!show) input.value.blur();
  showList.value = show;
}
</script>

<template>
  <div class="choice">
    <div class="flex flex-row justify-start items-center">
      <input
        class="w-44 h-9 text-slate-800 px-3 py-2 bg-white placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 block rounded-tl-xl rounded-bl-xl sm:text-sm invalid:border-pink-500 invalid:text-pink-600 disabled:shadow-none focus:outline-none transition-all z-10"
        :class="{ 'rounded-xl delay-75': emptySearch }"
        type="text"
        placeholder="ville"
        v-model="searchValue"
        @focus="toggleShowList(true)"
        @blur="toggleShowList(false)"
        @keydown.enter="choseListElement(firstItem())"
        ref="input"
      />
      <div
        class="h-9 w-0 -ml-1 rounded-tr-xl rounded-br-xl bg-slate-200 flex justify-center items-center transition-all"
        :class="{ 'w-9': !emptySearch }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 ml-1 text-slate-500"
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
      class="choices rounded-xl h-0 w-44 mt-1 overflow-y-scroll text-slate-50 dark:text-slate-700 bg-slate-700 dark:bg-slate-50 transition-all"
      :class="{
        'h-48': showList,
        'h-fit': emptyList && showList,
      }"
      ref="dropdown"
    >
      <ul>
        <p class="text-center m-1" v-if="emptyList">Aucun résultat.</p>
        <li
          class="rounded m-1 p-2 hover:bg-emerald-300/[.3]"
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
