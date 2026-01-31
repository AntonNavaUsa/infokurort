import { List, useTable } from '@refinedev/antd';
import { Table, Space, Button, Tag, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export const WidgetList = () => {
  const { tableProps } = useTable();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column dataIndex="name" title="Название" />
        <Table.Column
          dataIndex="type"
          title="Тип"
          render={(value) => (
            <Tag color={value === 'resort' ? 'blue' : 'green'}>{value}</Tag>
          )}
        />
        <Table.Column
          dataIndex={['latitude', 'longitude']}
          title="Координаты"
          render={(_, record: any) => `${record.latitude}, ${record.longitude}`}
        />
        <Table.Column dataIndex="radius" title="Радиус (м)" />
        <Table.Column
          dataIndex="totalClicks"
          title="Кликов"
          sorter
        />
        <Table.Column
          dataIndex="active"
          title="Активен"
          render={(value) => <Switch checked={value} disabled />}
        />
        <Table.Column
          title="Действия"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                href={`/widgets/preview/${record.id}`}
              >
                Превью
              </Button>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                href={`/widgets/edit/${record.id}`}
              />
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
