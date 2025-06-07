import {
  useCreateCityMutation,
  useDeleteCityMutation,
  useGetCitiesQuery,
  useUpdateCityMutation,
} from "@/app/store/services/settings.api";
import {
  Button,
  Drawer,
  Form,
  Input,
  List,
  Typography,
  Popconfirm,
} from "antd";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type { CityDTO } from "./countries.dto";
import { Edit, Trash } from "lucide-react";

export function CitiesDrawer() {
  const [params, setParams] = useSearchParams();
  const currentCountryId = params.get("countryId");
  const { t } = useTranslation();
  const [create] = useCreateCityMutation();
  const [update] = useUpdateCityMutation();
  const [remove] = useDeleteCityMutation();
  const [editId, setEditIt] = useState("");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleClose = () => {
    params.delete("countryId");
    setParams(params);
  };

  const { data, isFetching } = useGetCitiesQuery({
    countryId: currentCountryId,
  });

  const handleCreate = useCallback(
    (values: any) => {
      form.validateFields().then(async () => {
        await create({ ...values, countryId: currentCountryId }).unwrap();
      });
    },
    [create, currentCountryId, form]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id).unwrap();
    },
    [remove]
  );

  const handleSave = useCallback(
    async (values: any) => {
      await update({
        city: { countryId: currentCountryId!, name: values.name },
        id: editId!,
      });
      setEditIt("");
    },
    [currentCountryId, editId, update]
  );

  return (
    <Drawer
      open={!!currentCountryId}
      onClose={handleClose}
      title={t("cities")}
      loading={isFetching}
    >
      <div className="grid gap-4">
        <List<CityDTO>
          dataSource={data}
          bordered
          renderItem={(item) =>
            editId === item._id ? (
              <Form
                layout="vertical"
                onFinish={handleSave}
                className="p-4"
                form={editForm}
              >
                <Form.Item
                  name="name"
                  label={t("name")}
                  rules={[{ required: true, message: t("required") }]}
                >
                  <div className="grid gap-2">
                    <Input placeholder={item.name} />
                    <div className="grid gap-2 grid-cols-[auto_1fr]">
                      <Button
                        htmlType="button"
                        type="text"
                        onClick={() => setEditIt("")}
                      >
                        {t("cancel")}
                      </Button>
                      <Button htmlType="submit" type="primary">
                        {t("save")}
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            ) : (
              <List.Item
                actions={[
                  <Button
                    onClick={() => {
                      setEditIt(item._id!);
                      editForm.setFieldValue("name", item.name);
                    }}
                    size="small"
                  >
                    <Edit className="size-3" />
                  </Button>,
                  <Popconfirm
                    title={t("deleteSure")}
                    onConfirm={() => handleDelete(item._id!)}
                  >
                    <Button size="small" danger>
                      <Trash className="size-3" />
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Typography.Text>{item.name}</Typography.Text>
              </List.Item>
            )
          }
        />
        <div className="grid gap-2">
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item
              name="name"
              label={t("name")}
              rules={[{ required: true, message: t("required") }]}
            >
              <div className="grid gap-2 grid-cols-[1fr_auto]">
                <Input placeholder="Nyu York" />
                <Button htmlType="submit" type="primary">
                  {t("add")}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Drawer>
  );
}
