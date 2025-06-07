import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  message,
  Select,
  Spin,
} from "antd";
import type { BagTypeDTO } from "./bagType.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateBagTypeMutation,
  useGetBagTypeByIdQuery,
  useUpdateBagTypeMutation,
} from "@/app/store/services/settings.api";
import { useGetUnitTypesQuery } from "@/app/store/services/settings.api";

export default function BagTypeFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<BagTypeDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const bagTypeId = searchParams.get("editBagTypeId");

  const [createBagType, { isLoading: isCreating }] = useCreateBagTypeMutation();
  const [updateBagType, { isLoading: isUpdating }] = useUpdateBagTypeMutation();
  const { data: bagTypeData, isLoading: isLoadingBagType } =
    useGetBagTypeByIdQuery(bagTypeId!, {
      skip: !bagTypeId || !isModalOpen,
    });

  const { data: unitTypes = [] } = useGetUnitTypesQuery();

  const isEditMode = !!bagTypeId;

  useEffect(() => {
    if (bagTypeId) {
      setIsModalOpen(true);
    }
  }, [bagTypeId]);

  useEffect(() => {
    if (bagTypeData && isEditMode) {
      form.setFieldsValue(bagTypeData);
    }
  }, [bagTypeData, form, isEditMode]);

  const showModal = () => setIsModalOpen(true);

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (bagTypeId) {
      searchParams.delete("editBagTypeId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: BagTypeDTO) => {
    try {
      if (isEditMode && bagTypeId) {
        await updateBagType({ id: bagTypeId, bagType: values }).unwrap();
      } else {
        await createBagType(values).unwrap();
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
          {t("newBagType")}
        </Button>
      )}
      <Modal
        title={
          <h2 className="text-xl font-bold font-sans">
            {isEditMode ? t("editBagType") : t("newBagType")}
          </h2>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingBagType && isEditMode ? (
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
                name="name"
                label={t("name")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="capacity"
                label={t("capacity")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item
                name="unitType"
                label={t("unitType")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={unitTypes.map((ut) => ({
                    value: ut._id,
                    label: ut.name,
                  }))}
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
