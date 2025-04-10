export interface UnitTypeDTO {
  _id: string; // Unique identifier (UUID or Mongo ObjectId)
  name: string; // Name of the unit (e.g., "Kilogram", "Liter", "Piece")
  code: string; // Short code (e.g., "kg", "L", "pc")
  description?: string; // Optional description
  isActive: boolean; // Is this unit currently in use?
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export const unitTypeStatusOptions = [
  { value: true, label: "active" },
  { value: false, label: "inactive" },
];
