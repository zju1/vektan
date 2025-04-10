import { Modal, Form, Input, Button, message, Spin, Switch } from "antd";
import type { UnitTypeDTO } from "./unit-types.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateUnitTypeMutation,
  useGetUnitTypeByIdQuery,
  useUpdateUnitTypeMutation,
} from "@/app/store/services/settings.api";

export default function UnitTypeFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<UnitTypeDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const unitTypeId = searchParams.get("editUnitTypeId");

  const [createUnitType, { isLoading: isCreating }] =
    useCreateUnitTypeMutation();
  const [updateUnitType, { isLoading: isUpdating }] =
    useUpdateUnitTypeMutation();
  const { data: unitTypeData, isLoading: isLoadingUnitType } =
    useGetUnitTypeByIdQuery(unitTypeId, {
      skip: !unitTypeId || !isModalOpen,
    });

  const isEditMode = !!unitTypeId;

  useEffect(() => {
    if (unitTypeId) {
      setIsModalOpen(true);
    }
  }, [unitTypeId]);

  useEffect(() => {
    if (unitTypeData && isEditMode) {
      form.setFieldsValue(unitTypeData);
    }
  }, [unitTypeData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (unitTypeId) {
      searchParams.delete("editUnitTypeId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: UnitTypeDTO) => {
    try {
      if (isEditMode && unitTypeId) {
        await updateUnitType({ unitType: values, id: unitTypeId }).unwrap();
      } else {
        // For new unit types, set default values for createdAt and updatedAt
        const now = new Date().toISOString();
        const newUnitType = {
          ...values,
          createdAt: now,
          updatedAt: now,
        };
        await createUnitType(newUnitType).unwrap();
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
          {t("newUnitType")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editUnitType") : t("newUnitType")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingUnitType && isEditMode ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
            initialValues={{ isActive: true }}
          >
            <div className="grid gap-4">
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

              <Form.Item name="description" label={t("description")}>
                <Input.TextArea rows={3} />
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
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}
