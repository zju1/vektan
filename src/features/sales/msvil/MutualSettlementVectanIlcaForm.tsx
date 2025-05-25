import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import type { MutualSettlementVectanIlcaDTO } from "./msvil.dto";
import {
  useCreateMutualSettlementVectanIlcaMutation,
  useUpdateMutualSettlementVectanIlcaMutation,
  useGetMutualSettlementVectanIlcaByIdQuery,
} from "@/app/store/services/sales.api";

export default function MutualSettlementVectanIlcaFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<MutualSettlementVectanIlcaDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("editMutualSettlementVectanIlcaId");

  const [create, { isLoading: isCreating }] =
    useCreateMutualSettlementVectanIlcaMutation();
  const [update, { isLoading: isUpdating }] =
    useUpdateMutualSettlementVectanIlcaMutation();
  const { data } = useGetMutualSettlementVectanIlcaByIdQuery(id!, {
    skip: !id || !isModalOpen,
  });

  useEffect(() => {
    if (id) setIsModalOpen(true);
  }, [id]);

  useEffect(() => {
    if (data && id) {
      form.setFieldsValue({
        ...data,
        contractDate: moment(data.contractDate) as any,
        shipmentDate: moment(data.shipmentDate) as any,
        paymentDate: moment(data.paymentDate) as any,
      });
    }
  }, [data, form, id]);

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    searchParams.delete("editMutualSettlementVectanIlcaId");
    setSearchParams(searchParams);
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      contractDate: moment(values.contractDate).toISOString(),
      shipmentDate: moment(values.shipmentDate).toISOString(),
      paymentDate: moment(values.paymentDate).toISOString(),
    };

    try {
      if (id) await update({ id, data: payload }).unwrap();
      else await create(payload).unwrap();
      message.success(t("saved"));
      hideModal();
    } catch {
      message.error(t("errorOccuredInCRUD"));
    }
  };

  const numberFields = [
    "contractSumm",
    "actualStock",
    "quantity",
    "invoiceSumm",
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        {t("create")}
      </Button>
      <Modal
        title={t(
          id
            ? "editMutualSettlementVectanIlca"
            : "newMutualSettlementVectanIlca"
        )}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="pt-4"
        >
          <div className="grid gap-4">
            {[
              "contractNumber",
              "buyer",
              "country",
              "contractSumm",
              "actualStock",
              "invoiceNumber",
              "quantity",
              "invoiceSumm",
              "payment",
              "name",
              "consignee",
              "comment",
            ].map((field) => (
              <Form.Item
                key={field}
                name={field}
                label={t(field)}
                rules={[{ required: true, message: t("required") }]}
              >
                {numberFields.includes(field) ? (
                  <InputNumber className="w-full" />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}

            <Form.Item name="contractDate" label={t("contractDate")}>
              {" "}
              <DatePicker className="w-full" />{" "}
            </Form.Item>
            <Form.Item name="shipmentDate" label={t("shipmentDate")}>
              {" "}
              <DatePicker className="w-full" />{" "}
            </Form.Item>
            <Form.Item name="paymentDate" label={t("paymentDate")}>
              {" "}
              <DatePicker className="w-full" />{" "}
            </Form.Item>

            <div className="flex justify-end gap-2">
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
      </Modal>
    </>
  );
}
