import { Modal, Form, Input, Button, message, Spin } from "antd";
import { type SupplierDTO } from "./supplier.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateSupplierMutation,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
} from "@/app/store/services/suppliers.api";

export default function SupplierForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm<SupplierDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get supplier ID from query string if it exists
  const supplierId = searchParams.get("editSupplierId");

  // API hooks
  const [createSupplier, { isLoading: isCreating }] =
    useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] =
    useUpdateSupplierMutation();
  const { data: supplierData, isLoading: isLoadingSupplier } =
    useGetSupplierByIdQuery(supplierId, {
      skip: !supplierId || !isModalOpen,
    });

  // Determine if we're in edit mode
  const isEditMode = !!supplierId;

  // Open modal when supplierId changes in URL
  useEffect(() => {
    if (supplierId) {
      setIsModalOpen(true);
    }
  }, [supplierId]);

  // Set form values when supplier data is loaded
  useEffect(() => {
    if (supplierData && isEditMode) {
      form.setFieldsValue(supplierData);
    }
  }, [supplierData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    // Remove the editSupplierId from URL if it exists
    if (supplierId) {
      searchParams.delete("editSupplierId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: SupplierDTO) => {
    try {
      if (isEditMode && supplierId) {
        await updateSupplier({ supplier: values, id: supplierId }).unwrap();
      } else {
        await createSupplier(values).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (error) {
      message.error(t("errorOccuredInCRUD"));
    }
  };

  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={showModal}>
          {t("newSupplier")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editSupplier") : t("newSupplier")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingSupplier && isEditMode ? (
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
                name="contactName"
                label={t("contactPerson")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>{" "}
              <Form.Item
                name="phone"
                label={t("phone")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="companyName" label={t("companyName")}>
                <Input />
              </Form.Item>
              <Form.Item name="contactTitle" label={t("contactTitle")}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label={t("email")}>
                <Input type="email" />
              </Form.Item>
              <Form.Item name="region" label={t("region")}>
                <Input />
              </Form.Item>
              <Form.Item name="country" label={t("country")}>
                <Input />
              </Form.Item>
              <Form.Item name="city" label={t("city")}>
                <Input />
              </Form.Item>
              <Form.Item name="address" label={t("address")}>
                <Input />
              </Form.Item>
            </div>

            <div className="flex justify-end mt-6">
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
