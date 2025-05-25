import { useTranslation } from "react-i18next";
import { Button, Table, Modal, message } from "antd";
import { useSearchParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { MutualSettlementsILCAOtherDTO } from "./mutual-settlements-ilca-other.dto";
import {
  useDeleteMutualSettlementsILCAOtherMutation,
  useGetMutualSettlementsILCAOtherQuery,
} from "@/app/store/services/sales.api";
import MutualSettlementsIlcaOtherForm from "./MutualSettlementsIlcaOtherForm";
import { formatDate } from "@/lib/utils/date-utils";

export function MutualSettlementsIlcaOtherPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isError, refetch } =
    useGetMutualSettlementsILCAOtherQuery();
  const [remove, { isLoading: isDeleting }] =
    useDeleteMutualSettlementsILCAOtherMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editMutualSettlementsIlcaOtherId", id);
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
        } catch (err) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<MutualSettlementsILCAOtherDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_value, _record, index) => index + 1,
      width: 60,
    },
    {
      title: t("buyer"),
      dataIndex: "buyer",
      key: "buyer",
      width: 150,
    },
    {
      title: t("shipmentDate"),
      dataIndex: "shipmentDate",
      key: "shipmentDate",
      render: formatDate,
      width: 150,
    },
    {
      title: t("invoice"),
      dataIndex: "invoice",
      key: "invoice",
      width: 150,
    },
    {
      title: t("productName"),
      dataIndex: "productName",
      key: "productName",
      width: 150,
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: t("summ"),
      dataIndex: "summ",
      key: "summ",
      width: 100,
    },
    {
      title: t("paymentDate"),
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: formatDate,
      width: 150,
    },
    {
      title: t("remained"),
      dataIndex: "remained",
      key: "remained",
      width: 120,
    },
    {
      title: t("deliveryDate"),
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: formatDate,
      width: 150,
    },
    {
      title: t("paymentDateInDays"),
      dataIndex: "paymentDateInDays",
      key: "paymentDateInDays",
      width: 100,
    },
    {
      title: t("days"),
      dataIndex: "days",
      key: "days",
      width: 80,
    },
    {
      title: t("paymentDeadline"),
      dataIndex: "paymentDeadline",
      key: "paymentDeadline",
      render: formatDate,
      width: 150,
    },
    {
      title: t("actions"),
      key: "actions",
      fixed: "right",
      width: 100,
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
      <h1 className="text-2xl font-bold">{t("mutualSettlementsIlcaOther")}</h1>
      <div className="flex justify-between gap-2">
        <div />
        <div className="flex gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <MutualSettlementsIlcaOtherForm />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        dataSource={data || []}
        rowKey={(row) => row._id!}
        columns={columns}
        scroll={{ x: 1800 }}
        pagination={false}
      />
    </div>
  );
}
