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
  ville: string;
};

// PARSED TYPES

export type StationGroup = {
  searchId: string;
  searchLabel: string;
  address: Address;
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
  ville: string;
};

export type Coordinates = {
  lat: number;
  long: number;
};

export type Prices = {
  coordinates: Coordinates;
  carburants: Carburant[];
};

// ####################### ADRESSE API ###############################

export type ApiAddressResponse = {
  query: string;
  limit: number;
  features: ApiAddressFeature[];
};

export type ApiAddressFeature = {
  geometry: ApiAddressGeometry;
  properties: ApiAddressProperties;
};

export type ApiAddressGeometry = {
  coordinates: number[];
};

export type ApiAddressProperties = {
  id: string;
  label: string;
  score: number;
  postcode: string;
  city: string;
  context: string;
};

export type Address = {
  id: string;
  label: string;
  code_postal: string;
  ville: string;
  departement: string;
  coordinates: Coordinates;
  ordering_score: number;
};
