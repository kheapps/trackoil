import { defineStore } from "pinia";

import type { Prices, Station, StationGroup } from "@/custom_types";
import { fetchData, parseCarburant, parseStation } from "@/utils";

export const useStationStore = defineStore("stations", {
  state: () => ({
    items: [] as StationGroup[],
  }),
  getters: {
    getStationsByVille(state) {
      const groups = state.items;
      return (ville: string) =>
        groups.find((group) => group.ville === ville)?.stations;
    },
  },
  actions: {
    async fetchStations(ville: string) {
      // console.log("fetch stations for  ", ville);
      const url =
        "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&facet=id&facet=adresse&refine.ville=" +
        ville;
      if (this.getStationsByVille(ville)) return;
      const data = await fetchData(url);
      const group = parseStation(data);
      // console.log("parsed station data : ", group);

      this.items.push(group);
      this.updateGroupData(ville);
    },
    async updateGroupData(ville: string) {
      const stations = this.getStationsByVille(ville);
      if (stations) {
        for (const station of stations) {
          const prices = await this.fetchPrices(station);
          station.position = prices.coordinates;
          station.carburants = prices.carburants;
          // console.log("station : ", station.id);
          // console.log("date maj fetched ddata ", prices.carburants[0].date_maj);
          station.date_maj = prices.carburants[0].date_maj;
        }
      }
      // console.log("parsed group : ", stations);
      // console.log("items station store ", this.items);
    },
    async fetchPrices(station: Station): Promise<Prices> {
      // console.log("fetch price for station id : ", station.id);
      const result = {} as Prices;
      const url =
        "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&refine.id=" +
        station.id;
      const data = await fetchData(url);
      data.records[0].fields.geom;
      result.coordinates = {
        lat: data.records[0].fields.geom[0],
        long: data.records[0].fields.geom[1],
      };
      const carburants = parseCarburant(data.records);
      result.carburants = [...carburants];
      // console.log("fetched data for station id : ", station.id, data);
      // console.log("parsed carburants : ", carburants);
      return result;
    },
  },
});
