import {
  Form,
  Input,
  InputNumber,
  Modal,
  Button,
  message,
  Spin,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type { MarkDTO } from "./mark.dto";
import {
  useCreateMarkMutation,
  useUpdateMarkMutation,
  useGetMarkByIdQuery,
} from "@/app/store/services/settings.api";
import { useGetUnitTypesQuery } from "@/app/store/services/settings.api";

export default function MarkFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<MarkDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const markId = searchParams.get("editMarkId");
  const isEditMode = !!markId;

  const [createMark, { isLoading: isCreating }] = useCreateMarkMutation();
  const [updateMark, { isLoading: isUpdating }] = useUpdateMarkMutation();
  const { data: markData, isLoading: isLoadingMark } = useGetMarkByIdQuery(
    markId!,
    {
      skip: !markId || !isModalOpen,
    }
  );
  const { data: unitTypes } = useGetUnitTypesQuery();

  useEffect(() => {
    if (markId) setIsModalOpen(true);
  }, [markId]);

  useEffect(() => {
    if (markData && isEditMode) {
      form.setFieldsValue(markData);
    }
  }, [form, isEditMode, markData]);

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (markId) {
      searchParams.delete("editMarkId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: MarkDTO) => {
    try {
      if (isEditMode && markId) {
        await updateMark({ id: markId, mark: values }).unwrap();
      } else {
        await createMark(values).unwrap();
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
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          {t("newMark")}
        </Button>
      )}
      <Modal
        title={isEditMode ? t("editMark") : t("newMark")}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingMark && isEditMode ? (
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
                name="unitType"
                label={t("unitType")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={unitTypes?.map((u) => ({
                    value: u._id,
                    label: u.name,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="stock"
                label={t("stock")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="minStock"
                label={t("minimumStock")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber min={0} className="w-full" />
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
