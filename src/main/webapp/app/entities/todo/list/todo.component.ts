import { Component, OnInit } from '@angular/core';
import { TodoService } from 'app/entities/todo/service/todo.service';
import { HttpResponse } from '@angular/common/http';
import { ITodo } from 'app/entities/todo/todo.model';

@Component({
  selector: 'jhi-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  todos?: ITodo[];
  isLoading = false;

  constructor(protected todoService: TodoService) {}

  loadAll(): void {
    this.isLoading = true;

    this.todoService.query().subscribe(
      (res: HttpResponse<ITodo[]>) => {
        this.isLoading = false;
        this.todos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITodo): number {
    return item.id!;
  }
}
