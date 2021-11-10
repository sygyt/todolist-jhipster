import { IUser } from 'app/entities/user/user.model';

export interface ITodo {
  id?: number;
  title?: string;
  user?: IUser | null;
}

export class Todo implements ITodo {
  constructor(public id?: number, public title?: string, public user?: IUser | null) {}
}

export function getTodoIdentifier(todo: ITodo): number | undefined {
  return todo.id;
}
