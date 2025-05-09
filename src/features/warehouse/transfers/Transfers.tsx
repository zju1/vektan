import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  InputNumber,
  Space,
  Typography,
  Tooltip,
  DatePicker,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface TransferItem {
  id: string;
  date: string; // Date of transfer
  requestId: string; // Request ID (connected to module)
  recipientDepartment: string; // Department recipient
  itemId: string; // Item ID
  itemName: string; // Item name
  category: string; // Category
  purpose: string; // Purpose
  lotNumber: string; // LOT number
  packageQuantity: number; // Package quantity
  totalQuantity: number; // Total quantity
  unit: string; // Measurement unit
  sender: string; // Sender (warehouse)
  recipient: string; // Recipient (full name)
  recipientPosition: string; // Recipient position
  notes: string; // Notes
}

// Mock data based on the example in the image
const mockData: TransferItem[] = [
  {
    id: "1",
    date: "2025-04-14",
    requestId: "WO-001",
    recipientDepartment: "Лаборатория",
    itemId: "MRIA-U2KSr-001",
    itemName: "Низкомолекулярный воск",
    category: "Основное сырье",
    purpose: "Для производства/ для образца клиенту",
    lotNumber: "L151515",
    packageQuantity: 1,
    totalQuantity: 20,
    unit: "кг",
    sender: "Рахманов У.",
    recipient: "Иванов С.К.",
    recipientPosition: "Младший специалист",
    notes: "",
  },
  {
    id: "2",
    date: "2025-04-15",
    requestId: "WO-002",
    recipientDepartment: "Производство",
    itemId: "CHEM-A23-005",
    itemName: "Катализатор процесса",
    category: "Вспомогательное сырье",
    purpose: "Для производства",
    lotNumber: "L789012",
    packageQuantity: 2,
    totalQuantity: 5,
    unit: "л",
    sender: "Сидоров А.В.",
    recipient: "Петров И.Д.",
    recipientPosition: "Оператор линии",
    notes: "Срочный заказ",
  },
  {
    id: "3",
    date: "2025-04-16",
    requestId: "WO-003",
    recipientDepartment: "Технический отдел",
    itemId: "TOOL-WR-023",
    itemName: "Комплект инструментов",
    category: "Запчасти",
    purpose: "Для обслуживания",
    lotNumber: "LT45678",
    packageQuantity: 1,
    totalQuantity: 1,
    unit: "шт",
    sender: "Кузнецов Н.П.",
    recipient: "Смирнов В.В.",
    recipientPosition: "Инженер",
    notes: "Возврат через 5 дней",
  },
];

// Department options for the form
const departmentOptions = [
  "Лаборатория",
  "Производство",
  "Технический отдел",
  "Отдел контроля качества",
  "Логистика",
];

// Category options for the form
const categoryOptions = [
  "Основное сырье",
  "Вспомогательное сырье",
  "Запчасти",
  "Инструменты",
  "Готовая продукция",
];

// Unit options for the form
const unitOptions = ["кг", "л", "шт", "м", "г", "мл"];

