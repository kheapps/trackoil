import { defineStore } from "pinia";

import axios from "axios";

import type { ApiResponse, StationGroup } from "@/custom_types";
import { parseStation } from "@/utils";

export const useStationStore = defineStore("stations", {
  state: () => ({
    items: [] as StationGroup[],
  }),
  getters: {},
  actions: {
    async fetchStations(ville: string) {
      console.log("fetch stations for  ", ville);
      const url =
        "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&facet=id&facet=adresse&refine.ville=" +
        ville;
      const data = (await axios.get(url)).data as ApiResponse;
      const stations = parseStation(data);
      console.log("parsed station data : ", stations);
    },
    async fetchPrices(payload: object) {
      console.log("fetch price for station : ", payload);
    },
  },
});
