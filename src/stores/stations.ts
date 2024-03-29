import { defineStore } from "pinia";

import type { Address, Prices, Station, StationGroup } from "@/custom_types";
import { fetchData, parseCarburant, parseStation } from "@/parsers/stations";
import { coordinatesToString } from "@/utils";

export const useStationStore = defineStore("stations", {
  state: () => ({
    items: [] as StationGroup[],
    dataLoading: false,
  }),
  getters: {
    getGroupById(state) {
      const groups = state.items;
      return (id: string) => groups.find((group) => group.searchId === id);
    },
    getStationsBySearchId(state) {
      const groups = state.items;
      return (id: string) =>
        groups.find((group) => group.searchId === id)?.stations;
    },
    getSearchHistory(state): Address[] {
      return state.items.map((group) => group.address);
    },
  },
  actions: {
    async fetchGeofilter(address: Address): Promise<boolean> {
      this.dataLoading = true;
      const [lat, long] = coordinatesToString(address.coordinates).split(",");
      // console.log("coordinates lat : ", lat, "  long : ", long);
      const url =
        "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie&q=&facet=id&facet=adresse&geofilter.distance=" +
        lat +
        "%2C+" +
        long +
        "%2C+5000";
      const data = await fetchData(url);
      // console.log("geofiltered data fetched : ", data);
      window.localStorage.setItem("api-received-data", JSON.stringify(data));
      if (!data.facet_groups) return false;

      const group = parseStation(data);
      // console.log("geofiltered data fetched parsed group : ", group);
      group.searchId = address.id;
      group.searchLabel = address.label;
      group.address = address;

      this.items.push(group);
      this.updateGroupData(address.id);
      return true;
    },
    async updateGroupData(searchId: string) {
      const stations = this.getStationsBySearchId(searchId);
      if (stations) {
        for (const [ind, station] of stations.entries()) {
          const prices = await this.fetchPrices(station);
          station.position = prices.coordinates;
          station.carburants = prices.carburants;
          station.date_maj = prices.carburants[0].date_maj;
          station.ville = prices.carburants[0].ville;
          if (station.carburants.length === 0 || !station.carburants[0]?.name) {
            // console.log("station with no valid carburant ", station);
            stations.splice(ind, 1);
          }
        }
      }
      this.dataLoading = false;
      // console.log("items station store updated last added group ", this.items);
      // window.localStorage.setItem(
      //   "data-station",
      //   JSON.stringify(this.getGroupById(searchId))
      // );
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
