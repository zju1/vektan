export interface EmployeeDTO {
  _id?: string;
  fullName: string;
  position: string;
  departmentId: string;
  subDivision: string;
  subOrdination: string;
  phoneNumbers: string[];
  email: string;
  jobType: "basic" | "shift";
  brigadeNumber: number;
  isActive: boolean;
  comment: string;
}

export const employeetStatusOptions = [
  { value: "active", label: "active" },
  { value: "inactive", label: "inactive" },
];

export const employeetJobTypeOptions = [
  { value: "basic", label: "basic" },
  { value: "shift", label: "shift" },
];
