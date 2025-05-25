import { Table, Button, Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "@/lib/utils/date-utils";
import type { MutualSettlementVectanIlcaDTO } from "./msvil.dto";
import {
  useDeleteMutualSettlementVectanIlcaMutation,
  useGetMutualSettlementVectanIlcasQuery,
} from "@/app/store/services/sales.api";
import MutualSettlementVectanIlcaFormModal from "./MutualSettlementVectanIlcaForm";

export default function MutualSettlementVectanIlcaPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isFetching } = useGetMutualSettlementVectanIlcasQuery();
  const [remove, { isLoading: isDeleting }] =
    useDeleteMutualSettlementVectanIlcaMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editMutualSettlementVectanIlcaId", id);
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

  const columns: ColumnsType<MutualSettlementVectanIlcaDTO> = [
    {
      title: "№",
      key: "index",
      render: (_v, _r, i) => i + 1,
      width: 50,
    },
    ...[
      "contractNumber",
      "buyer",
      "country",
      "contractDate",
      "contractSumm",
      "actualStock",
      "invoiceNumber",
      "shipmentDate",
      "quantity",
      "invoiceSumm",
      "payment",
      "paymentDate",
      "name",
      "consignee",
      "comment",
    ].map((field) => ({
      title: t(field),
      dataIndex: field,
      key: field,
      render: (value: any) =>
        ["contractDate", "shipmentDate", "paymentDate"].includes(field)
          ? formatDate(value)
          : value,
    })),
    {
      title: t("actions"),
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_v, record) => (
        <div className="flex gap-2 justify-end">
          <Button size="small" type="text" icon={<EyeOutlined />} />
          <Button
            size="small"
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id!)}
          />
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
            loading={isDeleting}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-sans">
          {t("mutualSettlementVectanIlca")}
        </h1>
        <MutualSettlementVectanIlcaFormModal />
      </div>
      <Table
        bordered
        size="small"
        loading={isFetching}
        dataSource={data || []}
        rowKey={(r) => r._id!}
        columns={columns}
        scroll={{ x: 2000 }}
        pagination={false}
      />
    </div>
  );
}
