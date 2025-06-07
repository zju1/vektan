import { useTranslation } from "react-i18next";
import { Button, Table, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { BagTypeDTO } from "./bagType.dto";
import {
  useDeleteBagTypeMutation,
  useGetBagTypesQuery,
} from "@/app/store/services/settings.api";
import BagTypeFormModal from "./BagTypeForm";
import { useSearchParams } from "react-router-dom";
import Search from "antd/es/input/Search";

export default function BagTypePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: bagTypes, isLoading, isError, refetch } = useGetBagTypesQuery();
  const [deleteBagType, { isLoading: isDeleting }] = useDeleteBagTypeMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editBagTypeId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteBagType(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<BagTypeDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "id",
      render: (_val, _rec, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("capacity"),
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: t("unitType"),
      dataIndex: ["unitType", "name"],
      key: "unitType",
      render: (_, record) => (record.unitType as any)?.name || "-",
    },
    {
      title: t("actions"),
      key: "actions",
      width: 100,
      align: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            size="small"
            onClick={() => handleEdit(record._id!)}
          >
            {t("edit")}
          </Button>
          <Button
            type="text"
            size="small"
            danger
            onClick={() => handleDelete(record._id!)}
            loading={isDeleting}
          >
            {t("delete")}
          </Button>
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
      <h1 className="font-sans font-bold text-2xl">{t("bagTypes")}</h1>
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Search placeholder={t("search")} />
        <Button icon={<Download className="size-4" />}>{t("export")}</Button>
        <BagTypeFormModal />
      </div>
      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={bagTypes || []}
        pagination={false}
        scroll={{ x: 700 }}
      />
    </div>
  );
}
