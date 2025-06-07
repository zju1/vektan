import { Modal, Form, Input, Button, message, Spin } from "antd";
import type { CountryDTO } from "./countries.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCountryMutation,
  useGetCountryByIdQuery,
  useUpdateCountryMutation,
} from "@/app/store/services/settings.api";

export default function CountryFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<CountryDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const countryId = searchParams.get("editCountryId");

  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();
  const { data: countryData, isLoading: isLoadingCountry } =
    useGetCountryByIdQuery(countryId!, {
      skip: !countryId || !isModalOpen,
    });

  const isEditMode = !!countryId;

  useEffect(() => {
    if (countryId) setIsModalOpen(true);
  }, [countryId]);

  useEffect(() => {
    if (countryData && isEditMode) {
      form.setFieldsValue(countryData);
    }
  }, [countryData, form, isEditMode]);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (countryId) {
      searchParams.delete("editCountryId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: CountryDTO) => {
    try {
      if (isEditMode && countryId) {
        await updateCountry({ id: countryId, country: values }).unwrap();
      } else {
        await createCountry(values).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch {
      message.error(t("errorOccuredInCRUD"));
    }
  };

  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={showModal}>
          {t("newCountry")}
        </Button>
      )}
      <Modal
        title={isEditMode ? t("editCountry") : t("newCountry")}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingCountry && isEditMode ? (
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
            <div className="grid gap-2">
              <Form.Item
                name="name"
                label={t("name")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="code"
                label={t("code")}
                rules={[{ required: true, message: t("required") }]}
              >
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
