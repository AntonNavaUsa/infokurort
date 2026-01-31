import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Row, Col, Tabs, Card, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';

const { Text, Paragraph } = Typography;

export const WidgetEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const widgetData = queryResult?.data?.data;

  const handleCopyEmbed = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('Код скопирован в буфер обмена');
  };

  const iframeCode = widgetData
    ? `<iframe src="${window.location.origin}/widget/${widgetData.id}" width="100%" height="600" frameborder="0"></iframe>`
    : '';

  const jsCode = widgetData
    ? `<div id="ski-map-widget"></div>
<script src="${window.location.origin}/embed.js" 
        data-widget-id="${widgetData.id}"
        data-lat="${widgetData.latitude}"
        data-lng="${widgetData.longitude}">
</script>`
    : '';

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Tabs defaultActiveKey="settings">
        <Tabs.TabPane tab="Настройки" key="settings">
          <Form {...formProps} layout="vertical">
            <Form.Item
              label="Название виджета"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Широта"
                  name="latitude"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: '100%' }} step={0.0001} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Долгота"
                  name="longitude"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: '100%' }} step={0.0001} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Радиус поиска (м)" name="radius">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Тип" name="type">
              <Select>
                <Select.Option value="resort">Курорт</Select.Option>
                <Select.Option value="event">Событие</Select.Option>
                <Select.Option value="city">Город</Select.Option>
                <Select.Option value="custom">Произвольная</Select.Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Тема" name="theme">
                  <Select>
                    <Select.Option value="light">Светлая</Select.Option>
                    <Select.Option value="dark">Тёмная</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Цвет" name="primaryColor">
                  <Input type="color" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Активен" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Код для встраивания" key="embed">
          <Card title="iframe вариант" extra={
            <CopyOutlined onClick={() => handleCopyEmbed(iframeCode)} style={{ cursor: 'pointer' }} />
          }>
            <Paragraph>
              <Text code>{iframeCode}</Text>
            </Paragraph>
          </Card>

          <Card title="JavaScript вариант" style={{ marginTop: 16 }} extra={
            <CopyOutlined onClick={() => handleCopyEmbed(jsCode)} style={{ cursor: 'pointer' }} />
          }>
            <Paragraph>
              <pre style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                <code>{jsCode}</code>
              </pre>
            </Paragraph>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Аналитика" key="analytics">
          <Card>
            <p>Всего просмотров: {widgetData?.totalViews || 0}</p>
            <p>Всего кликов: {widgetData?.totalClicks || 0}</p>
            <p>CTR: {widgetData?.totalViews && widgetData?.totalViews > 0 
              ? (((widgetData?.totalClicks || 0) / widgetData.totalViews) * 100).toFixed(2) 
              : 0}%</p>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </Edit>
  );
};
