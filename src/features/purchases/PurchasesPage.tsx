import { useTranslation } from "react-i18next";
import { Button, Table } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";

interface DataType {
  key: string;
  receiptDate: string;
  invoiceNumber: string;
  supplier: string;
  rawMaterialName: string;
  id: string;
  unitOfMeasurement: string;
  quantity: number;
  pricePerUnit: number;
  sum: number;
  lotBatch: string;
  expirationDate: string;
  manufacturer: string;
  certificate: string;
  labResults: {
    penetration: number;
    viscosity: number;
    softeningTemperature: number;
    dropPoint: number;
    temperature: number;
  };
  comments: string;
}

const data: DataType[] = [
  {
    key: "1",
    receiptDate: "01.01.2023",
    invoiceNumber: "12345",
    supplier: "Supplier A",
    rawMaterialName: "Raw Material 1",
    id: "ID001",
    unitOfMeasurement: "kg",
    quantity: 100,
    pricePerUnit: 10.5,
    sum: 1050,
    lotBatch: "LOT123",
    expirationDate: "01.01.2024",
    manufacturer: "Manufacturer X",
    certificate: "CERT-001",
    labResults: {
      penetration: 25,
      viscosity: 150,
      softeningTemperature: 85,
      dropPoint: 90,
      temperature: 25,
    },
    comments: "Sample comment",
  },
  {
    key: "2",
    receiptDate: "02.01.2023",
    invoiceNumber: "12346",
    supplier: "Supplier B",
    rawMaterialName: "Raw Material 2",
    id: "ID002",
    unitOfMeasurement: "l",
    quantity: 50,
    pricePerUnit: 20,
    sum: 1000,
    lotBatch: "LOT124",
    expirationDate: "02.01.2024",
    manufacturer: "Manufacturer Y",
    certificate: "CERT-002",
    labResults: {
      penetration: 30,
      viscosity: 180,
      softeningTemperature: 80,
      dropPoint: 85,
      temperature: 25,
    },
    comments: "Another comment",
  },
];

export function PurchasePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnsType<DataType> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: "Дата поступления",
      dataIndex: "receiptDate",
      key: "receiptDate",
      width: 120,
    },
    {
      title: "Номер накладной",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 120,
    },
    {
      title: "Поставщик",
      dataIndex: "supplier",
      key: "supplier",
      width: 120,
    },
    {
      title: "Наименование сырья",
      dataIndex: "rawMaterialName",
      key: "rawMaterialName",
      width: 150,
    },
    {
      title: "ID (классификатор)",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Единица измерения",
      dataIndex: "unitOfMeasurement",
      key: "unitOfMeasurement",
      width: 120,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Цена за единицу",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      width: 120,
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      key: "sum",
      width: 100,
    },
    {
      title: "Лот/Партия",
      dataIndex: "lotBatch",
      key: "lotBatch",
      width: 100,
    },
    {
      title: "Срок годности",
      dataIndex: "expirationDate",
      key: "expirationDate",
      width: 120,
    },
    {
      title: "Производитель",
      dataIndex: "manufacturer",
      key: "manufacturer",
      width: 120,
    },
    {
      title: "Сертификат",
      dataIndex: "certificate",
      key: "certificate",
      width: 100,
    },
    {
      title: "Результаты лабораторного анализа",
      children: [
        {
          title: "Пенетрация",
          dataIndex: ["labResults", "penetration"],
          key: "penetration",
          width: 100,
        },
        {
          title: "Вязкость",
          dataIndex: ["labResults", "viscosity"],
          key: "viscosity",
          width: 100,
        },
        {
          title: "Температура размягчения",
          dataIndex: ["labResults", "softeningTemperature"],
          key: "softeningTemperature",
          width: 150,
        },
        {
          title: "Точка падения",
          dataIndex: ["labResults", "dropPoint"],
          key: "dropPoint",
          width: 120,
        },
        {
          title: "Температура",
          dataIndex: ["labResults", "temperature"],
          key: "temperature",
          width: 100,
        },
      ],
    },
    {
      title: "Комментарии",
      dataIndex: "comments",
      key: "comments",
      width: 150,
    },
    {
      title: t("actions"),
      key: "actions",
      width: 80,
      align: "right",
      fixed: "right",
      render: () => (
        <div className="flex items-center gap-2">
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">{t("purchases")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/warehouse/purchase-orders/new")}
          >
            {t("newPurchase")}
          </Button>
        </div>
      </div>

      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `${t("total")}: ${total}`,
        }}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
