import {
  useGetProductionJournalQuery,
  useUpdateProductionOrderMutation,
  useUpdateProductJournalMutation,
} from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { formatDate } from "@/lib/utils/date-utils";
import { Button, InputNumber, message, Popover, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import RecipeView from "../recipes/RecipeView";
import { useSearchParams } from "react-router-dom";
import type { SingleProductionJournal } from "./production-process.dto";
import { useRules } from "@/hooks/useRules";
import { useForm } from "@/hooks/useForm";
import { useCallback, useState } from "react";
import { type ProductionOrderStatus } from "@/features/sales/production-orders/production-order.dto";
import { BookCheck, Eye, PackageCheck } from "lucide-react";
import { MarAsPackedModal } from "./MarAsPackedModal";

function QTYForm({
  record,
  onClose,
}: {
  record: SingleProductionJournal;
  onClose: VoidFunction;
}) {
  const { Form, form } = useForm();
  const { required } = useRules();
  const { t } = useTranslation();
  const [update, { isLoading }] = useUpdateProductJournalMutation();

  const handleFinish = useCallback(
    async (values: any) => {
      await update({
        ...values,
        _id: record._id!,
      }).unwrap();
      message.success(t("journalUpdatedSuccessfully"));
      onClose?.();
    },
    [onClose, record._id, t, update]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        produced: record.produced,
      }}
    >
      <div className="grid gap-4 min-w-[200px]">
        <Form.Item label={t("produced")} name="produced" rules={[required]}>
          <InputNumber
            onFocus={(event) => event.target.select()}
            ref={(el) => {
              setTimeout(() => el?.focus(), 0);
            }}
            className="w-full"
          />
        </Form.Item>
        <Button loading={isLoading} htmlType="submit" type="primary">
          {t("save")}
        </Button>
      </div>
    </Form>
  );
}

function RenderForm({ record }: { record: SingleProductionJournal }) {
  const [visible, setVisible] = useState(false);
  return (
    <Popover
      destroyTooltipOnHide
      content={<QTYForm record={record} onClose={() => setVisible(false)} />}
      trigger="click"
      onOpenChange={(op) => setVisible(op)}
      open={visible}
    >
      <div className="w-full min-h-full h-full block py-4 max-h-max">
        {record.produced}
      </div>
    </Popover>
  );
}

export function ProductionProcessesPage() {
  const { t } = useTranslation();
  const { data, refetch } = useGetProductionJournalQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [params, setParams] = useSearchParams();
  const [update, { isLoading }] = useUpdateProductionOrderMutation();
  const [packedRecord, setPackedRecord] =
    useState<SingleProductionJournal | null>(null);

  const handleStatusChange = useCallback(
    async (value: ProductionOrderStatus, id: string) => {
      await update({
        status: value,
        _id: id,
      } as any).unwrap();
      refetch();
      message.success(t("statusUpdatedSuccessfully"));
    },
    [refetch, t, update]
  );

  return (
    <div>
      <TablePage
        table={{
          dataSource: data,
          loading: isLoading,
          scroll: { x: 2000 },
          columns: [
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
              dataIndex: ["productionOrder", "id"],
              key: "id",
              width: 100,
            },
            {
              title: t("buyer"),
              dataIndex: ["productionOrder", "buyer", "clientName"],
              key: "buyer",
              width: 200,
            },
            {
              title: t("consignee"),
              dataIndex: ["productionOrder", "consignee", "consigneeName"],
              key: "consignee",
              width: 200,
              align: "center",
            },
            {
              title: t("country"),
              dataIndex: ["productionOrder", "country", "name"],
              key: "country",
              width: 150,
              align: "center",
            },
            {
              title: t("city"),
              dataIndex: ["productionOrder", "city", "name"],
              key: "city",
              width: 100,
              align: "center",
            },
            {
              title: t("mark"),
              dataIndex: ["productionOrder", "mark", "name"],
              key: "mark",
              width: 100,
              align: "center",
            },
            {
              title: t("quantity"),
              dataIndex: ["productionOrder", "quantity"],
              key: "quantity",
              width: 120,
              align: "center",
            },
            {
              title: t("bagType"),
              dataIndex: ["productionOrder", "bagType", "name"],
              key: "bagType",
              width: 150,
              align: "center",
            },
            {
              title: t("productionTime"),
              dataIndex: ["productionOrder", "productionTime"],
              key: "productionTime",
              render: (date: string) => formatDate(date),
              width: 180,
              align: "center",
            },
            {
              title: t("produced"),
              dataIndex: "produced",
              key: "produced",
              width: 130,
              align: "center",
              onCell: () => ({
                className: "cursor-pointer hover:!bg-gray-200",
              }),
              render: (_value, record) => <RenderForm record={record} />,
            },
            {
              title: t("ready"),
              dataIndex: "ready",
              key: "ready",
              width: 130,
              align: "center",
              render: (_value, record) =>
                `${
                  record.produced === 0
                    ? 0
                    : (
                        (record.produced / record.productionOrder.quantity) *
                        100
                      ).toFixed(2)
                }%`,
            },
            {
              title: t("status"),
              dataIndex: ["productionOrder", "status"],
              key: "status",
              render: (status: ProductionOrderStatus) => t(status),
              width: 200,
              align: "center",
            },
            {
              title: t("actualProductionDate"),
              dataIndex: "actualProductionDate",
              key: "actualProductionDate",
              render: (date: string) => formatDate(date),
              width: 180,
              align: "center",
            },
            {
              title: t("diff"),
              dataIndex: "diff",
              key: "diff",
              width: 200,
              align: "center",
            },
            {
              title: t("spendings"),
              dataIndex: "spendings",
              key: "spendings",
              width: 120,
              fixed: "right",
              align: "center",
              render: (
                _record: SingleProductionJournal,
                record: SingleProductionJournal
              ) => (
                <div className="flex items-center gap-1">
                  <Button
                    className="aspect-square"
                    size="small"
                    type="text"
                    onClick={() => {
                      params.set("viewId", record.recipeId._id);
                      setParams(params);
                    }}
                  >
                    <Eye />
                  </Button>
                  {record.productionOrder.status === "producing" &&
                  record.produced === record.productionOrder.quantity ? (
                    <Tooltip title={t("markAsProduced")}>
                      <Button
                        className="aspect-square"
                        size="small"
                        color="green"
                        variant="text"
                        onClick={() => {
                          handleStatusChange(
                            "produced",
                            record.productionOrder._id
                          );
                        }}
                      >
                        <BookCheck />
                      </Button>
                    </Tooltip>
                  ) : record.productionOrder.status === "produced" ? (
                    <Tooltip title={t("markAsPacked")}>
                      <Button
                        className="aspect-square"
                        size="small"
                        color="purple"
                        variant="text"
                        onClick={() => setPackedRecord(record)}
                      >
                        <PackageCheck className="size-6" />
                      </Button>
                    </Tooltip>
                  ) : null}
                </div>
              ),
            },
          ],
        }}
        title={t("productionJournal")}
      />
      <RecipeView />
      <MarAsPackedModal
        open={!!packedRecord}
        onCancel={() => setPackedRecord(null)}
        record={packedRecord}
      />
    </div>
  );
}
