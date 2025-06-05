import { RetailerLevel } from '../../permissions/access-model';

export interface User {
  retailerId: string;
  level: RetailerLevel;
  name?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
} 