import * as dayjs from 'dayjs';
import { ITodo } from 'app/entities/todo/todo.model';

export interface ITag {
  id?: number;
  name?: string;
  createdAt?: dayjs.Dayjs;
  todos?: ITodo[] | null;
}

export class Tag implements ITag {
  constructor(public id?: number, public name?: string, public createdAt?: dayjs.Dayjs, public todos?: ITodo[] | null) {}
}

export function getTagIdentifier(tag: ITag): number | undefined {
  return tag.id;
}
