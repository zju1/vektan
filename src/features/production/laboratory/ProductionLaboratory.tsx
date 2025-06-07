import { useGetLaboratoryJournalQuery } from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { useForm } from "@/hooks/useForm";
import { useRules } from "@/hooks/useRules";
import { CloseOutlined } from "@ant-design/icons";
import { Button, InputNumber, Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ProductionLaboratoryPage() {
  const { t } = useTranslation();
  const { data } = useGetLaboratoryJournalQuery();
  const [currentChange, setCurrentChange] = useState<string | null>(null);
  const { Form, form } = useForm();
  const { required } = useRules();
  return (
    <div>
      <TablePage
        table={{
          dataSource: data,
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
                      : new Array(10).fill(0)
                  );
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
                      : new Array(10).fill(0)
                  );
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
                      : new Array(10).fill(0)
                  );
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
                      : new Array(10).fill(0)
                  );
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
              render: (_value, record) =>
                record.certificateOfAnalyzys.length === 0 ? (
                  <Button> {t("upload")} </Button>
                ) : (
                  <Button> {t("view")} </Button>
                ),
            },
          ],
        }}
        title={t("productionLaboratory")}
      />
      <Modal
        title={t(currentChange!, { name: "" })}
        open={!!currentChange}
        onCancel={() => setCurrentChange(null)}
        okText={t("save")}
        cancelText={t("cancel")}
        onOk={() => form.submit()}
      >
        {currentChange && (
          <Form layout="vertical" form={form}>
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
