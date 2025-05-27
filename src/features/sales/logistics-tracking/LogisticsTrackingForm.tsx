import {
  Modal,
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Spin,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import type { LogisticsTrackingDTO } from "./logisticsTracking.dto";
import {
  useCreateLogisticsTrackingMutation,
  useGetLogisticsTrackingByIdQuery,
  useUpdateLogisticsTrackingMutation,
} from "@/app/store/services/sales.api";
import { useGetUnitTypesQuery } from "@/app/store/services/settings.api";
import { useGetClientsQuery } from "@/app/store/services/clients.api";

export default function LogisticsTrackingFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<LogisticsTrackingDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const trackingId = searchParams.get("editLogisticsTrackingId");

  const [createTracking, { isLoading: isCreating }] =
    useCreateLogisticsTrackingMutation();
  const [updateTracking, { isLoading: isUpdating }] =
    useUpdateLogisticsTrackingMutation();
  const { data, isLoading } = useGetLogisticsTrackingByIdQuery(trackingId!, {
    skip: !trackingId || !isModalOpen,
  });
  const { data: unitTypes } = useGetUnitTypesQuery();
  const { data: clients } = useGetClientsQuery();

  const isEditMode = !!trackingId;

  useEffect(() => {
    if (trackingId) setIsModalOpen(true);
  }, [trackingId]);

  useEffect(() => {
    if (data && isEditMode) {
      form.setFieldsValue({
        ...data,
        invoiceDate: moment(data.invoiceDate) as any,
        shippingDate: moment(data.shippingDate) as any,
        updatingDate: moment(data.updatingDate) as any,
        expectedDeliveryDate: moment(data.expectedDeliveryDate) as any,
      });
    }
  }, [data, form, isEditMode]);

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (trackingId) {
      searchParams.delete("editLogisticsTrackingId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      invoiceDate: values.invoiceDate?.toISOString(),
      shippingDate: values.shippingDate?.toISOString(),
      updatingDate: values.updatingDate?.toISOString(),
      expectedDeliveryDate: values.expectedDeliveryDate?.toISOString(),
    };

    try {
      if (isEditMode && trackingId) {
        await updateTracking({ id: trackingId, tracking: payload }).unwrap();
      } else {
        await createTracking(payload).unwrap();
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
          {t("newLogisticsTracking")}
        </Button>
      )}
      <Modal
        title={
          <h2 className="text-xl font-bold font-sans">
            {isEditMode
              ? t("editLogisticsTracking")
              : t("newLogisticsTracking")}
          </h2>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoading && isEditMode ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <div className="grid gap-4 max-h-[65dvh] overflow-auto pr-2">
              {[
                "invoiceNumber",
                "country",
                "city",
                "mark",
                "lotNumber",
                "carrier",
                "govNumber",
                "driver",
                "deliveryStatus",
                "location",
              ].map((field) => (
                <Form.Item
                  key={field}
                  name={field}
                  label={t(field)}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Input />
                </Form.Item>
              ))}
              <Form.Item
                name="client"
                label={t("client")}
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
              <Form.Item
                name="unitType"
                label={t("unitType")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  options={unitTypes?.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                name="bagType"
                label="Тип мешка"
                rules={[{ required: true, message: t("required") }]}
              >
                <Select>
                  <Select.Option value="Большой (1000 кг)">
                    Большой (1000 кг)
                  </Select.Option>
                  <Select.Option value="Большой (500 кг)">
                    Большой (500 кг)
                  </Select.Option>
                  <Select.Option value="Маленький (25 кг)">
                    Маленький (25 кг)
                  </Select.Option>
                  <Select.Option value="Маленький (20 кг)">
                    Маленький (20 кг)
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="quantity"
                label={t("quantity")}
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>

              {[
                { name: "invoiceDate", label: t("invoiceDate") },
                { name: "shippingDate", label: t("shippingDate") },
                { name: "updatingDate", label: t("updatingDate") },
                {
                  name: "expectedDeliveryDate",
                  label: t("expectedDeliveryDate"),
                },
              ].map(({ name, label }) => (
                <Form.Item key={name} name={name} label={label}>
                  <DatePicker className="w-full" />
                </Form.Item>
              ))}

              <div className="flex justify-end mt-2">
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
