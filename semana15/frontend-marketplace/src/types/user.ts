export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: Role;
}

export interface Session {
  user: User;
  token: string;
}
