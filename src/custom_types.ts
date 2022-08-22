export type ApiResponse = {
  nhits: number;
  parameters: object;
  records: object;
  facet_groups: FacetGroup[];
};

export type FacetGroup = {
  name: string;
  facets: Facet[];
};

export type Facet = {
  name: string;
  count: number;
  state: string;
  path: string;
};

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
};

export type Carburant = {
  id: string;
  nom: string;
  price: number;
  date_maj: Date;
  coordonnees: Coordinates;
};

export type Coordinates = {
  lat: number;
  long: number;
};
