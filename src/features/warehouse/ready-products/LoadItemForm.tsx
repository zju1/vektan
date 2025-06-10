import { Input, InputNumber, Modal, notification, type ModalProps } from "antd";
import type { IProducedMaterial } from "./ready-products.dto";
import { useTranslation } from "react-i18next";
import { useForm } from "@/hooks/useForm";
import { useRules } from "@/hooks/useRules";
import type { ShipmentDTO } from "@/features/sales/shipments/shipment.dto";
import {
  useCreateShipmentMutation,
  useGetProductionrderByIdQuery,
} from "@/app/store/services/sales.api";
import { useCallback } from "react";
import { useAppDispatch } from "@/app/store/store.config";
import { warehouseApi } from "@/app/store/services/warehouse.service";

export function LoadItemForm({
  productionItem,
  ...props
}: ModalProps & { productionItem: IProducedMaterial }) {
  const { t } = useTranslation();
  const { Form, form } = useForm();
  const { required } = useRules();
  const { data } = useGetProductionrderByIdQuery(
    productionItem.productionId._id,
    {
      skip: !productionItem,
    }
  );
  const [create, { isLoading }] = useCreateShipmentMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback(
    async (values: ShipmentDTO) => {
      await create({ ...values, productionOrder: data!._id! }).unwrap();
      notification.success({ message: t("shipmentStatusStarted") });
      dispatch(warehouseApi.util.invalidateTags(["PRODUCED_ITEMS"]));
      props?.onCancel?.({} as any);
    },
    [create, data, dispatch, props, t]
  );

  return (
    <Modal
      {...props}
      title={t(`loadItem`, { id: productionItem.productionId.id })}
      okText={t("save")}
      cancelText={t("cancel")}
      okButtonProps={{ loading: isLoading }}
      onOk={form.submit}
    >
      <Form<ShipmentDTO> form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid gap-4">
          <Form.Item
            name="pricePerUnit"
            label={t("pricePerUnit")}
            rules={[required]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="totalPrice"
            label={t("totalPrice")}
            rules={[required]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="stateNumberOfTractor"
            label={t("stateNumberOfTractor")}
            rules={[required]}
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            name="stateNumberOfTrailer"
            label={t("stateNumberOfTrailer")}
            rules={[required]}
          >
            <Input className="w-full" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
