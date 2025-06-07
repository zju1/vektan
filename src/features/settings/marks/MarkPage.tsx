import { Table, Button, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useGetMarksQuery,
  useDeleteMarkMutation,
} from "@/app/store/services/settings.api";
import type { MarkDTO } from "./mark.dto";
import MarkFormModal from "./MarkForm";
import Search from "antd/es/input/Search";

export function MarkPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: marks, isLoading, isError, refetch } = useGetMarksQuery();
  const [deleteMark, { isLoading: isDeleting }] = useDeleteMarkMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editMarkId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteMark(id).unwrap();
          message.success(t("deleted"));
        } catch {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: MarkDTO, index: number) => index + 1,
      width: 50,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 200,
    },
    {
      title: t("unitType"),
      dataIndex: ["unitType", "name"],
      key: "unitType",
      width: 200,
      render: (_: any, record: MarkDTO) =>
        (record.unitType as any)?.name || "-",
    },
    {
      title: t("stock"),
      dataIndex: "stock",
      key: "stock",
      minWidth: 200,
    },
    {
      title: t("minimumStock"),
      dataIndex: "minStock",
      key: "minStock",
      minWidth: 50,
    },
    {
      title: t("actions"),
      key: "actions",
      align: "right",
      render: (_: any, record: MarkDTO) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id!)}
          />
          <Button
            danger
            type="text"
            size="small"
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
        <p className="text-red-500">{t("failedToLoadData")}</p>
        <Button onClick={() => refetch()}>{t("tryAgain")}</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">{t("marks")}</h1>
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Search placeholder={t("search")} />
        <Button icon={<DownloadOutlined className="size-4" />}>
          {t("export")}
        </Button>
        <MarkFormModal />
      </div>
      <Table
        bordered
        rowKey="_id"
        size="small"
        dataSource={marks || []}
        loading={isLoading}
        columns={columns as any}
        scroll={{ x: 800 }}
        pagination={false}
      />
    </div>
  );
}
