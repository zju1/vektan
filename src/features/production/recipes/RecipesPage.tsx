import { TablePage } from "@/components/table-page";
import { useTranslation } from "react-i18next";
import RecipeForm from "./RecipeForm";
import {
  useDeleteRecipeModelMutation,
  useGetRecipeModelsQuery,
} from "@/app/store/services/sales.api";
import { Button, message, Modal } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import RecipeView from "./RecipeView";

export function RecipesPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRecipeModelsQuery();
  const [remove, { isLoading: isDeleting }] = useDeleteRecipeModelMutation();
  const [params, setParams] = useSearchParams();

  const handleDelete = useCallback(
    async (id: string) => {
      Modal.confirm({
        title: t("warning"),
        content: t("deleteSure"),
        onOk: async () => {
          await remove(id).unwrap();
          message.success(t("deleted"));
        },
      });
    },
    [remove, t]
  );

  return (
    <div>
      <TablePage
        table={{
          bordered: true,
          loading: isLoading,
          dataSource: data,
          pagination: false,
          scroll: { x: 2800 },
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
              dataIndex: ["purchaseOrder", "id"],
              key: "id",
              width: 150,
            },
            {
              title: t("mark"),
              dataIndex: ["purchaseOrder", "mark", "name"],
              key: "buyer",
              width: 250,
            },
            {
              title: t("volume"),
              dataIndex: ["purchaseOrder", "quantity"],
              key: "volume",
              width: 100,
            },
            {
              title: t("unitType"),
              dataIndex: ["purchaseOrder", "unitType", "name"],
              key: "unitType",
            },
            {
              title: t("mainRaw", { name: 1 }),
              dataIndex: "mainRaw1",
              key: "mainRaw1",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "mainRawVolume1",
              key: "mainRawVolume1",
              width: 120,
              align: "center",
            },
            {
              title: t("mainRaw", { name: 2 }),
              dataIndex: "mainRaw2",
              key: "mainRaw2",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "mainRawVolume2",
              key: "mainRawVolume2",
              width: 120,
              align: "center",
            },
            {
              title: t("mainRaw", { name: 3 }),
              dataIndex: "mainRaw3",
              key: "mainRaw3",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "mainRawVolume3",
              key: "mainRawVolume3",
              width: 120,
              align: "center",
            },
            {
              title: t("mainRaw", { name: 4 }),
              dataIndex: "mainRaw4",
              key: "mainRaw4",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "mainRawVolume4",
              key: "mainRawVolume4",
              width: 120,
              align: "center",
            },
            {
              title: t("byProduct"),
              dataIndex: "byProduct",
              key: "byProduct",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "byProductVolume",
              key: "byProductVolume",
              width: 120,
              align: "center",
            },
            {
              title: t("chemicals"),
              dataIndex: "chemicals",
              key: "chemicals",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "chemicalsVolume",
              key: "chemicalsVolume",
              width: 120,
              align: "center",
            },
            {
              title: t("additive"),
              dataIndex: "additive",
              key: "additive",
              width: 120,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: "additiveVolume",
              key: "additiveVolume",
              width: 120,
              align: "center",
            },
            {
              title: t("devices"),
              dataIndex: "device",
              key: "device",
              width: 120,
              align: "center",
            },
            {
              title: t("lotNumber"),
              dataIndex: "lotNumber",
              key: "lotNumber",
              width: 120,
              align: "center",
            },
            {
              title: t("actions"),
              key: "actions",
              width: 160,
              align: "center",
              fixed: "right",
              render: (_, record) => (
                <div className="flex items-center gap-2">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      params.set("viewId", record._id);
                      setParams(params);
                    }}
                  />
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                      params.set("recipeId", record._id);
                      setParams(params);
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record._id!)}
                    loading={isDeleting}
                  />
                </div>
              ),
            },
          ],
        }}
        title={t("recipes")}
      />
      <RecipeForm />
      <RecipeView />
    </div>
  );
}
