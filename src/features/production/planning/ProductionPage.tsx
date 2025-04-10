import { Button } from "antd";
import { useState } from "react";
import { ProductionTable } from "./ProductionTable";
import { ProductionFormModal } from "./ProductionForm";

export function ProductionPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Производства </h1>
        <Button type="primary" onClick={() => setOpen(true)}>
          <span className="text-white">Создать</span>
        </Button>
      </div>
      <ProductionTable />
      {open && (
        <ProductionFormModal open={open} onCancel={() => setOpen(false)} />
      )}
    </div>
  );
}
