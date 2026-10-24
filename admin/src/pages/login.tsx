import { AuthPage } from '@refinedev/antd';

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<h1>Инфокурорт</h1>}
      formProps={{ initialValues: {} }}
    />
  );
};
