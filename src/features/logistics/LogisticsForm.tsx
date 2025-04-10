import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  message,
  Spin,
  Divider,
} from "antd";
import { type LogisticsDTO } from "./logistics.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateLogisticsCompanyMutation,
  useGetLogisticsCompanyByIdQuery,
  useUpdateLogisticsCompanyMutation,
} from "@/app/store/services/settings.api";

export default function LogisticsCompanyFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<LogisticsDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const companyId = searchParams.get("editLogisticsCompanyId");

  const [createCompany, { isLoading: isCreating }] =
    useCreateLogisticsCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] =
    useUpdateLogisticsCompanyMutation();
  const { data: companyData, isLoading: isLoadingCompany } =
    useGetLogisticsCompanyByIdQuery(companyId, {
      skip: !companyId || !isModalOpen,
    });

  const isEditMode = !!companyId;

  useEffect(() => {
    if (companyId) {
      setIsModalOpen(true);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyData && isEditMode) {
      form.setFieldsValue(companyData);
    }
  }, [companyData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (companyId) {
      searchParams.delete("editLogisticsCompanyId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: LogisticsDTO) => {
    try {
      if (isEditMode && companyId) {
        await updateCompany({ company: values, id: companyId }).unwrap();
      } else {
        await createCompany(values).unwrap();
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
          {t("newService")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editService") : t("newService")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
        width={700}
      >
        {isLoadingCompany && isEditMode ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
            initialValues={{ active: true }}
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label={t("name")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="legalName" label={t("legalName")}>
                  <Input />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="contactEmail"
                  label={t("contactEmail")}
                  rules={[
                    { required: true, message: t("required") },
                    { type: "email", message: t("incorrectFormat") },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="contactPhone"
                  label={t("contactPhone")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="taxId" label={t("taxId")}>
                  <Input />
                </Form.Item>

                <Form.Item name="website" label={t("website")}>
                  <Input />
                </Form.Item>
              </div>

              <Divider>{t("headquartersAddress")}</Divider>

              <Form.Item
                name={["headquartersAddress", "street"]}
                label={t("street")}
              >
                <Input />
              </Form.Item>

              <div className="grid grid-cols-3 gap-4">
                <Form.Item
                  name={["headquartersAddress", "city"]}
                  label={t("city")}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={["headquartersAddress", "region"]}
                  label={t("region")}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={["headquartersAddress", "postalCode"]}
                  label={t("postalCode")}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                name={["headquartersAddress", "country"]}
                label={t("country")}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="active"
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
