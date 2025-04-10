import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { ProductDTO } from "./product.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import Search from "antd/es/input/Search";
import ProductFormModal from "./ProductForm";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/app/store/services/warehouse.service";
import type { CategoryDTO } from "../categories/category.dto";
import type { UnitTypeDTO } from "@/features/settings/unit-types/unit-types.dto";
import type { SupplierDTO } from "@/features/suppliers/supplier.dto";

export function ProductPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editProductId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteProduct(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<ProductDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 300,
      sorter: (a: ProductDTO, b: ProductDTO) => a.name.localeCompare(b.name),
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: CategoryDTO) => category.name,
    },
    {
      title: t("unitType"),
      dataIndex: "unitType",
      key: "unitType",
      width: 120,
      render: (unitType: UnitTypeDTO) => unitType.name,
    },
    {
      title: t("supplier"),
      dataIndex: "supplier",
      key: "supplier",
      width: 150,
      render: (supplier: SupplierDTO) => supplier.contactName,
    },
    {
      title: t("stock"),
      dataIndex: "stock",
      key: "stock",
      width: 120,
      align: "right",
    },
    {
      title: t("minimumStock"),
      dataIndex: "minimumStock",
      key: "minimumStock",
      width: 120,
      align: "right",
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "right",
      render: (price: number) => price.toFixed(2),
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? t("active") : t("inactive")}
        </Tag>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 80,
      align: "right",
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
          <p className="text-red-500 mb-4">{t("failedToLoadData")}</p>
          <Button onClick={() => refetch()}>{t("tryAgain")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">{t("products")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <ProductFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={products || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
