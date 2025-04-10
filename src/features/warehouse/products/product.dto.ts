import type { UnitTypeDTO } from "@/features/settings/unit-types/unit-types.dto";
import type { CategoryDTO } from "../categories/category.dto";
import type { SupplierDTO } from "@/features/suppliers/supplier.dto";

export interface ProductDTO {
  _id?: string; // Unique identifier
  name: string; // Product name
  categoryId: string; // Linked category ID
  unitTypeId: string; // Linked unit type ID
  supplierId: string; // Primary supplier ID
  stock: number; // Initial stock quantity
  minimumStock: number; // Minimum allowed before alert
  price: number; // Default unit price
  isActive: boolean; // Is this product active?
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  category?: CategoryDTO;
  unitType?: UnitTypeDTO;
  supplier?: SupplierDTO;
}

export const productStatusOptions = [
  { value: true, label: "active" },
  { value: false, label: "inactive" },
];
