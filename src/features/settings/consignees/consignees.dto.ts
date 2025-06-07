export interface ConsigneeDTO {
  _id?: string;
  consigneeName: string;
  contactPerson: string;
  contactTitle?: string;
  phone?: string;
  email: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  status: string;
}

export const clientStatusOptions = [
  { value: "active", label: "active" },
  { value: "inactive", label: "inactive" },
  { value: "pending", label: "pending" },
];
