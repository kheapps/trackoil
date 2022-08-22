import type {
  ApiResponse,
  Station,
  Carburant,
  StationGroup,
  Coordinates,
} from "./custom_types";

export function parseStation(payload: ApiResponse): StationGroup {
  console.log("Parsing object : ", payload);
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
