import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  InputNumber,
} from "antd";
import {
  employeetJobTypeOptions,
  employeetStatusOptions,
  type EmployeeDTO,
} from "./employee.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateEmployeeMutation,
  useGetDepartmentsQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "@/app/store/services/admin";
import { CircleMinus, CirclePlus } from "lucide-react";

export default function DepartmentFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<EmployeeDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: departments } = useGetDepartmentsQuery();
  const id = searchParams.get("currentItemId");

  const [create, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [update, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const { data: singleData, isLoading } = useGetEmployeeByIdQuery(id, {
    skip: !id || !isModalOpen,
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      setIsModalOpen(true);
    }
  }, [id]);

  useEffect(() => {
    if (singleData && isEditMode) {
      form.setFieldsValue(singleData);
    }
  }, [singleData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (id) {
      searchParams.delete("currentItemId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: EmployeeDTO) => {
    try {
      if (isEditMode && id) {
        await update({
          item: values,
          id: id,
        }).unwrap();
      } else {
        await create(values).unwrap();
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
              {isEditMode ? t("editEmployee") : t("newEmployee")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoading && isEditMode ? (
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
                name="fullName"
                label={t("fullName")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="position"
                label={t("position")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="departmentId"
                label={t("department")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={departments?.map((item) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="subDivision"
                label={t("subDivision")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="subOrdination"
                label={t("subOrdination")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.List name="phoneNumbers" initialValue={[""]}>
                {(fields, { add, remove }) => (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Form.Item
                            className="flex-1"
                            {...restField}
                            name={name}
                            rules={[
                              {
                                required: true,
                                message: t("required"),
                              },
                            ]}
                          >
                            <Input placeholder={t("phoneNumber")} />
                          </Form.Item>
                          <CircleMinus
                            className="size-4 cursor-pointer"
                            onClick={() => remove(name)}
                          />
                        </div>
                      ))}
                    </div>

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<CirclePlus className="size-4" />}
                      >
                        {t("add")}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item
                name="email"
                label={t("email")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="jobType"
                label={t("jobType")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={employeetJobTypeOptions.map((item) => ({
                    ...item,
                    label: t(item.label),
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="brigadeNumber"
                label={t("brigadeNumber")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item
                name="status"
                label={t("status")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select>
                  {employeetStatusOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {t(option.label)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="comment" label={t("comment")}>
                <Input.TextArea rows={3} />
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
