import { Button, Input, Table, type TableProps } from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import type { AnyObject } from "antd/es/_util/type";

type TablePageProps<T = AnyObject> = PropsWithChildren & {
  title: string;
  table: TableProps<T>;
  isEdit?: boolean;
  onCreate?: VoidFunction;
};

export function TablePage<T = AnyObject>({
  title,
  table,
  onCreate,
}: TablePageProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="font-sans text-lg font-medium">{title}</h2>
        <div className="grid gap-2 grid-cols-[1fr_auto_auto]">
          <Input placeholder={t("search")} prefix={<SearchOutlined />} />
          <Button variant="outlined" icon={<DownloadOutlined />}>
            {t("export")}
          </Button>
          {onCreate && (
            <Button onClick={onCreate} icon={<PlusOutlined />} type="primary">
              {t("create")}
            </Button>
          )}
        </div>
      </div>
      <Table {...table} bordered />
    </div>
  );
}
