export interface User {
  username: string;
  email: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
  children?: Message[];
  hasChildren?: boolean;
}

export interface CreateMessageRequest {
  content: string;
  parentId?: number;
}

export interface MessageIdResponse {
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  msg?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
