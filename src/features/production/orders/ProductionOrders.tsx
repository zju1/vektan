"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Progress,
  Space,
  Tooltip,
  Typography,
  Popconfirm,
  Tag,
  Drawer,
  type TableColumnsType,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Типы данных
interface OrderType {
  key: string;
  id: string;
  recipe: string;
  manufactureDate: string | null;
  recipient: string;
  country: string;
  deliveryTerms: string;
  brand: string;
  bagType: string;
  quantity: number;
  unit: string;
  loading: string;
  productionStatus: "planned" | "inProduction" | "ready";
  productionPercentage: number;
  deadline: string;
  lotNumber: string;
  history: HistoryItem[];
}

interface HistoryItem {
  date: string;
  user: string;
  action: string;
  details: string;
}

// Начальные данные
const initialData: OrderType[] = [
  {
    key: "1",
    id: "ORD-2023-001",
    recipe: "Стандартная смесь A-12 + добавка C-45",
    manufactureDate: "2023-05-15 14:30",
    recipient: 'ООО "ХимПром"',
    country: "Казахстан",
    deliveryTerms: "FCA / Алматы, ул. Промышленная 45",
    brand: "ПолиМикс-500",
    bagType: "Биг-бэг 1000 кг",
    quantity: 25,
    unit: "тонна",
    loading: "паллет",
    productionStatus: "ready",
    productionPercentage: 100,
    deadline: "2023-05-20",
    lotNumber: "LOT-2023-A-123",
    history: [
      {
        date: "2023-05-10 09:15",
        user: "Иванов И.И.",
        action: "Создание заказа",
        details: "Заказ создан",
      },
      {
        date: "2023-05-15 14:30",
        user: "Петров П.П.",
        action: "Изменение статуса",
        details: 'Статус изменен на "Готов"',
      },
    ],
  },
  {
    key: "2",
    id: "ORD-2023-002",
    recipe: "Премиум смесь B-24 + катализатор K-8",
    manufactureDate: null,
    recipient: 'ТОО "АгроХим"',
    country: "Узбекистан",
    deliveryTerms: "CIP / Ташкент, Промзона 12",
    brand: "АгроПолимер-200",
    bagType: "Мешок 25 кг",
    quantity: 15,
    unit: "тонна",
    loading: "паллет",
    productionStatus: "inProduction",
    productionPercentage: 45,
    deadline: "2023-06-10",
    lotNumber: "",
    history: [
      {
        date: "2023-05-20 11:30",
        user: "Иванов И.И.",
        action: "Создание заказа",
        details: "Заказ создан",
      },
      {
        date: "2023-05-25 09:45",
        user: "Сидоров С.С.",
        action: "Начало производства",
        details: "Производство начато",
      },
    ],
  },
  {
    key: "3",
    id: "ORD-2023-003",
    recipe: "Базовая смесь C-30 + добавки D-10, E-5",
    manufactureDate: null,
    recipient: 'ЗАО "ТехноПласт"',
    country: "Россия",
    deliveryTerms: "DAP / Москва, ул. Складская 78",
    brand: "ТехноПолимер-100",
    bagType: "Биг-бэг 500 кг",
    quantity: 30,
    unit: "тонна",
    loading: "паллет",
    productionStatus: "planned",
    productionPercentage: 0,
    deadline: "2023-06-25",
    lotNumber: "",
    history: [
      {
        date: "2023-05-30 15:20",
        user: "Иванов И.И.",
        action: "Создание заказа",
        details: "Заказ создан",
      },
    ],
  },
];

// Компонент для перетаскиваемых строк
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: "move",
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

