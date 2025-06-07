import { useTranslation } from "react-i18next";
import { Button, Table, message, Modal } from "antd";
import { Download } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { CountryDTO } from "./countries.dto";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useDeleteCountryMutation,
  useGetCountriesQuery,
} from "@/app/store/services/settings.api";
import CountryFormModal from "./CountryForm";
import Search from "antd/es/input/Search";
import { CitiesDrawer } from "./CitiesDrawer";

export function CountriesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: countries,
    isLoading,
    isError,
    refetch,
  } = useGetCountriesQuery();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();

  const handleEdit = (id: string) => {
    searchParams.set("editCountryId", id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("warning"),
      content: t("deleteSure"),
      onOk: async () => {
        try {
          await deleteCountry(id).unwrap();
          message.success(t("deleted"));
        } catch (error) {
          message.error(t("errorOccured"));
        }
      },
    });
  };

  const columns: ColumnsType<CountryDTO> = [
    {
      title: "№",
      dataIndex: "index",
      key: "id",
      render: (_value, _record, index) => index + 1,
      width: 40,
      align: "center",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      minWidth: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("citiesCount"),
      dataIndex: "cityCount",
      key: "cityCount",
      width: 100,
      align: "center",
    },
    {
      title: t("code"),
      dataIndex: "code",
      key: "code",
      width: 100,
      align: "center",
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
            onClick={() => {
              searchParams.set("countryId", record._id);
              setSearchParams(searchParams);
            }}
            icon={<OrderedListOutlined />}
          />
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
      <h1 className="font-sans font-bold text-2xl">{t("countries")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Search placeholder={t("search")} />
        <div className="flex items-center justify-end gap-2">
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
          <CountryFormModal />
        </div>
      </div>

      <Table
        bordered
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(row) => row._id}
        dataSource={countries || []}
        pagination={false}
        scroll={{ x: 600 }}
      />
      <CitiesDrawer />
    </div>
  );
}
