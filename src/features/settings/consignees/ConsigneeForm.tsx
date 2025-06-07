import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { clientStatusOptions, type ConsigneeDTO } from "./consignees.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useCreateConsigneeMutation,
  useGetConsigneeByIdQuery,
  useUpdateConsigneeMutation,
} from "@/app/store/services/settings.api";

export default function ConsigneeFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ConsigneeDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const consigneeId = searchParams.get("editConsigneeId");

  const [createConsignee, { isLoading: isCreating }] =
    useCreateConsigneeMutation();
  const [updateConsignee, { isLoading: isUpdating }] =
    useUpdateConsigneeMutation();
  const { data: consigneeData, isLoading: isLoadingClient } =
    useGetConsigneeByIdQuery(consigneeId!, {
      skip: !consigneeId || !isModalOpen,
    });

  const isEditMode = !!consigneeId;

  useEffect(() => {
    if (consigneeId) {
      setIsModalOpen(true);
    }
  }, [consigneeId]);

  useEffect(() => {
    if (consigneeData && isEditMode) {
      form.setFieldsValue(consigneeData);
    }
  }, [consigneeData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (consigneeId) {
      searchParams.delete("editConsigneeId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: ConsigneeDTO) => {
    try {
      if (isEditMode && consigneeId) {
        await updateConsignee({ consignee: values, id: consigneeId }).unwrap();
      } else {
        await createConsignee(values).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (error) {
      console.log(error);
      message.error(t("errorOccuredInCRUD"));
    }
  };

  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={showModal}>
          {t("create")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editConsignee") : t("newConsignee")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingClient && isEditMode ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <div className="grid gap-4">
              <Form.Item
                name="consigneeName"
                label={t("consigneeName")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="contactPerson"
                label={t("contactPerson")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="phone"
                  label={t("phone")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="status"
                  label={t("status")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Select>
                    {clientStatusOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {t(option.label)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <Form.Item name="contactTitle" label={t("contactTitle")}>
                <Input />
              </Form.Item>

              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="address" label={t("address")}>
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={t("email")}
                  rules={[{ type: "email", message: t("incorrectFormat") }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Form.Item name="region" label={t("region")}>
                  <Input />
                </Form.Item>

                <Form.Item name="country" label={t("country")}>
                  <Input />
                </Form.Item>
                <Form.Item name="city" label={t("city")}>
                  <Input />
                </Form.Item>
              </div>

              <Form.Item name="postalCode" label={t("postalCode")}>
                <Input />
              </Form.Item>
            </div>

            <div className="flex items-center justify-end mt-6">
              <Button onClick={hideModal} className="mr-2">
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating || isUpdating}
              >
                {t("save")}
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}
