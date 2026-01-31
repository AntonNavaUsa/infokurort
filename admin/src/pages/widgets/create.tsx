import { Create, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Row, Col } from 'antd';

export const WidgetCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Название виджета"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Виджет Роза Хутор" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Широта (Latitude)"
              name="latitude"
              rules={[{ required: true }, { type: 'number', min: -90, max: 90 }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="43.66"
                step={0.0001}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Долгота (Longitude)"
              name="longitude"
              rules={[{ required: true }, { type: 'number', min: -180, max: 180 }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="40.31"
                step={0.0001}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Радиус поиска (метры)"
          name="radius"
          initialValue={5000}
          rules={[{ type: 'number', min: 100, max: 50000 }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="5000"
          />
        </Form.Item>

        <Form.Item
          label="Тип точки"
          name="type"
          initialValue="resort"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="resort">Курорт</Select.Option>
            <Select.Option value="event">Событие</Select.Option>
            <Select.Option value="city">Город</Select.Option>
            <Select.Option value="custom">Произвольная точка</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Партнёр"
          name="partnerId"
          rules={[{ required: true }]}
        >
          <Select placeholder="Выберите партнёра">
            {/* TODO: Загрузить список партнёров */}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Тема"
              name="theme"
              initialValue="light"
            >
              <Select>
                <Select.Option value="light">Светлая</Select.Option>
                <Select.Option value="dark">Тёмная</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Основной цвет"
              name="primaryColor"
              initialValue="#3b82f6"
            >
              <Input type="color" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Активен"
          name="active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};
