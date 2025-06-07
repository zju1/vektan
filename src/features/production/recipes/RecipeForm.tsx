import { Form, Input, InputNumber, Modal, Button, message, Spin } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import type { RecipeModelDTO } from "./recipe.dto";
import {
  useCreateRecipeModelMutation,
  useGetProductionrderByIdQuery,
  useGetRecipeModelByIdQuery,
  useUpdateRecipeModelMutation,
} from "@/app/store/services/sales.api";
import { useRules } from "@/hooks/useRules";

export default function RecipeForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm<RecipeModelDTO>();
  const [searchParams, setSearchParams] = useSearchParams();
  const poId = searchParams.get("poId");
  const recipeId = searchParams.get("recipeId");
  const isModalOpen = Boolean(poId || recipeId);
  const isEditMode = !!recipeId;

  const { data: proOrder } = useGetProductionrderByIdQuery(poId!, {
    skip: !poId,
    refetchOnMountOrArgChange: true,
  });

  const [createRecipe, { isLoading: isCreating }] =
    useCreateRecipeModelMutation();

  const [updateRecipe, { isLoading: isUpdating }] =
    useUpdateRecipeModelMutation();

  const { data: recipeData, isLoading: isLoadingMark } =
    useGetRecipeModelByIdQuery(
      { id: recipeId! },
      {
        skip: !recipeId || !isModalOpen,
      }
    );

  const { required } = useRules();

  useEffect(() => {
    if (recipeData && isEditMode) {
      form.setFieldsValue(recipeData);
    }
  }, [form, isEditMode, recipeData]);

  const hideModal = () => {
    form.resetFields();
    searchParams.delete("poId");
    searchParams.delete("recipeId");
    setSearchParams(searchParams);
  };

  const handleSubmit = async (values: RecipeModelDTO) => {
    try {
      if (isEditMode && recipeId) {
        await updateRecipe({ id: recipeId, recipe: values }).unwrap();
      } else {
        await createRecipe({ ...values, purchaseOrder: poId! }).unwrap();
      }
      message.success(t("saved"));
      hideModal();
    } catch (error) {
      message.error(t("errorOccuredInCRUD"));
    }
  };

  return (
    <Modal
      title={
        isEditMode
          ? t("editRecipe", { poId: proOrder?.id })
          : t("newRecipe", { poId: proOrder?.id })
      }
      open={isModalOpen}
      onCancel={hideModal}
      footer={null}
      maskClosable={false}
    >
      {isLoadingMark && isEditMode ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid gap-2">
            <div className="grid gap-2 grid-cols-[1fr_0.5fr]">
              <Form.Item
                name="mainRaw1"
                label={t("mainRaw", { name: 1 })}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="mainRawVolume1"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="mainRaw2"
                label={t("mainRaw", { name: 2 })}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="mainRawVolume2"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="mainRaw3"
                label={t("mainRaw", { name: 3 })}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="mainRawVolume3"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="mainRaw4"
                label={t("mainRaw", { name: 4 })}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="mainRawVolume4"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="byProduct"
                label={t("byProduct")}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="byProductVolume"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="chemicals"
                label={t("chemicals")}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="chemicalsVolume"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="additive"
                label={t("additive")}
                rules={[required]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="additiveVolume"
                label={t("volume")}
                rules={[required]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <Form.Item name="device" label={t("devices")} rules={[required]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="lotNumber"
              label={t("lotNumber")}
              rules={[required]}
            >
              <Input />
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
      )}
    </Modal>
  );
}
