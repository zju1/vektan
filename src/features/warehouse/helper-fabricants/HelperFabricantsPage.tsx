import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Divider,
  Typography,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import {
  useCreateHelpingMaterialMutation,
  useDeleteHelpingMaterialMutation,
  useGetHelpingMaterialsQuery,
  useUpdateHelpingMaterialMutation,
} from "@/app/store/services/sales.api";

const { Title } = Typography;
const { Option } = Select;

// Define the interface for the raw material data
export interface RawMaterialData {
  _id?: string;
  date: string;
  idNumber: string;
  name: string;
  supplier: string;
  category: string;
  wagonNumber: string;
  documentNumber: string;
  packagingType: string;
  quantity: number;
  unit: string;
  pricePerUnit: string;
  totalAmount: string;
  batch: number;
  qualityControl: string;
  location: string;
  notes: string;
}

// Category options
const categoryOptions = ["Основное сырье", "Вспомогательное сырье", "Упаковка"];

// Packaging type options
const packagingTypeOptions = [
  "канистра",
  "бочка",
  "мешок",
  "коробка",
  "паллета",
];

// Unit options
const unitOptions = ["литров", "кг", "тонн", "штук"];

// Quality control options
const qualityControlOptions = [
  "Проверено",
  "В процессе",
  "Требуется проверка",
  "Не соответствует",
];

