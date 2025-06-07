import { Form } from "antd";

export function useForm() {
  const [form] = Form.useForm();

  return { form, Form };
}
