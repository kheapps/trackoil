// API TYPES

export type ApiResponse = {
  nhits: number;
  parameters: object;
  records: ApiRecord[];
  facet_groups: ApiFacetGroup[];
};

export type ApiFacetGroup = {
  name: string;
  facets: ApiFacet[];
};

export type ApiFacet = {
  name: string;
  count: number;
  state: string;
  path: string;
};

export type ApiRecord = {
  fields: ApiRecordFields;
  datasetid: string;
  recordid: string;
};

export type ApiRecordFields = {
  adresse: string;
  com_arm_code: string;
  com_arm_name: string;
  geom: number[];
  horaires_automate_24_24: string;
  prix_maj: string;
  prix_nom: string;
  prix_valeur: number;
};

// PARSED TYPES

export type StationGroup = {
  ville: string;
  stations: Station[];
};

export type Station = {
  ville: string;
  address: string;
  id: string;
  carburants: Carburant[];
  position: Coordinates;
  date_maj: Date;
};

export type Carburant = {
  name: string;
  price: number;
  date_maj: Date;
};

export type Coordinates = {
  lat: number;
  long: number;
};

export type Prices = {
  coordinates: Coordinates;
  carburants: Carburant[];
};
