import { Refine, Authenticated } from '@refinedev/core';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import routerProvider from '@refinedev/react-router-v6';
import dataProvider from '@refinedev/simple-rest';
import { RefineThemes, ThemedLayoutV2, useNotificationProvider } from '@refinedev/antd';
import { ConfigProvider, App as AntdApp } from 'antd';
import axios from 'axios';
import ruRU from 'antd/locale/ru_RU';
import '@refinedev/antd/dist/reset.css';

import { authProvider } from './providers/authProvider';
import { ResortList } from './pages/resorts/list';
import { ResortCreate } from './pages/resorts/create';
import { ResortEdit } from './pages/resorts/edit';
import { KnowledgeList } from './pages/knowledge/list';
import { KnowledgeCreate } from './pages/knowledge/create';
import { KnowledgeEdit } from './pages/knowledge/edit';
import { Login } from './pages/login';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'ski-admin-token';

// Create axios instance with auth interceptor
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={ruRU} theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider(API_URL, axiosInstance)}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
              resources={[
              {
                name: 'resorts',
                list: '/resorts',
                create: '/resorts/create',
                edit: '/resorts/edit/:id',
                meta: {
                  label: 'Курорты',
                },
              },
              {
                name: 'knowledge',
                list: '/knowledge',
                create: '/knowledge/create',
                edit: '/knowledge/edit/:id',
                meta: {
                  label: 'База знаний',
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <Authenticated fallback={<Navigate to="/login" />}>
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<Navigate to="/resorts" replace />} />
                <Route path="/resorts">
                  <Route index element={<ResortList />} />
                  <Route path="create" element={<ResortCreate />} />
                  <Route path="edit/:id" element={<ResortEdit />} />
                </Route>
                <Route path="/knowledge">
                  <Route index element={<KnowledgeList />} />
                  <Route path="create" element={<KnowledgeCreate />} />
                  <Route path="edit/:id" element={<KnowledgeEdit />} />
                </Route>
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
