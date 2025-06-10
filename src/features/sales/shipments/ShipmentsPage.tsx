import { useGetShipmentsQuery } from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SingleShipment } from "./shipment.dto";
import { OnTheWayModal } from "./OnTheWayModal";

export function ShipmentsPage() {
  const { t } = useTranslation();
  const { data } = useGetShipmentsQuery();
  const [otwItem, setOTWItem] = useState<SingleShipment | null>(null);
  return (
    <>
      <TablePage
        table={{
          dataSource: data,
          scroll: { x: 2300 },
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
              title: t("seller"),
              dataIndex: "seller",
              key: "seller",
              render: () => "Vektan",
              width: 150,
              align: "center",
            },
            {
              title: t("buyer"),
              dataIndex: ["productionOrder", "buyer", "clientName"],
              key: "buyer",
              width: 200,
              align: "center",
            },
            {
              title: t("consignee"),
              dataIndex: ["productionOrder", "consignee", "consigneeName"],
              key: "consignee",
              width: 150,
              align: "center",
            },
            {
              title: t("unloadPlace"),
              dataIndex: ["productionOrder"],
              key: "unloadPlace",
              width: 150,
              align: "center",
              render: (po) => `${po.country.name}, ${po.city.name}`,
            },
            {
              title: t("mark"),
              dataIndex: ["productionOrder", "mark", "name"],
              key: "mark",
              width: 150,
              align: "center",
            },
            {
              title: t("bagType"),
              dataIndex: ["productionOrder", "bagType", "name"],
              key: "bagType",
              width: 150,
              align: "center",
            },
            {
              title: t("volume"),
              dataIndex: ["productionOrder", "quantity"],
              key: "volume",
              width: 150,
              align: "center",
            },
            {
              title: t("unitType"),
              dataIndex: ["productionOrder", "unitType", "name"],
              key: "unitType",
              width: 150,
              align: "center",
            },
            {
              title: t("pricePerUnit"),
              dataIndex: "pricePerUnit",
              key: "pricePerUnit",
              width: 100,
              align: "center",
            },
            {
              title: t("totalPrice"),
              dataIndex: "totalPrice",
              key: "totalPrice",
              width: 100,
              align: "center",
            },
            {
              title: t("stateNumberOfTractor"),
              dataIndex: "stateNumberOfTractor",
              key: "stateNumberOfTractor",
              width: 100,
              align: "center",
            },
            {
              title: t("stateNumberOfTrailer"),
              dataIndex: "stateNumberOfTrailer",
              key: "stateNumberOfTrailer",
              width: 100,
              align: "center",
            },
            {
              title: t("orderStatus"),
              dataIndex: ["productionOrder", "status"],
              key: "orderStatus",
              render: (value) => t(value),
              width: 120,
              align: "center",
            },
            {
              title: t("documents"),
              dataIndex: "documents",
              key: "documents",
              render: () => (
                <div className="grid gap-1">
                  <Button size="small">{t("invoice")}</Button>
                  <Button size="small">{t("smp")}</Button>
                </div>
              ),
              width: 140,
              align: "center",
            },
            {
              title: t("actions"),
              dataIndex: "actions",
              key: "actions",
              fixed: "right",
              render: (_value, record) => (
                <div className="grid gap-1">
                  <Button
                    type="primary"
                    variant="solid"
                    color="green"
                    disabled={record.productionOrder.status !== "loaded"}
                    onClick={() => setOTWItem(record)}
                    icon={<PlayCircleOutlined />}
                  >
                    {t("onTheWay")}
                  </Button>
                </div>
              ),
              width: 120,
              align: "center",
            },
          ],
        }}
        title={t("shipments")}
      />
      {otwItem && (
        <OnTheWayModal
          shipment={otwItem}
          onCancel={() => setOTWItem(null)}
          open={!!otwItem}
        />
      )}
    </>
  );
}
