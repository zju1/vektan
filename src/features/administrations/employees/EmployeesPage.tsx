import { useTranslation } from "react-i18next";
import { Button, Table, message, Modal, Tag } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { EmployeeDTO } from "./employee.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import Search from "antd/es/input/Search";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/app/store/services/admin";
import DepartmentFormModal from "./EmployeeForm";

export function EmployeesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const { data: rows, isLoading, isError, refetch } = useGetEmployeesQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const handleEdit = (id: string) => {
    searchParams.set("currentItemId", id);
    setSearchParams(searchParams);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      default:
        return "default";
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await remove(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<EmployeeDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("fullName"),
      dataIndex: "fullName",
      key: "fullName",
      minWidth: 200,
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        a.fullName.localeCompare(b.fullName),
    },
    {
      title: t("department"),
      dataIndex: "departmentId",
      key: "departmentId",
      width: 200,
      render: (value) => value.name,
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        a.position.localeCompare(b.position),
    },
    {
      title: t("position"),
      dataIndex: "position",
      key: "position",
      width: 200,
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        a.position.localeCompare(b.position),
    },
    {
      title: t("subDivision"),
      dataIndex: "subDivision",
      key: "subDivision",
      width: 200,
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        a.subDivision.localeCompare(b.subDivision),
    },
    {
      title: t("phoneNumber"),
      dataIndex: "phoneNumbers",
      key: "phoneNumbers",
      render: (value) => (value as string[]).join(", "),
      width: 200,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        a.email.localeCompare(b.email),
    },
    {
      title: t("jobType"),
      dataIndex: "jobType",
      key: "jobType",
      width: 200,
      render: (value) => t(value),
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        a.jobType.localeCompare(b.jobType),
    },
    {
      title: t("brigadeNumber"),
      dataIndex: "brigadeNumber",
      key: "brigadeNumber",
      width: 200,
      render: (value) => t(value),
      sorter: (a: EmployeeDTO, b: EmployeeDTO) =>
        String(a.brigadeNumber).localeCompare(String(b.brigadeNumber)),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {t(status.charAt(0) + status.slice(1))}
        </Tag>
      ),
    },
    {
      title: t("comment"),
      dataIndex: "comment",
      key: "comment",
      width: 250,
      ellipsis: true,
    },

    {
      title: t("actions"),
      key: "actions",
      width: 80,
      align: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id!)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
            loading={isDeleting}
          />
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t("failedToLoadData")}</p>
          <Button onClick={() => refetch()}>{t("tryAgain")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">{t("employees")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <DepartmentFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={rows || []}
        pagination={false}
        scroll={{ x: 2200, y: "70dvh" }}
      />
    </div>
  );
}
