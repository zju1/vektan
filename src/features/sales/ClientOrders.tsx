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
import {
  useCreateClientOrderMutation,
  useDeleteClientOrderMutation,
  useGetClientOrdersQuery,
  useUpdateClientOrderMutation,
} from "@/app/store/services/sales.api";
import { useTranslation } from "react-i18next";
import { useGetClientsQuery } from "@/app/store/services/clients.api";

export interface IClientOrder {
  _id: string;
  bagType: string;
  buyer: string;
  country: string;
  deliveryTerms: string;
  hasILCA: boolean;
  ilcaPrice: number;
  ilcaTotalPrice: number;
  paymentTerms: string;
  pricePerTon: number;
  productType: string;
  purchaseOrder: string;
  quantity: number;
  recipient: string;
  shippedVolume: number;
  totalPrice: number;
  unit: string;
}

export function ClientOrdersPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IClientOrder | null>(null);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { data } = useGetClientOrdersQuery({});
  const [create, { isLoading: createLoading }] = useCreateClientOrderMutation();
  const [update, { isLoading: updateLoading }] = useUpdateClientOrderMutation();
  const [remove] = useDeleteClientOrderMutation();
  const { t } = useTranslation();
  const { data: clients } = useGetClientsQuery();
  const loading = createLoading || updateLoading;

  // Handle form submission
  const handleFormSubmit = () => {
    console.log(modalMode);
    form.validateFields().then(async (values) => {
      // Calculate total prices
      const ilcaTotalPrice =
        values.hasILCA && values.ilcaPrice
          ? values.ilcaPrice * values.quantity
          : 0;
      const totalPrice = values.pricePerTon * values.quantity;

      const newRecord = {
        ...values,
        ilcaTotalPrice,
        totalPrice,
      };
      console.log(newRecord);

      try {
        if (modalMode === "create") {
          await create(newRecord).unwrap();
          message.success("Заказ успешно создан");
        } else {
          await update({ ...newRecord, _id: currentRecord?._id }).unwrap();
          message.success("Заказ успешно обновлен");
        }
      } catch (error) {
        console.log(error);
      }

      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id).unwrap();
      message.success("Заказ успешно удален");
    } catch (error: any) {
      console.log(error);
    }
  };

  // Open modal for creating a new record
  const showCreateModal = () => {
    setCurrentRecord(null);
    setModalMode("create");
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for editing an existing record
  const showEditModal = (record: IClientOrder) => {
    setCurrentRecord(record);
    setModalMode("edit");
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Open modal for viewing record details
  const showViewModal = (record: IClientOrder) => {
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
  }, [form]);

  // Table columns definition
  const columns: TableColumnsType<IClientOrder> = [
    {
      title: "№",
      dataIndex: "_id",
      key: "_id",
      width: 80,
      render: (_value, _record, index) => index + 1,
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
            onConfirm={() => handleDelete(record._id)}
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
        dataSource={data || []}
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
          <Button
            key="submit"
            loading={loading}
            type="primary"
            onClick={handleFormSubmit}
          >
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
              label={t("buyer")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Select
                options={clients?.map((item) => ({
                  value: item._id,
                  label: item.clientName,
                }))}
                className="w-full"
              />
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
              <div>{currentRecord._id}</div>
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
