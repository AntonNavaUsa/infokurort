import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Select, Switch } from 'antd';

export const KnowledgeCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Заголовок"
          name="title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Контент"
          name="content"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={10} />
        </Form.Item>

        <Form.Item
          label="Категория"
          name="category"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="faq">FAQ</Select.Option>
            <Select.Option value="resort_info">Информация о курортах</Select.Option>
            <Select.Option value="instructors">Инструкторы</Select.Option>
            <Select.Option value="pricing">Цены</Select.Option>
            <Select.Option value="ski_tips">Советы по катанию</Select.Option>
            <Select.Option value="safety">Безопасность</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Подкатегория" name="subcategory">
          <Input />
        </Form.Item>

        <Form.Item
          label="Активен"
          name="isActive"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};
