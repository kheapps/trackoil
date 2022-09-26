import { defineStore } from "pinia";

import axios from "axios";

import type { ApiResponse } from "@/custom_types";

const api_url =
  "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&facet=prix_nom";

export const useCarburantStore = defineStore("carburant", {
  state: () => ({
    items: [] as string[],
  }),
  getters: {},
  actions: {
    async fetchCarburants() {
      const data = (await axios.get(api_url)).data as ApiResponse;
      const carburants = data.facet_groups.find(
        (element: { name: string }) => element.name === "prix_nom"
      )?.facets;
      // this.items = [...(carburants ?? [])];
      carburants?.forEach((elem) => this.items.push(elem.name));
    },
  },
});
