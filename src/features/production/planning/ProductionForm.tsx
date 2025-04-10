"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Row,
  Col,
  Steps,
  message,
} from "antd";
import {
  SaveOutlined,
  SolutionOutlined,
  ExperimentOutlined,
  SettingOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ProductionFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit?: (values: any) => void;
  initialValues?: any;
  isEdit?: boolean;
}

export function ProductionFormModal({
  open,
  onCancel,
  onSubmit,
  initialValues = {},
  isEdit = false,
}: ProductionFormModalProps) {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      // Format dates for submission
      const formattedValues = {
        ...values,
        productionDate: values.productionDate?.format("YYYY-MM-DD"),
        productionPeriod: values.productionPeriod
          ? [
              values.productionPeriod[0]?.format("YYYY-MM-DD"),
              values.productionPeriod[1]?.format("YYYY-MM-DD"),
            ]
          : undefined,
      };

      console.log("Form submitted:", formattedValues);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(formattedValues);
      }

      form.resetFields();
      onCancel();
      message.success(
        `Production ${isEdit ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    try {
      // Validate fields in the current step before moving to the next
      await form.validateFields(getFieldsForStep(currentStep));
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Define which fields belong to which step
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: // Basic Information
        return [
          "lot",
          "productName",
          "productionDate",
          "productionPeriod",
          "purchasingCompany",
        ];
      case 1: // Production Details
        return ["productionAmount", "batchLmp", "addedLmp"];
      case 2: // Technical Parameters
        return ["penetration", "viscosity", "drippingTemp", "bagType"];
      case 3: // Shipping Information
        return ["loadingType", "shippedAmount", "factoryExitDate", "notes"];
      default:
        return [];
    }
  };

  const steps = [
    {
      title: "Основная информация",
      icon: <SolutionOutlined />,
    },
    {
      title: "Детали производства",
      icon: <SettingOutlined />,
    },
    {
      title: "Технические параметры",
      icon: <ExperimentOutlined />,
    },
    {
      title: "Информация об отгрузке",
      icon: <RocketOutlined />,
    },
  ];

  const modalTitle = isEdit
    ? "Редактировать производство"
    : "Создать новое производство";

  // Reset step when modal opens/closes
  const handleModalClose = () => {
    setCurrentStep(0);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={handleModalClose}
      width={1200}
      footer={null}
    >
      <Steps
        current={currentStep}
        items={steps.map((item) => ({
          title: item.title,
          icon: item.icon,
        }))}
        className="mb-8"
      />

      <Form
        form={form}
        layout="vertical"
        className="grid w-full"
        initialValues={{
          ...initialValues,
          productionDate: initialValues.productionDate
            ? dayjs(initialValues.productionDate)
            : undefined,
          productionPeriod: initialValues.productionPeriod
            ? [
                dayjs(initialValues.productionPeriod[0]),
                dayjs(initialValues.productionPeriod[1]),
              ]
            : undefined,
        }}
      >
        {/* Step 1: Basic Information */}
        <div
          style={{ display: currentStep === 0 ? "grid" : "none", gap: "16px" }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Номер партии"
                name="lot"
                rules={[{ required: true, message: "Введите номер партии" }]}
              >
                <Input placeholder="напр., L001123" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Название продукта"
                name="productName"
                rules={[
                  { required: true, message: "Введите название продукта" },
                ]}
              >
                <Input placeholder="напр., (FC)2/1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Компания-покупатель"
                name="purchasingCompany"
                rules={[
                  { required: true, message: "Выберите компанию-покупателя" },
                ]}
              >
                <Select placeholder="Выберите компанию">
                  <Option value="Akdeniz">Akdeniz</Option>
                  <Option value="Chemson">Chemson</Option>
                  <Option value="Baerlocher">Baerlocher</Option>
                  <Option value="Other">Другое</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Дата производства"
                name="productionDate"
                rules={[
                  { required: true, message: "Выберите дату производства" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Период производства" name="productionPeriod">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Step 2: Production Details */}
        <div
          style={{ display: currentStep === 1 ? "grid" : "none", gap: "16px" }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Объем производства (тонн)"
                name="productionAmount"
                rules={[
                  { required: true, message: "Введите объем производства" },
                ]}
              >
                <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Партия LMP"
                name="batchLmp"
                rules={[{ required: true, message: "Введите партию LMP" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Добавленный LMP" name="addedLmp">
                <Input placeholder="Детали LMP" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Производственный процесс"
                name="productionProcess"
              >
                <Select placeholder="Выберите производственный процесс">
                  <Option value="standard">Стандартный процесс</Option>
                  <Option value="accelerated">Ускоренный процесс</Option>
                  <Option value="custom">Пользовательский процесс</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Назначенный персонал" name="assignedPersonnel">
                <Select mode="multiple" placeholder="Выберите персонал">
                  <Option value="operator1">Оператор 1</Option>
                  <Option value="operator2">Оператор 2</Option>
                  <Option value="technician1">Техник 1</Option>
                  <Option value="supervisor1">Супервайзер 1</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Step 3: Technical Parameters */}
        <div
          style={{ display: currentStep === 2 ? "grid" : "none", gap: "16px" }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Проникновение (1/10мм)"
                name="penetration"
                rules={[
                  { required: true, message: "Введите значение проникновения" },
                ]}
              >
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Вязкость (мПа*с)"
                name="viscosity"
                rules={[
                  { required: true, message: "Введите значение вязкости" },
                ]}
              >
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Температура каплепадения (°C)"
                name="drippingTemp"
                rules={[
                  {
                    required: true,
                    message: "Введите температуру каплепадения",
                  },
                ]}
              >
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Тип мешка"
                name="bagType"
                rules={[{ required: true, message: "Выберите тип мешка" }]}
              >
                <Select placeholder="Выберите тип мешка">
                  <Option value="oq qop">oq qop</Option>
                  <Option value="qora qop">qora qop</Option>
                  <Option value="other">Другое</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Проверка качества" name="qualityCheck">
                <Select placeholder="Выберите статус качества">
                  <Option value="passed">Пройдено</Option>
                  <Option value="pending">В ожидании</Option>
                  <Option value="failed">Не пройдено</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Технические примечания" name="technicalNotes">
                <TextArea
                  rows={4}
                  placeholder="Введите технические примечания или наблюдения"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Step 4: Shipping Information */}
        <div
          style={{ display: currentStep === 3 ? "grid" : "none", gap: "16px" }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Тип загрузки"
                name="loadingType"
                rules={[{ required: true, message: "Выберите тип загрузки" }]}
              >
                <Select placeholder="Выберите тип загрузки">
                  <Option value="Паллет">Паллет</Option>
                  <Option value="Контейнер">Контейнер</Option>
                  <Option value="Навалом">Навалом</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Отгруженное количество"
                name="shippedAmount"
                rules={[
                  { required: true, message: "Введите отгруженное количество" },
                ]}
              >
                <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Дата выхода с завода"
                name="factoryExitDate"
                rules={[
                  { required: true, message: "Введите дату выхода с завода" },
                ]}
              >
                <Input placeholder="напр., 16-02-23" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Статус"
                name="status"
                rules={[{ required: true, message: "Выберите статус" }]}
              >
                <Select placeholder="Выберите статус">
                  <Option value="Отгружено">Отгружено</Option>
                  <Option value="В процессе">В процессе</Option>
                  <Option value="Ожидание">Ожидание</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Перевозчик" name="shippingCarrier">
                <Input placeholder="Введите перевозчика" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Примечания" name="notes">
                <TextArea
                  rows={4}
                  placeholder="Введите дополнительные примечания"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Назад
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Далее
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              icon={<SaveOutlined />}
            >
              {isEdit ? "Обновить" : "Создать"}
            </Button>
          )}
          <Button style={{ margin: "0 8px" }} onClick={handleModalClose}>
            Отмена
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
