import { useForm } from "@/hooks/useForm";
import { Input, Modal, type ModalProps } from "antd";
import type { SingleProductionOrder } from "./production-order.dto";
import { useTranslation } from "react-i18next";
import { useRules } from "@/hooks/useRules";
import { useCallback } from "react";
import { useChangeProductionOrderMutation } from "@/app/store/services/sales.api";

export function CommercialRejectionModal({
  order,
  onReject,
  ...modalProps
}: ModalProps & { order: SingleProductionOrder; onReject: VoidFunction }) {
  const { Form, form } = useForm();
  const { t } = useTranslation();
  const { required } = useRules();
  const [reject, { isLoading }] = useChangeProductionOrderMutation();

  const handleSubmit = useCallback(async () => {
    const values = form.getFieldsValue();
    await reject({
      _id: order._id,
      commercialRejectionReason: values.commercialRejectionReason,
      status: "rejected",
    }).unwrap();
    modalProps?.onCancel?.({} as any);
    onReject();
  }, [form, modalProps, onReject, order._id, reject]);

  return (
    <Modal
      {...modalProps}
      onOk={form.submit}
      okButtonProps={{ loading: isLoading }}
      okText={t("reject")}
      cancelText={t("cancel")}
      width={700}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="commercialRejectionReason"
          label={t("commercialRejectionReason")}
          rules={[required]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
