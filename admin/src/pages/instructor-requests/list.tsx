import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Select, Space, Table, Tag, Typography, message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'ski-admin-token';

type RequestStatus = 'new' | 'in_progress' | 'done' | 'spam';

type InstructorRequest = {
  id: number;
  name: string;
  contact: string;
  resort: string;
  dates: string | null;
  learner: string;
  childAge: string | null;
  discipline: string;
  level: string;
  page: string | null;
  attribution: Record<string, unknown> | null;
  status: RequestStatus;
  createdAt: string;
};

const statusLabels: Record<RequestStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Закрыта',
  spam: 'Спам',
};

const statusColors: Record<RequestStatus, string> = {
  new: 'blue',
  in_progress: 'orange',
  done: 'green',
  spam: 'default',
};

export const InstructorRequestsList = () => {
  const [requests, setRequests] = useState<InstructorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/instructor-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ''}` },
      });
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: InstructorRequest[] = await response.json();
      setRequests(data);
    } catch (cause) {
      const description = cause instanceof Error ? cause.message : 'Неизвестная ошибка';
      setError(`Не удалось загрузить заявки (${description}). Проверьте подключение к API и войдите заново.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const updateStatus = async (id: number, status: RequestStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`${API_URL}/instructor-requests/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const updated: InstructorRequest = await response.json();
      setRequests((current) => current.map((request) => request.id === id ? updated : request));
      messageApi.success('Статус заявки обновлён');
    } catch (cause) {
      const description = cause instanceof Error ? cause.message : 'Неизвестная ошибка';
      messageApi.error(`Не удалось обновить статус (${description})`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Заявки на инструктора</Typography.Title>
        <Button onClick={() => void loadRequests()} loading={loading}>Обновить</Button>
      </div>
      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}
      <Table<InstructorRequest>
        rowKey="id"
        dataSource={requests}
        loading={loading}
        scroll={{ x: 1100 }}
        pagination={{ pageSize: 20, showSizeChanger: true }}
      >
        <Table.Column<InstructorRequest> title="Заявка" dataIndex="id" width={90} render={(id: number, record) => (
          <Space direction="vertical" size={0}>
            <Typography.Text strong>#{id}</Typography.Text>
            <Typography.Text type="secondary">{new Date(record.createdAt).toLocaleString('ru-RU')}</Typography.Text>
          </Space>
        )} />
        <Table.Column<InstructorRequest> title="Клиент" dataIndex="name" width={160} render={(_: string, record) => (
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{record.name}</Typography.Text>
            <Typography.Text copyable>{record.contact}</Typography.Text>
          </Space>
        )} />
        <Table.Column<InstructorRequest> title="Параметры" dataIndex="resort" render={(_: string, record) => (
          <Space direction="vertical" size={0}>
            <span>{record.resort} · {record.discipline} · {record.level}</span>
            <Typography.Text type="secondary">
              {record.learner}{record.childAge ? `, ${record.childAge}` : ''}{record.dates ? ` · ${record.dates}` : ''}
            </Typography.Text>
          </Space>
        )} />
        <Table.Column<InstructorRequest> title="Статус" dataIndex="status" width={160} render={(status: RequestStatus, record) => (
          <Select
            aria-label={`Статус заявки ${record.id}`}
            value={status}
            loading={updatingId === record.id}
            disabled={updatingId !== null && updatingId !== record.id}
            onChange={(value: RequestStatus) => void updateStatus(record.id, value)}
            style={{ width: 140 }}
            options={Object.entries(statusLabels).map(([value, label]) => ({ value, label: <Tag color={statusColors[value as RequestStatus]}>{label}</Tag> }))}
          />
        )} />
        <Table.Column<InstructorRequest> title="Страница" dataIndex="page" ellipsis />
      </Table>
    </>
  );
};
