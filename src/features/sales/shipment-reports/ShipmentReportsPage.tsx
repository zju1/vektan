import { useGetShipmentReportsQuery } from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { formatDate } from "@/lib/utils/date-utils";
import { useTranslation } from "react-i18next";

export function ShipmentReportsPage() {
  const { t } = useTranslation();
  const { data, isFetching } = useGetShipmentReportsQuery({});
  return (
    <TablePage
      title={t("shipmentReports")}
      table={{
        dataSource: data,
        loading: isFetching,
        scroll: { x: 2400 },
        columns: [
          {
            title: "№",
            dataIndex: "index",
            key: "index",
            render: (_value, _record, index) => index + 1,
            width: 50,
            align: "center",
          },
          {
            title: t("id"),
            dataIndex: ["productionOrder", "id"],
            key: "id",
            align: "center",
            minWidth: 150,
          },
          {
            title: t("consignee"),
            dataIndex: ["productionOrder", "consignee", "consigneeName"],
            key: "consignee",
            align: "center",
            width: 150,
          },
          {
            title: t("country"),
            dataIndex: ["productionOrder", "country", "name"],
            key: "country",
            align: "center",
            width: 150,
          },
          {
            title: t("invoiceNumber"),
            dataIndex: ["invoiceNumber"],
            key: "invoiceNumber",
            align: "center",
            width: 150,
          },
          {
            title: t("shipmentDate"),
            dataIndex: ["shipmentDate"],
            key: "shipmentDate",
            align: "center",
            width: 150,
            render: formatDate,
          },
          {
            title: t("mark"),
            dataIndex: ["productionOrder", "mark", "name"],
            key: "mark",
            align: "center",
            width: 150,
          },
          {
            title: t("bagType"),
            dataIndex: ["productionOrder", "bagType", "name"],
            key: "bagType",
            align: "center",
            width: 150,
          },
          {
            title: t("volume"),
            dataIndex: ["productionOrder", "quantity"],
            key: "volume",
            align: "center",
            width: 150,
          },
          {
            title: t("unitType"),
            dataIndex: ["productionOrder", "unitType", "name"],
            key: "unitType",
            align: "center",
            width: 150,
          },
          {
            title: t("status"),
            dataIndex: ["productionOrder", "status"],
            key: "status",
            align: "center",
            width: 150,
            render: (status) => t(status),
          },
          {
            title: t("currentLocation"),
            dataIndex: ["currentLocation"],
            key: "currentLocation",
            align: "center",
            width: 150,
          },
          {
            title: t("updatedDate"),
            dataIndex: ["updatedDate"],
            key: "updatedDate",
            align: "center",
            width: 150,
            render: formatDate,
          },
          {
            title: t("actualDeliveryDate"),
            dataIndex: ["actualDeliveryDate"],
            key: "actualDeliveryDate",
            align: "center",
            width: 150,
            render: formatDate,
          },
          {
            title: t("numberOfDays"),
            dataIndex: ["numberOfDays"],
            key: "numberOfDays",
            align: "center",
            width: 150,
          },
          {
            title: t("numberOfDays"),
            dataIndex: ["numberOfDays"],
            key: "numberOfDays",
            align: "center",
            width: 150,
          },
          {
            title: t("deliveryExpenses"),
            dataIndex: ["deliveryExpenses"],
            key: "deliveryExpenses",
            align: "center",
            width: 150,
          },
          {
            title: t("deliveryExpensesPerTonn"),
            dataIndex: ["deliveryExpensesPerTonn"],
            key: "deliveryExpensesPerTonn",
            align: "center",
            width: 150,
          },
          {
            title: t("currency"),
            dataIndex: ["currency", "name"],
            key: "currency",
            align: "center",
            width: 150,
          },
        ],
      }}
    />
  );
}
