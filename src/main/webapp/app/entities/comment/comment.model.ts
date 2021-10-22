import * as dayjs from 'dayjs';
import { ITodo } from 'app/entities/todo/todo.model';

export interface IComment {
  id?: number;
  body?: string;
  createdAt?: dayjs.Dayjs;
  todo?: ITodo | null;
}

export class Comment implements IComment {
  constructor(public id?: number, public body?: string, public createdAt?: dayjs.Dayjs, public todo?: ITodo | null) {}
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
