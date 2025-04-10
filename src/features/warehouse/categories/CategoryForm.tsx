import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
  Switch,
  TreeSelect,
} from "antd";
import type { CategoryDTO } from "./category.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/app/store/services/warehouse.service";
import { buildCategoryOptionsTree } from "@/lib/utils/build-category-options";

interface CategoryFormModalProps {
  categories?: CategoryDTO[];
}

export default function CategoryFormModal({
  categories = [],
}: CategoryFormModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<CategoryDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get("editCategoryId");

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetCategoryByIdQuery(categoryId, {
      skip: !categoryId || !isModalOpen,
    });

  const isEditMode = !!categoryId;

  useEffect(() => {
    if (categoryId) {
      setIsModalOpen(true);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryData && isEditMode) {
      form.setFieldsValue(categoryData);
    }
  }, [categoryData, form, isEditMode]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    form.resetFields();
    setIsModalOpen(false);

    if (categoryId) {
      searchParams.delete("editCategoryId");
      setSearchParams(searchParams);
    }
  };

  const handleSubmit = async (values: CategoryDTO) => {
    try {
      if (isEditMode && categoryId) {
        await updateCategory({ category: values, id: categoryId }).unwrap();
      } else {
        await createCategory(values).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (error) {
      console.log(error);
      message.error(t("errorOccuredInCRUD"));
    }
  };

  // Filter out the current category from parent options to prevent circular references
  const parentOptions = buildCategoryOptionsTree(
    categories.filter((cat) => !isEditMode || cat._id !== categoryId)
  );

  return (
    <>
      {!isEditMode && (
        <Button type="primary" onClick={showModal}>
          {t("newCategory")}
        </Button>
      )}

      <Modal
        title={
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-sans">
              {isEditMode ? t("editCategory") : t("newCategory")}
            </h2>
          </div>
        }
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        maskClosable={false}
      >
        {isLoadingCategory && isEditMode ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
            initialValues={{ isActive: true, parentId: null }}
          >
            <div className="grid gap-4">
              <Form.Item
                name="name"
                label={t("name")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="description" label={t("description")}>
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item name="parentId" label={t("parentCategory")}>
                <TreeSelect allowClear treeData={parentOptions} />
              </Form.Item>

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
