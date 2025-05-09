"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  InputNumber,
  Radio,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";

// Define the interface for order data
interface OrderData {
  id: number;
  buyer: "ILCA-FZCO" | "Vektan Chemical";
  hasILCA: boolean;
  ilcaPrice: number | null;
  ilcaTotalPrice: number | null;
  recipient: string;
  purchaseOrder: string;
  quantity: number;
  unit: string;
  country: string;
  deliveryTerms: string;
  productType: string;
  bagType: string;
  shippedVolume: number;
  pricePerTon: number;
  totalPrice: number;
  paymentTerms: string;
}

// Mock data
const initialData: OrderData[] = [
  {
    id: 1001,
    buyer: "ILCA-FZCO",
    hasILCA: true,
    ilcaPrice: 1200,
    ilcaTotalPrice: 12000,
    recipient: "ABC Company",
    purchaseOrder: "PO-2023-001",
    quantity: 10,
    unit: "тонна",
    country: "Казахстан",
    deliveryTerms: "CIF Алматы",
    productType: "Тип A",
    bagType: "Большой (1000 кг)",
    shippedVolume: 10,
    pricePerTon: 1500,
    totalPrice: 15000,
    paymentTerms: "100% предоплата",
  },
  {
    id: 1002,
    buyer: "Vektan Chemical",
    hasILCA: false,
    ilcaPrice: null,
    ilcaTotalPrice: null,
    recipient: "XYZ Ltd",
    purchaseOrder: "PO-2023-002",
    quantity: 5,
    unit: "тонна",
    country: "Узбекистан",
    deliveryTerms: "FOB Ташкент",
    productType: "Тип B",
    bagType: "Маленький (25 кг)",
    shippedVolume: 5,
    pricePerTon: 1800,
    totalPrice: 9000,
    paymentTerms: "50% предоплата, 50% после доставки",
  },
  {
    id: 1003,
    buyer: "ILCA-FZCO",
    hasILCA: true,
    ilcaPrice: 1300,
    ilcaTotalPrice: 26000,
    recipient: "Global Trade",
    purchaseOrder: "PO-2023-003",
    quantity: 20,
    unit: "тонна",
    country: "Россия",
    deliveryTerms: "DAP Москва",
    productType: "Тип C",
    bagType: "Большой (500 кг)",
    shippedVolume: 20,
    pricePerTon: 1600,
    totalPrice: 32000,
    paymentTerms: "30% предоплата, 70% через 30 дней",
  },
];

