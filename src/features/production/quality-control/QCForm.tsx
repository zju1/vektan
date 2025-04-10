import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Tabs,
  Divider,
  message,
} from "antd";
import {
  SaveOutlined,
  ExperimentOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface QualityControlFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit?: (values: any) => void;
  initialValues?: any;
  isEdit?: boolean;
}

export function QCForm({
  open,
  onCancel,
  onSubmit,
  initialValues = {},
  isEdit = false,
}: QualityControlFormModalProps) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [penetrationAvg, setPenetrationAvg] = useState<number | null>(null);
  const [viscosityAvg, setViscosityAvg] = useState<number | null>(null);
  const [meltingTempAvg, setMeltingTempAvg] = useState<number | null>(null);
  const [dropTempAvg, setDropTempAvg] = useState<number | null>(null);

  // Calculate averages when form values change
  useEffect(() => {
    const calculateAverages = () => {
      const values = form.getFieldsValue();

      // Calculate penetration average
      const pen1 = values.penetration1;
      const pen2 = values.penetration2;
      const pen3 = values.penetration3;
      if (pen1 && pen2 && pen3) {
        const avg = (pen1 + pen2 + pen3) / 3;
        setPenetrationAvg(Number.parseFloat(avg.toFixed(2)));
        form.setFieldValue("penetrationAvg", Number.parseFloat(avg.toFixed(2)));
      }

      // Calculate viscosity average
      const vis1 = values.viscosity1;
      const vis2 = values.viscosity2;
      const vis3 = values.viscosity3;
      if (vis1 && vis2 && vis3) {
        const avg = (vis1 + vis2 + vis3) / 3;
        setViscosityAvg(Number.parseFloat(avg.toFixed(2)));
        form.setFieldValue("viscosityAvg", Number.parseFloat(avg.toFixed(2)));
      }

      // Calculate melting temperature average
      const melt1 = values.meltingTemp1;
      const melt2 = values.meltingTemp2;
      const melt3 = values.meltingTemp3;
      if (melt1 && melt2 && melt3) {
        const avg = (melt1 + melt2 + melt3) / 3;
        setMeltingTempAvg(Number.parseFloat(avg.toFixed(2)));
        form.setFieldValue("meltingTempAvg", Number.parseFloat(avg.toFixed(2)));
      } else if (melt1 && melt2) {
        const avg = (melt1 + melt2) / 2;
        setMeltingTempAvg(Number.parseFloat(avg.toFixed(2)));
        form.setFieldValue("meltingTempAvg", Number.parseFloat(avg.toFixed(2)));
      }

      // Calculate drop temperature average
      const drop1 = values.dropTemp1;
      const drop2 = values.dropTemp2;
      const drop3 = values.dropTemp3;
      if (drop1 && drop2 && drop3) {
        const avg = (drop1 + drop2 + drop3) / 3;
        setDropTempAvg(Number.parseFloat(avg.toFixed(2)));
        form.setFieldValue("dropTempAvg", Number.parseFloat(avg.toFixed(2)));
      } else if (drop1 && drop2) {
        const avg = (drop1 + drop2) / 2;
        setDropTempAvg(Number.parseFloat(avg.toFixed(2)));
        form.setFieldValue("dropTempAvg", Number.parseFloat(avg.toFixed(2)));
      }
    };

    // Use a timeout to avoid excessive calculations during typing
    const timer = setTimeout(calculateAverages, 300);
    return () => clearTimeout(timer);
  }, [form]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      // Format date for submission
      const formattedValues = {
        ...values,
        date: values.date ? dayjs(values.date).format("DD-MM-YY") : "",
        // Ensure averages are set
        penetrationAvg: penetrationAvg || values.penetrationAvg,
        viscosityAvg: viscosityAvg || values.viscosityAvg,
        meltingTempAvg: meltingTempAvg || values.meltingTempAvg,
        dropTempAvg: dropTempAvg || values.dropTempAvg,
      };

      console.log("Form submitted:", formattedValues);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(formattedValues);
      }

      form.resetFields();
      onCancel();
      message.success(
        `Запись контроля качества ${isEdit ? "обновлена" : "создана"} успешно!`
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        "Не удалось отправить форму. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens/closes
  const handleModalClose = () => {
    setActiveTab("1");
    form.resetFields();
    setPenetrationAvg(null);
    setViscosityAvg(null);
    setMeltingTempAvg(null);
    setDropTempAvg(null);
    onCancel();
  };

  const modalTitle = isEdit
    ? "Редактировать запись контроля качества"
    : "Создать новую запись контроля качества";

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={handleModalClose}
      width={1000}
      footer={null}
      bodyStyle={{ maxHeight: "80vh" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          date: initialValues.date
            ? dayjs(initialValues.date, "DD-MM-YY")
            : undefined,
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <ExperimentOutlined /> Основная информация
              </span>
            }
            key="1"
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Дата"
                  name="date"
                  rules={[
                    { required: true, message: "Пожалуйста, выберите дату" },
                  ]}
                >
                  <DatePicker format="DD-MM-YY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Продукт"
                  name="product"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите название продукта",
                    },
                  ]}
                >
                  <Input placeholder="напр., VTS-114 (LMP 0% Сол.)" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Количество (тонн)"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите количество",
                    },
                  ]}
                >
                  <InputNumber min={0} step={0.001} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Проникновение (P)</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Общий"
                  name="penetrationGeneral"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Образец #1"
                  name="penetration1"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Образец #2"
                  name="penetration2"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Образец #3"
                  name="penetration3"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6} offset={18}>
                <Form.Item label="Среднее значение" name="penetrationAvg">
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: "100%" }}
                    disabled
                    value={penetrationAvg}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Вязкость (mPa*s)</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Общий"
                  name="viscosityGeneral"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Образец #1"
                  name="viscosity1"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Образец #2"
                  name="viscosity2"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Образец #3"
                  name="viscosity3"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6} offset={18}>
                <Form.Item label="Среднее значение" name="viscosityAvg">
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: "100%" }}
                    disabled
                    value={viscosityAvg}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <CalculatorOutlined /> Температурные параметры
              </span>
            }
            key="2"
          >
            <Divider orientation="left">Температура размягчения (°C)</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Образец #1" name="meltingTemp1">
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Образец #2" name="meltingTemp2">
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Образец #3" name="meltingTemp3">
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={16}>
                <Form.Item label="Среднее значение" name="meltingTempAvg">
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: "100%" }}
                    disabled
                    value={meltingTempAvg}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Температура каплепадения (°C)</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Образец #1" name="dropTemp1">
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Образец #2" name="dropTemp2">
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Образец #3" name="dropTemp3">
                  <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={16}>
                <Form.Item label="Среднее значение" name="dropTempAvg">
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: "100%" }}
                    disabled
                    value={dropTempAvg}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Дополнительная информация</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Примечание" name="notes">
                  <TextArea
                    rows={4}
                    placeholder="Введите дополнительные примечания или наблюдения"
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <div
          className="steps-action"
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {isEdit ? "Обновить" : "Создать"}
          </Button>
          <Button style={{ margin: "0 8px" }} onClick={handleModalClose}>
            Отмена
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
