import { Button } from "antd";
import { useState } from "react";
import { QualityControlTable } from "./QCTable";
import { QCForm } from "./QCForm";

export function QControlPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Контроль качества</h1>
        <Button type="primary" onClick={() => setOpen(true)}>
          <span className="text-white">Создать</span>
        </Button>
      </div>
      <QualityControlTable />
      {open && <QCForm open={open} onCancel={() => setOpen(false)} />}
    </div>
  );
}
