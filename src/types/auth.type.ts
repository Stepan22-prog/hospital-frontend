import { IUser } from './customer.type';

export interface ISingIn {
  email: string;
  password: string;
  role: 'Customer' | 'Staff';
}

export interface ISingUp extends Omit<IUser, 'id'> {
  password: string;
}

export interface ISingInResponse {
  id: string;
  access_token: string;
  role: 'Customer' | 'Staff' | 'Admin';
}
