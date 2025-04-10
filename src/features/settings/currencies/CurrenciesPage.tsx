"use client";

import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { CurrencyDTO } from "./currency.dto";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useDeleteCurrencyMutation,
  useGetCurrenciesQuery,
} from "@/app/store/services/settings.api";
import CurrencyFormModal from "./CurrencyForm";
import Search from "antd/es/input/Search";

export function CurrenciesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const {
    data: currencies,
    isLoading,
    isError,
    refetch,
  } = useGetCurrenciesQuery();
  const [deleteCurrency, { isLoading: isDeleting }] =
    useDeleteCurrencyMutation();

  const handleEdit = (code: string) => {
    searchParams.set("editCurrencyCode", code);
    setSearchParams(searchParams);
  };

  const handleDelete = async (code: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteCurrency(code).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<CurrencyDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "code",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("code"),
      dataIndex: "code",
      key: "code",
      width: 100,
      sorter: (a: CurrencyDTO, b: CurrencyDTO) => a.code.localeCompare(b.code),
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 200,
      sorter: (a: CurrencyDTO, b: CurrencyDTO) => a.name.localeCompare(b.name),
    },
    {
      title: t("symbol"),
      dataIndex: "symbol",
      key: "symbol",
      width: 100,
      align: "center",
    },
    {
      title: t("exchangeRate"),
      dataIndex: "exchangeRateToBase",
      key: "exchangeRateToBase",
      width: 150,
      align: "right",
      render: (rate) => (rate ? rate.toFixed(4) : "-"),
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {t(isActive ? "active" : "inactive")}
        </Tag>
      ),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      align: "right",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("actions"),
      key: "actions",
      width: 80,
      align: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            loading={isDeleting}
          />
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t("failedToLoadData")}</p>
          <Button onClick={() => refetch()}>{t("tryAgain")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-sans font-bold text-2xl">{t("currencies")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <CurrencyFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id}
        dataSource={currencies || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
