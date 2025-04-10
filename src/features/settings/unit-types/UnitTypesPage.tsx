import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { UnitTypeDTO } from "./unit-types.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useDeleteUnitTypeMutation,
  useGetUnitTypesQuery,
} from "@/app/store/services/settings.api";
import UnitTypeFormModal from "./UnitTypeForm";
import Search from "antd/es/input/Search";
import { formatDate } from "@/lib/utils/date-utils";

export function UnitTypesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const {
    data: unitTypes,
    isLoading,
    isError,
    refetch,
  } = useGetUnitTypesQuery();
  const [deleteUnitType, { isLoading: isDeleting }] =
    useDeleteUnitTypeMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editUnitTypeId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteUnitType(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "green" : "red";
  };

  const columns: ColumnsType<UnitTypeDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 200,
      sorter: (a: UnitTypeDTO, b: UnitTypeDTO) => a.name.localeCompare(b.name),
    },
    {
      title: t("code"),
      dataIndex: "code",
      key: "code",
      width: 100,
      align: "center",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={getStatusColor(isActive)}>
          {t(isActive ? "active" : "inactive")}
        </Tag>
      ),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: Date) => formatDate(date),
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
            onClick={() => handleEdit(record._id)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
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
      <h1 className="font-sans font-bold text-2xl">{t("unitTypes")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <UnitTypeFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id}
        dataSource={unitTypes || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
