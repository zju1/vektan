"use client";

import { useState } from "react";
import { Table, Button, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface DataType {
  key: string;
  orderNumber: number;
  receiptDate: string;
  nomenclatureName: string;
  code: string;
  quantity: number;
  incomeExpense: string;
  expirationDate: string;
  price: number;
  supplier: string;
  typeOperation: string;
  creationDate: string;
  relationToOrder: string;
  storageLocation: string;
  responsible: string;
  qualityStatus: string;
  availabilityForUse: string;
  commentaryNote: string;
  relationToSystem: string;
  dateOfAddingToSystem: string;
  typeOfShipment: string;
  dateOfLastModification: string;
  additionalColumn1: string;
  additionalColumn2: string;
}

export function TransferOrders() {
  const [data, setData] = useState<DataType[]>(generateData(20));

  const handleView = (record: DataType) => {
    console.log("View record:", record);
    // Implement view logic
  };

  const handleEdit = (record: DataType) => {
    console.log("Edit record:", record);
    // Implement edit logic
  };

  const handleDelete = (record: DataType) => {
    console.log("Delete record:", record);
    // Implement delete logic
    setData(data.filter((item) => item.key !== record.key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "№",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 60,
      fixed: "left",
    },
    {
      title: "Основная информация",
      children: [
        {
          title: "Дата прихода",
          dataIndex: "receiptDate",
          key: "receiptDate",
          width: 120,
        },
        {
          title: "Наименование номенклатуры",
          dataIndex: "nomenclatureName",
          key: "nomenclatureName",
          width: 200,
        },
        {
          title: "Артикул (Классификатор)",
          dataIndex: "code",
          key: "code",
          width: 150,
        },
        {
          title: "Количество",
          dataIndex: "quantity",
          key: "quantity",
          width: 100,
        },
      ],
    },
    {
      title: "Движение",
      children: [
        {
          title: "Приход / Расход",
          dataIndex: "incomeExpense",
          key: "incomeExpense",
          width: 130,
        },
        {
          title: "Срок годности",
          dataIndex: "expirationDate",
          key: "expirationDate",
          width: 120,
        },
      ],
    },
    {
      title: "Финансовая информация",
      children: [
        {
          title: "Цена/стоим.",
          dataIndex: "price",
          key: "price",
          width: 120,
        },
        {
          title: "Поставщик",
          dataIndex: "supplier",
          key: "supplier",
          width: 150,
        },
      ],
    },
    {
      title: "Операция",
      children: [
        {
          title: "Тип операции",
          dataIndex: "typeOperation",
          key: "typeOperation",
          width: 120,
        },
        {
          title: "Основание / Документ",
          dataIndex: "creationDate",
          key: "creationDate",
          width: 150,
        },
        {
          title: "Дата",
          dataIndex: "creationDate",
          key: "creationDate",
          width: 100,
        },
      ],
    },
    {
      title: "Связи и статусы",
      children: [
        {
          title: "Связь с заказом / накладной",
          dataIndex: "relationToOrder",
          key: "relationToOrder",
          width: 180,
        },
        {
          title: "Статус перемещения",
          dataIndex: "storageLocation",
          key: "storageLocation",
          width: 150,
        },
        {
          title: "Ответственный за перемещение",
          dataIndex: "responsible",
          key: "responsible",
          width: 200,
        },
      ],
    },
    {
      title: "Качество и доступность",
      children: [
        {
          title: "КМФ о доступности использования",
          dataIndex: "availabilityForUse",
          key: "availabilityForUse",
          width: 220,
        },
        {
          title: "Комментарий / Примечание",
          dataIndex: "commentaryNote",
          key: "commentaryNote",
          width: 180,
        },
      ],
    },
    {
      title: "Системная информация",
      children: [
        {
          title: "Связь с системой",
          dataIndex: "relationToSystem",
          key: "relationToSystem",
          width: 130,
        },
        {
          title: "Дата проведения в системе",
          dataIndex: "dateOfAddingToSystem",
          key: "dateOfAddingToSystem",
          width: 180,
        },
        {
          title: "Тип отгрузки (отпуск, брак)",
          dataIndex: "typeOfShipment",
          key: "typeOfShipment",
          width: 200,
        },
        {
          title: "Дата последних изменений",
          dataIndex: "dateOfLastModification",
          key: "dateOfLastModification",
          width: 180,
        },
      ],
    },
    {
      title: "Дополнительно",
      children: [
        {
          title: "Дополнительный столбец",
          dataIndex: "additionalColumn1",
          key: "additionalColumn1",
          width: 180,
        },
        {
          title: "Дополнительный столбец",
          dataIndex: "additionalColumn2",
          key: "additionalColumn2",
          width: 180,
        },
      ],
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
            onClick={() => handleView(record)}
            title="Просмотр"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Редактировать"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            title="Удалить"
          />
        </Space>
      ),
    },
  ];
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">Перемещение товаров</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<DownloadOutlined className="size-4" />}>
            {t("export")}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/warehouse/transfer-orders/new")}
          >
            {t("newPurchase")}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
          size="small"
          bordered
        />
      </div>
    </div>
  );
}

