import { useGetProducedItemsQuery } from "@/app/store/services/warehouse.service";
import { TablePage } from "@/components/table-page";
import { formatDate } from "@/lib/utils/date-utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IProducedMaterial } from "./ready-products.dto";
import { Button } from "antd";
import { LoadItemForm } from "./LoadItemForm";

export function ProducedItemsPage() {
  const { t } = useTranslation();
  const { data } = useGetProducedItemsQuery();
  const [current, setCurrent] = useState<IProducedMaterial | null>(null);

  return (
    <>
      <TablePage
        title={t("producedItems")}
        table={{
          dataSource: data,
          scroll: { x: 2000 },
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
              title: t("warehouseIdNum"),
              dataIndex: "warehouseId",
              key: "warehouseId",
              minWidth: 150,
              align: "center",
            },
            {
              title: t("productionOrderId"),
              dataIndex: ["productionId", "id"],
              key: "productionOrderId",
              width: 100,
              align: "center",
            },
            {
              title: t("mark"),
              dataIndex: ["productionId", "mark", "name"],
              key: "mark",
              minWidth: 150,
              align: "center",
            },
            {
              title: t("producedDate"),
              dataIndex: "producedDate",
              key: "producedDate",
              width: 150,
              render: (value) => formatDate(value),
              align: "center",
            },
            {
              title: t("bagType"),
              dataIndex: ["productionId", "bagType", "name"],
              key: "bagType",
              width: 100,
              align: "center",
            },
            {
              title: t("numberOfBags"),
              dataIndex: "numberOfBags",
              key: "numberOfBags",
              width: 100,
              align: "center",
            },
            {
              title: t("numberOfPallets"),
              dataIndex: "numberOfPallets",
              key: "numberOfPallets",
              width: 100,
              align: "center",
            },
            {
              title: t("nettoWeight"),
              dataIndex: ["nettoWeight", "weight"],
              key: "nettoWeight",
              width: 100,
              align: "center",
            },
            {
              title: t("unitType"),
              dataIndex: ["nettoWeight", "unitType", "name"],
              key: "NettounitType",
              width: 100,
              align: "center",
            },
            {
              title: t("bruttoWeight"),
              dataIndex: ["bruttoWeight", "weight"],
              key: "bruttoWeight",
              width: 100,
              align: "center",
            },
            {
              title: t("unitType"),
              dataIndex: ["bruttoWeight", "unitType", "name"],
              key: "NettounitType",
              width: 100,
              align: "center",
            },
            {
              title: t("lotNumber"),
              dataIndex: "lotNumber",
              key: "lotNumber",
              width: 100,
              align: "center",
            },
            {
              title: t("placementInWarehouse"),
              dataIndex: "placementInWarehouse",
              key: "placementInWarehouse",
              width: 150,
              align: "center",
            },
            {
              title: t("status"),
              dataIndex: ["productionId", "status"],
              key: "status",
              width: 150,
              render: (status) => t(status),
              align: "center",
            },
            {
              title: t("sticker"),
              dataIndex: "sticker",
              key: "sticker",
              width: 150,
              align: "center",
            },
            {
              title: t("actions"),
              dataIndex: "actions",
              key: "actions",
              width: 180,
              fixed: "right",
              align: "center",
              render: (_value, record) => (
                <Button
                  className="text-wrap h-auto"
                  size="small"
                  onClick={() => setCurrent(record)}
                >
                  {t("startShippingProcess")}
                </Button>
              ),
            },
          ],
        }}
      />
      {current && (
        <LoadItemForm
          open={!!current}
          onCancel={() => setCurrent(null)}
          productionItem={current}
        />
      )}
    </>
  );
}
