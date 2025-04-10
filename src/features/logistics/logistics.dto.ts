export interface LogisticsDTO {
  _id?: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  legalName?: string;
  taxId?: string;
  website?: string;
  headquartersAddress?: {
    street: string;
    city: string;
    region?: string;
    postalCode: string;
    country: string;
  };
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const logisticsStatusOptions = [
  { value: true, label: "active" },
  { value: false, label: "inactive" },
];
