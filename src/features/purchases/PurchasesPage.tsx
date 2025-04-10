import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal, Tooltip } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { PurchaseDTO } from "./purchase.dto";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";
import {
  useDeletePurchaseMutation,
  useGetPurchasesQuery,
} from "@/app/store/services/purchase.api";
import { formatCurrency } from "@/lib/utils/currency-utils";

export function PurchasePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // API integration
  const {
    data: purchases,
    isLoading,
    isError,
    refetch,
  } = useGetPurchasesQuery();
  const [deletePurchase, { isLoading: isDeleting }] =
    useDeletePurchaseMutation();

  const handleEdit = (id: string) => {
    navigate(`/purchases/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deletePurchase(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case "inReceiptProcess":
        return "blue";
      case "inTransit":
        return "orange";
      case "overdue":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "advancePayment":
        return "green";
      case "letterOfCredit":
        return "purple";
      case "installmentPlan":
        return "cyan";
      case "deferral":
        return "orange";
      case "paymentUponReceiptOfGoods":
        return "blue";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<PurchaseDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("applicationNumber"),
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 150,
    },
    {
      title: t("purchaseType"),
      dataIndex: "purchaseType",
      key: "purchaseType",
      width: 150,
      render: (type) => t(type),
    },
    {
      title: t("uniqueDescription"),
      dataIndex: "uniqueDescription",
      key: "uniqueDescription",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: t("supplier"),
      dataIndex: "supplierId",
      key: "supplierId",
      width: 100,
    },
    {
      title: t("supplierCompanyName"),
      dataIndex: "supplierCompanyName",
      key: "supplierCompanyName",
      width: 180,
    },
    {
      title: t("department"),
      dataIndex: "departmentId",
      key: "departmentId",
      width: 100,
    },
    {
      title: t("logisticsService"),
      dataIndex: "logisticsServiceId",
      key: "logisticsServiceId",
      width: 100,
    },
    {
      title: t("currency"),
      dataIndex: "currencyId",
      key: "currencyId",
      width: 100,
    },
    {
      title: t("deliveryTerms"),
      dataIndex: "deliveryTerms",
      key: "deliveryTerms",
      width: 150,
    },
    {
      title: t("quota"),
      dataIndex: "quota",
      key: "quota",
      width: 100,
    },
    {
      title: t("contractDate"),
      dataIndex: "contractDate",
      key: "contractDate",
      width: 120,
    },
    {
      title: t("contractQuantities"),
      dataIndex: "contractQuantities",
      key: "contractQuantities",
      width: 150,
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: t("cost"),
      dataIndex: "cost",
      key: "cost",
      width: 120,
      render: (cost) => formatCurrency(cost),
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: t("paymentStatus"),
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 150,
      render: (status) => (
        <Tag color={getPaymentStatusColor(status)}>{t(status)}</Tag>
      ),
    },
    {
      title: t("initiator"),
      dataIndex: "initiator",
      key: "initiator",
      width: 120,
    },
    {
      title: t("productStatus"),
      dataIndex: "productStatus",
      key: "productStatus",
      width: 150,
      render: (status) => (
        <Tag color={getProductStatusColor(status)}>{t(status)}</Tag>
      ),
    },
    {
      title: t("refund"),
      dataIndex: "refund",
      key: "refund",
      width: 120,
    },
    {
      title: t("purpose"),
      dataIndex: "purpose",
      key: "purpose",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (purpose) => (
        <Tooltip placement="topLeft" title={purpose}>
          {purpose}
        </Tooltip>
      ),
    },
    {
      title: t("comments"),
      dataIndex: "comments",
      key: "comments",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (comments) => (
        <Tooltip placement="topLeft" title={comments}>
          {comments}
        </Tooltip>
      ),
    },
    {
      title: t("specifications"),
      dataIndex: "specifications",
      key: "specifications",
      width: 120,
      render: (specs) => (
        <div className="flex items-center">
          {specs && specs.length > 0 ? (
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() => message.info(t("viewSpecifications"))}
            >
              {specs.length}
            </Button>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 80,
      align: "right",
      fixed: "right",
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
      <h1 className="font-sans font-bold text-2xl">{t("purchases")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/purchases/new")}
          >
            {t("newPurchase")}
          </Button>
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={purchases || []}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `${t("total")}: ${total}`,
        }}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
