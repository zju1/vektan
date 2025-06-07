import { Button, Descriptions, Modal, notification, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  useChangeProductionOrderMutation,
  useGetProductionrderByIdQuery,
  useGetRecipeModelByIdQuery,
} from "@/app/store/services/sales.api";
import { useCallback } from "react";
import { PlayCircleFilled } from "@ant-design/icons";

export default function RecipeView() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewId = searchParams.get("viewId");
  const isModalOpen = !!viewId;
  const [change] = useChangeProductionOrderMutation();

  const { data, isLoading, refetch } = useGetRecipeModelByIdQuery(
    { id: viewId! },
    {
      skip: !viewId,
    }
  );

  const { data: prodOrder, refetch: reload } = useGetProductionrderByIdQuery(
    data?.purchaseOrder as string,
    {
      skip: !data?.purchaseOrder,
      refetchOnMountOrArgChange: true,
    }
  );

  const start = useCallback(async () => {
    await change({
      _id: prodOrder?._id,
      status: "producing",
    }).unwrap();
    notification.success({
      message: t("productionStarted"),
    });
    refetch();
    reload();
  }, [change, prodOrder?._id, refetch, reload, t]);

  const closeModal = () => {
    searchParams.delete("viewId");
    setSearchParams(searchParams);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      title={`${prodOrder?.id}`}
      maskClosable={false}
    >
      {isLoading || !data ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid gap-4">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t("mainRaw", { name: 1 })}>
              {data.mainRaw1}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.mainRawVolume1}
            </Descriptions.Item>
            <Descriptions.Item label={t("mainRaw", { name: 2 })}>
              {data.mainRaw2}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.mainRawVolume2}
            </Descriptions.Item>
            <Descriptions.Item label={t("mainRaw", { name: 3 })}>
              {data.mainRaw3}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.mainRawVolume3}
            </Descriptions.Item>
            <Descriptions.Item label={t("mainRaw", { name: 4 })}>
              {data.mainRaw4}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.mainRawVolume4}
            </Descriptions.Item>
            <Descriptions.Item label={t("byProduct")}>
              {data.byProduct}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.byProductVolume}
            </Descriptions.Item>
            <Descriptions.Item label={t("chemicals")}>
              {data.chemicals}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.chemicalsVolume}
            </Descriptions.Item>
            <Descriptions.Item label={t("additive")}>
              {data.additive}
            </Descriptions.Item>
            <Descriptions.Item label={t("volume")}>
              {data.additiveVolume}
            </Descriptions.Item>
            <Descriptions.Item label={t("devices")}>
              {data.device}
            </Descriptions.Item>
            <Descriptions.Item label={t("lotNumber")}>
              {data.lotNumber}
            </Descriptions.Item>
          </Descriptions>
          {prodOrder?.status === "planned" && (
            <Button
              onClick={start}
              size="large"
              icon={<PlayCircleFilled />}
              variant="solid"
              color="green"
            >
              {t("startProducing")}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
}
