import {
  useDeletePurchaseRequestMutation,
  useGetPurchaseRequestQuery,
} from "@/app/store/services/purchase.api";
import { Button, Popconfirm, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { useState } from "react";
import moment from "moment";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

export function ApprovedPurchases() {
  const { t } = useTranslation();
  const [remove] = useDeletePurchaseRequestMutation();
  const { data, isFetching } = useGetPurchaseRequestQuery({ confirmed: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: t("initiator"),
      dataIndex: "initiator",
      key: "initiator",
    },
    {
      title: t("productName"),
      dataIndex: "product",
      key: "product",
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: t("unitType"),
      dataIndex: "unitTypeName",
      key: "unitTypeName",
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: t("total"),
      dataIndex: "total",
      key: "total",
    },
    {
      title: t("supplier"),
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: t("currency"),
      dataIndex: "currencyName",
      key: "currencyName",
    },
    {
      title: t("techspecs"),
      dataIndex: "techspecs",
      key: "techspecs",
    },
    {
      title: t("priority"),
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        const colorMap = {
          critical: "red",
          high: "orange",
          medium: "blue",
        };
        return (
          <Tag color={colorMap[priority as keyof typeof colorMap]}>
            {t(priority)}
          </Tag>
        );
      },
    },

    {
      title: t("requiredDate"),
      dataIndex: "requiredDate",
      key: "requiredDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: t("expectedReceivingDate"),
      dataIndex: "expectedReceivingDate",
      key: "expectedReceivingDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap = {
          dealing: "blue",
          confirmed: "green",
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {t(status)}
          </Tag>
        );
      },
    },
    {
      title: t("purchaseStatus"),
      dataIndex: "purchaseStatus",
      key: "purchaseStatus",
      render: (status: string) => {
        const colorMap = {
          co: "blue",
          contract: "geekblue",
          prepayment: "gold",
          completed: "green",
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {t(status)}
          </Tag>
        );
      },
    },
    {
      title: t("comment"),
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: t("confirmationComment"),
      dataIndex: "confirmationComment",
      key: "confirmationComment",
    },
    {
      title: t("actions"),
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} size="small" />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingId(record._id);
              setOpen(true);
            }}
          />
          <Popconfirm
            title={t("areYouSureDelete")}
            onConfirm={() => remove(record._id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-bold text-2xl">
          {t("approvedPurchases")}
        </h1>
        <PurchaseOrderForm
          id={editingId}
          setId={setEditingId}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <Table
        rowKey="_id"
        bordered
        dataSource={data || []}
        loading={isFetching}
        columns={columns}
        scroll={{ x: 2000 }}
      />
    </div>
  );
}
