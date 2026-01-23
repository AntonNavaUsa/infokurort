import type { AuthProvider } from '@refinedev/core';

const TOKEN_KEY = 'ski-admin-token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return {
          success: true,
          redirectTo: '/resorts',
        };
      }

      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'Неверный email или пароль',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'Ошибка подключения к серверу',
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: '/login',
      logout: true,
    };
  },

  getPermissions: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      const { role } = JSON.parse(user);
      return role;
    }
    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: '/login',
        error,
      };
    }

    return { error };
  },
};
