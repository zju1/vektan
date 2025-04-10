import { useTranslation } from "react-i18next";
import { Button, Table, Tag, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { LogisticsDTO } from "./logistics.dto";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import Search from "antd/es/input/Search";
import {
  useDeleteLogisticsCompanyMutation,
  useGetLogisticsCompaniesQuery,
} from "@/app/store/services/settings.api";
import LogisticsCompanyFormModal from "./LogisticsForm";

export function LogisticsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // API integration
  const {
    data: companies,
    isLoading,
    isError,
    refetch,
  } = useGetLogisticsCompaniesQuery();
  const [deleteCompany, { isLoading: isDeleting }] =
    useDeleteLogisticsCompanyMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editLogisticsCompanyId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteCompany(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const openWebsite = (url?: string) => {
    if (!url) return;

    // Add protocol if missing
    const websiteUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(websiteUrl, "_blank");
  };

  const columns: ColumnsType<LogisticsDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "_id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 180,
      sorter: (a: LogisticsDTO, b: LogisticsDTO) =>
        a.name.localeCompare(b.name),
    },
    {
      title: t("legalName"),
      dataIndex: "legalName",
      key: "legalName",
      width: 180,
      render: (legalName) => legalName || "-",
    },
    {
      title: t("contactEmail"),
      dataIndex: "contactEmail",
      key: "contactEmail",
      width: 180,
    },
    {
      title: t("contactPhone"),
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: 150,
    },
    {
      title: t("website"),
      dataIndex: "website",
      key: "website",
      width: 120,
      render: (website) =>
        website ? (
          <Button
            type="link"
            icon={<GlobalOutlined />}
            onClick={() => openWebsite(website)}
          >
            {t("visit")}
          </Button>
        ) : (
          "-"
        ),
    },
    {
      title: t("location"),
      dataIndex: "headquartersAddress",
      key: "location",
      width: 180,
      render: (address) =>
        address ? `${address.city}, ${address.country}` : "-",
    },
    {
      title: t("status"),
      dataIndex: "active",
      key: "active",
      width: 100,
      align: "center",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? t("active") : t("inactive")}
        </Tag>
      ),
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
            onClick={() => handleEdit(record._id!)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
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
      <h1 className="font-sans font-bold text-2xl">{t("logisticsServices")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <LogisticsCompanyFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id!}
        dataSource={companies || []}
        pagination={false}
        scroll={{ x: "max-content", y: "70dvh" }}
      />
    </div>
  );
}
