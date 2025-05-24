import { useConfirmPurchaseRequestMutation } from "@/app/store/services/purchase.api";
import { useGetCurrenciesQuery } from "@/app/store/services/settings.api";
import {
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  InputNumber,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { type Dispatch, type SetStateAction } from "react";
import { useGetSuppliersQuery } from "@/app/store/services/suppliers.api";
import type { PurchaseOrderDTO } from "./purchase-order.dto";

export interface PurchaseConfirmationDTO {
  price: number;
  total: number;
  currency: string;
  supplier: string;
  expectedReceivingDate: string;
  responsible: string;
  confirmationComment: string;
  purchaseStatus: "co" | "contract" | "prepayment" | "completed";
}

export const purchaseStatuses: {
  label: string;
  value: PurchaseConfirmationDTO["purchaseStatus"];
}[] = [
  {
    label: "co",
    value: "co",
  },
  {
    label: "contract",
    value: "contract",
  },
  {
    label: "prepayment",
    value: "prepayment",
  },
  {
    label: "completed",
    value: "completed",
  },
];

export function ConfirmPurchaseRequest({
  po,
  setPO,
}: {
  po: PurchaseOrderDTO | null;
  setPO: Dispatch<SetStateAction<PurchaseOrderDTO | null>>;
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [update, { isLoading: updateLoading }] =
    useConfirmPurchaseRequestMutation();

  const { data: currencies } = useGetCurrenciesQuery();
  const { data: suppliers } = useGetSuppliersQuery();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.expectedReceivingDate = moment(
        values.expectedReceivingDate
      ).toISOString();

      await update({
        purchase: values,
        _id: po!._id!,
      });
      notification.success({ message: t("purchaseRequestConfirmed") });
      setPO(null);
      form.resetFields();
    } catch (err) {
      console.error("Form error:", err);
    }
  };

  return (
    <Modal
      open={!!po}
      onCancel={() => {
        setPO(null);
      }}
      onOk={handleSubmit}
      confirmLoading={updateLoading}
      title={t("confirmPurchaseRequest")}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <div className="grid gap-4">
          <Form.Item
            name="responsible"
            label={t("responsible")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="currency"
            label={t("currency")}
            rules={[{ required: true }]}
          >
            <Select
              options={currencies?.map((item) => ({
                label: `${item.code} - ${item.name}`,
                value: item._id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label={t("price")}
            rules={[{ required: true }]}
          >
            <InputNumber<number>
              className="w-full"
              onChange={(value) =>
                form.setFieldValue(
                  "total",
                  value ? value * (po?.quantity || 1) : 0
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="total"
            label={t("total")}
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" disabled />
          </Form.Item>
          <Form.Item
            name="supplier"
            label={t("supplier")}
            rules={[{ required: true }]}
          >
            <Select
              options={suppliers?.map((item) => ({
                label: `${item.companyName} - ${item.contactName}`,
                value: item._id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="expectedReceivingDate"
            label={t("expectedReceivingDate")}
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="purchaseStatus"
            label={t("purchaseStatus")}
            rules={[{ required: true }]}
          >
            <Select
              options={purchaseStatuses.map((item) => ({
                ...item,
                label: t(item.label),
              }))}
            />
          </Form.Item>
          <Form.Item
            name="confirmationComment"
            label={t("confirmationComment")}
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
