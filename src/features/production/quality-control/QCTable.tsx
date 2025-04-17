"use client";

import { useState } from "react";
import { Table, Input, Button, DatePicker, Select, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface QualityControlData {
  key: string;
  id: number;
  date: string;
  product: string;
  quantity: number;
  penetrationGeneral: number;
  penetration1: number;
  penetration2: number;
  penetration3: number;
  penetrationAvg: number;
  viscosityGeneral: number;
  viscosity1: number;
  viscosity2: number;
  viscosity3: number;
  viscosityAvg: number;
  meltingTemp1: number | null;
  meltingTemp2: number | null;
  meltingTemp3: number | null;
  meltingTempAvg: number | null;
  dropTemp1: number | null;
  dropTemp2: number | null;
  dropTemp3: number | null;
  dropTempAvg: number | null;
  notes: string;
}

// Sample data based on the image
const initialQualityControls: QualityControlData[] = [
  {
    key: "1",
    id: 1,
    date: "13-12-21",
    product: "VTS-114 (LMP 0% Сол.)",
    quantity: 20,
    penetrationGeneral: 3.0,
    penetration1: 3.0,
    penetration2: 3.0,
    penetration3: 3.0,
    penetrationAvg: 3.0,
    viscosityGeneral: 20.08,
    viscosity1: 20.08,
    viscosity2: 21.08,
    viscosity3: 21.04,
    viscosityAvg: 20.73,
    meltingTemp1: 140.0,
    meltingTemp2: 140.0,
    meltingTemp3: 140.0,
    meltingTempAvg: 140.0,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
  {
    key: "2",
    id: 2,
    date: "17-12-21",
    product: "VTS-114 (LMP 0% Сол.)",
    quantity: 27,
    penetrationGeneral: 3.0,
    penetration1: 3.0,
    penetration2: 3.0,
    penetration3: 3.0,
    penetrationAvg: 3.0,
    viscosityGeneral: 19.8,
    viscosity1: 19.8,
    viscosity2: 19.74,
    viscosity3: 19.12,
    viscosityAvg: 19.55,
    meltingTemp1: 140.0,
    meltingTemp2: 135.0,
    meltingTemp3: 140.0,
    meltingTempAvg: 138.33,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
  {
    key: "3",
    id: 3,
    date: "17-12-21",
    product: "VTS-115 (LMP 0.5 %)",
    quantity: 13.5,
    penetrationGeneral: 2.0,
    penetration1: 2.0,
    penetration2: 2.0,
    penetration3: 2.0,
    penetrationAvg: 2.0,
    viscosityGeneral: 38.0,
    viscosity1: 36.76,
    viscosity2: 35.57,
    viscosity3: 36.11,
    viscosityAvg: 36.15,
    meltingTemp1: 150.0,
    meltingTemp2: 150.0,
    meltingTemp3: 150.0,
    meltingTempAvg: 150.0,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
  {
    key: "4",
    id: 4,
    date: "22-01-22",
    product: "VTS-112 (LMP 0% Сол.)",
    quantity: 20.13,
    penetrationGeneral: 6.5,
    penetration1: 6.0,
    penetration2: 6.5,
    penetration3: 6.5,
    penetrationAvg: 6.33,
    viscosityGeneral: 13.0,
    viscosity1: 13.76,
    viscosity2: 13.72,
    viscosity3: 13.61,
    viscosityAvg: 13.7,
    meltingTemp1: 130.0,
    meltingTemp2: 130.0,
    meltingTemp3: 130.0,
    meltingTempAvg: 130.0,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
  {
    key: "5",
    id: 5,
    date: "22-01-22",
    product: "VTS-114 (LMP 0%)",
    quantity: 18.22,
    penetrationGeneral: 3.5,
    penetration1: 3.5,
    penetration2: 3.5,
    penetration3: 3.5,
    penetrationAvg: 3.5,
    viscosityGeneral: 19.0,
    viscosity1: 19.0,
    viscosity2: 19.52,
    viscosity3: 19.3,
    viscosityAvg: 19.27,
    meltingTemp1: null,
    meltingTemp2: null,
    meltingTemp3: null,
    meltingTempAvg: null,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
  {
    key: "6",
    id: 6,
    date: "22-01-22",
    product: "VTS-117 (LMP 10%)",
    quantity: 9.171,
    penetrationGeneral: 2.0,
    penetration1: 2.0,
    penetration2: 2.0,
    penetration3: 2.0,
    penetrationAvg: 2.0,
    viscosityGeneral: 16.5,
    viscosity1: 16.52,
    viscosity2: 17.02,
    viscosity3: 17.03,
    viscosityAvg: 16.85,
    meltingTemp1: null,
    meltingTemp2: null,
    meltingTemp3: null,
    meltingTempAvg: null,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
  {
    key: "7",
    id: 7,
    date: "04-02-22",
    product: "VTS-114(0%)(2.15ОПЗФА)",
    quantity: 40,
    penetrationGeneral: 3.5,
    penetration1: 4.0,
    penetration2: 3.5,
    penetration3: 4.0,
    penetrationAvg: 3.83,
    viscosityGeneral: 19.51,
    viscosity1: 19.5,
    viscosity2: 19.8,
    viscosity3: 19.64,
    viscosityAvg: 19.65,
    meltingTemp1: null,
    meltingTemp2: null,
    meltingTemp3: null,
    meltingTempAvg: null,
    dropTemp1: null,
    dropTemp2: null,
    dropTemp3: null,
    dropTempAvg: null,
    notes: "",
  },
];

export function QualityControlTable() {
  const [qualityControls, setQualityControls] = useState(
    initialQualityControls
  );
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey?: string;
    order?: "ascend" | "descend";
  }>({});

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value === "") {
      setQualityControls(initialQualityControls);
      return;
    }

    const filtered = initialQualityControls.filter(
      (item) =>
        item.product.toLowerCase().includes(value.toLowerCase()) ||
        item.date.toLowerCase().includes(value.toLowerCase())
    );
    setQualityControls(filtered);
  };

  const handleChange = (
    _pagination: any,
    filters: Record<string, any>,
    sorter: any
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText("");
    setQualityControls(initialQualityControls);
  };

  const columns: ColumnsType<QualityControlData> = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      width: 100,
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortOrder: sortedInfo.columnKey === "date" ? sortedInfo.order : null,
    },
    {
      title: "Продукт",
      dataIndex: "product",
      key: "product",
      width: 180,
      filters: Array.from(
        new Set(initialQualityControls.map((item) => item.product))
      ).map((product) => ({
        text: product,
        value: product,
      })),
      filteredValue: filteredInfo.product || null,
      onFilter: (value, record) => record.product.includes(value.toString()),
    },
    {
      title: "Кол-во (тонн)",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      sorter: (a, b) => a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
    },
    {
      title: () => (
        <span>
          Проникновение (P)
          <Tooltip title="Значения проникновения в 1/10 мм">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      children: [
        {
          title: "Общий",
          dataIndex: "penetrationGeneral",
          key: "penetrationGeneral",
          width: 100,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "#1",
          dataIndex: "penetration1",
          key: "penetration1",
          width: 80,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "#2",
          dataIndex: "penetration2",
          key: "penetration2",
          width: 80,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "#3",
          dataIndex: "penetration3",
          key: "penetration3",
          width: 80,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "Среднее",
          dataIndex: "penetrationAvg",
          key: "penetrationAvg",
          width: 100,
          render: (value) => value?.toFixed(2),
        },
      ],
    },
    {
      title: () => (
        <span>
          Вязкость (mPa*s)
          <Tooltip title="Значения вязкости в mPa*s">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      children: [
        {
          title: "Общий",
          dataIndex: "viscosityGeneral",
          key: "viscosityGeneral",
          width: 100,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "#1",
          dataIndex: "viscosity1",
          key: "viscosity1",
          width: 80,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "#2",
          dataIndex: "viscosity2",
          key: "viscosity2",
          width: 80,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "#3",
          dataIndex: "viscosity3",
          key: "viscosity3",
          width: 80,
          render: (value) => value?.toFixed(2),
        },
        {
          title: "Среднее",
          dataIndex: "viscosityAvg",
          key: "viscosityAvg",
          width: 100,
          render: (value) => value?.toFixed(2),
        },
      ],
    },
    {
      title: () => (
        <span>
          Температура размягчения (°C)
          <Tooltip title="Температура размягчения в градусах Цельсия">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      children: [
        {
          title: "#1",
          dataIndex: "meltingTemp1",
          key: "meltingTemp1",
          width: 80,
          render: (value) => value?.toFixed(2) || "-",
        },
        {
          title: "#2",
          dataIndex: "meltingTemp2",
          key: "meltingTemp2",
          width: 80,
          render: (value) => value?.toFixed(2) || "-",
        },
        {
          title: "#3",
          dataIndex: "meltingTemp3",
          key: "meltingTemp3",
          width: 80,
          render: (value) => value?.toFixed(2) || "-",
        },
        {
          title: "Среднее",
          dataIndex: "meltingTempAvg",
          key: "meltingTempAvg",
          width: 100,
          render: (value) => value?.toFixed(2) || "-",
        },
      ],
    },
    {
      title: () => (
        <span>
          Температура каплепадения (°C)
          <Tooltip title="Температура каплепадения в градусах Цельсия">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      children: [
        {
          title: "#1",
          dataIndex: "dropTemp1",
          key: "dropTemp1",
          width: 80,
          render: (value) => value?.toFixed(2) || "-",
        },
        {
          title: "#2",
          dataIndex: "dropTemp2",
          key: "dropTemp2",
          width: 80,
          render: (value) => value?.toFixed(2) || "-",
        },
        {
          title: "#3",
          dataIndex: "dropTemp3",
          key: "dropTemp3",
          width: 80,
          render: (value) => value?.toFixed(2) || "-",
        },
        {
          title: "Среднее",
          dataIndex: "dropTempAvg",
          key: "dropTempAvg",
          width: 100,
          render: (value) => value?.toFixed(2) || "-",
        },
      ],
    },
    {
      title: "Примечание",
      dataIndex: "notes",
      key: "notes",
      width: 150,
    },
    {
      title: "Действии", // actions
      key: "actions",
      width: 80,
      align: "right",
      fixed: "right",
      render: (_) => (
        <div className="flex items-center gap-2">
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Поиск по продукту или дате"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button icon={<FilterOutlined />} onClick={clearFilters}>
            Очистить фильтры
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <span>Диапазон дат:</span>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">Все продукты</Option>
            {Array.from(
              new Set(initialQualityControls.map((item) => item.product))
            ).map((product) => (
              <Option key={product} value={product}>
                {product}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={qualityControls}
        onChange={handleChange}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        summary={(pageData) => {
          let totalQuantity = 0;
          let avgPenetration = 0;
          let avgViscosity = 0;
          const count = pageData.length;

          pageData.forEach(({ quantity, penetrationAvg, viscosityAvg }) => {
            totalQuantity += quantity;
            avgPenetration += penetrationAvg || 0;
            avgViscosity += viscosityAvg || 0;
          });

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  Итого / Среднее
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totalQuantity.toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong>{(avgPenetration / count).toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <strong>{(avgViscosity / count).toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={8}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
}
