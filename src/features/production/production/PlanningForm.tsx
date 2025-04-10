import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
} from "antd";

const { Option } = Select;

interface ProductionPlanningModalProps {
  open: boolean;
  onCancel: () => void;
}

export function ProductionPlanningForm({
  open,
  onCancel,
}: ProductionPlanningModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Convert DatePicker values to string format
        const formattedValues = {
          ...values,
          date: values.date ? values.date.format("DD.MM.YY") : "",
          shippingDate: values.shippingDate
            ? values.shippingDate.format("DD.MM.YY")
            : "",
        };
        console.log("Form submitted:", formattedValues);
        // Here you would typically send the data to your backend
        // and then refresh the table data
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Добавить новый производственный заказ"
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Добавить заказ
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "Отгружено",
          statusPercent: "100%",
        }}
      >
        <Card title="Состав" className="mb-4">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item label="УЗЛМП (%)" name="uzlmp">
                <Input placeholder="напр. 90%" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="И-01 (%)" name="i01">
                <Input placeholder="напр. 40%" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="М-01 (%)" name="m01">
                <Input placeholder="напр. 60%" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="С-01 (%)" name="c01">
                <Input placeholder="напр. 5%" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="ВТР-70 (%)" name="vtr70">
                <Input placeholder="напр. 10%" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Детали заказа" className="mb-4">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Дата"
                name="date"
                rules={[
                  { required: true, message: "Пожалуйста, выберите дату" },
                ]}
              >
                <DatePicker format="DD.MM.YY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Грузополучатель"
                name="cargo"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите грузополучателя",
                  },
                ]}
              >
                <Input placeholder="напр. EQUITEE" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Страна"
                name="country"
                rules={[
                  { required: true, message: "Пожалуйста, введите страну" },
                ]}
              >
                <Input placeholder="напр. США" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Город"
                name="city"
                rules={[
                  { required: true, message: "Пожалуйста, введите город" },
                ]}
              >
                <Input placeholder="напр. Чарлстон" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Марка/Тип мешка"
                name="brand"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите марку/тип мешка",
                  },
                ]}
              >
                <Input placeholder="напр. VT-110 (P) in BIG BAGS 550" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Количество"
                name="quantity"
                rules={[
                  { required: true, message: "Пожалуйста, введите количество" },
                ]}
              >
                <Input type="number" placeholder="напр. 20" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Информация об отгрузке" className="mb-4">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Загрузка"
                name="loading"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, выберите тип загрузки",
                  },
                ]}
              >
                <Select placeholder="Выберите тип загрузки">
                  <Option value="Паллет">Паллет</Option>
                  <Option value="Контейнер">Контейнер</Option>
                  <Option value="Навалом">Навалом</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Контейнер" name="container">
                <Input placeholder="напр. 1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Фурс" name="furs">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Статус" name="status">
                <Select>
                  <Option value="Отгружено">Отгружено</Option>
                  <Option value="В процессе">В процессе</Option>
                  <Option value="Ожидание">Ожидание</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Статус %" name="statusPercent">
                <Select>
                  <Option value="100%">100%</Option>
                  <Option value="75%">75%</Option>
                  <Option value="50%">50%</Option>
                  <Option value="25%">25%</Option>
                  <Option value="0%">0%</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Дата отгрузки" name="shippingDate">
                <DatePicker format="DD.MM.YY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Место отгрузки" name="shippingLocation">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Подтверждение заказа" name="orderConfirmation">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
