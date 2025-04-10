import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { departmentStatusOptions, type DepartmentDTO } from "./department.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateDepartmentMutation,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
} from "@/app/store/services/admin";

export default function DepartmentFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<DepartmentDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const departmentId = searchParams.get("editDepartmentId");

  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const { data: departmentData, isLoading: isLoadingDepartment } =
    useGetDepartmentByIdQuery(departmentId, {
      skip: !departmentId || !isModalOpen,
    });

  const isEditMode = !!departmentId;

  useEffect(() => {
    if (departmentId) {
      setIsModalOpen(true);
    }
  }, [departmentId]);

  useEffect(() => {
    if (departmentData && isEditMode) {
      form.setFieldsValue(departmentData);
    }
  }, [departmentData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (departmentId) {
      searchParams.delete("editDepartmentId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: DepartmentDTO) => {
    try {
      if (isEditMode && departmentId) {
        await updateDepartment({
          department: values,
          id: departmentId,
        }).unwrap();
      } else {
        await createDepartment(values).unwrap();
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
          {t("newDepartment")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editDepartment") : t("newDepartment")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingDepartment && isEditMode ? (
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

              <Form.Item name="description" label={t("description")}>
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name="status"
                label={t("status")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select>
                  {departmentStatusOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {t(option.label)}
                    </Select.Option>
                  ))}
                </Select>
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
