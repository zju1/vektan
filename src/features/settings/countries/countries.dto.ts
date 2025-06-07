export interface CountryDTO {
  _id: string;
  name: string;
  code: string;
  cityCount?: number;
}

export interface CityDTO {
  _id?: string;
  name: string;
  countryId: string;
}
