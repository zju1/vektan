import {
  useCreatePurchaseRequestMutation,
  useGetPurchaseRequestByIdQuery,
  useUpdatePurchaseRequestMutation,
} from "@/app/store/services/purchase.api";
import {
  useGetCurrenciesQuery,
  useGetUnitTypesQuery,
} from "@/app/store/services/settings.api";
import { Form, Input, InputNumber, Modal, Select, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { purchaseStatuses } from "./PurchaseConfirmForm";
import { useGetSuppliersQuery } from "@/app/store/services/suppliers.api";

export function PurchaseOrderForm({
  open,
  setOpen,
  id,
  setId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string | null;
  setId: Dispatch<SetStateAction<string | null>>;
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [create, { isLoading: createLoading }] =
    useCreatePurchaseRequestMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdatePurchaseRequestMutation();
  const { data } = useGetPurchaseRequestByIdQuery(id, {
    refetchOnMountOrArgChange: true,
    skip: !id,
  });

  const { data: unitTypes } = useGetUnitTypesQuery();
  const { data: currencies } = useGetCurrenciesQuery();
  const { data: suppliers } = useGetSuppliersQuery();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.requiredDate = moment(values.requiredDate).toISOString();
      values.expectedReceivingDate = moment(
        values.expectedReceivingDate
      ).toISOString();

      if (id) {
        await update({
          purchase: { ...values, id: data!.id },
          _id: String(data?._id),
        });
      } else {
        await create(values);
      }

      setOpen(false);
      setId(null);
      form.resetFields();
    } catch (err) {
      console.error("Form error:", err);
    }
  };
  const canShowDetails = id && data?.status === "confirmed";
  useEffect(() => {
    if (id && data) {
      form.setFieldsValue({
        ...data,
        requiredDate: moment(data.requiredDate),
        expectedReceivingDate: moment(data.expectedReceivingDate),
      });
    }
  }, [data, form, id]);

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setId(null);
        }}
        onOk={handleSubmit}
        confirmLoading={createLoading || updateLoading}
        title={t("purchaseRequests")}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <div className="grid gap-4">
            <Form.Item
              name="initiator"
              label={t("initiator")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="product"
              label={t("productName")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="techspecs"
              label={t("techspecs")}
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="priority"
              label={t("priority")}
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="critical">{t("critical")}</Select.Option>
                <Select.Option value="high">{t("high")}</Select.Option>
                <Select.Option value="medium">{t("medium")}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="unitType"
              label={t("unitType")}
              rules={[{ required: true }]}
            >
              <Select>
                {unitTypes?.map((u) => (
                  <Select.Option key={u._id} value={u._id}>
                    {u.name} ({u.code})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label={t("quantity")}
              rules={[{ required: true }]}
            >
              <InputNumber<number>
                min={1}
                style={{ width: "100%" }}
                onChange={(value) =>
                  form.setFieldValue(
                    "total",
                    value ? value * (form.getFieldValue("price") || 1) : 0
                  )
                }
              />
            </Form.Item>
            {canShowDetails && (
              <>
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
                        value
                          ? value * (form.getFieldValue("quantity") || 1)
                          : 0
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
              </>
            )}
            <Form.Item
              name="requiredDate"
              label={t("requiredDate")}
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="status"
              label={t("status")}
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="dealing">{t("dealing")}</Select.Option>
                <Select.Option value="confirmed">
                  {t("confirmed")}
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="comment"
              label={t("comment")}
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            {canShowDetails && (
              <>
                <Form.Item
                  name="responsible"
                  label={t("responsible")}
                  rules={[{ required: true }]}
                >
                  <Input />
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
              </>
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
