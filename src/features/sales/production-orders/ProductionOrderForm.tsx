import type { ModalFormProps } from "@/@types/form.props";
import { useForm } from "@/hooks/useForm";
import { useRules } from "@/hooks/useRules";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Upload,
} from "antd";
import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useTranslation } from "react-i18next";
import type { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { useGetClientsQuery } from "@/app/store/services/clients.api";
import {
  useGetBagTypesQuery,
  useGetCitiesQuery,
  useGetConsigneesQuery,
  useGetCountriesQuery,
  useGetMarkByIdQuery,
  useGetMarksQuery,
  useGetUnitTypesQuery,
} from "@/app/store/services/settings.api";
import {
  useCreateProductionOrderMutation,
  useGetProductionrderByIdQuery,
  useUpdateProductionOrderMutation,
} from "@/app/store/services/sales.api";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useFiles } from "@/hooks/useFiles";

export function ProductionOrderForm({
  open,
  onClose,
  title,
}: PropsWithChildren & ModalFormProps) {
  const { Form, form } = useForm();
  const { t } = useTranslation();
  const { required } = useRules();
  const [params, setParams] = useSearchParams();
  const id = params.get("editProductionOrderId");
  const { data } = useGetProductionrderByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const [fileList, setFileList] = useState<any[]>([]);
  const { handleUpload, isLoading } = useFiles();
  const [create, { isLoading: createLoading }] =
    useCreateProductionOrderMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdateProductionOrderMutation();
  const [defaultFiles, setDefaultFiles] = useState<
    { name: string; fileUrl: string }[]
  >([]);
  const loading = isLoading || createLoading || updateLoading;

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (_file: any, newFiles: RcFile[]) => {
      setFileList([
        ...fileList,
        ...newFiles.filter(
          (file) => fileList.findIndex((f) => f.name === file.name) === -1
        ),
      ]);
      return false;
    },
    fileList,
  };

  const currentCountry = Form.useWatch("country", form);
  const currentMark = Form.useWatch("mark", form);

  const { data: selectedMark } = useGetMarkByIdQuery(currentMark, {
    skip: !currentMark || !!id,
    refetchOnMountOrArgChange: true,
  });
  const { data: buyers } = useGetClientsQuery();
  const { data: consignees } = useGetConsigneesQuery();
  const { data: countries } = useGetCountriesQuery();
  const { data: cities } = useGetCitiesQuery(
    {
      countryId: currentCountry,
    },
    { refetchOnMountOrArgChange: true }
  );
  const { data: marks } = useGetMarksQuery();
  const { data: unitTypes } = useGetUnitTypesQuery();
  const { data: bagTypes } = useGetBagTypesQuery();

  useEffect(() => {
    if (data && id) {
      form.setFieldsValue({
        ...data,
        productionTime: moment(data.productionTime) as any,
      });
      setDefaultFiles(data.approvingDocument);
    }
  }, [data, form, id]);

  const handleClose = useCallback(() => {
    onClose();
    params.delete("editProductionOrderId");
    setParams(params);
  }, [onClose, params, setParams]);

  const handleSubmit = useCallback(
    async (values: any) => {
      let approvingDocument = [];
      if (fileList.length === 0 && defaultFiles.length === 0) {
        notification.error({
          message: t("pleaseUploadSomeFiles"),
        });
        return;
      }
      approvingDocument = await handleUpload(fileList);
      const normalizedValues = {
        ...values,
        approvingDocument: [...defaultFiles, ...approvingDocument],
        productionTime: values?.productionTime
          ? values?.productionTime.toISOString()
          : "",
      };
      if (id) {
        await update({ ...normalizedValues, _id: data?._id }).unwrap();
        notification.success({ message: t("saved") });
        handleClose();
      } else {
        await create(normalizedValues).unwrap();
        notification.success({ message: t("orderCreated") });
        handleClose();
      }
    },
    [
      create,
      data?._id,
      defaultFiles,
      fileList,
      handleClose,
      handleUpload,
      id,
      t,
      update,
    ]
  );

  useEffect(() => {
    if (!id && selectedMark) {
      form.setFieldValue("unitType", selectedMark.unitType);
    }
  }, [selectedMark, id, form]);

  return (
    <Modal
      destroyOnClose
      title={title}
      open={open}
      onCancel={handleClose}
      onOk={form.submit}
      okText={t("save")}
      cancelText={t("cancel")}
      okButtonProps={{ loading }}
    >
      <Form
        initialValues={{ comments: "" }}
        onFinish={handleSubmit}
        layout="vertical"
        form={form}
      >
        <div className="grid gap-2">
          <div className="grid gap-2 grid-cols-2">
            <Form.Item name="buyer" label={t("buyer")} rules={[required]}>
              <Select
                options={buyers?.map((item) => ({
                  label: item.clientName,
                  value: item._id,
                }))}
                showSearch
                autoClearSearchValue
              />
            </Form.Item>
            <Form.Item
              name="consignee"
              label={t("consignee")}
              rules={[required]}
            >
              <Select
                options={consignees?.map((item) => ({
                  label: item.consigneeName,
                  value: item._id,
                }))}
                showSearch
                autoClearSearchValue
              />
            </Form.Item>
            <Form.Item name="country" label={t("country")} rules={[required]}>
              <Select
                options={countries?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                showSearch
                autoClearSearchValue
              />
            </Form.Item>
            <Form.Item name="city" label={t("city")} rules={[required]}>
              <Select
                options={cities?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                showSearch
                autoClearSearchValue
              />
            </Form.Item>
          </div>
          <Form.Item name="mark" label={t("mark")} rules={[required]}>
            <Select
              options={marks?.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
              showSearch
              autoClearSearchValue
            />
          </Form.Item>
          <div className="grid gap-2 grid-cols-2">
            <Form.Item name="quantity" label={t("volume")} rules={[required]}>
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="unitType" label={t("unitType")} rules={[required]}>
              <Select
                options={unitTypes?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                showSearch
                autoClearSearchValue
              />
            </Form.Item>
            <Form.Item name="bagType" label={t("bagType")} rules={[required]}>
              <Select
                showSearch
                autoClearSearchValue
                options={bagTypes?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
            </Form.Item>{" "}
            <Form.Item
              name="productionTime"
              label={t("productionTime")}
              rules={[required]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.Item label={t("approvingDocument")}>
            <Upload
              {...uploadProps}
              multiple
              listType="text"
              maxCount={20}
              accept={undefined}
              method={undefined}
              openFileDialogOnClick
            >
              <Button icon={<UploadOutlined />}>Загрузить файлы</Button>
            </Upload>
            {defaultFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">Загруженные файлы</h4>
                <ul className="mt-2 grid">
                  {defaultFiles.map((file) => (
                    <li
                      className="border-b last:border-none flex items-center justify-between gap-4"
                      key={file.fileUrl}
                    >
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 py-2 flex-1"
                      >
                        {file.name}
                      </a>
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={() => {
                          setDefaultFiles((prev) =>
                            prev.filter((f) => f.fileUrl !== file.fileUrl)
                          );
                        }}
                      >
                        Удалить
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Item>
          <Form.Item
            name="salesPerson"
            label={t("salesPersonName")}
            rules={[required]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="comments" label={t("comments")}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
