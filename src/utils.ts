import type {
  ApiResponse,
  Station,
  Carburant,
  StationGroup,
  Coordinates,
  ApiRecord,
  ApiAddressResponse,
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

  const ville =
    payload.facet_groups.find((f) => f.name.toLowerCase() === "ville")
      ?.facets[0].name ?? "";

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
    station.ville = ville;
    station.carburants = [] as Carburant[];
    station.position = {} as Coordinates;

    stations.push(station);
  });

  return {
    ville: ville,
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

    // console.log("c = ", c);
    carburants.push(c);
  });
  return carburants;
}

export function formatLastMajDate(date: Date): string {
  // console.log("parse date format", date);
  if (isNaN(date?.valueOf())) return "NC";
  return date.toLocaleDateString() + " à " + date.toLocaleTimeString();
}

// ####################### ADRESSE API ###############################

export function searchAddresses(search: string) {
  axios
    .get("https://api-adresse.data.gouv.fr/search/?q=" + search + "&limit=25")
    .then((res) => {
      parseAdressesSuggestions(res.data);
    });
}

export function parseAdressesSuggestions(data: ApiAddressResponse): Address[] {
  const addresses = [] as Address[];
  console.log("Parsing addresses data ", data);
  const features = data.features;
  console.log("features data received ", features);

  features.forEach((f) => {
    const a = {} as Address;

    a.label = f.properties.label;
    a.ville = f.properties.city;
    a.code_postal = f.properties.postcode;
    a.departement = f.properties.context;
    a.ordering_score = f.properties.score;
    a.coordinates = {
      lat: f.geometry.coordinates[1],
      long: f.geometry.coordinates[0],
    };

    addresses.push(a);
  });

  return addresses;
}
