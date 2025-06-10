import {
  useChangeProductionOrderMutation,
  useGetProductionrdersQuery,
} from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { useTranslation } from "react-i18next";
import { Button, Descriptions, Modal, notification, Tag } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { formatDate } from "@/lib/utils/date-utils";
import type { ColumnsType } from "antd/es/table";
import type {
  ProductionOrderStatus,
  SingleProductionOrder,
} from "@/features/sales/production-orders/production-order.dto";
import { ProductionRejectionModal } from "./ProductionRejectionModal";
import { useNavigate } from "react-router-dom";

export function ProductionOrderPage() {
  const { t } = useTranslation();
  const { data, isFetching } = useGetProductionrdersQuery({
    status:
      "accepted_by_production,planned,under_review_by_production,planned,producing,produced",
  });
  const [reject, setReject] = useState(false);
  const [viewRecord, setViewRecord] = useState<SingleProductionOrder | null>(
    null
  );
  const navigate = useNavigate();
  const [change, { isLoading: statusChanging }] =
    useChangeProductionOrderMutation();

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
        width: 105,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <div className="flex items-center gap-2 [&>*]:shrink-0">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setViewRecord(record)}
            />
            {record.status === "planned" && (
              <Button
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate(`/production/recipes?poId=${record._id}`)
                }
              />
            )}
          </div>
        ),
      },
    ],
    [navigate, t]
  );

  const approveAndPlan = useCallback(async () => {
    await change({ _id: viewRecord?._id, status: "planned" }).unwrap();
    notification.success({
      message: t("SOApprovedToPlan"),
    });
    setViewRecord(null);
  }, [change, t, viewRecord?._id]);

  return (
    <>
      <TablePage
        title="Сводная таблица заказов"
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
            <Descriptions column={1} bordered size="small" className="mt-4">
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
              <Descriptions.Item label={t("quantity")}>
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
              <Descriptions.Item label={t("comments")}>
                {viewRecord.comments}
              </Descriptions.Item>
            </Descriptions>
            {viewRecord.status === "under_review_by_production" && (
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
                  onClick={approveAndPlan}
                >
                  {t("approveAndAddToPlan")}{" "}
                </Button>
              </div>
            )}
          </div>
        )}

        {reject && (
          <ProductionRejectionModal
            open={reject}
            centered
            title={t("rejectToProduce", { doc: viewRecord?.id })}
            onCancel={() => setReject(false)}
            onClose={() => setReject(false)}
            onReject={() => setViewRecord(null)}
            order={viewRecord!}
          />
        )}
      </Modal>
    </>
  );
}