export function ClientOrdersPage() {
  const [data, setData] = useState<OrderData[]>(initialData);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<OrderData | null>(null);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Filter data based on search text
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        val !== null &&
        val.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Handle form submission
  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      // Calculate total prices
      const ilcaTotalPrice =
        values.hasILCA && values.ilcaPrice
          ? values.ilcaPrice * values.quantity
          : null;
      const totalPrice = values.pricePerTon * values.quantity;

      const newRecord = {
        ...values,
        ilcaTotalPrice,
        totalPrice,
        unit: "тонна", // Default unit
      };

      if (modalMode === "create") {
        // Generate a new ID for new records
        newRecord.id = Math.max(...data.map((item) => item.id)) + 1;
        setData([...data, newRecord]);
        message.success("Заказ успешно создан");
      } else {
        // Update existing record
        setData(
          data.map((item) =>
            item.id === currentRecord?.id ? { ...newRecord, id: item.id } : item
          )
        );
        message.success("Заказ успешно обновлен");
      }

      form.resetFields();
      setIsModalVisible(false);
    });
  };

  // Handle record deletion
  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    message.success("Заказ успешно удален");
  };

  // Open modal for creating a new record
  const showCreateModal = () => {
    setCurrentRecord(null);
    setModalMode("create");
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for editing an existing record
  const showEditModal = (record: OrderData) => {
    setCurrentRecord(record);
    setModalMode("edit");
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Open modal for viewing record details
  const showViewModal = (record: OrderData) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  // Effect to update calculated fields when form values change
  useEffect(() => {
    const hasILCA = form.getFieldValue("hasILCA");
    const quantity = form.getFieldValue("quantity") || 0;
    const ilcaPrice = form.getFieldValue("ilcaPrice") || 0;
    const pricePerTon = form.getFieldValue("pricePerTon") || 0;

    if (hasILCA) {
      form.setFieldValue("ilcaTotalPrice", ilcaPrice * quantity);
    } else {
      form.setFieldValue("ilcaPrice", null);
      form.setFieldValue("ilcaTotalPrice", null);
    }

    form.setFieldValue("totalPrice", pricePerTon * quantity);
  }, [
    form.getFieldValue("hasILCA"),
    form.getFieldValue("quantity"),
    form.getFieldValue("ilcaPrice"),
    form.getFieldValue("pricePerTon"),
  ]);

  // Table columns definition
  const columns: TableColumnsType<OrderData> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Покупатель",
      dataIndex: "buyer",
      key: "buyer",
      width: 150,
    },
    {
      title: "ILCA-FZCO",
      dataIndex: "hasILCA",
      key: "hasILCA",
      width: 120,
      render: (hasILCA: boolean) => (hasILCA ? "Да" : "Нет"),
    },
    {
      title: "Цена ILCA-FZCO за тонну",
      dataIndex: "ilcaPrice",
      key: "ilcaPrice",
      width: 180,
      render: (price: number | null) => (price === null ? "-" : `$${price}`),
    },
    {
      title: "Итого цена ILCA",
      dataIndex: "ilcaTotalPrice",
      key: "ilcaTotalPrice",
      width: 150,
      render: (price: number | null) => (price === null ? "-" : `$${price}`),
    },
    {
      title: "Грузополучатель",
      dataIndex: "recipient",
      key: "recipient",
      width: 150,
    },
    {
      title: "Purchase order",
      dataIndex: "purchaseOrder",
      key: "purchaseOrder",
      width: 150,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
    },
    {
      title: "Ед. изм.",
      dataIndex: "unit",
      key: "unit",
      width: 100,
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
    },
    {
      title: "Марка",
      dataIndex: "productType",
      key: "productType",
      width: 120,
    },
    {
      title: "Тип мешка",
      dataIndex: "bagType",
      key: "bagType",
      width: 150,
    },
    {
      title: "Отгружаемый объем",
      dataIndex: "shippedVolume",
      key: "shippedVolume",
      width: 150,
    },
    {
      title: "Цена за тонну",
      dataIndex: "pricePerTon",
      key: "pricePerTon",
      width: 150,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Итого цена",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Условия оплаты",
      dataIndex: "paymentTerms",
      key: "paymentTerms",
      width: 200,
    },
    {
      title: "Действия",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showViewModal(record)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Вы уверены, что хотите удалить этот заказ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Заказ клиентов</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Поиск..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            Новый заказ
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Create/Edit Modal */}
      <Modal
        title={
          modalMode === "create" ? "Создать новый заказ" : "Редактировать заказ"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            {modalMode === "create" ? "Создать" : "Сохранить"}
          </Button>,
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" initialValues={{ unit: "тонна" }}>
          <div className="grid grid-cols-2 gap-4">
            {modalMode === "edit" && (
              <Form.Item
                name="id"
                label="ID номер заказа"
                className="col-span-2"
              >
                <Input disabled />
              </Form.Item>
            )}

            <Form.Item
              name="buyer"
              label="Покупатель"
              rules={[{ required: true, message: "Выберите покупателя" }]}
            >
              <Select>
                <Select.Option value="ILCA-FZCO">ILCA-FZCO</Select.Option>
                <Select.Option value="Vektan Chemical">
                  Vektan Chemical
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="hasILCA"
              label="ILCA-FZCO"
              rules={[{ required: true, message: "Выберите опцию" }]}
            >
              <Radio.Group>
                <Radio value={true}>Да</Radio>
                <Radio value={false}>Нет</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="ilcaPrice"
              label="Цена продаваемая ILCA-FZCO за тонну"
              dependencies={["hasILCA"]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                prefix="$"
                disabled={!form.getFieldValue("hasILCA")}
              />
            </Form.Item>

            <Form.Item name="ilcaTotalPrice" label="Итого цена ILCA">
              <InputNumber style={{ width: "100%" }} prefix="$" disabled />
            </Form.Item>

            <Form.Item
              name="recipient"
              label="Грузополучатель"
              rules={[{ required: true, message: "Введите грузополучателя" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="purchaseOrder"
              label="Purchase order"
              rules={[{ required: true, message: "Введите номер заказа" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Количество"
              rules={[{ required: true, message: "Введите количество" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="unit" label="Ед. изм.">
              <Input disabled defaultValue="тонна" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Страна"
              rules={[{ required: true, message: "Введите страну" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="deliveryTerms"
              label="Условия доставки/Город"
              rules={[{ required: true, message: "Введите условия доставки" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="productType"
              label="Марка"
              rules={[{ required: true, message: "Введите марку продукта" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="bagType"
              label="Тип мешка"
              rules={[{ required: true, message: "Выберите тип мешка" }]}
            >
              <Select>
                <Select.Option value="Большой (1000 кг)">
                  Большой (1000 кг)
                </Select.Option>
                <Select.Option value="Большой (500 кг)">
                  Большой (500 кг)
                </Select.Option>
                <Select.Option value="Маленький (25 кг)">
                  Маленький (25 кг)
                </Select.Option>
                <Select.Option value="Маленький (20 кг)">
                  Маленький (20 кг)
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="shippedVolume"
              label="Отгружаемый объем"
              rules={[{ required: true, message: "Введите отгружаемый объем" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="pricePerTon"
              label="Цена за тонну"
              rules={[{ required: true, message: "Введите цену за тонну" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
            </Form.Item>

            <Form.Item name="totalPrice" label="Итого цена">
              <InputNumber style={{ width: "100%" }} prefix="$" disabled />
            </Form.Item>

            <Form.Item
              name="paymentTerms"
              label="Условия оплаты"
              className="col-span-2"
              rules={[{ required: true, message: "Введите условия оплаты" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Просмотр заказа"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Закрыть
          </Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 border-b pb-2">
              <div className="font-bold">ID номер заказа</div>
              <div>{currentRecord.id}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Покупатель</div>
              <div>{currentRecord.buyer}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">ILCA-FZCO</div>
              <div>{currentRecord.hasILCA ? "Да" : "Нет"}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">
                Цена продаваемая ILCA-FZCO за тонну
              </div>
              <div>
                {currentRecord.ilcaPrice === null
                  ? "-"
                  : `$${currentRecord.ilcaPrice}`}
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Итого цена ILCA</div>
              <div>
                {currentRecord.ilcaTotalPrice === null
                  ? "-"
                  : `$${currentRecord.ilcaTotalPrice}`}
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Грузополучатель</div>
              <div>{currentRecord.recipient}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Purchase order</div>
              <div>{currentRecord.purchaseOrder}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Количество</div>
              <div>{currentRecord.quantity}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Ед. изм.</div>
              <div>{currentRecord.unit}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Страна</div>
              <div>{currentRecord.country}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Условия доставки/Город</div>
              <div>{currentRecord.deliveryTerms}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Марка</div>
              <div>{currentRecord.productType}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Тип мешка</div>
              <div>{currentRecord.bagType}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Отгружаемый объем</div>
              <div>{currentRecord.shippedVolume}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Цена за тонну</div>
              <div>${currentRecord.pricePerTon}</div>
            </div>

            <div className="border-b pb-2">
              <div className="font-bold">Итого цена</div>
              <div>${currentRecord.totalPrice}</div>
            </div>

            <div className="col-span-2 border-b pb-2">
              <div className="font-bold">Условия оплаты</div>
              <div>{currentRecord.paymentTerms}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