export function HelperFabricantsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<RawMaterialData | null>(
    null
  );
  const [form] = Form.useForm();
  const [create, { isLoading: createLoading }] =
    useCreateHelpingMaterialMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdateHelpingMaterialMutation();
  const [remove] = useDeleteHelpingMaterialMutation();
  const { data, isFetching } = useGetHelpingMaterialsQuery({});

  // Handler for showing the create modal
  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handler for showing the view modal
  const showViewModal = (record: RawMaterialData) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  // Handler for showing the edit modal
  const showEditModal = (record: RawMaterialData) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, "DD.MM.YYYY") : undefined,
    });
    setIsEditModalVisible(true);
  };

  // Handler for deleting a record
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить эту запись?",
      content: "Это действие невозможно отменить.",
      okText: "Да",
      okType: "danger",
      cancelText: "Нет",
      async onOk() {
        await remove(id).unwrap();
      },
    });
  };

  // Handler for form submission (create new record)
  const handleCreate = () => {
    form.validateFields().then(async (values) => {
      await create(values).unwrap();
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Handler for form submission (edit record)
  const handleEdit = () => {
    if (!currentRecord) return;

    form.validateFields().then(async (values) => {
      await update({ ...values, _id: currentRecord._id }).unwrap();
      setIsEditModalVisible(false);
    });
  };

  // Table columns configuration
  const columns: TableProps<RawMaterialData>["columns"] = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "ID номер сырья",
      dataIndex: "idNumber",
      key: "idNumber",
      width: 120,
    },
    {
      title: "Наименование сырья",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Поставщик",
      dataIndex: "supplier",
      key: "supplier",
      width: 180,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Номер вагона/фуры/контейнера",
      dataIndex: "wagonNumber",
      key: "wagonNumber",
      width: 180,
    },
    {
      title: "Номер накладной и сопроводительных док",
      dataIndex: "documentNumber",
      key: "documentNumber",
      width: 180,
    },
    {
      title: "Тип упаковки",
      dataIndex: "packagingType",
      key: "packagingType",
      width: 120,
    },
    {
      title: "Кол-во сырья",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Ед. изм",
      dataIndex: "unit",
      key: "unit",
      width: 100,
    },
    {
      title: "Цена товара за ед.",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      width: 140,
    },
    {
      title: "Итоговая сумма",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
    },
    {
      title: "Партия",
      dataIndex: "batch",
      key: "batch",
      width: 100,
    },
    {
      title: "Качество контроля",
      dataIndex: "qualityControl",
      key: "qualityControl",
      width: 140,
      render: (text) => {
        let color = "green";
        if (text === "В процессе") color = "blue";
        if (text === "Требуется проверка") color = "orange";
        if (text === "Не соответствует") color = "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Локация",
      dataIndex: "location",
      key: "location",
      width: 120,
    },
    {
      title: "Примечание",
      dataIndex: "notes",
      key: "notes",
      width: 180,
    },
    {
      title: "Действия",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
          />
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            type="default"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
          />
        </Space>
      ),
    },
  ];

  // Form for creating/editing records
  const renderForm = () => (
    <Form
      form={form}
      layout="vertical"
      style={{ maxHeight: "70vh", overflow: "auto" }}
    >
      <div className="grid grid-cols-3 gap-4">
        <Form.Item
          name="date"
          label="Дата"
          rules={[{ required: true, message: "Пожалуйста, выберите дату!" }]}
        >
          <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="name"
          label="Наименование сырья"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите наименование сырья!",
            },
          ]}
        >
          <Input placeholder="Введите наименование сырья" />
        </Form.Item>

        <Form.Item
          name="supplier"
          label="Поставщик"
          rules={[
            { required: true, message: "Пожалуйста, введите поставщика!" },
          ]}
        >
          <Input placeholder="Введите название поставщика" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Категория"
          rules={[
            { required: true, message: "Пожалуйста, выберите категорию!" },
          ]}
        >
          <Select placeholder="Выберите категорию">
            {categoryOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="wagonNumber"
          label="Номер вагона/фуры/контейнера"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите номер транспортного средства!",
            },
          ]}
        >
          <Input placeholder="Введите номер" />
        </Form.Item>

        <Form.Item
          name="documentNumber"
          label="Номер накладной и сопроводительных док"
          rules={[
            { required: true, message: "Пожалуйста, введите номер накладной!" },
          ]}
        >
          <Input placeholder="Введите номер накладной" />
        </Form.Item>

        <Form.Item
          name="packagingType"
          label="Тип упаковки"
          rules={[
            { required: true, message: "Пожалуйста, выберите тип упаковки!" },
          ]}
        >
          <Select placeholder="Выберите тип упаковки">
            {packagingTypeOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Кол-во сырья"
          rules={[{ required: true, message: "Введите количество!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Ед. изм"
          rules={[{ required: true, message: "Выберите единицу измерения!" }]}
        >
          <Select placeholder="Выберите единицу измерения">
            {unitOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="pricePerUnit"
          label="Цена товара за ед."
          rules={[{ required: true, message: "Введите цену за единицу!" }]}
        >
          <Input placeholder="Например: 900.00 USD" />
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Итоговая сумма"
          rules={[{ required: true, message: "Введите итоговую сумму!" }]}
        >
          <Input placeholder="Например: 15 000.00 USD" />
        </Form.Item>

        <Form.Item
          name="batch"
          label="Партия"
          rules={[{ required: true, message: "Введите номер партии!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="qualityControl"
          label="Качество контроля"
          className="col-span-2"
          rules={[
            { required: true, message: "Выберите статус контроля качества!" },
          ]}
        >
          <Select placeholder="Выберите статус">
            {qualityControlOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="location"
          label="Локация"
          rules={[{ required: true, message: "Укажите локацию!" }]}
        >
          <Input placeholder="Например: Навес 5" />
        </Form.Item>

        <Form.Item name="notes" label="Примечание" className="col-span-3">
          <Input.TextArea
            rows={2}
            placeholder="Введите дополнительные примечания"
          />
        </Form.Item>
      </div>
    </Form>
  );

  // Detail view component
  const renderDetailView = () => {
    if (!currentRecord) return null;

    const detailItems = [
      { label: "Дата", value: currentRecord.date },
      { label: "ID номер сырья", value: currentRecord.idNumber },
      { label: "Наименование сырья", value: currentRecord.name },
      { label: "Поставщик", value: currentRecord.supplier },
      { label: "Категория", value: currentRecord.category },
      {
        label: "Номер вагона/фуры/контейнера",
        value: currentRecord.wagonNumber,
      },
      {
        label: "Номер накладной и сопроводительных док",
        value: currentRecord.documentNumber,
      },
      { label: "Тип упаковки", value: currentRecord.packagingType },
      { label: "Кол-во сырья", value: currentRecord.quantity },
      { label: "Ед. изм", value: currentRecord.unit },
      { label: "Цена товара за ед.", value: currentRecord.pricePerUnit },
      { label: "Итоговая сумма", value: currentRecord.totalAmount },
      { label: "Партия", value: currentRecord.batch },
      { label: "Качество контроля", value: currentRecord.qualityControl },
      { label: "Локация", value: currentRecord.location },
      { label: "Примечание", value: currentRecord.notes || "Нет примечаний" },
    ];

    return (
      <div style={{ maxHeight: "70vh", overflow: "auto" }}>
        <div className="grid grid-cols-2 gap-4">
          {detailItems.map((item, index) => (
            <div
              key={index}
              className={index === detailItems.length - 1 ? "col-span-2" : ""}
            >
              <div className="font-bold text-gray-500">{item.label}</div>
              <div className="mt-1">
                {item.label === "Качество контроля" ? (
                  <Tag
                    color={
                      item.value === "Проверено"
                        ? "green"
                        : item.value === "В процессе"
                        ? "blue"
                        : item.value === "Требуется проверка"
                        ? "orange"
                        : "red"
                    }
                  >
                    {item.value}
                  </Tag>
                ) : (
                  item.value
                )}
              </div>
              <Divider style={{ margin: "10px 0" }} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <Title level={2}>Управление сырьем</Title>

      {/* Search and Create button row */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Поиск по всем полям..."
          prefix={<SearchOutlined />}
          style={{ width: "100%", marginRight: "16px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Добавить сырье
        </Button>
      </div>

      {/* Main table */}
      <Table
        columns={columns}
        dataSource={data || []}
        loading={isFetching}
        scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
        size="small"
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Create Modal */}
      <Modal
        title="Добавить новое сырье"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreate}
        width={900}
        okButtonProps={{ loading: createLoading || updateLoading }}
        destroyOnClose
      >
        {renderForm()}
      </Modal>

      {/* View Modal */}
      <Modal
        title={
          currentRecord
            ? `Информация о сырье: ${currentRecord.name}`
            : "Информация о сырье"
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Закрыть
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalVisible(false);
              if (currentRecord) {
                showEditModal(currentRecord);
              }
            }}
          >
            Редактировать
          </Button>,
        ]}
        width={800}
      >
        {renderDetailView()}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          currentRecord
            ? `Редактировать сырье: ${currentRecord.name}`
            : "Редактировать сырье"
        }
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEdit}
        width={900}
        okButtonProps={{ loading: createLoading || updateLoading }}
        destroyOnClose
      >
        {renderForm()}
      </Modal>
    </div>
  );
}
