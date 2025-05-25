import { useTranslation } from "react-i18next";
import { Button, Table, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { LogisticsReportDTO } from "./logistics-report.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useDeleteLogisticsReportMutation,
  useGetLogisticsReportQuery,
} from "@/app/store/services/sales.api";
import LogisticsReportFormModal from "./LogisticsReportForm";
import Search from "antd/es/input/Search";
import { formatDate } from "@/lib/utils/date-utils";

export function LogisticsReportsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isError, refetch } = useGetLogisticsReportQuery();
  const [remove, { isLoading: isDeleting }] =
    useDeleteLogisticsReportMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editLogisticsReportId", id);
    setSearchParams(searchParams);
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

  const columns: ColumnsType<LogisticsReportDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "id",
      render: (_v, _r, i) => i + 1,
      width: 40,
      align: "center",
    },
    { title: t("seller"), dataIndex: "seller", key: "seller" },
    { title: t("buyer"), dataIndex: "buyer", key: "buyer" },
    { title: t("status"), dataIndex: "status", key: "status", width: 120 },
    {
      title: t("currentLocation"),
      dataIndex: "currentLocation",
      key: "currentLocation",
    },
    {
      title: t("shippingDate"),
      dataIndex: "shippingDate",
      key: "shippingDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: t("actualDeliveryDate"),
      dataIndex: "actualDeliveryDate",
      key: "actualDeliveryDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 100,
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
      <h1 className="font-sans font-bold text-2xl">{t("logisticsReport")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <LogisticsReportFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={data || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
