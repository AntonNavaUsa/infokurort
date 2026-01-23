import { List, useTable, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Tag } from 'antd';

export const ResortList = () => {
  const { tableProps } = useTable();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={70} />
        <Table.Column dataIndex="name" title="Название" />
        <Table.Column dataIndex="location" title="Локация" />
        <Table.Column
          dataIndex="status"
          title="Статус"
          render={(value) => (
            <Tag color={value === 'open' ? 'green' : 'red'}>
              {value === 'open' ? 'Открыт' : 'Закрыт'}
            </Tag>
          )}
        />
        <Table.Column dataIndex="snowDepth" title="Снег (см)" />
        <Table.Column dataIndex="temperature" title="Температура (°C)" />
        <Table.Column
          dataIndex="liftsOpen"
          title="Подъемники"
          render={(value, record: any) => `${value}/${record.liftsTotal}`}
        />
        <Table.Column
          dataIndex="trailsOpen"
          title="Трассы"
          render={(value, record: any) => `${value}/${record.trailsTotal}`}
        />
        <Table.Column
          title="Действия"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