export function TransferItems() {
  const [items, setItems] = useState<TransferItem[]>(mockData);
  const [searchText, setSearchText] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransferItem | null>(null);
  const [form] = Form.useForm();

  // Filter items based on search text
  const filteredItems = items.filter((item) => {
    const searchLower = searchText.toLowerCase();
    return (
      item.requestId.toLowerCase().includes(searchLower) ||
      item.itemName.toLowerCase().includes(searchLower) ||
      item.recipientDepartment.toLowerCase().includes(searchLower) ||
      item.recipient.toLowerCase().includes(searchLower) ||
      item.lotNumber.toLowerCase().includes(searchLower)
    );
  });

  // Handle create item
  const handleCreate = () => {
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  // Handle submit for create/edit form
  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      const newItem: TransferItem = {
        id: selectedItem ? selectedItem.id : `${items.length + 1}`,
        date: values.date.format("YYYY-MM-DD"),
        requestId: values.requestId,
        recipientDepartment: values.recipientDepartment,
        itemId: values.itemId,
        itemName: values.itemName,
        category: values.category,
        purpose: values.purpose,
        lotNumber: values.lotNumber,
        packageQuantity: values.packageQuantity,
        totalQuantity: values.totalQuantity,
        unit: values.unit,
        sender: values.sender,
        recipient: values.recipient,
        recipientPosition: values.recipientPosition,
        notes: values.notes || "",
      };

      if (selectedItem) {
        // Edit mode
        setItems(
          items.map((item) => (item.id === selectedItem.id ? newItem : item))
        );
        setIsEditModalVisible(false);
        message.success("Запись успешно обновлена");
      } else {
        // Create mode
        setItems([...items, newItem]);
        setIsCreateModalVisible(false);
        message.success("Запись успешно создана");
      }
      form.resetFields();
    });
  };

  // Handle view item
  const handleView = (record: TransferItem) => {
    setSelectedItem(record);
    setIsViewModalVisible(true);
  };

  // Handle edit item
  const handleEdit = (record: TransferItem) => {
    setSelectedItem(record);
    form.setFieldsValue({
      date: dayjs(record.date),
      requestId: record.requestId,
      recipientDepartment: record.recipientDepartment,
      itemId: record.itemId,
      itemName: record.itemName,
      category: record.category,
      purpose: record.purpose,
      lotNumber: record.lotNumber,
      packageQuantity: record.packageQuantity,
      totalQuantity: record.totalQuantity,
      unit: record.unit,
      sender: record.sender,
      recipient: record.recipient,
      recipientPosition: record.recipientPosition,
      notes: record.notes,
    });
    setIsEditModalVisible(true);
  };

  // Handle delete item
  const handleDelete = (record: TransferItem) => {
    Modal.confirm({
      title: "Подтверждение",
      content: "Вы действительно хотите удалить эту запись?",
      okText: "Да",
      cancelText: "Отмена",
      onOk: () => {
        setItems(items.filter((item) => item.id !== record.id));
        message.success("Запись успешно удалена");
      },
    });
  };

  // Modal form for creating and editing items
  const renderItemForm = () => (
    <Form
      form={form}
      layout="vertical"
      name="transferItemForm"
      initialValues={{
        date: dayjs(),
        packageQuantity: 1,
        totalQuantity: 1,
        unit: "шт",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="date"
          label="Дата перемещения"
          rules={[{ required: true, message: "Введите дату перемещения" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="requestId"
          label="Номер заявки (связан с модулем заявок)"
          rules={[{ required: true, message: "Введите номер заявки" }]}
        >
          <Input placeholder="Например: WO-001" />
        </Form.Item>

        <Form.Item
          name="recipientDepartment"
          label="Цех-получатель"
          rules={[{ required: true, message: "Выберите цех-получатель" }]}
        >
          <Select placeholder="Выберите отдел">
            {departmentOptions.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="itemId"
          label="ID номер сырья"
          rules={[{ required: true, message: "Введите ID номер сырья" }]}
        >
          <Input placeholder="Например: MRIA-U2KSr-001" />
        </Form.Item>

        <Form.Item
          name="itemName"
          label="Наименование товара"
          rules={[{ required: true, message: "Введите наименование товара" }]}
        >
          <Input placeholder="Название товара" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Категория"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Select placeholder="Выберите категорию">
            {categoryOptions.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="purpose"
          label="Почему этот товар берется со склада"
          rules={[{ required: true, message: "Укажите назначение" }]}
        >
          <Input placeholder="Например: Для производства" />
        </Form.Item>

        <Form.Item
          name="lotNumber"
          label="LOT number"
          rules={[{ required: true, message: "Введите LOT номер" }]}
        >
          <Input placeholder="Например: L151515" />
        </Form.Item>

        <Form.Item
          name="packageQuantity"
          label="Количество мешков"
          rules={[{ required: true, message: "Введите количество мешков" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="totalQuantity"
          label="Количество"
          rules={[{ required: true, message: "Введите общее количество" }]}
        >
          <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Единица измерения"
          rules={[{ required: true, message: "Выберите единицу измерения" }]}
        >
          <Select placeholder="Выберите единицу">
            {unitOptions.map((unit) => (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="sender"
          label="Склад-отправитель (отв)"
          rules={[{ required: true, message: "Введите отправителя" }]}
        >
          <Input placeholder="ФИО отправителя" />
        </Form.Item>

        <Form.Item
          name="recipient"
          label="Ф.И.О. получающего"
          rules={[{ required: true, message: "Введите ФИО получателя" }]}
        >
          <Input placeholder="ФИО получателя" />
        </Form.Item>

        <Form.Item
          name="recipientPosition"
          label="Должность получателя"
          rules={[{ required: true, message: "Введите должность получателя" }]}
        >
          <Input placeholder="Например: Младший специалист" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Примечание"
          className="col-span-1 md:col-span-2"
        >
          <Input.TextArea rows={3} placeholder="Дополнительные комментарии" />
        </Form.Item>
      </div>
    </Form>
  );

  // Table columns configuration
  const columns = [
    {
      title: "Дата перемещения",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Номер заявки",
      dataIndex: "requestId",
      key: "requestId",
    },
    {
      title: "Цех получатель",
      dataIndex: "recipientDepartment",
      key: "recipientDepartment",
    },
    {
      title: "ID номер сырья",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Наименование товара",
      dataIndex: "itemName",
      key: "itemName",
      ellipsis: true,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Почему этот товар берется со склада",
      dataIndex: "purpose",
      key: "purpose",
      ellipsis: true,
    },
    {
      title: "LOT number",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Количество мешков",
      dataIndex: "packageQuantity",
      key: "packageQuantity",
    },
    {
      title: "Количество",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Единица измерения",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Склад-отправитель (отв)",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Ф.И.О. получающего",
      dataIndex: "recipient",
      key: "recipient",
    },
    {
      title: "Должность получателя",
      dataIndex: "recipientPosition",
      key: "recipientPosition",
      ellipsis: true,
    },
    {
      title: "Примечание",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
    },
    {
      title: "Действия",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: TransferItem) => (
        <Space size="small">
          <Tooltip title="Просмотр">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>
        Перемещение товаров со склада в цеха и подразделения компании
      </Title>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Поиск по номеру заявки, товару, получателю..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%", marginRight: 16 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Создать запись
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey="id"
        scroll={{ x: "max-content" }}
        size="middle"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      {/* Create Modal */}
      <Modal
        title="Создать запись о перемещении"
        open={isCreateModalVisible}
        onOk={handleFormSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        width={800}
        okText="Создать"
        cancelText="Отмена"
      >
        {renderItemForm()}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Редактировать запись о перемещении"
        open={isEditModalVisible}
        onOk={handleFormSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={800}
        okText="Сохранить"
        cancelText="Отмена"
      >
        {renderItemForm()}
      </Modal>

      {/* View Modal */}
      <Modal
        title="Детали перемещения товара"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Закрыть
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="font-bold">Дата перемещения</p>
              <p>{selectedItem.date}</p>
            </div>
            <div>
              <p className="font-bold">Номер заявки</p>
              <p>{selectedItem.requestId}</p>
            </div>
            <div>
              <p className="font-bold">Цех-получатель</p>
              <p>{selectedItem.recipientDepartment}</p>
            </div>
            <div>
              <p className="font-bold">ID номер сырья</p>
              <p>{selectedItem.itemId}</p>
            </div>
            <div>
              <p className="font-bold">Наименование товара</p>
              <p>{selectedItem.itemName}</p>
            </div>
            <div>
              <p className="font-bold">Категория</p>
              <p>{selectedItem.category}</p>
            </div>
            <div>
              <p className="font-bold">Причина перемещения со склада</p>
              <p>{selectedItem.purpose}</p>
            </div>
            <div>
              <p className="font-bold">LOT номер</p>
              <p>{selectedItem.lotNumber}</p>
            </div>
            <div>
              <p className="font-bold">Количество мешков</p>
              <p>{selectedItem.packageQuantity}</p>
            </div>
            <div>
              <p className="font-bold">Количество</p>
              <p>
                {selectedItem.totalQuantity} {selectedItem.unit}
              </p>
            </div>
            <div>
              <p className="font-bold">Единица измерения</p>
              <p>{selectedItem.unit}</p>
            </div>
            <div>
              <p className="font-bold">Склад-отправитель</p>
              <p>{selectedItem.sender}</p>
            </div>
            <div>
              <p className="font-bold">Ф.И.О. получающего</p>
              <p>{selectedItem.recipient}</p>
            </div>
            <div>
              <p className="font-bold">Должность получателя</p>
              <p>{selectedItem.recipientPosition}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="font-bold">Примечание</p>
              <p>{selectedItem.notes || "-"}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
