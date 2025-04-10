import { Button } from "antd";
import ProductionPlanningTable from "./PlanningTable";
import { useState } from "react";
import { ProductionPlanningForm } from "./PlanningForm";

export function ProductionPlanningPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Планирование производства </h1>
        <Button type="primary" onClick={() => setOpen(true)}>
          <span className="text-white">Создать новый план</span>
        </Button>
      </div>
      <ProductionPlanningTable />
      {open && (
        <ProductionPlanningForm open={open} onCancel={() => setOpen(false)} />
      )}
    </div>
  );
}
