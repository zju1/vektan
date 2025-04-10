export interface DepartmentDTO {
  _id?: string;
  name: string;
  description?: string;
  parentDepartmentId?: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export const departmentStatusOptions = [
  { value: "active", label: "active" },
  { value: "inactive", label: "inactive" },
];
