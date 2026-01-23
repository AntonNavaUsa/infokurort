import { AuthPage } from '@refinedev/antd';

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<h1>🎿 Ski Concierge</h1>}
      formProps={{
        initialValues: {
          email: 'admin@ski-concierge.ru',
          password: 'admin123',
        },
      }}
    />
  );
};
