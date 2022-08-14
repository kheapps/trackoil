<script setup lang="ts">
import { ref, toRefs, watch } from "vue";

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
    <input
      class="w-48 text-slate-800 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none transition-all"
      type="text"
      placeholder="ville"
      v-model="searchValue"
      @focus="toggleShowList(true)"
      @blur="toggleShowList(false)"
      @keydown.enter="choseListElement(firstItem())"
      ref="input"
    />
    <div
      class="choices rounded h-0 w-48 mt-1 overflow-y-scroll text-slate-50 dark:text-slate-700 bg-slate-700 dark:bg-slate-50 transition-all"
      :class="{ 'h-48': showList }"
    >
      <ul>
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