// Generate fake data
function generateData(count: number): DataType[] {
  const data: DataType[] = [];
  const suppliers = [
    "ООО Поставщик",
    "АО Снабжение",
    "ИП Иванов",
    "ЗАО ТехноСнаб",
    "ООО ПромРесурс",
  ];
  const nomenclatures = [
    "Болт М6",
    "Гайка М8",
    "Шайба 10мм",
    "Подшипник 6204",
    "Вал 15х150",
    "Втулка 25х40",
    "Пружина 5х30",
  ];
  const operations = [
    "Приход",
    "Расход",
    "Перемещение",
    "Инвентаризация",
    "Списание",
  ];
  const statuses = ["Завершено", "В процессе", "Ожидание", "Отменено"];
  const responsibles = [
    "Иванов И.И.",
    "Петров П.П.",
    "Сидоров С.С.",
    "Кузнецов К.К.",
  ];
  const availabilities = [
    "Доступно",
    "Ограничено",
    "Недоступно",
    "На проверке",
  ];
  const shipmentTypes = [
    "Отпуск в производство",
    "Брак",
    "Возврат поставщику",
    "Перемещение",
  ];

  for (let i = 0; i < count; i++) {
    const receiptDate = randomDate(new Date(2023, 0, 1), new Date());
    const expirationDate = randomDate(receiptDate, new Date(2025, 11, 31));

    data.push({
      key: `${i}`,
      orderNumber: i + 1,
      receiptDate: formatDate(receiptDate),
      nomenclatureName:
        nomenclatures[Math.floor(Math.random() * nomenclatures.length)],
      code: `АРТ-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: Math.floor(1 + Math.random() * 1000),
      incomeExpense: Math.random() > 0.5 ? "Приход" : "Расход",
      expirationDate: formatDate(expirationDate),
      price: Number.parseFloat((100 + Math.random() * 10000).toFixed(2)),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      typeOperation: operations[Math.floor(Math.random() * operations.length)],
      creationDate: formatDate(randomDate(new Date(2023, 0, 1), receiptDate)),
      relationToOrder: `Заказ №${Math.floor(1000 + Math.random() * 9000)}`,
      storageLocation: statuses[Math.floor(Math.random() * statuses.length)],
      responsible:
        responsibles[Math.floor(Math.random() * responsibles.length)],
      qualityStatus: Math.random() > 0.7 ? "Требует проверки" : "Проверено",
      availabilityForUse:
        availabilities[Math.floor(Math.random() * availabilities.length)],
      commentaryNote: Math.random() > 0.7 ? "Комментарий к позиции" : "",
      relationToSystem: `Система-${Math.floor(100 + Math.random() * 900)}`,
      dateOfAddingToSystem: formatDate(randomDate(receiptDate, new Date())),
      typeOfShipment:
        shipmentTypes[Math.floor(Math.random() * shipmentTypes.length)],
      dateOfLastModification: formatDate(new Date()),
      additionalColumn1: Math.random() > 0.5 ? "Данные 1" : "",
      additionalColumn2: Math.random() > 0.5 ? "Данные 2" : "",
    });
  }

  return data;
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("ru-RU");
}
