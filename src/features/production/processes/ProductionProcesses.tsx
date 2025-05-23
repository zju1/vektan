"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  InputNumber,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useCreateProcessDataMutation,
  useDeleteProcessDataMutation,
  useGetProcessDataQuery,
  useUpdateProcesDataMutation,
} from "@/app/store/services/sales.api";

interface RawMaterial {
  batchNumber: string;
  quantity: number;
  position: string;
}

export interface ProcessData {
  _id?: string;
  orderId: string;
  mainComponent: {
    rawMaterial1: RawMaterial;
    rawMaterial2: RawMaterial;
    rawMaterial3: RawMaterial;
  };
  byProduct: RawMaterial;
  additives: RawMaterial;
  lotNumber: string;
  notes: string;
}

export function ProductionProcessesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ProcessData | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isFetching } = useGetProcessDataQuery({});

  const [remove] = useDeleteProcessDataMutation();
  const [create, { isLoading: createLoading }] = useCreateProcessDataMutation();
  const [update, { isLoading: updateLoading }] = useUpdateProcesDataMutation();

  const showModal = (record?: ProcessData, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (record) {
      setCurrentRecord(record);
      form.setFieldsValue({
        orderId: record.orderId,
        rawMaterial1BatchNumber: record.mainComponent.rawMaterial1.batchNumber,
        rawMaterial1Quantity: record.mainComponent.rawMaterial1.quantity,
        rawMaterial1Position: record.mainComponent.rawMaterial1.position,
        rawMaterial2BatchNumber: record.mainComponent.rawMaterial2.batchNumber,
        rawMaterial2Quantity: record.mainComponent.rawMaterial2.quantity,
        rawMaterial2Position: record.mainComponent.rawMaterial2.position,
        rawMaterial3BatchNumber: record.mainComponent.rawMaterial3.batchNumber,
        rawMaterial3Quantity: record.mainComponent.rawMaterial3.quantity,
        rawMaterial3Position: record.mainComponent.rawMaterial3.position,
        byProductBatchNumber: record.byProduct.batchNumber,
        byProductQuantity: record.byProduct.quantity,
        byProductPosition: record.byProduct.position,
        additivesBatchNumber: record.additives.batchNumber,
        additivesQuantity: record.additives.quantity,
        additivesPosition: record.additives.position,
        lotNumber: record.lotNumber,
        notes: record.notes,
      });
    } else {
      setCurrentRecord(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const newRecord: ProcessData = {
        orderId: values.orderId,
        mainComponent: {
          rawMaterial1: {
            batchNumber: values.rawMaterial1BatchNumber,
            quantity: values.rawMaterial1Quantity,
            position: values.rawMaterial1Position,
          },
          rawMaterial2: {
            batchNumber: values.rawMaterial2BatchNumber,
            quantity: values.rawMaterial2Quantity,
            position: values.rawMaterial2Position,
          },
          rawMaterial3: {
            batchNumber: values.rawMaterial3BatchNumber,
            quantity: values.rawMaterial3Quantity,
            position: values.rawMaterial3Position,
          },
        },
        byProduct: {
          batchNumber: values.byProductBatchNumber,
          quantity: values.byProductQuantity,
          position: values.byProductPosition,
        },
        additives: {
          batchNumber: values.additivesBatchNumber,
          quantity: values.additivesQuantity,
          position: values.additivesPosition,
        },
        lotNumber: values.lotNumber,
        notes: values.notes,
      };

      if (currentRecord) {
        await update({ ...newRecord, _id: currentRecord._id });

        messageApi.success("Процесс успешно обновлен");
      } else {
        await create(newRecord);
        messageApi.success("Процесс успешно создан");
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = async (id: string) => {
    await remove(id).unwrap();
    messageApi.success("Процесс успешно удален");
  };

  const columns: ColumnsType<ProcessData> = [
    {
      title: "ID номер заказа",
      dataIndex: "orderId",
      key: "orderId",
      width: 120,
    },
    {
      title: "Основной компонент",
      children: [
        {
          title: "Основное сырье 1",
          children: [
            {
              title: "Номер партии",
              dataIndex: ["mainComponent", "rawMaterial1", "batchNumber"],
              key: "rawMaterial1BatchNumber",
              width: 100,
            },
            {
              title: "Кол-во (тн)",
              dataIndex: ["mainComponent", "rawMaterial1", "quantity"],
              key: "rawMaterial1Quantity",
              width: 100,
            },
            {
              title: "Позиция",
              dataIndex: ["mainComponent", "rawMaterial1", "position"],
              key: "rawMaterial1Position",
              width: 100,
            },
          ],
        },
        {
          title: "Основное сырье 2",
          children: [
            {
              title: "Номер партии",
              dataIndex: ["mainComponent", "rawMaterial2", "batchNumber"],
              key: "rawMaterial2BatchNumber",
              width: 100,
            },
            {
              title: "Кол-во (тн)",
              dataIndex: ["mainComponent", "rawMaterial2", "quantity"],
              key: "rawMaterial2Quantity",
              width: 100,
            },
            {
              title: "Позиция",
              dataIndex: ["mainComponent", "rawMaterial2", "position"],
              key: "rawMaterial2Position",
              width: 100,
            },
          ],
        },
        {
          title: "Основное сырье 3",
          children: [
            {
              title: "Номер партии",
              dataIndex: ["mainComponent", "rawMaterial3", "batchNumber"],
              key: "rawMaterial3BatchNumber",
              width: 100,
            },
            {
              title: "Кол-во (тн)",
              dataIndex: ["mainComponent", "rawMaterial3", "quantity"],
              key: "rawMaterial3Quantity",
              width: 100,
            },
            {
              title: "Позиция",
              dataIndex: ["mainComponent", "rawMaterial3", "position"],
              key: "rawMaterial3Position",
              width: 100,
            },
          ],
        },
      ],
    },
    {
      title: "Побочный продукт VTR-70",
      children: [
        {
          title: "Номер партии",
          dataIndex: ["byProduct", "batchNumber"],
          key: "byProductBatchNumber",
          width: 100,
        },
        {
          title: "Кол-во (тн)",
          dataIndex: ["byProduct", "quantity"],
          key: "byProductQuantity",
          width: 100,
        },
        {
          title: "Позиция",
          dataIndex: ["byProduct", "position"],
          key: "byProductPosition",
          width: 100,
        },
      ],
    },
    {
      title: "Присадка & Химикаты",
      children: [
        {
          title: "Номер партии",
          dataIndex: ["additives", "batchNumber"],
          key: "additivesBatchNumber",
          width: 100,
        },
        {
          title: "Кол-во (тн)",
          dataIndex: ["additives", "quantity"],
          key: "additivesQuantity",
          width: 100,
        },
        {
          title: "Позиция",
          dataIndex: ["additives", "position"],
          key: "additivesPosition",
          width: 100,
        },
      ],
    },
    {
      title: "LOT number",
      dataIndex: "lotNumber",
      key: "lotNumber",
      width: 120,
    },
    {
      title: "Примечание",
      dataIndex: "notes",
      key: "notes",
      width: 150,
    },
    {
      title: "Действия",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showModal(record, true)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record, false)}
          />
          <Popconfirm
            title="Вы уверены, что хотите удалить этот процесс?"
            onConfirm={() => handleDelete(record._id!)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Процессы</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Поиск по ID или LOT номеру"
            prefix={<SearchOutlined />}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Создать новый
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data || []}
        loading={isFetching}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        bordered
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          isViewMode
            ? "Просмотр процесса"
            : currentRecord
            ? "Редактировать процесс"
            : "Создать новый процесс"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          isViewMode
            ? [
                <Button key="back" onClick={handleCancel}>
                  Закрыть
                </Button>,
              ]
            : [
                <Button key="back" onClick={handleCancel}>
                  Отмена
                </Button>,
                <Button
                  loading={updateLoading || createLoading}
                  key="submit"
                  type="primary"
                  onClick={handleSubmit}
                >
                  {currentRecord ? "Обновить" : "Создать"}
                </Button>,
              ]
        }
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={isViewMode}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Form.Item
            name="lotNumber"
            label="LOT number"
            className="col-span-3"
            rules={[{ required: true }]}
          >
            <Input placeholder="Например: L0512323" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Примечание"
            className="col-span-3"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Дополнительная информация" />
          </Form.Item>

          {/* Main Component - Raw Material 1 */}
          <div className="col-span-3">
            <h3 className="font-bold mb-2">Основное сырье 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="rawMaterial1BatchNumber"
                label="Номер партии"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: L-1" />
              </Form.Item>
              <Form.Item
                name="rawMaterial1Quantity"
                label="Кол-во (тн)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} placeholder="15" className="w-full" />
              </Form.Item>
              <Form.Item
                name="rawMaterial1Position"
                label="Позиция"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: Склад-ОС-1" />
              </Form.Item>
            </div>
          </div>

          {/* Main Component - Raw Material 2 */}
          <div className="col-span-3">
            <h3 className="font-bold mb-2">Основное сырье 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="rawMaterial2BatchNumber"
                label="Номер партии"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: L-2" />
              </Form.Item>
              <Form.Item
                name="rawMaterial2Quantity"
                label="Кол-во (тн)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} placeholder="2" className="w-full" />
              </Form.Item>
              <Form.Item
                name="rawMaterial2Position"
                label="Позиция"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: Склад-ОС-2" />
              </Form.Item>
            </div>
          </div>

          {/* Main Component - Raw Material 3 */}
          <div className="col-span-3">
            <h3 className="font-bold mb-2">Основное сырье 3</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="rawMaterial3BatchNumber"
                label="Номер партии"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: L-3" />
              </Form.Item>
              <Form.Item
                name="rawMaterial3Quantity"
                label="Кол-во (тн)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} placeholder="5" className="w-full" />
              </Form.Item>
              <Form.Item
                name="rawMaterial3Position"
                label="Позиция"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: Склад-ОС-3" />
              </Form.Item>
            </div>
          </div>

          {/* By-product VTR-70 */}
          <div className="col-span-3">
            <h3 className="font-bold mb-2">Побочный продукт VTR-70</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="byProductBatchNumber"
                label="Номер партии"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: L-PP-001" />
              </Form.Item>
              <Form.Item
                name="byProductQuantity"
                label="Кол-во (тн)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  placeholder="0.5"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                name="byProductPosition"
                label="Позиция"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: Склад-ПП-1" />
              </Form.Item>
            </div>
          </div>

          {/* Additives & Chemicals */}
          <div className="col-span-3">
            <h3 className="font-bold mb-2">Присадка & Химикаты</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="additivesBatchNumber"
                label="Номер партии"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: L-PP-001" />
              </Form.Item>
              <Form.Item
                name="additivesQuantity"
                label="Кол-во (тн)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  placeholder="0.1"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                name="additivesPosition"
                label="Позиция"
                rules={[{ required: true }]}
              >
                <Input placeholder="Например: Склад-ПР-1" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
