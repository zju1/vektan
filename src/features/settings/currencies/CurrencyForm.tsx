"use client";

import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
  Switch,
  InputNumber,
} from "antd";
import type { CurrencyDTO } from "./currency.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCurrencyMutation,
  useGetCurrencyByCodeQuery,
  useUpdateCurrencyMutation,
} from "@/app/store/services/settings.api";

export default function CurrencyFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<CurrencyDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currencyCode = searchParams.get("editCurrencyCode");

  const [createCurrency, { isLoading: isCreating }] =
    useCreateCurrencyMutation();
  const [updateCurrency, { isLoading: isUpdating }] =
    useUpdateCurrencyMutation();
  const { data: currencyData, isLoading: isLoadingCurrency } =
    useGetCurrencyByCodeQuery(currencyCode, {
      skip: !currencyCode || !isModalOpen,
    });

  const isEditMode = !!currencyCode;

  useEffect(() => {
    if (currencyCode) {
      setIsModalOpen(true);
    }
  }, [currencyCode]);

  useEffect(() => {
    if (currencyData && isEditMode) {
      form.setFieldsValue(currencyData);
    }
  }, [currencyData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (currencyCode) {
      searchParams.delete("editCurrencyCode");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: CurrencyDTO) => {
    try {
      if (isEditMode && currencyCode) {
        await updateCurrency({ currency: values, code: currencyCode }).unwrap();
      } else {
        // Set default values for dates if creating new currency
        const now = new Date();
        values.createdAt = now;
        values.updatedAt = now;
        await createCurrency(values).unwrap();
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
          {t("newCurrency")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editCurrency") : t("newCurrency")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingCurrency && isEditMode ? (
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
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="code"
                  label={t("code")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Input disabled={isEditMode} />
                </Form.Item>

                <Form.Item
                  name="symbol"
                  label={t("symbol")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                name="name"
                label={t("name")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="exchangeRateToBase"
                label={t("exchangeRateToBase")}
              >
                <InputNumber
                  min={0}
                  step={0.0001}
                  precision={4}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="isActive"
                label={t("status")}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t("active")}
                  unCheckedChildren={t("inactive")}
                />
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
