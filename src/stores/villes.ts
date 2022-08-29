import { defineStore } from "pinia";

import axios from "axios";

import type { ApiResponse, ApiFacet } from "@/custom_types";

const api_url =
  "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&facet=ville";

export const useVillesStore = defineStore("villes", {
  state: () => ({
    items: [] as ApiFacet[],
  }),
  getters: {},
  actions: {
    async fetchVilles() {
      const data = (await axios.get(api_url)).data as ApiResponse;
      const villes = data["facet_groups"].find(
        (element: { name: string }) => element.name === "ville"
      )?.facets;
      this.items = [...(villes ?? [])];
    },
  },
});
