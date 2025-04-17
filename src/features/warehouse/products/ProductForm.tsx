"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  Switch,
  InputNumber,
  TreeSelect,
} from "antd";
import type { ProductDTO } from "./product.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/app/store/services/warehouse.service";
import { useGetCategoriesQuery } from "@/app/store/services/warehouse.service";
import { useGetUnitTypesQuery } from "@/app/store/services/settings.api";
import { useGetSuppliersQuery } from "@/app/store/services/suppliers.api";
import { buildCategoryOptionsTree } from "@/lib/utils/build-category-options";

export default function ProductFormModal() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ProductDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const productId = searchParams.get("editProductId");

  // API queries
  const { data: categories } = useGetCategoriesQuery();
  const { data: unitTypes } = useGetUnitTypesQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductByIdQuery(productId, {
      skip: !productId || !isModalOpen,
      refetchOnMountOrArgChange: true,
    });

  const isEditMode = !!productId;

  useEffect(() => {
    if (productId) {
      setIsModalOpen(true);
    }
  }, [productId]);

  useEffect(() => {
    if (productData && isEditMode) {
      form.setFieldsValue(productData);
    }
  }, [productData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (productId) {
      searchParams.delete("editProductId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: ProductDTO) => {
    try {
      if (isEditMode && productId) {
        await updateProduct({ product: values, id: productId }).unwrap();
      } else {
        await createProduct(values).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (error) {
      console.log(error);
      message.error(t("errorOccuredInCRUD"));
    }
  };

  // Prepare options for select fields
  const categoryOptions = buildCategoryOptionsTree(categories || []);

  const unitTypeOptions =
    unitTypes?.map((unitType) => ({
      value: unitType._id,
      label: unitType.name,
    })) || [];

  const supplierOptions =
    suppliers?.map((supplier) => ({
      value: supplier._id,
      label: supplier.contactName,
    })) || [];

  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={showModal}>
          {t("newProduct")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editProduct") : t("newProduct")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
        width={700}
      >
        {isLoadingProduct && isEditMode ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
            initialValues={{
              isActive: true,
              stock: 0,
              minimumStock: 0,
              price: 0,
            }}
          >
            <div className="grid gap-4">
              <Form.Item
                name="name"
                label={t("name")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="categoryId"
                  label={t("category")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <TreeSelect allowClear treeData={categoryOptions} />
                </Form.Item>
                <Form.Item
                  name="type"
                  label={t("type")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Select
                    options={[
                      {
                        label: t("mainRawMaterial"),
                        value: "mainRawMaterial",
                      },
                      {
                        label: t("helpingRawMaterial"),
                        value: "helpingRawMaterial",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name="unitTypeId"
                  label={t("unitType")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <Select options={unitTypeOptions} />
                </Form.Item>
              </div>

              <Form.Item
                name="supplierId"
                label={t("supplier")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select options={supplierOptions} />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="stock"
                  label={t("stock")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>

                <Form.Item
                  name="minimumStock"
                  label={t("minimumStock")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>

                <Form.Item
                  name="price"
                  label={t("price")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    className="w-full"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="isActive"
                label={t("status")}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t("active")}
                  unCheckedChildren={t("inactive")}
                />
              </Form.Item>
            </div>

            <div className="flex items-center justify-end mt-6">
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
        )}
      </Modal>
    </>
  );
}
