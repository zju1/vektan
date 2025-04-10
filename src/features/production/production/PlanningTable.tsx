"use client";

import { useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface OrderData {
  key: string;
  uzlmp: string;
  i01: string;
  m01: string;
  c01: string;
  vtr70: string;
  date: string;
  cargo: string;
  country: string;
  city: string;
  brand: string;
  quantity: number;
  loading: string;
  container: number;
  furs: string;
  status: string;
  statusPercent: string;
  shippingDate: string;
  shippingLocation: string;
  orderConfirmation: string;
}

// Sample data based on the image
const initialOrders: OrderData[] = [
  {
    key: "1",
    uzlmp: "",
    i01: "40%",
    m01: "60%",
    c01: "",
    vtr70: "",
    date: "01.03.25",
    cargo: "СТиМ Брест",
    country: "Белоруссия",
    city: "Брест",
    brand: "VTS-114 PR 20 кг меш.",
    quantity: 20,
    loading: "Паллет",
    container: 1,
    furs: "",
    status: "Отгружено",
    statusPercent: "100%",
    shippingDate: "03.03.25",
    shippingLocation: "",
    orderConfirmation: "",
  },
  {
    key: "2",
    uzlmp: "",
    i01: "30%",
    m01: "65%",
    c01: "5%",
    vtr70: "",
    date: "03.03.25",
    cargo: "Akdeniz Chemson",
    country: "Австрия",
    city: "Арнольдштейн",
    brand: "VT-110 P - 500 кг",
    quantity: 20,
    loading: "Паллет",
    container: 1,
    furs: "",
    status: "Отгружено",
    statusPercent: "100%",
    shippingDate: "04.03.25",
    shippingLocation: "",
    orderConfirmation: "",
  },
  {
    key: "3",
    uzlmp: "90%",
    i01: "",
    m01: "",
    c01: "",
    vtr70: "10%",
    date: "06.03.25",
    cargo: "Константа Плюс",
    country: "Россия",
    city: "Москва",
    brand: "VTS-110 (P) - 25 кг bags",
    quantity: 20,
    loading: "Паллет",
    container: 1,
    furs: "",
    status: "Отгружено",
    statusPercent: "100%",
    shippingDate: "05.03.25",
    shippingLocation: "",
    orderConfirmation: "",
  },
  {
    key: "4",
    uzlmp: "90%",
    i01: "",
    m01: "",
    c01: "",
    vtr70: "10%",
    date: "05.03.25",
    cargo: "EQUITEE",
    country: "США",
    city: "Чарлстон",
    brand: "VT-110 (P) in BIG BAGS 550",
    quantity: 20,
    loading: "Паллет",
    container: 1,
    furs: "",
    status: "Отгружено",
    statusPercent: "100%",
    shippingDate: "06.03.25",
    shippingLocation: "",
    orderConfirmation: "",
  },
  {
    key: "5",
    uzlmp: "90%",
    i01: "",
    m01: "",
    c01: "",
    vtr70: "10%",
    date: "07.03.25",
    cargo: "EQUITEE",
    country: "США",
    city: "Чарлстон",
    brand: "VT-110 (P) in small bags 25",
    quantity: 22,
    loading: "Паллет",
    container: 1,
    furs: "",
    status: "Отгружено",
    statusPercent: "100%",
    shippingDate: "07.03.25",
    shippingLocation: "",
    orderConfirmation: "",
  },
];

export default function ProductionPlanningTable() {
  const [orders] = useState(initialOrders);

  const columns: ColumnsType<OrderData> = [
    {
      title: "УЗЛМП",
      dataIndex: "uzlmp",
      key: "uzlmp",
      width: 80,
    },
    {
      title: "И-01",
      dataIndex: "i01",
      key: "i01",
      width: 80,
    },
    {
      title: "М-01",
      dataIndex: "m01",
      key: "m01",
      width: 80,
    },
    {
      title: "С-01",
      dataIndex: "c01",
      key: "c01",
      width: 80,
    },
    {
      title: "ВТР-70",
      dataIndex: "vtr70",
      key: "vtr70",
      width: 80,
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "Грузополучатель",
      dataIndex: "cargo",
      key: "cargo",
      width: 150,
    },
    {
      title: "Страна",
      dataIndex: "country",
      key: "country",
      width: 120,
    },
    {
      title: "Город",
      dataIndex: "city",
      key: "city",
      width: 120,
    },
    {
      title: "Марка/Тип мешка",
      dataIndex: "brand",
      key: "brand",
      width: 200,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Загрузка",
      dataIndex: "loading",
      key: "loading",
      width: 100,
    },
    {
      title: "Контейнер",
      dataIndex: "container",
      key: "container",
      width: 100,
    },
    {
      title: "Фурс",
      dataIndex: "furs",
      key: "furs",
      width: 80,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "Отгружено" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Статус %",
      dataIndex: "statusPercent",
      key: "statusPercent",
      width: 100,
    },
    {
      title: "Дата отгрузки",
      dataIndex: "shippingDate",
      key: "shippingDate",
      width: 120,
    },
    {
      title: "Место отгрузки",
      dataIndex: "shippingLocation",
      key: "shippingLocation",
      width: 150,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      scroll={{ x: "max-content" }}
      pagination={false}
      bordered
      size="middle"
    />
  );
}
