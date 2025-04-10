import SupplierFormModal from "./SupplierForm";
import Search from "antd/es/input/Search";
import { useTranslation } from "react-i18next";
import { Button, Table, Spin, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { SupplierDTO } from "./supplier.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from "@/app/store/services/suppliers.api";

export function SuppliersPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const {
    data: suppliers,
    isLoading,
    isError,
    refetch,
  } = useGetSuppliersQuery();
  const [deleteSupplier, { isLoading: isDeleting }] =
    useDeleteSupplierMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editSupplierId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    // Use native confirm dialog
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteSupplier(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<SupplierDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("companyName"),
      dataIndex: "companyName",
      key: "companyName",
      minWidth: 200,
      sorter: (a: SupplierDTO, b: SupplierDTO) =>
        a.companyName.localeCompare(b.companyName),
    },
    {
      title: t("contactTitle"),
      dataIndex: "contactTitle",
      key: "contactTitle",
      width: 100,
      align: "right",
    },
    {
      title: t("contactPerson"),
      dataIndex: "contactName",
      key: "contactName",
      width: 150,
      align: "right",
      sorter: (a: SupplierDTO, b: SupplierDTO) =>
        a.contactName.localeCompare(b.contactName),
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "right",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 150,
      align: "right",
    },
    {
      title: t("region"),
      dataIndex: "region",
      key: "region",
      width: 150,
      align: "right",
    },
    {
      title: t("country"),
      dataIndex: "country",
      key: "country",
      width: 150,
      align: "right",
    },
    {
      title: t("city"),
      dataIndex: "city",
      key: "city",
      width: 150,
      align: "right",
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
      width: 200,
      align: "right",
    },
    {
      title: t("actions"),
      key: "actions",
      width: 80,
      align: "right",
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id!)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
            loading={isDeleting}
          />
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t("failedToLoadSuppliers")}</p>
          <Button onClick={() => refetch()}>{t("tryAgain")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">{t("suppliers")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <SupplierFormModal />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={suppliers || []}
          rowKey={(row) => row._id!}
          pagination={false}
          scroll={{ x: "max-content", y: "70dvh" }}
        />
      )}
    </div>
  );
}
