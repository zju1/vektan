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
  useCreatePurchaseFabricantMutation,
  useDeletePurchaseFabricantMutation,
  useGetPurchaseFabricantsQuery,
  useUpdatePurchaseFabricantMutation,
} from "@/app/store/services/sales.api";

const { Title } = Typography;
const { Option } = Select;

// Define the interface for the material data
export interface MaterialData {
  _id?: string;
  date: string;
  idNumber: string;
  name: string;
  category: string;
  supplier: string;
  wagonNumber: string;
  lotNumber: string;
  bagCount: number;
  totalTonnage: number;
  pricePerUnit: string;
  totalAmount: string;
  batch: number;
  penetrationQuality: number;
  viscosityQuality: number;
  meltingPointQuality: number;
  location: string;
  notes: string;
}

// Category options
const categoryOptions = ["Основное сырье", "Вспомогательное сырье", "Упаковка"];

export function Fabricants() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MaterialData | null>(null);
  const [form] = Form.useForm();
  const [create, { isLoading: createLoading }] =
    useCreatePurchaseFabricantMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdatePurchaseFabricantMutation();
  const [remove] = useDeletePurchaseFabricantMutation();
  const { data, isFetching } = useGetPurchaseFabricantsQuery({});

  // Handler for showing the create modal
  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handler for showing the view modal
  const showViewModal = (record: MaterialData) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  // Handler for showing the edit modal
  const showEditModal = (record: MaterialData) => {
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
      const newData: MaterialData = {
        ...values,
        date: values.date ? values.date.format("DD.MM.YYYY") : "",
      };
      await create(newData).unwrap();
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Handler for form submission (edit record)
  const handleEdit = () => {
    if (!currentRecord) return;

    form.validateFields().then(async (values) => {
      await update({ ...values, _id: currentRecord._id! }).unwrap();
      setIsEditModalVisible(false);
    });
  };

  // Table columns configuration
  const columns: TableProps<MaterialData>["columns"] = [
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
      width: 150,
    },
    {
      title: "Наименование сырья",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Поставщик",
      dataIndex: "supplier",
      key: "supplier",
      width: 200,
    },
    {
      title: "Номер вагона/фуры/контейнера",
      dataIndex: "wagonNumber",
      key: "wagonNumber",
      width: 200,
    },
    {
      title: "LOT номер",
      dataIndex: "lotNumber",
      key: "lotNumber",
      width: 120,
    },
    {
      title: "Количество мешков",
      dataIndex: "bagCount",
      key: "bagCount",
      width: 100,
    },
    {
      title: "Общий тоннаж",
      dataIndex: "totalTonnage",
      key: "totalTonnage",
      width: 100,
    },
    {
      title: "Цена товара за ед.",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      width: 150,
    },
    {
      title: "Итоговая сумма",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
    },
    {
      title: "Партия",
      dataIndex: "batch",
      key: "batch",
      width: 100,
    },
    {
      title: "Качество контроля: Пенетрация (1/10 мм)",
      dataIndex: "penetrationQuality",
      key: "penetrationQuality",
      width: 150,
    },
    {
      title: "Качество контроля: Вязкость (mPa*s)",
      dataIndex: "viscosityQuality",
      key: "viscosityQuality",
      width: 150,
    },
    {
      title: "Качество контроля: Каплепадение C°",
      dataIndex: "meltingPointQuality",
      key: "meltingPointQuality",
      width: 150,
    },
    {
      title: "Локация",
      dataIndex: "location",
      key: "location",
      width: 100,
    },
    {
      title: "Примечание",
      dataIndex: "notes",
      key: "notes",
      width: 200,
    },
    {
      title: "Действия",
      key: "actions",
      fixed: "right",
      width: 150,
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
          name="supplier"
          label="Поставщик"
          rules={[
            { required: true, message: "Пожалуйста, введите поставщика!" },
          ]}
        >
          <Input placeholder="Введите название поставщика" />
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
          name="lotNumber"
          label="LOT номер"
          rules={[
            { required: true, message: "Пожалуйста, введите LOT номер!" },
          ]}
        >
          <Input placeholder="Например: 424L02" />
        </Form.Item>

        <Form.Item
          name="bagCount"
          label="Количество мешков"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите количество мешков!",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="totalTonnage"
          label="Общий тоннаж"
          rules={[
            { required: true, message: "Пожалуйста, введите общий тоннаж!" },
          ]}
        >
          <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="pricePerUnit"
          label="Цена товара за ед."
          rules={[
            { required: true, message: "Пожалуйста, введите цену за единицу!" },
          ]}
        >
          <Input placeholder="Например: 900.00 USD" />
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Итоговая сумма"
          rules={[
            { required: true, message: "Пожалуйста, введите итоговую сумму!" },
          ]}
        >
          <Input placeholder="Например: 15,000.00 USD" />
        </Form.Item>

        <Form.Item
          name="batch"
          label="Партия"
          rules={[
            { required: true, message: "Пожалуйста, введите номер партии!" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="penetrationQuality"
          label="Качество контроля: Пенетрация (1/10 мм)"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите значение пенетрации!",
            },
          ]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="viscosityQuality"
          label="Качество контроля: Вязкость (mPa*s)"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите значение вязкости!",
            },
          ]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="meltingPointQuality"
          label="Качество контроля: Каплепадение C°"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите значение каплепадения!",
            },
          ]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="location"
          label="Локация"
          rules={[{ required: true, message: "Пожалуйста, введите локацию!" }]}
        >
          <Input placeholder="Например: Навес 1" />
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
      { label: "Категория", value: currentRecord.category },
      { label: "Поставщик", value: currentRecord.supplier },
      {
        label: "Номер вагона/фуры/контейнера",
        value: currentRecord.wagonNumber,
      },
      { label: "LOT номер", value: currentRecord.lotNumber },
      { label: "Количество мешков", value: currentRecord.bagCount },
      { label: "Общий тоннаж", value: currentRecord.totalTonnage },
      { label: "Цена товара за ед.", value: currentRecord.pricePerUnit },
      { label: "Итоговая сумма", value: currentRecord.totalAmount },
      { label: "Партия", value: currentRecord.batch },
      {
        label: "Качество контроля: Пенетрация (1/10 мм)",
        value: currentRecord.penetrationQuality,
      },
      {
        label: "Качество контроля: Вязкость (mPa*s)",
        value: currentRecord.viscosityQuality,
      },
      {
        label: "Качество контроля: Каплепадение C°",
        value: currentRecord.meltingPointQuality,
      },
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
              <div className="mt-1">{item.value}</div>
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
        okButtonProps={{ loading: createLoading || updateLoading }}
        width={900}
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
        okButtonProps={{ loading: createLoading || updateLoading }}
        onOk={handleEdit}
        width={900}
        destroyOnClose
      >
        {renderForm()}
      </Modal>
    </div>
  );
}
