import { List, useTable, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Tag } from 'antd';

export const KnowledgeList = () => {
  const { tableProps } = useTable();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={70} />
        <Table.Column dataIndex="title" title="Заголовок" />
        <Table.Column
          dataIndex="category"
          title="Категория"
          render={(value) => {
            const categoryMap: Record<string, { label: string; color: string }> = {
              faq: { label: 'FAQ', color: 'blue' },
              resort_info: { label: 'Курорты', color: 'green' },
              instructors: { label: 'Инструкторы', color: 'purple' },
              pricing: { label: 'Цены', color: 'orange' },
              ski_tips: { label: 'Советы', color: 'cyan' },
              safety: { label: 'Безопасность', color: 'red' },
            };
            const cat = categoryMap[value] || { label: value, color: 'default' };
            return <Tag color={cat.color}>{cat.label}</Tag>;
          }}
        />
        <Table.Column dataIndex="subcategory" title="Подкатегория" />
        <Table.Column
          dataIndex="isActive"
          title="Активен"
          render={(value) => (
            <Tag color={value ? 'green' : 'default'}>
              {value ? 'Да' : 'Нет'}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="updatedAt"
          title="Обновлен"
          render={(value) => new Date(value).toLocaleDateString('ru-RU')}
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
