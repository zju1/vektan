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
  DatePicker,
  message,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  useCreateStockAnalyzeMutation,
  useDeleteStockAnalyzeMutation,
  useGetStockAnalyzesQuery,
  useUpdateStockAnalyzeMutation,
} from "@/app/store/services/sales.api";

const { Title } = Typography;
const { Option } = Select;

// Define the interface for stock item data structure
export interface StockItem {
  _id: string;
  serialNumber: string;
  arrivalDate: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  packagingType: string;
  remainingStock: number;
  minQuantity: number;
  deliveryTime: string;
  notes: string;
}

const unitOptions = ["шт.", "кг.", "г.", "м.", "см.", "мм.", "т.н.", "литр"];

// Define the packaging types
const packagingTypes = [
  "Коробка",
  "Мешок",
  "Связка",
  "Паллет",
  "Контейнер",
  "Цех/отдел",
];

// Component for Stock Analysis Page
export function StockAnalyzePage() {
  // State variables
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<StockItem | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form] = Form.useForm();
  const { data, isFetching } = useGetStockAnalyzesQuery({});
  const [create, { isLoading: createLoading }] =
    useCreateStockAnalyzeMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdateStockAnalyzeMutation();
  const [remove] = useDeleteStockAnalyzeMutation();

  const loading = createLoading || updateLoading;

  // Handler for showing create modal
  const showCreateModal = () => {
    setModalMode("create");
    setCurrentItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handler for showing edit modal
  const showEditModal = (record: StockItem) => {
    setModalMode("edit");
    setCurrentItem(record);
    form.setFieldsValue({
      ...record,
      arrivalDate: record.arrivalDate ? dayjs(record.arrivalDate) : null,
    });
    setIsModalVisible(true);
  };

  // Handler for showing view modal
  const showViewModal = (record: StockItem) => {
    setCurrentItem(record);
    setIsViewModalVisible(true);
  };

  // Handler for modal submission
  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const formattedValues = {
          ...values,
          arrivalDate: values.arrivalDate
            ? dayjs(values.arrivalDate).format("YYYY-MM-DD")
            : "",
        };

        if (modalMode === "create") {
          await create(formattedValues).unwrap();
          message.success("Запись успешно добавлена");
        } else if (modalMode === "edit" && currentItem) {
          await update({ ...formattedValues, _id: currentItem._id }).unwrap();
          message.success("Запись успешно обновлена");
        }

        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Handler for modal cancel
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // Handler for view modal close
  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setCurrentItem(null);
  };

  // Handler for delete item
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Подтверждение удаления",
      content: "Вы уверены, что хотите удалить эту запись?",
      okText: "Да",
      okType: "danger",
      cancelText: "Отмена",
      async onOk() {
        await remove(id).unwrap();
        message.success("Запись успешно удалена");
      },
    });
  };

  // Define table columns
  const columns: ColumnsType<StockItem> = [
    {
      title: "ID номер",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 100,
    },
    {
      title: "Дата поступления в склад",
      dataIndex: "arrivalDate",
      key: "arrivalDate",
      width: 150,
    },
    {
      title: "Наименование товара",
      dataIndex: "productName",
      key: "productName",
      width: 200,
    },
    {
      title: "Категория товара",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Ед. изм",
      dataIndex: "unit",
      key: "unit",
      width: 80,
    },
    {
      title: "Тип упаковки",
      dataIndex: "packagingType",
      key: "packagingType",
      width: 120,
    },
    {
      title: "Остаток на складе",
      dataIndex: "remainingStock",
      key: "remainingStock",
      width: 150,
    },
    {
      title: "Минимальное количество на складе",
      dataIndex: "minQuantity",
      key: "minQuantity",
      width: 200,
    },
    {
      title: "Минимальное время для закупа и доставки на склад",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
      width: 200,
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
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Просмотр">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Анализ остатков</Title>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Поиск по товарам, категориям, номерам..."
            prefix={<SearchOutlined />}
            className="max-w-md"
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={showCreateModal}
          >
            Добавить запись
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data || []}
        loading={isFetching}
        rowKey="_id"
        scroll={{ x: 1800 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* Form Modal for Create/Edit */}
      <Modal
        title={
          modalMode === "create"
            ? "Добавить новую запись"
            : "Редактировать запись"
        }
        open={isModalVisible}
        onOk={handleModalOk}
        okButtonProps={{ loading }}
        onCancel={handleModalCancel}
        width={800}
        okText={modalMode === "create" ? "Добавить" : "Сохранить"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          name="stockForm"
          initialValues={{
            unit: "шт.",
            packagingType: "Коробка",
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="arrivalDate"
              label="Дата поступления в склад"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите дату поступления!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                placeholder="Выберите дату"
              />
            </Form.Item>

            <Form.Item
              name="productName"
              label="Наименование товара"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите наименование товара!",
                },
              ]}
            >
              <Input placeholder="Введите наименование товара" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Категория товара"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите категорию товара!",
                },
              ]}
            >
              <Input placeholder="Введите категорию товара" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Количество"
              rules={[
                { required: true, message: "Пожалуйста, введите количество!" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Введите количество"
              />
            </Form.Item>

            <Form.Item
              name="unit"
              label="Единица измерения"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите единицу измерения!",
                },
              ]}
            >
              <Select placeholder="Выберите единицу измерения">
                {unitOptions.map((unit) => (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="packagingType"
              label="Тип упаковки"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите тип упаковки!",
                },
              ]}
            >
              <Select placeholder="Выберите тип упаковки">
                {packagingTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="remainingStock"
              label="Остаток на складе"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите остаток на складе!",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Введите остаток на складе"
              />
            </Form.Item>

            <Form.Item
              name="minQuantity"
              label="Минимальное количество на складе"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите минимальное количество!",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Введите минимальное количество"
              />
            </Form.Item>

            <Form.Item
              name="deliveryTime"
              label="Минимальное время для закупа и доставки"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите время доставки!",
                },
              ]}
            >
              <Input placeholder="Например: 3 дня, 1 неделя" />
            </Form.Item>

            <Form.Item name="notes" label="Примечание" className="col-span-2">
              <Input.TextArea
                rows={3}
                placeholder="Введите примечания или комментарии"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="Детали записи"
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="close" onClick={handleViewModalClose}>
            Закрыть
          </Button>,
        ]}
        width={800}
      >
        {currentItem && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">ID номер:</p>
              <p>{currentItem.serialNumber}</p>
            </div>
            <div>
              <p className="font-bold">Дата поступления в склад:</p>
              <p>{currentItem.arrivalDate}</p>
            </div>
            <div>
              <p className="font-bold">Наименование товара:</p>
              <p>{currentItem.productName}</p>
            </div>
            <div>
              <p className="font-bold">Категория товара:</p>
              <p>{currentItem.category}</p>
            </div>
            <div>
              <p className="font-bold">Количество:</p>
              <p>{currentItem.quantity}</p>
            </div>
            <div>
              <p className="font-bold">Единица измерения:</p>
              <p>{currentItem.unit}</p>
            </div>
            <div>
              <p className="font-bold">Тип упаковки:</p>
              <p>{currentItem.packagingType}</p>
            </div>
            <div>
              <p className="font-bold">Остаток на складе:</p>
              <p>{currentItem.remainingStock}</p>
            </div>
            <div>
              <p className="font-bold">Минимальное количество на складе:</p>
              <p>{currentItem.minQuantity}</p>
            </div>
            <div>
              <p className="font-bold">
                Минимальное время для закупа и доставки:
              </p>
              <p>{currentItem.deliveryTime}</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">Примечание:</p>
              <p>{currentItem.notes || "Не указано"}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
