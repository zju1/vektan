import {
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  type ModalProps,
} from "antd";
import type {
  MarkAsPackedDTO,
  SingleProductionJournal,
} from "./production-process.dto";
import { useTranslation } from "react-i18next";
import { useForm } from "@/hooks/useForm";
import { useRules } from "@/hooks/useRules";
import { useGetUnitTypesQuery } from "@/app/store/services/settings.api";
import { useCallback } from "react";
import { useCreateProducedItemMutation } from "@/app/store/services/warehouse.service";
import { salesApi } from "@/app/store/services/sales.api";
import { useAppDispatch } from "@/app/store/store.config";

export function MarAsPackedModal({
  record,
  ...props
}: ModalProps & { record: SingleProductionJournal | null }) {
  const { t } = useTranslation();

  const { Form, form } = useForm();
  const { required } = useRules();
  const { data: unitTypes } = useGetUnitTypesQuery();
  const [createProducedWHItem] = useCreateProducedItemMutation();
  const dispatch = useAppDispatch();
  const handleSubmit = useCallback(
    async (values: MarkAsPackedDTO) => {
      await createProducedWHItem({
        ...values,
        productionId: record!.productionOrder._id,
      }).unwrap();
      dispatch(
        salesApi.util.invalidateTags([
          "ProductionJournal",
          "PRODUCTION_ORDERS",
          "ProductionLab",
        ])
      );
      message.success(t("statusUpdatedSuccessfully"));
      props.onCancel?.({} as any);
    },
    [createProducedWHItem, dispatch, props, record, t]
  );

  return (
    <Modal
      {...props}
      destroyOnClose
      title={t(`markAsPackedModal`, { id: record?.productionOrder.id })}
      okText={t("save")}
      cancelText={t("cancel")}
      onOk={form.submit}
    >
      <Form
        form={form}
        layout="vertical"
        className="pb-4"
        onFinish={handleSubmit}
      >
        <div className="grid gap-4">
          <div className="grid gap-2 grid-cols-2 gap-x-4">
            <Form.Item
              name="numberOfBags"
              label={t("numberOfBags")}
              rules={[required]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name="numberOfPallets"
              label={t("numberOfPallets")}
              rules={[required]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name={["nettoWeight", "weight"]}
              label={t("nettoWeight")}
              rules={[required]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name={["nettoWeight", "unitType"]}
              label={t("unitType")}
              rules={[required]}
            >
              <Select
                options={unitTypes?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name={["bruttoWeight", "weight"]}
              label={t("bruttoWeight")}
              rules={[required]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name={["bruttoWeight", "unitType"]}
              label={t("unitType")}
              rules={[required]}
            >
              <Select
                options={unitTypes?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                className="w-full"
              />
            </Form.Item>
          </div>{" "}
          <Form.Item
            name="placementInWarehouse"
            label={t("placementInWarehouse")}
            rules={[required]}
          >
            <Input className="w-full" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
