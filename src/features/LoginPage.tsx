import { useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/app/store/store.config";
import { useSigninMutation } from "@/app/store/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { setToken } from "@/app/store/slices/auth.slice";

const { Title, Text } = Typography;

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface AuthUser {
  username: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  _id: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { access_token } = useAuth();

  const { toast } = useToast();

  const [signin, { isLoading }] = useSigninMutation();

  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async (values: LoginDTO) => {
      try {
        const response = await signin(values).unwrap();
        dispatch(setToken(response.accessToken));
      } catch (error) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("invalidCredentials"),
        });
        console.log(error);
      }
    },
    [signin, dispatch, toast, t]
  );

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg" bordered={false}>
        <div className="text-center mb-6">
          <Title level={2} className="mb-1">
            {t("login")}
          </Title>
          <Text type="secondary">{t("loginDescription")}</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => setError(null)}
          />
        )}

        <Form
          form={form}
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          autoComplete="off"
          size="large"
        >
          <div className="grid gap-4">
            <Form.Item
              name="username"
              label={t("username")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t("johndoe")}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t("password")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t("*****")}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isLoading}
                icon={<LoginOutlined />}
              >
                {t("login")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
}
