import {
  Modal,
  Form,
  Input,
  Button,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import type { LogisticsReportDTO } from "./logistics-report.dto";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateLogisticsReportMutation,
  useGetLogisticsReportByIdQuery,
  useUpdateLogisticsReportMutation,
} from "@/app/store/services/sales.api";
import moment from "moment";

export default function LogisticsReportFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<LogisticsReportDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const reportId = searchParams.get("editLogisticsReportId");

  const [create, { isLoading: isCreating }] =
    useCreateLogisticsReportMutation();
  const [update, { isLoading: isUpdating }] =
    useUpdateLogisticsReportMutation();
  const { data } = useGetLogisticsReportByIdQuery(reportId!, {
    skip: !reportId || !isModalOpen,
  });

  const isEdit = !!reportId;

  useEffect(() => {
    if (reportId) setIsModalOpen(true);
  }, [reportId]);

  useEffect(() => {
    if (data && isEdit)
      form.setFieldsValue({
        ...data,
        invoiceDate: moment(data.invoiceDate) as any,
        shippingDate: moment(data.shippingDate) as any,
        updatingDate: moment(data.updatingDate) as any,
        actualDeliveryDate: moment(data.actualDeliveryDate) as any,
      });
  }, [data, form, isEdit]);

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    if (reportId) {
      searchParams.delete("editLogisticsReportId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: LogisticsReportDTO) => {
    try {
      if (isEdit) {
        await update({ id: reportId!, report: values }).unwrap();
      } else {
        await create(values).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (err) {
      message.error(t("errorOccuredInCRUD"));
    }
  };

  return (
    <>
      {!isEdit && (
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          {t("newReport")}
        </Button>
      )}

      <Modal
        title={
          <h2 className="text-xl font-bold font-sans">
            {t(isEdit ? "editReport" : "newReport")}
          </h2>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid gap-4 grid-cols-2">
            {[
              "seller",
              "buyer",
              "consignee",
              "invoiceNumber",
              "mark",
              "bagType",
              "quantity",
              "unitType",
              "status",
              "currentLocation",
              "comment",
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
            <Form.Item name="invoiceDate" label={t("invoiceDate")}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="shippingDate" label={t("shippingDate")}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="updatingDate" label={t("updatingDate")}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="actualDeliveryDate"
              label={t("actualDeliveryDate")}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="numberOfDays" label={t("numberOfDays")}>
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="shippingCost" label={t("shippingCost")}>
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name="shippingCostPerTon"
              label={t("shippingCostPerTon")}
            >
              <InputNumber className="w-full" />
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
      </Modal>
    </>
  );
}
