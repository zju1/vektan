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

dayjs.locale("ru");
const { TextArea } = Input;
const { Option } = Select;

export default function TransferOrderPage() {
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

  const operations = [
    "Приход",
    "Расход",
    "Перемещение",
    "Инвентаризация",
    "Списание",
  ];
  const statuses = ["Завершено", "В процессе", "Ожидание", "Отменено"];
  const responsibles = [
    "Иванов И.И.",
    "Петров П.П.",
    "Сидоров С.С.",
    "Кузнецов К.К.",
  ];
  const availabilities = [
    "Доступно",
    "Ограничено",
    "Недоступно",
    "На проверке",
  ];
  const shipmentTypes = [
    "Отпуск в производство",
    "Брак",
    "Возврат поставщику",
    "Перемещение",
  ];
  const systems = ["Система-1", "Система-2", "Система-3", "Система-4"];
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
      navi("/warehouse/transfer-orders"); // Redirect to main page after success
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

  return (
    <div className="space-y-6 mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb
            items={[
              {
                title: (
                  <a onClick={() => navi("/warehouse/transfer-orders")}>
                    Перемещение товаров
                  </a>
                ),
              },
              { title: "Создание нового перемещение товаров" },
            ]}
          />
          <h1 className="text-2xl font-bold mt-2">
            Создание нового перемещение товаров
          </h1>
        </div>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navi("/warehouse/transfer-orders")}
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
          incomeExpense: "Приход",
          typeOperation: "Приход",
          storageLocation: "В процессе",
          availabilityForUse: "Доступно",
          typeOfShipment: "Отпуск в производство",
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
              label="Дата прихода"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="nomenclatureName"
              label="Наименование номенклатуры"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Input placeholder="Введите наименование" />
            </Form.Item>
            <Form.Item
              name="code"
              label="Артикул (Классификатор)"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Input placeholder="Введите артикул" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Количество"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
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
            <Form.Item name="expirationDate" label="Срок годности">
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
        </Card>

        <Card
          title={
            <span className="text-lg font-medium">
              Информация о поставщике и движении
            </span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <Form.Item
              name="incomeExpense"
              label="Приход / Расход"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Select placeholder="Выберите тип">
                <Option value="Приход">Приход</Option>
                <Option value="Расход">Расход</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="Цена/стоим."
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
          </div>
        </Card>

        <Card
          title={
            <span className="text-lg font-medium">Операция и документы</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item
              name="typeOperation"
              label="Тип операции"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Select placeholder="Выберите тип операции">
                {operations.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="documentBase" label="Основание / Документ">
              <Input placeholder="Введите основание" />
            </Form.Item>
            <Form.Item name="creationDate" label="Дата">
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="relationToOrder"
              label="Связь с заказом / накладной"
            >
              <Input placeholder="Введите номер заказа/накладной" />
            </Form.Item>
            <Form.Item name="lotBatch" label="Лот/Партия">
              <Input placeholder="Введите номер партии" />
            </Form.Item>
          </div>

          <Form.Item label="Документы">
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

        <Card
          title={
            <span className="text-lg font-medium">Статусы и ответственные</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item name="storageLocation" label="Статус перемещения">
              <Select placeholder="Выберите статус">
                {statuses.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="responsible"
              label="Ответственный за перемещение"
              rules={[{ required: true, message: "Обязательное поле" }]}
            >
              <Select placeholder="Выберите ответственного">
                {responsibles.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="availabilityForUse"
              label="КМФ о доступности использования"
            >
              <Select placeholder="Выберите доступность">
                {availabilities.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="typeOfShipment"
              label="Тип отгрузки (отпуск, брак)"
            >
              <Select placeholder="Выберите тип отгрузки">
                {shipmentTypes.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Card>

        <Card
          title={
            <span className="text-lg font-medium">Системная информация</span>
          }
          className="shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item name="relationToSystem" label="Связь с системой">
              <Select placeholder="Выберите систему">
                {systems.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="dateOfAddingToSystem"
              label="Дата проведения в системе"
            >
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="dateOfLastModification"
              label="Дата последних изменений"
            >
              <DatePicker
                locale={locale}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
                disabled
              />
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
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item
              name="commentaryNote"
              label="Комментарий / Примечание"
              className="md:col-span-2"
            >
              <TextArea rows={3} placeholder="Введите комментарий" />
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
          </div>
        </Card>

        <div className="flex justify-end space-x-4 py-4">
          <Button onClick={() => navi("/warehouse/transfer-orders")}>
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
