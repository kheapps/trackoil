import type {
  ApiResponse,
  Station,
  Carburant,
  StationGroup,
  Coordinates,
  ApiRecord,
  Address,
} from "@/custom_types";

import axios from "axios";

export async function fetchData(url: string): Promise<ApiResponse> {
  const data = (await axios.get(url)).data as ApiResponse;
  return data;
}

export function parseStation(payload: ApiResponse): StationGroup {
  // console.log("Parsing object : ", payload);
  const stations = [] as Station[];

  const adresses =
    payload.facet_groups.find((f) => f.name.toLowerCase() === "adresse")
      ?.facets ?? [];
  const ids =
    payload.facet_groups.find((f) => f.name.toLowerCase() === "id")?.facets ??
    [];

  adresses.forEach((address, index) => {
    const station = {} as Station;
    station.address = address.name;
    station.id = ids[index].name;
    station.ville = "";
    station.carburants = [] as Carburant[];
    station.position = {} as Coordinates;

    stations.push(station);
  });

  return {
    searchId: "",
    searchLabel: "",
    address: {} as Address,
    stations: stations,
  };
}

export function parseCarburant(records: ApiRecord[]): Carburant[] {
  const carburants = [] as Carburant[];
  records.forEach((record) => {
    // console.log("Parse carburant ", record);
    const c = {} as Carburant;

    c.name = record.fields.prix_nom;
    c.price = record.fields.prix_valeur;
    c.date_maj = new Date(record.fields.prix_maj);
    c.ville = record.fields.ville;
    // console.log("ville carburant : ", c.ville, record.fields.ville)

    // console.log("c = ", c);
    carburants.push(c);
  });
  return carburants.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  );
}
