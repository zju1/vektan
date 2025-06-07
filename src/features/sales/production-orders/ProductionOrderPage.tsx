import {
  useChangeProductionOrderMutation,
  useDeleteProductionOrderMutation,
  useGetProductionrdersQuery,
} from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { useTranslation } from "react-i18next";
import { ProductionOrderForm } from "./ProductionOrderForm";
import { Button, Descriptions, Modal, Tag, message, notification } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { formatDate } from "@/lib/utils/date-utils";
import { useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type {
  ProductionOrderStatus,
  SingleProductionOrder,
} from "./production-order.dto";
import { CommercialRejectionModal } from "./CommercialRejectionModal";

export function ProductionOrderPage() {
  const { t } = useTranslation();
  const { data, isFetching, refetch } = useGetProductionrdersQuery({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [reject, setReject] = useState(false);
  const [change, { isLoading: statusChanging }] =
    useChangeProductionOrderMutation();
  const [viewRecord, setViewRecord] = useState<SingleProductionOrder | null>(
    null
  );
  const [remove, { isLoading: isDeleting }] =
    useDeleteProductionOrderMutation();
  const [open, setOpen] = useState(false);

  const handleEdit = useCallback(
    (id: string) => {
      searchParams.set("editProductionOrderId", id);
      setSearchParams(searchParams);
      setOpen(true);
    },
    [searchParams, setSearchParams]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      Modal.confirm({
        title: t("warning"),
        content: t("deleteSure"),
        onOk: async () => {
          try {
            await remove(id).unwrap();
            message.success(t("deleted"));
            refetch();
          } catch (error) {
            message.error(t("errorOccured"));
          }
        },
      });
    },
    [refetch, remove, t]
  );

  const columns: ColumnsType<SingleProductionOrder> = useMemo(
    () => [
      {
        title: "№",
        dataIndex: "index",
        key: "index",
        render: (_value, _record, index) => index + 1,
        width: 50,
        align: "center",
      },
      {
        title: t("id"),
        dataIndex: "id",
        key: "id",
        width: 100,
      },
      {
        title: t("buyer"),
        dataIndex: ["buyer", "clientName"],
        key: "buyer",
        width: 250,
      },
      {
        title: t("consignee"),
        dataIndex: ["consignee", "consigneeName"],
        key: "consignee",
      },
      {
        title: t("country"),
        dataIndex: ["country", "name"],
        key: "country",
        width: 200,
      },
      {
        title: t("city"),
        dataIndex: ["city", "name"],
        key: "city",
      },
      {
        title: t("mark"),
        dataIndex: ["mark", "name"],
        key: "mark",
      },
      {
        title: t("status"),
        dataIndex: "status",
        key: "status",
        width: 200,
        render: (status: ProductionOrderStatus) => (
          <Tag
            color={
              status === "draft"
                ? "blue"
                : (
                    [
                      "rejected",
                      "rejected_by_production",
                    ] as ProductionOrderStatus[]
                  ).includes(status)
                ? "red-inverse"
                : "green"
            }
          >
            {t(status)}
          </Tag>
        ),
      },
      {
        title: t("volume"),
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: t("unitType"),
        dataIndex: ["unitType", "name"],
        key: "unitType",
      },
      {
        title: t("bagType"),
        dataIndex: ["bagType", "name"],
        key: "bagType",
      },
      {
        title: t("productionTime"),
        dataIndex: "productionTime",
        key: "productionTime",
        render: (date: string) => formatDate(date),
      },
      {
        title: t("approvingDocument"),
        dataIndex: "approvingDocument",
        key: "approvingDocument",
        width: 150,
        render: (docs: any[]) => t("documentsLength", { docs: docs.length }),
      },
      {
        title: t("salesPersonName"),
        dataIndex: "salesPerson",
        key: "salesPerson",
      },
      {
        title: t("comments"),
        dataIndex: "comments",
        key: "comments",
        ellipsis: true,
      },
      {
        title: t("actions"),
        key: "actions",
        width: 120,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <div className="flex items-center gap-2 [&>*]:shrink-0">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setViewRecord(record)}
            />
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
    ],
    [t, isDeleting, handleEdit, handleDelete]
  );

  const sendToCommercialDirector = useCallback(async () => {
    await change({ _id: viewRecord?._id, status: "on_approval" }).unwrap();
    notification.success({
      message: t("SOsuccessfullySentToCommercialDirector"),
    });
    setViewRecord(null);
  }, [change, t, viewRecord?._id]);

  const sendToProductionDirector = useCallback(async () => {
    await change({
      _id: viewRecord?._id,
      status: "under_review_by_production",
    }).unwrap();
    notification.success({
      message: t("approvedAndSentToProdDirector"),
    });
    setViewRecord(null);
  }, [change, t, viewRecord?._id]);

  return (
    <>
      <TablePage<SingleProductionOrder>
        title={t("productionOrders")}
        onCreate={() => setOpen(true)}
        table={{
          columns,
          loading: isFetching,
          dataSource: data,
          scroll: {
            x: 2500,
          },
        }}
      />
      <Modal
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        footer={null}
        maskClosable={false}
        title={viewRecord?.id}
      >
        {viewRecord && (
          <div className="grid gap-4">
            <Descriptions
              column={1}
              labelStyle={{ maxWidth: "150px" }}
              bordered
              size="small"
              className="mt-4"
            >
              <Descriptions.Item label={t("buyer")}>
                {viewRecord.buyer?.clientName}
              </Descriptions.Item>
              <Descriptions.Item label={t("consignee")}>
                {viewRecord.consignee?.consigneeName}
              </Descriptions.Item>
              <Descriptions.Item label={t("country")}>
                {viewRecord.country?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("city")}>
                {viewRecord.city?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("mark")}>
                {viewRecord.mark?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("volume")}>
                {viewRecord.quantity}
              </Descriptions.Item>
              <Descriptions.Item label={t("unitType")}>
                {viewRecord.unitType?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("bagType")}>
                {viewRecord.bagType?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("productionTime")}>
                {formatDate(viewRecord.productionTime)}
              </Descriptions.Item>
              <Descriptions.Item label={t("approvingDocument")}>
                {viewRecord.approvingDocument?.map((doc: any) => (
                  <div key={doc._id}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.name}
                    </a>
                  </div>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label={t("salesPersonName")}>
                {viewRecord.salesPerson}
              </Descriptions.Item>
              <Descriptions.Item label={t("status")}>
                {t(viewRecord.status)}
              </Descriptions.Item>
              {viewRecord.status === "rejected" && (
                <Descriptions.Item label={t("commercialRejectionReason")}>
                  {viewRecord.commercialRejectionReason}
                </Descriptions.Item>
              )}
              <Descriptions.Item label={t("comments")}>
                {viewRecord.comments}
              </Descriptions.Item>
            </Descriptions>
            {viewRecord.status === "draft" && (
              <Button
                loading={statusChanging}
                icon={<SendOutlined />}
                type="primary"
                onClick={sendToCommercialDirector}
              >
                {t("sendToCommercialDirector")}{" "}
              </Button>
            )}
            {viewRecord.status === "on_approval" && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  icon={<CloseOutlined />}
                  loading={statusChanging}
                  danger
                  onClick={() => setReject(true)}
                >
                  {t("reject")}
                </Button>
                <Button
                  loading={statusChanging}
                  icon={<CheckOutlined />}
                  color="cyan"
                  variant="solid"
                  onClick={sendToProductionDirector}
                >
                  {t("approveAndSendToProductionDirector")}{" "}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
      <ProductionOrderForm
        onClose={() => setOpen(false)}
        open={open}
        title={
          searchParams.get("editProductionOrderId")
            ? t("editProductionOrder")
            : t("createProductionOrder")
        }
      />
      {reject && (
        <CommercialRejectionModal
          open={reject}
          centered
          title={t("commercialReject", { doc: viewRecord?.id })}
          onCancel={() => setReject(false)}
          onReject={() => setViewRecord(null)}
          order={viewRecord!}
        />
      )}
    </>
  );
}
