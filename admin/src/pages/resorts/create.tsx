import { Create, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Select } from 'antd';

export const ResortCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Локация" name="location">
          <Input />
        </Form.Item>

        <Form.Item label="Статус" name="status">
          <Select>
            <Select.Option value="open">Открыт</Select.Option>
            <Select.Option value="closed">Закрыт</Select.Option>
            <Select.Option value="partial">Частично</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Глубина снега (см)" name="snowDepth">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Погода" name="weather">
          <Input />
        </Form.Item>

        <Form.Item label="Температура (°C)" name="temperature">
          <InputNumber />
        </Form.Item>

        <Form.Item label="Подъемников открыто" name="liftsOpen">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Подъемников всего" name="liftsTotal">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Трасс открыто" name="trailsOpen">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Трасс всего" name="trailsTotal">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Веб-сайт" name="website">
          <Input type="url" />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Create>
  );
};
