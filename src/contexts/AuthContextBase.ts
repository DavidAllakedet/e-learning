import { createContext } from 'react';
import type { Role } from '../constants/roles';

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatar?: string | null;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  university?: string;
  className?: string;
  interests?: string;
  institution?: string;
  specialty?: string;
  bio?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterPayload) => Promise<void>;
  updateUser: (next: AuthUser) => void;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
