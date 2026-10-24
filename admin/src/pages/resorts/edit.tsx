import { Edit, useForm } from '@refinedev/antd';
import { Alert, Checkbox, Form, Input, InputNumber, Select, Typography } from 'antd';

export const ResortEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps} headerButtons={[]}>
      <Form {...formProps} layout="vertical">
        <Alert
          type="info"
          showIcon
          message="Обновляйте только проверенные данные"
          description="При сохранении изменений в статусе, погоде, снеге, подъёмниках или трассах дата обновления выставится автоматически. Данные старше суток не показываются в блоке «Сейчас» на главной."
          style={{ marginBottom: 16 }}
        />
        {queryResult?.data?.data?.statusUpdatedAt && (
          <Typography.Text type="secondary">
            Последняя проверка статуса: {new Date(queryResult.data.data.statusUpdatedAt).toLocaleString('ru-RU')}
          </Typography.Text>
        )}
        <Form.Item name="verifyStatus" valuePropName="checked" initialValue={false}>
          <Checkbox>Я только что сверил данные о статусе с первоисточником</Checkbox>
        </Form.Item>
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
    </Edit>
  );
};
