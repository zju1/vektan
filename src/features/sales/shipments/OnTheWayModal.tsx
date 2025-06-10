import {
  DatePicker,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  type ModalProps,
} from "antd";
import type { SingleShipment } from "./shipment.dto";
import { useTranslation } from "react-i18next";
import { useForm } from "@/hooks/useForm";
import { useGetCurrenciesQuery } from "@/app/store/services/settings.api";
import { useRules } from "@/hooks/useRules";
import { useCallback } from "react";
import { useCreateShipmentReportMutation } from "@/app/store/services/sales.api";

export function OnTheWayModal({
  shipment,
  ...props
}: ModalProps & { shipment: SingleShipment }) {
  const { t } = useTranslation();
  const { Form, form } = useForm();
  const { data: currencies } = useGetCurrenciesQuery();
  const { required } = useRules();
  const [create, { isLoading }] = useCreateShipmentReportMutation();

  const handleSubmit = useCallback(
    async (values: any) => {
      const body = {
        ...values,
        shipmentDate: values.shipmentDate.toISOString(),
        actualDeliveryDate: values.actualDeliveryDate.toISOString(),
        productionOrder: shipment.productionOrder._id,
      };
      await create(body).unwrap();
      notification.success({ message: t("statusUpdatedSuccessfully") });
      props?.onCancel?.({} as any);
    },
    [create, props, shipment.productionOrder._id, t]
  );

  return (
    <Modal
      {...props}
      title={t("onTheWayForm", { id: shipment.productionOrder.id })}
      okText={t("save")}
      onOk={form.submit}
      okButtonProps={{ loading: isLoading }}
      cancelText={t("cancel")}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid gap-4">
          <Form.Item
            name="invoiceNumber"
            rules={[required]}
            label={t("invoiceNumber")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shipmentDate"
            rules={[required]}
            label={t("shipmentDate")}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="currentLocation"
            rules={[required]}
            label={t("currentLocation")}
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            name="actualDeliveryDate"
            rules={[required]}
            label={t("actualDeliveryDate")}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="deliveryExpenses"
            rules={[required]}
            label={t("deliveryExpenses")}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="deliveryExpensesPerTonn"
            rules={[required]}
            label={t("deliveryExpensesPerTonn")}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="currency" rules={[required]} label={t("currency")}>
            <Select
              options={currencies?.map((item) => ({
                label: `${item.name} | ${item.code}`,
                value: item._id,
              }))}
              className="w-full"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
