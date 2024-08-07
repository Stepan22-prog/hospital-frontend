export interface IUser {
  id: string
	name: string
	email: string
  surname: string
  telephone?: number
  birthday: string
  gender: 'male' | 'female'
}

export type GetAll = {
  firstName?: string;
  lastName?: string;
}

export type UpdateUser = Partial<Omit<IUser, 'id'> & { password: string }>

