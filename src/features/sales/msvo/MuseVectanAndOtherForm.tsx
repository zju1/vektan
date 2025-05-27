import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  message,
  Spin,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import type { MuseVectanAndOtherDTO } from "./muse-vectan-and-other.dto";
import {
  useCreateMuseVectanAndOtherMutation,
  useGetMuseVectanAndOtherByIdQuery,
  useUpdateMuseVectanAndOtherMutation,
} from "@/app/store/services/sales.api";
import { useGetClientsQuery } from "@/app/store/services/clients.api";

export default function MuseVectanAndOtherFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<MuseVectanAndOtherDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const msvoId = searchParams.get("editMuseVectanId");

  const [create, { isLoading: isCreating }] =
    useCreateMuseVectanAndOtherMutation();
  const [update, { isLoading: isUpdating }] =
    useUpdateMuseVectanAndOtherMutation();
  const { data, isLoading } = useGetMuseVectanAndOtherByIdQuery(msvoId!, {
    skip: !msvoId || !isModalOpen,
  });

  const isEditMode = !!msvoId;

  useEffect(() => {
    if (msvoId) setIsModalOpen(true);
  }, [msvoId]);

  useEffect(() => {
    if (data && isEditMode) {
      form.setFieldsValue({
        ...data,
        contractDate: moment(data.contractDate) as any,
        shipmentDate: moment(data.shipmentDate) as any,
        paymentDate: moment(data.paymentDate) as any,
      });
    }
  }, [data, isEditMode, form]);

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (msvoId) {
      searchParams.delete("editMuseVectanId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: MuseVectanAndOtherDTO) => {
    try {
      const payload = {
        ...values,
        contractDate: moment(values.contractDate).toISOString(),
        shipmentDate: moment(values.shipmentDate).toISOString(),
        paymentDate: moment(values.paymentDate).toISOString(),
      };

      if (isEditMode) {
        await update({ id: msvoId!, msvo: payload }).unwrap();
      } else {
        await create(payload).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (err) {
      console.error(err);
      message.error(t("errorOccuredInCRUD"));
    }
  };
  const { data: clients } = useGetClientsQuery();
  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          {t("create")}
        </Button>
      )}
      <Modal
        title={t(isEditMode ? "edit" : "create")}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoading && isEditMode ? (
          <div className="py-12 flex justify-center">
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
                name="buyer"
                label={t("buyer")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={clients?.map((item) => ({
                    value: item._id,
                    label: item.clientName,
                  }))}
                  className="w-full"
                />
              </Form.Item>
              {[
                ["country", "text"],
                ["cotractNumber", "text"],
                ["contractDate", "date"],
                ["contractSumm", "number"],
                ["actualStock", "number"],
                ["invoiceNumber", "text"],
                ["lotNumber", "text"],
                ["shipmentDate", "date"],
                ["quantity", "number"],
                ["invoiceSumm", "number"],
                ["deliveryStatus", "text"],
                ["paymentConditions", "text"],
                ["paymentDate", "date"],
                ["comment", "text"],
              ].map(([name, type]) => (
                <Form.Item
                  key={name}
                  name={name}
                  label={t(name)}
                  rules={[{ required: true, message: t("required") }]}
                >
                  {type === "text" ? (
                    <Input />
                  ) : type === "number" ? (
                    <InputNumber className="w-full" />
                  ) : (
                    <DatePicker className="w-full" format="YYYY-MM-DD" />
                  )}
                </Form.Item>
              ))}
              <div className="flex justify-end mt-4 gap-2">
                <Button onClick={hideModal}>{t("cancel")}</Button>
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
