import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { ITag } from 'app/entities/tag/tag.model';

export interface ITodo {
  id?: number;
  title?: string;
  description?: string | null;
  createdAt?: dayjs.Dayjs;
  deadline?: dayjs.Dayjs | null;
  user?: IUser | null;
  tags?: ITag[] | null;
}

export class Todo implements ITodo {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public createdAt?: dayjs.Dayjs,
    public deadline?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public tags?: ITag[] | null
  ) {}
}

export function getTodoIdentifier(todo: ITodo): number | undefined {
  return todo.id;
}
