import {
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  DatePicker,
  InputNumber,
  Upload,
  Card,
  Breadcrumb,
  Space,
} from "antd";
import {
  purchaseTypeOptions,
  paymentStatusOptions,
  productStatusOptions,
  type PurchaseDTO,
} from "./purchase.dto";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

// Assuming these queries are available in your application
import { useGetSuppliersQuery } from "@/app/store/services/suppliers.api";
import {
  useCreatePurchaseMutation,
  useGetPurchaseByIdQuery,
  useUpdatePurchaseMutation,
} from "@/app/store/services/purchase.api";
import { useGetDepartmentsQuery } from "@/app/store/services/admin";
import {
  useGetCurrenciesQuery,
  useGetLogisticsCompaniesQuery,
} from "@/app/store/services/settings.api";
import { useFiles } from "@/hooks/useFiles";
import dayjs from "dayjs";
import type { RcFile } from "antd/es/upload";
import { File } from "lucide-react";

export function PurchaseFormPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm<PurchaseDTO>();
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // API integration for CRUD operations
  const [createPurchase, { isLoading: isCreating }] =
    useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: isUpdating }] =
    useUpdatePurchaseMutation();
  const { data: purchaseData, isLoading: isLoadingPurchase } =
    useGetPurchaseByIdQuery(id || null, {
      skip: !id,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  // API integration for reference data
  const { data: suppliers } = useGetSuppliersQuery();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: logisticsServices } = useGetLogisticsCompaniesQuery();
  const { data: currencies } = useGetCurrenciesQuery();
  const [defaultFiles, setDefaultFiles] = useState<
    { name: string; fileUrl: string }[]
  >([]);

  const { handleUpload, isLoading: uploading } = useFiles();

  const isEditMode = !!id;
  const isLoading = isCreating || isUpdating || isLoadingPurchase;

  useEffect(() => {
    if (purchaseData && isEditMode) {
      // Convert date strings to moment objects for DatePicker
      form.setFieldsValue(purchaseData);

      // Set file list if specifications exist
      if (
        purchaseData.specifications &&
        purchaseData.specifications.length > 0
      ) {
        setDefaultFiles(purchaseData.specifications);
        setFileList([]);
      }
    }
  }, [purchaseData, form, isEditMode]);

  const handleSupplierChange = (value: string) => {
    const supplier = suppliers?.find((s) => s._id === value);
    if (supplier) {
      form.setFieldsValue({ supplierCompanyName: supplier.companyName });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const newFiles = [];
      if (fileList.length > 0) {
        const uploadedFiles = await handleUpload(fileList);
        newFiles.push(...uploadedFiles);
      }
      const formattedValues = {
        ...values,
        specifications: [...defaultFiles, ...newFiles],
      };

      if (isEditMode && id) {
        await updatePurchase({ purchase: formattedValues, id }).unwrap();
      } else {
        await createPurchase(formattedValues).unwrap();
      }
      message.success(t("saved"));
      navigate("/purchases");
    } catch (error) {
      console.log(error);
      message.error(t("errorOccuredInCRUD"));
    }
  };

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

  if (isLoadingPurchase && isEditMode) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto w-full max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <Breadcrumb
            items={[
              {
                title: (
                  <a onClick={() => navigate("/purchases")}>{t("purchases")}</a>
                ),
              },
              { title: isEditMode ? t("editPurchase") : t("newPurchase") },
            ]}
          />
          <h1 className="text-2xl font-bold mt-2">
            {isEditMode ? t("editPurchase") : t("newPurchase")}
          </h1>
        </div>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/purchases")}
          >
            {t("back")}
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isLoading || uploading}
            onClick={() => form.submit()}
          >
            {t("save")}
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card
          title={
            <span className="text-lg font-medium">{t("basicInformation")}</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="applicationNumber"
                label={t("applicationNumber")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="purchaseType"
                label={t("purchaseType")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select>
                  {purchaseTypeOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {t(option.label)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item
              name="uniqueDescription"
              label={t("uniqueDescription")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Card>

        {/* Supplier & Department Information */}
        <Card
          title={
            <span className="text-lg font-medium">
              {t("organizationInformation")}
            </span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="supplierId"
                label={t("supplier")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select
                  onChange={handleSupplierChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {suppliers?.map((supplier) => (
                    <Select.Option key={supplier._id} value={supplier._id}>
                      {supplier.contactName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="supplierCompanyName"
                label={t("supplierCompanyName")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="departmentId"
                label={t("department")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select showSearch optionFilterProp="children">
                  {departments?.map((department) => (
                    <Select.Option key={department._id} value={department._id}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="logisticsServiceId"
                label={t("logisticsService")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select showSearch optionFilterProp="children">
                  {logisticsServices?.map((service) => (
                    <Select.Option key={service._id} value={service._id}>
                      {service.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item
              name="initiator"
              label={t("initiator")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Card>

        {/* Contract Details */}
        <Card
          title={
            <span className="text-lg font-medium">{t("contractDetails")}</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="contractDate"
                label={t("contractDate")}
                getValueProps={(value) => ({
                  value: value ? dayjs(value) : "",
                })}
                rules={[{ required: true, message: t("required") }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name="deliveryTerms"
                label={t("deliveryTerms")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="contractQuantities"
                label={t("contractQuantities")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="quota"
                label={t("quota")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="refund" label={t("refund")}>
                <Input />
              </Form.Item>
            </div>
          </div>
        </Card>

        {/* Financial Information */}
        <Card
          title={
            <span className="text-lg font-medium">
              {t("financialInformation")}
            </span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="currencyId"
                label={t("currency")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select showSearch optionFilterProp="children">
                  {currencies?.map((currency) => (
                    <Select.Option key={currency._id} value={currency._id}>
                      {currency.code} - {currency.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="price"
                label={t("price")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name="cost"
                label={t("cost")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber className="w-full" min={0} precision={2} />
              </Form.Item>
            </div>
            <Form.Item
              name="paymentStatus"
              label={t("paymentStatus")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Select>
                {paymentStatusOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {t(option.label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Card>

        {/* Product Information */}
        <Card
          title={
            <span className="text-lg font-medium">
              {t("productInformation")}
            </span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-2">
            <Form.Item
              name="productStatus"
              label={t("productStatus")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Select>
                {productStatusOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {t(option.label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="purpose" label={t("purpose")}>
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="comments" label={t("comments")}>
              <TextArea rows={3} />
            </Form.Item>
          </div>
        </Card>

        {/* Specifications & Documents */}
        <Card
          title={
            <span className="text-lg font-medium">
              {t("documentsAndSpecifications")}
            </span>
          }
          className="shadow-sm"
        >
          <Form.Item label={t("specifications")}>
            <Upload
              {...uploadProps}
              multiple
              listType="text"
              maxCount={20}
              accept={undefined}
              method={undefined}
              openFileDialogOnClick
              hasControlInside
            >
              <Button icon={<UploadOutlined />}>{t("uploadFiles")}</Button>
            </Upload>
            {defaultFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">{t("uploadedFiles")}</h4>
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
                        className="flex items-center gap-2 text-brand-main py-2 flex-1"
                      >
                        <File className="size-4" />
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
                        {t("delete")}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Item>
        </Card>

        <div className="flex justify-end space-x-4 py-4">
          <Button onClick={() => navigate("/purchases")}>{t("cancel")}</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading || uploading}
            icon={<SaveOutlined />}
          >
            {t("save")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
