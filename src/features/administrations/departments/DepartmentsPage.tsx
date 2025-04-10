import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { DepartmentDTO } from "./department.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

import Search from "antd/es/input/Search";
import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from "@/app/store/services/admin";
import { formatDate } from "@/lib/utils/date-utils";
import DepartmentFormModal from "./DepartmentForm";

export function DepartmentPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const {
    data: departments,
    isLoading,
    isError,
    refetch,
  } = useGetDepartmentsQuery();
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editDepartmentId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteDepartment(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
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

  const columns: ColumnsType<DepartmentDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 200,
      sorter: (a: DepartmentDTO, b: DepartmentDTO) =>
        a.name.localeCompare(b.name),
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
    },

    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => formatDate(date),
      sorter: (a: DepartmentDTO, b: DepartmentDTO) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
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
      <h1 className="font-sans font-bold text-2xl">{t("departments")}</h1>
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
        dataSource={departments || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
