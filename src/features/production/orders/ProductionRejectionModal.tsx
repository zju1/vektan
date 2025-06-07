import { useForm } from "@/hooks/useForm";
import { Input, Modal, type ModalProps } from "antd";
import { useTranslation } from "react-i18next";
import { useRules } from "@/hooks/useRules";
import { useCallback } from "react";
import { useChangeProductionOrderMutation } from "@/app/store/services/sales.api";
import type { SingleProductionOrder } from "@/features/sales/production-orders/production-order.dto";

export function ProductionRejectionModal({
  order,
  onReject,
  onCancel,
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
      productionRejectionReason: values.productionRejectionReason,
      status: "rejected_by_production",
    }).unwrap();
    onCancel?.({} as any);
    onReject();
  }, [form, onCancel, onReject, order._id, reject]);

  return (
    <Modal
      {...modalProps}
      onCancel={onCancel}
      onOk={form.submit}
      okButtonProps={{ loading: isLoading }}
      okText={t("reject")}
      cancelText={t("cancel")}
      width={700}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="productionRejectionReason"
          label={t("rejectionReason")}
          rules={[required]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
