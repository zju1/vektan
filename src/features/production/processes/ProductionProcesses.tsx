import { useGetProductionJournalQuery } from "@/app/store/services/sales.api";
import { TablePage } from "@/components/table-page";
import { formatDate } from "@/lib/utils/date-utils";
import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import RecipeView from "../recipes/RecipeView";
import { useSearchParams } from "react-router-dom";
import type { SingleProductionJournal } from "./production-process.dto";

export function ProductionProcessesPage() {
  const { t } = useTranslation();
  const { data } = useGetProductionJournalQuery();
  const [params, setParams] = useSearchParams();
  return (
    <div>
      <TablePage
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
              title: t("id"),
              dataIndex: ["productionOrder", "id"],
              key: "id",
              width: 100,
            },
            {
              title: t("buyer"),
              dataIndex: ["productionOrder", "buyer", "clientName"],
              key: "buyer",
              width: 200,
            },
            {
              title: t("consignee"),
              dataIndex: ["productionOrder", "consignee", "consigneeName"],
              key: "consignee",
              width: 200,
              align: "center",
            },
            {
              title: t("country"),
              dataIndex: ["productionOrder", "country", "name"],
              key: "country",
              width: 150,
              align: "center",
            },
            {
              title: t("city"),
              dataIndex: ["productionOrder", "city", "name"],
              key: "city",
              width: 100,
              align: "center",
            },
            {
              title: t("mark"),
              dataIndex: ["productionOrder", "mark", "name"],
              key: "mark",
              width: 100,
              align: "center",
            },
            {
              title: t("quantity"),
              dataIndex: ["productionOrder", "quantity"],
              key: "quantity",
              width: 100,
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
              title: t("productionTime"),
              dataIndex: ["productionOrder", "productionTime"],
              key: "productionTime",
              render: (date: string) => formatDate(date),
              width: 100,
              align: "center",
            },
            {
              title: t("produced"),
              dataIndex: "produced",
              key: "produced",
              width: 100,
              align: "center",
            },
            {
              title: t("ready"),
              dataIndex: "ready",
              key: "ready",
              width: 100,
              align: "center",
            },
            {
              title: t("status"),
              dataIndex: ["productionOrder", "status"],
              key: "status",
              render: (status: string) => t(status),
              width: 100,
              align: "center",
            },
            {
              title: t("actualProductionDate"),
              dataIndex: "actualProductionDate",
              key: "actualProductionDate",
              render: (date: string) => formatDate(date),
              width: 100,
              align: "center",
            },
            {
              title: t("diff"),
              dataIndex: "diff",
              key: "diff",
              width: 200,
              align: "center",
            },
            {
              title: t("spendings"),
              dataIndex: "spendings",
              key: "spendings",
              width: 100,
              fixed: "right",
              align: "center",
              render: (_record: SingleProductionJournal, record) => (
                <Button
                  onClick={() => {
                    params.set("viewId", record.recipeId._id);
                    setParams(params);
                  }}
                >
                  <EyeOutlined />
                </Button>
              ),
            },
          ],
        }}
        title={t("productionJournal")}
      />
      <RecipeView />
    </div>
  );
}
