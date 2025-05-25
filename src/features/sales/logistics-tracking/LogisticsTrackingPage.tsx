import { useTranslation } from "react-i18next";
import { Table, Button, Modal, message } from "antd";
import { useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "@/lib/utils/date-utils";
import {
  useDeleteLogisticsTrackingMutation,
  useGetLogisticsTrackingsQuery,
} from "@/app/store/services/sales.api";
import type { LogisticsTrackingDTO } from "./logisticsTracking.dto";
import LogisticsTrackingFormModal from "./LogisticsTrackingForm";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export function LogisticsTrackingPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isError, refetch } = useGetLogisticsTrackingsQuery();
  const [remove, { isLoading: isDeleting }] =
    useDeleteLogisticsTrackingMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editLogisticsTrackingId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await remove(id).unwrap();
          message.success(t("deleted"));
        } catch {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<LogisticsTrackingDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_val, _rec, i) => i + 1,
      width: 50,
      align: "center",
    },
    ...[
      "invoiceNumber",
      "client",
      "country",
      "city",
      "mark",
      "bagType",
      "quantity",
      "unitType",
      "lotNumber",
      "carrier",
      "govNumber",
      "driver",
      "deliveryStatus",
      "location",
    ].map((field) => ({
      title: t(field),
      dataIndex: field,
      key: field,
      ellipsis: true,
    })),
    {
      title: t("invoiceDate"),
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: formatDate,
    },
    {
      title: t("shippingDate"),
      dataIndex: "shippingDate",
      key: "shippingDate",
      render: formatDate,
    },
    {
      title: t("updatingDate"),
      dataIndex: "updatingDate",
      key: "updatingDate",
      render: formatDate,
    },
    {
      title: t("expectedDeliveryDate"),
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      render: formatDate,
    },
    {
      title: t("actions"),
      key: "actions",
      width: 100,
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="text" icon={<EyeOutlined />} />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id!)}
          />
          <Button
            danger
            type="text"
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
      <h1 className="text-2xl font-bold font-sans">{t("logisticsTracking")}</h1>
      <div className="flex justify-end">
        <LogisticsTrackingFormModal />
      </div>
      <Table
        bordered
        size="small"
        rowKey="_id"
        loading={isLoading}
        dataSource={data || []}
        columns={columns}
        scroll={{ x: 2800, y: "70dvh" }}
        pagination={false}
      />
    </div>
  );
}
