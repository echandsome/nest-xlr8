export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  meta: IPaginationMeta;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface IUserPayload {
  id: string;
  email: string;
}

export interface ICreateUserData {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface IUpdateUserData {
  name?: string;
  email?: string;
  bio?: string;
  password?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IAuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string;
  };
}
