"use client";

import { useState } from "react";
import { Table, Tag, Input, Button, DatePicker, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProductionData {
  key: string;
  lot: string;
  productName: string;
  addedLmp: string;
  month: string;
  year: number;
  productionAmount: number;
  batchLmp: number;
  penetration: number;
  viscosity: number;
  drippingTemp: number;
  bagType: string;
  purchasingCompany: string;
  loadingType: string;
  status: string;
  shippedAmount: number;
  remainingPaper: string;
  factoryExitDate: string;
}

// Sample data based on the image
const initialProductions: ProductionData[] = [
  {
    key: "1",
    lot: "L001123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 39,
    penetration: 12.325,
    viscosity: 7.97,
    drippingTemp: 114.5,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "16-02-23",
  },
  {
    key: "2",
    lot: "L002123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 39,
    penetration: 10.24,
    viscosity: 8.55,
    drippingTemp: 113.2,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "16-02-23",
  },
  {
    key: "3",
    lot: "L003123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 39,
    penetration: 12.1,
    viscosity: 7.79,
    drippingTemp: 113.76,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "16-02-23",
  },
  {
    key: "4",
    lot: "L004123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 39,
    penetration: 10,
    viscosity: 9.01,
    drippingTemp: 115.52,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "19-02-23",
  },
  {
    key: "5",
    lot: "L005123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 40,
    penetration: 12.75,
    viscosity: 5.85,
    drippingTemp: 109.96,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "19-02-23",
  },
  {
    key: "6",
    lot: "L006123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 40,
    penetration: 14,
    viscosity: 5.38,
    drippingTemp: 106.1,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "19-02-23",
  },
  {
    key: "7",
    lot: "L007123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 40,
    penetration: 12.5,
    viscosity: 7.21,
    drippingTemp: 114.68,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "21-02-23",
  },
  {
    key: "8",
    lot: "L017123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Январь",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 1,
    penetration: 11.67,
    viscosity: 7.29,
    drippingTemp: 114.3,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "03-03-23",
  },
  {
    key: "9",
    lot: "L018123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Февраль",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 1,
    penetration: 12.8,
    viscosity: 8.55,
    drippingTemp: 114.4,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "03-03-23",
  },
  {
    key: "10",
    lot: "L019123",
    productName: "(FC)2/1",
    addedLmp: "",
    month: "Февраль",
    year: 2023,
    productionAmount: 21.5,
    batchLmp: 1,
    penetration: 11.67,
    viscosity: 7.29,
    drippingTemp: 114.3,
    bagType: "oq qop",
    purchasingCompany: "Akdeniz",
    loadingType: "Паллет",
    status: "Отгружено",
    shippedAmount: 21.5,
    remainingPaper: "",
    factoryExitDate: "03-03-23",
  },
];

export function ProductionTable() {
  const [productions, setProductions] = useState(initialProductions);
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey?: string;
    order?: "ascend" | "descend";
  }>({});

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value === "") {
      setProductions(initialProductions);
      return;
    }

    const filtered = initialProductions.filter(
      (item) =>
        item.lot.toLowerCase().includes(value.toLowerCase()) ||
        item.productName.toLowerCase().includes(value.toLowerCase()) ||
        item.purchasingCompany.toLowerCase().includes(value.toLowerCase())
    );
    setProductions(filtered);
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
    setProductions(initialProductions);
  };

  const columns: ColumnsType<ProductionData> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: "LOT",
      dataIndex: "lot",
      key: "lot",
      width: 100,
      sorter: (a, b) => a.lot.localeCompare(b.lot),
      sortOrder: sortedInfo.columnKey === "lot" ? sortedInfo.order : null,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: 120,
      filters: [{ text: "(FC)2/1", value: "(FC)2/1" }],
      filteredValue: filteredInfo.productName || null,
      onFilter: (value, record) =>
        record.productName.includes(value.toString()),
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 100,
      filters: [
        { text: "Январь", value: "Январь" },
        { text: "Февраль", value: "Февраль" },
      ],
      filteredValue: filteredInfo.month || null,
      onFilter: (value, record) => record.month.includes(value.toString()),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 80,
    },
    {
      title: "Production (tons)",
      dataIndex: "productionAmount",
      key: "productionAmount",
      width: 140,
      sorter: (a, b) => a.productionAmount - b.productionAmount,
      sortOrder:
        sortedInfo.columnKey === "productionAmount" ? sortedInfo.order : null,
    },
    {
      title: "Batch LMP",
      dataIndex: "batchLmp",
      key: "batchLmp",
      width: 100,
    },
    {
      title: "Penetration",
      dataIndex: "penetration",
      key: "penetration",
      width: 120,
    },
    {
      title: "Viscosity",
      dataIndex: "viscosity",
      key: "viscosity",
      width: 100,
    },
    {
      title: "Dripping Temp (°C)",
      dataIndex: "drippingTemp",
      key: "drippingTemp",
      width: 150,
    },
    {
      title: "Bag Type",
      dataIndex: "bagType",
      key: "bagType",
      width: 100,
    },
    {
      title: "Purchasing Company",
      dataIndex: "purchasingCompany",
      key: "purchasingCompany",
      width: 180,
      filters: [{ text: "Akdeniz", value: "Akdeniz" }],
      filteredValue: filteredInfo.purchasingCompany || null,
      onFilter: (value, record) =>
        record.purchasingCompany.includes(value.toString()),
    },
    {
      title: "Loading Type",
      dataIndex: "loadingType",
      key: "loadingType",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "Отгружено" ? "green" : "blue"}>{status}</Tag>
      ),
      filters: [{ text: "Отгружено", value: "Отгружено" }],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value.toString()),
    },
    {
      title: "Shipped Amount",
      dataIndex: "shippedAmount",
      key: "shippedAmount",
      width: 140,
    },
    {
      title: "Factory Exit Date",
      dataIndex: "factoryExitDate",
      key: "factoryExitDate",
      width: 150,
      sorter: (a, b) => a.factoryExitDate.localeCompare(b.factoryExitDate),
      sortOrder:
        sortedInfo.columnKey === "factoryExitDate" ? sortedInfo.order : null,
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
            placeholder="Search by LOT, product name, or company"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button icon={<FilterOutlined />} onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <span>Date Range:</span>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">All Status</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="pending">Pending</Option>
          </Select>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={productions}
        onChange={handleChange}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        summary={(pageData) => {
          let totalProduction = 0;
          let totalShipped = 0;

          pageData.forEach(({ productionAmount, shippedAmount }) => {
            totalProduction += productionAmount;
            totalShipped += shippedAmount;
          });

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totalProduction.toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={8}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong>{totalShipped.toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
}