// Основной компонент страницы
export function ProductionOrdersPage() {
  const [dataSource, setDataSource] = useState<OrderType[]>(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isHistoryDrawerVisible, setIsHistoryDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<OrderType | null>(null);
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Настройка сенсоров для drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Обработка окончания перетаскивания
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);

        // Добавляем запись в историю о перемещении
        const updatedData = [...prev];
        const movedItem = { ...updatedData[activeIndex] };

        movedItem.history = [
          ...movedItem.history,
          {
            date: new Date().toISOString().replace("T", " ").substring(0, 19),
            user: "Текущий пользователь",
            action: "Изменение порядка",
            details: `Заказ перемещен с позиции ${activeIndex + 1} на позицию ${
              overIndex + 1
            }`,
          },
        ];

        updatedData[activeIndex] = movedItem;

        // Перемещаем элемент
        const newData = [...updatedData];
        const [removed] = newData.splice(activeIndex, 1);
        newData.splice(overIndex, 0, removed);

        return newData;
      });
    }
  };

  // Обработка поиска
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = dataSource.filter((item) => {
    return Object.values(item).some((val) => {
      if (typeof val === "string") {
        return val.toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    });
  });

  // Обработка создания/редактирования заказа
  const showModal = (record?: OrderType) => {
    if (record) {
      setCurrentRecord(record);
      form.setFieldsValue({
        ...record,
        deadline: record.deadline ? dayjs(record.deadline) : null,
        manufactureDate: record.manufactureDate
          ? dayjs(record.manufactureDate)
          : null,
      });
      setEditMode(true);
    } else {
      setCurrentRecord(null);
      form.resetFields();
      setEditMode(false);
    }
    setIsModalVisible(true);
  };

  // Просмотр деталей заказа
  const showViewModal = (record: OrderType) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  // Просмотр истории заказа
  const showHistoryDrawer = (record: OrderType) => {
    setCurrentRecord(record);
    setIsHistoryDrawerVisible(true);
  };

  // Обработка удаления заказа
  const handleDelete = (key: string) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  // Обработка отправки формы
  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.format("YYYY-MM-DD") : "",
        manufactureDate: values.manufactureDate
          ? values.manufactureDate.format("YYYY-MM-DD HH:mm")
          : null,
      };

      if (editMode && currentRecord) {
        // Обновление существующего заказа
        const newData = [...dataSource];
        const index = newData.findIndex(
          (item) => currentRecord.key === item.key
        );

        // Добавляем запись в историю
        const historyEntry: HistoryItem = {
          date: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "Текущий пользователь",
          action: "Редактирование заказа",
          details: "Данные заказа обновлены",
        };

        const updatedItem = {
          ...newData[index],
          ...formattedValues,
          history: [...newData[index].history, historyEntry],
        };

        newData.splice(index, 1, updatedItem);
        setDataSource(newData);
      } else {
        // Создание нового заказа
        const newKey = (dataSource.length + 1).toString();
        const newId = `ORD-${new Date().getFullYear()}-${newKey.padStart(
          3,
          "0"
        )}`;

        const newOrder: OrderType = {
          key: newKey,
          id: newId,
          ...formattedValues,
          history: [
            {
              date: new Date().toISOString().replace("T", " ").substring(0, 19),
              user: "Текущий пользователь",
              action: "Создание заказа",
              details: "Заказ создан",
            },
          ],
        };

        setDataSource([...dataSource, newOrder]);
      }

      setIsModalVisible(false);
    });
  };

  // Обработка отмены
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Обработка закрытия модального окна просмотра
  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  // Обработка закрытия панели истории
  const handleHistoryDrawerClose = () => {
    setIsHistoryDrawerVisible(false);
  };

  // Получение статуса в виде тега
  const getStatusTag = (status: string) => {
    switch (status) {
      case "planned":
        return <Tag color="blue">В плане</Tag>;
      case "inProduction":
        return <Tag color="orange">В производстве</Tag>;
      case "ready":
        return <Tag color="green">Готов</Tag>;
      default:
        return <Tag color="default">Неизвестно</Tag>;
    }
  };

  // Определение колонок таблицы
  const columns: TableColumnsType<OrderType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Рецепт заказа",
      dataIndex: "recipe",
      key: "recipe",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Дата изготовления",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Грузополучатель",
      dataIndex: "recipient",
      key: "recipient",
      width: 150,
    },
    {
      title: "Страна",
      dataIndex: "country",
      key: "country",
      width: 120,
    },
    {
      title: "Условия доставки/Город",
      dataIndex: "deliveryTerms",
      key: "deliveryTerms",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Марка",
      dataIndex: "brand",
      key: "brand",
      width: 150,
    },
    {
      title: "Тип мешка",
      dataIndex: "bagType",
      key: "bagType",
      width: 150,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      key: "unit",
      width: 80,
    },
    {
      title: "Загрузка",
      dataIndex: "loading",
      key: "loading",
      width: 100,
    },
    {
      title: "Статус производства",
      dataIndex: "productionStatus",
      key: "productionStatus",
      width: 150,
      render: (text) => getStatusTag(text),
      filters: [
        { text: "В плане", value: "planned" },
        { text: "В производстве", value: "inProduction" },
        { text: "Готов", value: "ready" },
      ],
      onFilter: (value, record) => record.productionStatus === value,
    },
    {
      title: "Статус в %",
      dataIndex: "productionPercentage",
      key: "productionPercentage",
      width: 120,
      render: (percentage) => <Progress percent={percentage} size="small" />,
      sorter: (a, b) => a.productionPercentage - b.productionPercentage,
    },
    {
      title: "Срок изготовления",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      sorter: (a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    },
    {
      title: "LOT номер",
      dataIndex: "lotNumber",
      key: "lotNumber",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "История",
      key: "history",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<HistoryOutlined />}
          onClick={() => showHistoryDrawer(record)}
          type="text"
        />
      ),
    },
    {
      title: "Действия",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
            type="text"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="text"
          />
          <Popconfirm
            title="Вы уверены, что хотите удалить этот заказ?"
            onConfirm={() => handleDelete(record.key)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Заказы</Title>
        <div className="flex gap-4">
          <Input
            placeholder="Поиск"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Новый заказ
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            rowKey="key"
            columns={columns}
            dataSource={filteredData}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10 }}
            size="middle"
            bordered
          />
        </SortableContext>
      </DndContext>

      {/* Модальное окно создания/редактирования заказа */}
      <Modal
        title={editMode ? "Редактировать заказ" : "Создать новый заказ"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        okText={editMode ? "Сохранить" : "Создать"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            unit: "тонна",
            loading: "паллет",
            productionStatus: "planned",
            productionPercentage: 0,
          }}
        >
          {editMode && (
            <Form.Item
              name="id"
              label="ID номер заказа"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item
            name="recipe"
            label="Рецепт заказа"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="manufactureDate" label="Дата изготовления">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                locale={locale}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="recipient"
              label="Грузополучатель"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="country"
              label="Страна"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="deliveryTerms"
              label="Условия доставки/Город"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="brand" label="Марка" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="bagType"
              label="Тип мешка"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Биг-бэг 500 кг">Биг-бэг 500 кг</Option>
                <Option value="Биг-бэг 1000 кг">Биг-бэг 1000 кг</Option>
                <Option value="Мешок 20 кг">Мешок 20 кг</Option>
                <Option value="Мешок 25 кг">Мешок 25 кг</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Количество"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="unit"
              label="Ед. изм."
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="loading"
              label="Загрузка"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="productionStatus"
              label="Статус производства"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="planned">В плане</Option>
                <Option value="inProduction">В производстве</Option>
                <Option value="ready">Готов</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="productionPercentage"
              label="Статус производства в процентах"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="deadline"
              label="Срок изготовления"
              rules={[{ required: true }]}
            >
              <DatePicker locale={locale} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="lotNumber" label="LOT номер">
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Модальное окно просмотра заказа */}
      <Modal
        title={`Просмотр заказа #${currentRecord?.id}`}
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Закрыть
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              handleViewCancel();
              if (currentRecord) showModal(currentRecord);
            }}
          >
            Редактировать
          </Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Text strong>Рецепт заказа:</Text>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {currentRecord.recipe}
              </div>
            </div>

            <div>
              <Text strong>ID номер заказа:</Text>
              <div className="mt-1">{currentRecord.id}</div>
            </div>

            <div>
              <Text strong>Дата изготовления:</Text>
              <div className="mt-1">{currentRecord.manufactureDate || "-"}</div>
            </div>

            <div>
              <Text strong>Грузополучатель:</Text>
              <div className="mt-1">{currentRecord.recipient}</div>
            </div>

            <div>
              <Text strong>Страна:</Text>
              <div className="mt-1">{currentRecord.country}</div>
            </div>

            <div>
              <Text strong>Условия доставки/Город:</Text>
              <div className="mt-1">{currentRecord.deliveryTerms}</div>
            </div>

            <div>
              <Text strong>Марка:</Text>
              <div className="mt-1">{currentRecord.brand}</div>
            </div>

            <div>
              <Text strong>Тип мешка:</Text>
              <div className="mt-1">{currentRecord.bagType}</div>
            </div>

            <div>
              <Text strong>Количество:</Text>
              <div className="mt-1">
                {currentRecord.quantity} {currentRecord.unit}
              </div>
            </div>

            <div>
              <Text strong>Загрузка:</Text>
              <div className="mt-1">{currentRecord.loading}</div>
            </div>

            <div>
              <Text strong>Статус производства:</Text>
              <div className="mt-1">
                {getStatusTag(currentRecord.productionStatus)}
              </div>
            </div>

            <div>
              <Text strong>Статус производства в процентах:</Text>
              <div className="mt-1">
                <Progress percent={currentRecord.productionPercentage} />
              </div>
            </div>

            <div>
              <Text strong>Срок изготовления:</Text>
              <div className="mt-1">{currentRecord.deadline}</div>
            </div>

            <div>
              <Text strong>LOT номер:</Text>
              <div className="mt-1">{currentRecord.lotNumber || "-"}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Панель истории заказа */}
      <Drawer
        title={`История заказа #${currentRecord?.id}`}
        placement="right"
        onClose={handleHistoryDrawerClose}
        open={isHistoryDrawerVisible}
        width={500}
      >
        {currentRecord && (
          <div className="space-y-4">
            {currentRecord.history.map((item, index) => (
              <div key={index} className="border-b pb-3">
                <div className="flex justify-between">
                  <Text strong>{item.action}</Text>
                  <Text type="secondary">{item.date}</Text>
                </div>
                <div className="mt-1">
                  <Text>{item.details}</Text>
                </div>
                <div className="mt-1">
                  <Text type="secondary">Пользователь: {item.user}</Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
