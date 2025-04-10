export interface CategoryDTO {
  _id?: string;
  name: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: CategoryDTO[];
}

export const categoryStatusOptions = [
  { value: true, label: "active" },
  { value: false, label: "inactive" },
];
