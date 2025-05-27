/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  message,
  Spin,
  Select,
} from "antd";
import type { MutualSettlementsILCAOtherDTO } from "./mutual-settlements-ilca-other.dto";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import {
  useCreateMutualSettlementsILCAOtherMutation,
  useUpdateMutualSettlementsILCAOtherMutation,
  useGetMutualSettlementsILCAOtherByIdQuery,
} from "@/app/store/services/sales.api";
import { useGetClientsQuery } from "@/app/store/services/clients.api";

export default function MutualSettlementsIlcaOtherForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm<MutualSettlementsILCAOtherDTO>();
  const [searchParams, setSearchParams] = useSearchParams();

  const editId = searchParams.get("editMutualSettlementsIlcaOtherId");
  const isEditMode = !!editId;

  const [create, { isLoading: isCreating }] =
    useCreateMutualSettlementsILCAOtherMutation();
  const [update, { isLoading: isUpdating }] =
    useUpdateMutualSettlementsILCAOtherMutation();
  const { data, isLoading: isLoadingData } =
    useGetMutualSettlementsILCAOtherByIdQuery(editId!, {
      skip: !editId,
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (editId) setIsModalOpen(true);
  }, [editId]);

  useEffect(() => {
    if (data && isEditMode) {
      form.setFieldsValue({
        ...data,
        shipmentDate: moment(data.shipmentDate) as any,
        paymentDate: moment(data.paymentDate) as any,
        deliveryDate: moment(data.deliveryDate) as any,
        paymentDeadline: moment(data.paymentDeadline) as any,
      });
    }
  }, [data]);

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (editId) {
      searchParams.delete("editMutualSettlementsIlcaOtherId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      shipmentDate: values.shipmentDate?.toISOString(),
      paymentDate: values.paymentDate?.toISOString(),
      deliveryDate: values.deliveryDate?.toISOString(),
      paymentDeadline: values.paymentDeadline?.toISOString(),
    };

    try {
      if (isEditMode && editId) {
        await update({ id: editId, data: payload }).unwrap();
      } else {
        await create(payload).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (err) {
      message.error(t("errorOccuredInCRUD"));
    }
  };
  const { data: clients } = useGetClientsQuery();
  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          {t("newRecord")}
        </Button>
      )}
      <Modal
        title={t(isEditMode ? "edit" : "newRecord")}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isEditMode && isLoadingData ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            className="mt-4"
          >
            <div className="grid gap-4">
              <Form.Item
                name="buyer"
                label={t("buyer")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={clients?.map((item) => ({
                    value: item._id,
                    label: item.clientName,
                  }))}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                name="shipmentDate"
                label={t("shipmentDate")}
                rules={[{ required: true, message: t("required") }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name="invoice"
                label={t("invoice")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="productName"
                label={t("productName")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label={t("quantity")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name="price"
                label={t("price")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name="summ"
                label={t("summ")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name="paymentDate"
                label={t("paymentDate")}
                rules={[{ required: true, message: t("required") }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name="remained"
                label={t("remained")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="deliveryDate"
                label={t("deliveryDate")}
                rules={[{ required: true, message: t("required") }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name="paymentDateInDays"
                label={t("paymentDateInDays")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name="days"
                label={t("days")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name="paymentDeadline"
                label={t("paymentDeadline")}
                rules={[{ required: true, message: t("required") }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={hideModal}>{t("cancel")}</Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={isCreating || isUpdating}
                >
                  {t("save")}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}
