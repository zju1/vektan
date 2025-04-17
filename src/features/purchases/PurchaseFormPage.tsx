"use client";

import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Card,
  Breadcrumb,
  Space,
  DatePicker,
  Divider,
} from "antd";
import { useState } from "react";
import locale from "antd/lib/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import {
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import type { RcFile } from "antd/es/upload";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

dayjs.locale("ru");
const { TextArea } = Input;
const { Option } = Select;

export function PurchaseFormPage() {
  const [form] = Form.useForm();
  const navi = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for select options
  const suppliers = [
    { id: "1", name: "ООО Поставщик", contactName: "Иванов И.И." },
    { id: "2", name: "АО Снабжение", contactName: "Петров П.П." },
    { id: "3", name: "ИП Иванов", contactName: "Иванов А.А." },
    { id: "4", name: "ЗАО ТехноСнаб", contactName: "Сидоров С.С." },
    { id: "5", name: "ООО ПромРесурс", contactName: "Кузнецов К.К." },
  ];

  const manufacturers = [
    "ООО Производитель",
    "АО ПромТех",
    "ЗАО Индустрия",
    "ООО ТехноПром",
    "ИП Сидоров",
  ];

  const units = ["шт", "кг", "л", "м", "уп", "компл"];

  const [defaultFiles, setDefaultFiles] = useState<
    { name: string; fileUrl: string }[]
  >([]);

  const handleSupplierChange = (value: string) => {
    const supplier = suppliers.find((s) => s.id === value);
    if (supplier) {
      form.setFieldsValue({ supplierCompanyName: supplier.name });
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    console.log("Form values:", values);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navi("/warehouse/purchase-orders"); // Redirect to main page after success
    }, 1500);
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

  const { t } = useTranslation();

  return (
    <div className="space-y-6 mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb
            items={[
              {
                title: (
                  <a onClick={() => navi("/warehouse/purchase-orders")}>
                    Приемка товаров
                  </a>
                ),
              },
              { title: t("newAcceptance") },
            ]}
          />
          <h1 className="text-2xl font-bold mt-2">{t("acceptNewProducts")}</h1>
        </div>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navi("/warehouse/purchase-orders")}
          >
            Назад
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
          >
            Сохранить
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
        initialValues={{
          dateOfLastModification: dayjs(),
        }}
      >
        <Card
          title={
            <span className="text-lg font-medium">Основная информация</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item
              name="receiptDate"
              label="Дата поступления"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="invoiceNumber"
              label="Номер накладной"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Input placeholder="Введите номер накладной" />
            </Form.Item>
            <Form.Item
              name="supplierId"
              label="Поставщик"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Select
                onChange={handleSupplierChange}
                showSearch
                optionFilterProp="children"
                placeholder="Выберите поставщика"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Button type="text" icon={<PlusOutlined />} block>
                      Добавить нового поставщика
                    </Button>
                  </>
                )}
              >
                {suppliers.map((supplier) => (
                  <Option key={supplier.id} value={supplier.id}>
                    {supplier.contactName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="supplierCompanyName"
              label="Название компании поставщика"
            >
              <Input disabled />
            </Form.Item>
          </div>
        </Card>

        <Card
          title={
            <span className="text-lg font-medium">Информация о сырье</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item
              name="rawMaterialName"
              label="Наименование сырья"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Input placeholder="Введите наименование сырья" />
            </Form.Item>
            <Form.Item
              name="id"
              label="ID (классификатор)"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Input placeholder="Введите ID" />
            </Form.Item>
            <Form.Item
              name="unit"
              label="Единица измерения"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Select placeholder="Выберите единицу измерения">
                {units.map((unit) => (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Количество"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="pricePerUnit"
              label="Цена за единицу"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="sum" label="Сумма">
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: "100%" }}
                disabled
              />
            </Form.Item>
            <Form.Item name="lotBatch" label="Лот/Партия">
              <Input placeholder="Введите номер партии" />
            </Form.Item>
            <Form.Item name="expirationDate" label="Срок годности">
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="manufacturer" label="Производитель">
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Выберите производителя"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Button type="text" icon={<PlusOutlined />} block>
                      Добавить нового производителя
                    </Button>
                  </>
                )}
              >
                {manufacturers.map((manufacturer) => (
                  <Option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="certificate" label="Сертификат">
              <Input placeholder="Введите номер сертификата" />
            </Form.Item>
          </div>
        </Card>

        <Card
          title={
            <span className="text-lg font-medium">
              Результаты лабораторного анализа
            </span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item name="penetration" label="Пенетрация">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="viscosity" label="Вязкость">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="softeningTemperature"
              label="Температура размягчения"
            >
              <InputNumber min={0} style={{ width: "100%" }} suffix="°C" />
            </Form.Item>
            <Form.Item name="dropPoint" label="Точка падения">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="temperature" label="Температура">
              <InputNumber min={0} style={{ width: "100%" }} suffix="°C" />
            </Form.Item>
          </div>
        </Card>

        <Card
          title={
            <span className="text-lg font-medium">
              Дополнительная информация
            </span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item
              name="comments"
              label="Комментарии"
              className="md:col-span-2"
            >
              <TextArea rows={3} placeholder="Введите комментарии" />
            </Form.Item>
            <Form.Item
              name="additionalColumn1"
              label="Дополнительный столбец 1"
            >
              <Input placeholder="Введите дополнительную информацию" />
            </Form.Item>
            <Form.Item
              name="additionalColumn2"
              label="Дополнительный столбец 2"
            >
              <Input placeholder="Введите дополнительную информацию" />
            </Form.Item>
            <Form.Item
              name="additionalColumn3"
              label="Дополнительный столбец 3"
            >
              <Input placeholder="Введите дополнительную информацию" />
            </Form.Item>
            <Form.Item
              name="additionalColumn4"
              label="Дополнительный столбец 4"
            >
              <Input placeholder="Введите дополнительную информацию" />
            </Form.Item>
            <Form.Item
              name="additionalColumn5"
              label="Дополнительный столбец 5"
            >
              <Input placeholder="Введите дополнительную информацию" />
            </Form.Item>
          </div>
        </Card>

        <Card
          title={<span className="text-lg font-medium">Документы</span>}
          className="shadow-sm"
        >
          <Form.Item label="Сертификаты и документация">
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
        </Card>

        <div className="flex justify-end space-x-4 py-4">
          <Button onClick={() => navi("/warehouse/purchase-orders")}>
            Отмена
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </div>
  );
}
