import { Table, Button, Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useDeleteMuseVectanAndOtherMutation,
  useGetMuseVectanAndOthersQuery,
} from "@/app/store/services/sales.api";
import MuseVectanAndOtherFormModal from "./MuseVectanAndOtherForm";

export default function MuseVectanAndOtherPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isFetching } = useGetMuseVectanAndOthersQuery();
  const [remove, { isLoading: isDeleting }] =
    useDeleteMuseVectanAndOtherMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editMuseVectanId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await remove(id).unwrap();
          message.success(t("deleted"));
        } catch {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-sans">
          {t("museVectanAndOther")}
        </h1>
        <MuseVectanAndOtherFormModal />
      </div>

      <Table
        bordered
        loading={isFetching}
        rowKey="_id"
        dataSource={data || []}
        scroll={{ x: 1600 }}
        pagination={false}
        columns={[
          {
            title: "№",
            render: (_val, _row, index) => index + 1,
            width: 50,
          },
          ...[
            "buyer",
            "country",
            "cotractNumber",
            "contractDate",
            "contractSumm",
            "actualStock",
            "invoiceNumber",
            "lotNumber",
            "shipmentDate",
            "quantity",
            "invoiceSumm",
            "deliveryStatus",
            "paymentConditions",
            "paymentDate",
            "comment",
          ].map((key) => ({
            title: t(key),
            dataIndex: key,
            key,
            width: 150,
          })),
          {
            title: t("actions"),
            key: "actions",
            width: 100,
            fixed: "right",
            render: (_value, record) => (
              <div className="flex gap-2 justify-end">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record._id!)}
                />
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record._id!)}
                  loading={isDeleting}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
