import {
  useGetLaboratoryJournalQuery,
  useUpdateLaboratoryJournalMutation,
} from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { useForm } from "@/hooks/useForm";
import { useRules } from "@/hooks/useRules";
import { CloseOutlined } from "@ant-design/icons";
import { Button, InputNumber, message, Modal } from "antd";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IProductionQA } from "./production-lab.dto";

export function ProductionLaboratoryPage() {
  const { t } = useTranslation();
  const { data } = useGetLaboratoryJournalQuery();
  const [update] = useUpdateLaboratoryJournalMutation();
  const [currentChange, setCurrentChange] = useState<
    keyof IProductionQA | null
  >(null);
  const { Form, form } = useForm();
  const { required } = useRules();
  const [currentId, setCurrentId] = useState<string | null>(null);

  const onFinish = useCallback(
    async (values: IProductionQA) => {
      const item = values[currentChange!] as number[];
      const key: keyof IProductionQA =
        currentChange === "viscosities"
          ? "averageViscosity"
          : currentChange === "droppingPoints"
          ? "averageDroppingPoint"
          : currentChange === "softeningTemps"
          ? "aveareageSofteningTemp"
          : "averageMeltingPoint";
      const body = {
        ...values,
        _id: currentId!,
        [key]: item.reduce((prev, curr) => (prev += curr), 0) / item.length,
      };
      await update(body).unwrap();
      message.success({
        content: t("laboratoryChecksUpdatedSuccessfully"),
      });
      setCurrentChange(null);
      setCurrentId(null);
    },
    [currentChange, currentId, t, update]
  );

  return (
    <div>
      <TablePage
        table={{
          dataSource: data,
          scroll: { x: 1200 },
          columns: [
            {
              title: "№",
              dataIndex: "index",
              key: "index",
              render: (_value, _record, index) => index + 1,
              width: 50,
              align: "center",
            },
            {
              title: t("id"),
              dataIndex: ["prodOrder", "id"],
              key: "id",
            },
            {
              title: t("lotNumber"),
              dataIndex: ["recipe", "lotNumber"],
              key: "lotNumber",
              width: 100,
              align: "center",
            },
            {
              title: t("mark"),
              dataIndex: ["prodOrder", "mark", "name"],
              key: "mark",
              width: 100,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: ["prodOrder", "quantity"],
              key: "quantity",
              width: 100,
              align: "center",
            },
            {
              title: t("bagType"),
              dataIndex: ["prodOrder", "bagType", "name"],
              key: "bagType",
              width: 100,
              align: "center",
            },
            {
              title: t("viscosity"),
              dataIndex: "averageViscosity",
              key: "averageViscosity",
              width: 100,
              align: "center",
              onCell: (record) => ({
                onClick: () => {
                  form.setFieldValue(
                    "viscosities",
                    record.viscosities.length > 0
                      ? record.viscosities
                      : new Array(10).fill(undefined)
                  );
                  setCurrentId(record._id);
                  setCurrentChange("viscosities");
                },
                className: "cursor-pointer",
              }),
            },
            {
              title: t("softeningTemp"),
              dataIndex: "aveareageSofteningTemp",
              key: "aveareageSofteningTemp",
              width: 100,
              align: "center",
              onCell: (record) => ({
                onClick: () => {
                  form.setFieldValue(
                    "softeningTemps",
                    record.softeningTemps.length > 0
                      ? record.softeningTemps
                      : new Array(10).fill(undefined)
                  );
                  setCurrentId(record._id);
                  setCurrentChange("softeningTemps");
                },
                className: "cursor-pointer",
              }),
            },
            {
              title: t("droppingPoint"),
              dataIndex: "averageDroppingPoint",
              key: "averageDroppingPoint",
              width: 100,
              align: "center",
              onCell: (record) => ({
                onClick: () => {
                  form.setFieldValue(
                    "droppingPoints",
                    record.droppingPoints.length > 0
                      ? record.droppingPoints
                      : new Array(10).fill(undefined)
                  );
                  setCurrentId(record._id);
                  setCurrentChange("droppingPoints");
                },
                className: "cursor-pointer",
              }),
            },
            {
              title: t("meltingPoint"),
              dataIndex: "averageMeltingPoint",
              key: "averageMeltingPoint",
              width: 100,
              align: "center",
              onCell: (record) => ({
                onClick: () => {
                  form.setFieldValue(
                    "meltingPoints",
                    record.meltingPoints.length > 0
                      ? record.meltingPoints
                      : new Array(10).fill(undefined)
                  );
                  setCurrentId(record._id);
                  setCurrentChange("meltingPoints");
                },
                className: "cursor-pointer",
              }),
            },
            {
              title: t("certificateOfAnalyzys"),
              dataIndex: "certificateOfAnalyzys",
              key: "certificateOfAnalyzys",
              width: 100,
              align: "center",
              render: (_value) => <Button> {t("download")} </Button>,
            },
          ],
        }}
        title={t("productionLaboratory")}
      />
      <Modal
        title={t(currentChange!, { name: "" })}
        open={!!currentChange}
        onCancel={() => {
          setCurrentChange(null);
          setCurrentId(null);
        }}
        okText={t("save")}
        cancelText={t("cancel")}
        onOk={() => form.submit()}
        destroyOnClose
      >
        {currentChange && (
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.List name={currentChange}>
              {(fields, { add, remove }) => (
                <div className="grid gap-6">
                  <div className="grid gap-2 grid-cols-2 gap-x-4">
                    {fields.map(({ name, key }, index) => (
                      <Form.Item
                        label={t(currentChange, { name: name + 1 })}
                        key={key}
                        name={name}
                        rules={[required]}
                      >
                        <InputNumber
                          className="w-full"
                          addonAfter={
                            <Button type="text" onClick={() => remove(index)}>
                              <CloseOutlined />
                            </Button>
                          }
                        />
                      </Form.Item>
                    ))}
                  </div>
                  <Button type="dashed" onClick={() => add(0)}>
                    {t("add")}
                  </Button>
                </div>
              )}
            </Form.List>
          </Form>
        )}
      </Modal>
    </div>
  );
}
