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
  type TableColumnsType,
  notification,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import {
  useCreateProductionOrderMutation,
  useDeleteProductionOrderMutation,
  useGetProductionrdersQuery,
  useUpdateProductionOrderMutation,
} from "@/app/store/services/sales.api";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Типы данных
export interface ProductionOrder {
  _id: string;
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
}

// Основной компонент страницы
export function ProductionOrdersPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ProductionOrder | null>(
    null
  );
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [create, { isLoading: createLoading }] =
    useCreateProductionOrderMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdateProductionOrderMutation();
  const [remove] = useDeleteProductionOrderMutation();
  const { data, isFetching } = useGetProductionrdersQuery({});
  const loading = createLoading || updateLoading;

  const showModal = (record?: ProductionOrder) => {
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
  const showViewModal = (record: ProductionOrder) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  // Обработка удаления заказа
  const handleDelete = async (id: string) => {
    try {
      await remove(id).unwrap();
      notification.success({ message: "Успешно удалено!" });
    } catch (error) {
      console.log(error);
    }
  };

  // Обработка отправки формы
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.format("YYYY-MM-DD") : "",
        manufactureDate: values.manufactureDate
          ? values.manufactureDate.format("YYYY-MM-DD HH:mm")
          : "",
      };

      if (editMode && currentRecord) {
        await update({ ...formattedValues, _id: currentRecord?._id }).unwrap();
        notification.success({
          message: "Обновлено успешно!",
        });
      } else {
        await create({ ...formattedValues, _id: currentRecord?._id }).unwrap();
        notification.success({
          message: "Создано успешно!",
        });
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
  const columns: TableColumnsType<ProductionOrder> = [
    {
      title: "№",
      dataIndex: "_id",
      key: "_id",
      width: 50,
      fixed: "left",
      align: "center",
      render: (_v, _r, index) => index + 1,
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
            onConfirm={() => handleDelete(record._id)}
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

      <Table
        columns={columns}
        rowKey={({ _id }) => _id}
        loading={isFetching}
        dataSource={data || []}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
        size="middle"
        bordered
      />

      <Modal
        title={editMode ? "Редактировать заказ" : "Создать новый заказ"}
        open={isModalVisible}
        onOk={handleOk}
        okButtonProps={{ loading }}
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

            <Form.Item
              rules={[{ required: true }]}
              name="lotNumber"
              label="LOT номер"
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Модальное окно просмотра заказа */}
      <Modal
        title={`Просмотр заказа #${currentRecord?._id}`}
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
              <div className="mt-1">{currentRecord._id}</div>
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
    </div>
  );
}
