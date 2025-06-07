import ConsigneeFormModal from "./ConsigneeForm";
import Search from "antd/es/input/Search";
import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { ConsigneeDTO } from "./consignees.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

import {
  useDeleteConsigneeMutation,
  useGetConsigneesQuery,
} from "@/app/store/services/settings.api";

export function ConsigneesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const {
    data: consignees,
    isLoading,
    isError,
    refetch,
  } = useGetConsigneesQuery();
  const [deleteConsignee, { isLoading: isDeleting }] =
    useDeleteConsigneeMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editConsigneeId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    // Use native confirm dialog instead of Ant Modal
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteConsignee(id).unwrap();
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
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<ConsigneeDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("consignee"),
      dataIndex: "consigneeName",
      key: "consigneeName",
      minWidth: 200,
      sorter: (a: ConsigneeDTO, b: ConsigneeDTO) =>
        a.consigneeName.localeCompare(b.consigneeName),
    },
    {
      title: t("contactPerson"),
      dataIndex: "contactPerson",
      key: "contactPerson",
      width: 190,
      align: "right",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 150,
      align: "right",
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "right",
    },
    {
      title: t("city"),
      dataIndex: "city",
      key: "city",
      width: 150,
      align: "right",
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
      <h1 className="font-sans font-bold text-2xl">{t("consignees")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <ConsigneeFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={consignees || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
