export interface EmployeeDTO {
  _id?: string;

  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager";

  position?: string;
  departmentId?: string;
  subDivision?: string;
  subOrdination?: string;
  phoneNumbers?: string[];
  email?: string;
  jobType?: "basic" | "shift";
  brigadeNumber?: number;
  status?: "active" | "inactive";
  comment?: string;
}

export const employeetStatusOptions = [
  { value: "active", label: "active" },
  { value: "inactive", label: "inactive" },
];

export const employeetJobTypeOptions = [
  { value: "basic", label: "basic" },
  { value: "shift", label: "shift" },
];
