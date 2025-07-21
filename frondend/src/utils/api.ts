import type { User, LoginRequest, RegisterRequest, Message, CreateMessageRequest, MessageIdResponse } from '../types';
import config from '../config';

const API_BASE_URL = config.api.baseUrl;

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    return apiRequest<{ success: boolean; msg?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest) => {
    return apiRequest<{ success: boolean; msg?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiRequest<User>('/auth/me');
  },
};

export const messageApi = {
  getAllMessages: async () => {
    return apiRequest<Message[]>('/messages');
  },

  getAllMessagesWithTree: async () => {
    return apiRequest<Message[]>('/messages/tree');
  },

  createMessage: async (data: CreateMessageRequest) => {
    return apiRequest<MessageIdResponse>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getChildren: async (messageId: number) => {
    return apiRequest<Message[]>(`/messages/${messageId}/children`);
  },
};
