import type { ApiAddressResponse, Address } from "@/custom_types";

import axios from "axios";

export async function searchAddresses(search: string): Promise<Address[]> {
  const data = (
    await axios.get(
      "https://api-adresse.data.gouv.fr/search/?q=" + search + "&limit=25"
    )
  ).data;
  return parseAddressesSuggestions(data);
}

function parseAddressesSuggestions(data: ApiAddressResponse): Address[] {
  const addresses = [] as Address[];
  // console.log("Parsing addresses data ", data);
  const features = data.features;
  // console.log("features data received ", features);

  features.forEach((f) => {
    const a = {} as Address;

    a.id = f.properties.id;
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
